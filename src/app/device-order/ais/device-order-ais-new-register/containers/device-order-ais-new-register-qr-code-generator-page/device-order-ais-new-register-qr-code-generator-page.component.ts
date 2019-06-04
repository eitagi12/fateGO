import { Component, OnInit, OnDestroy } from '@angular/core';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { Router } from '@angular/router';
import { HomeService, AlertService, TokenService, PageLoadingService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import {
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_QR_CODE_SUMMARY_PAGE,
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_QR_CODE_QUEUE_PAGE
} from '../../constants/route-path.constant';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { QrCodePageService } from 'src/app/device-order/services/qr-code-page.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs/internal/Subscription';
import * as moment from 'moment';
import { StringifyOptions } from 'querystring';

@Component({
  selector: 'app-device-order-ais-new-register-qr-code-generator-page',
  templateUrl: './device-order-ais-new-register-qr-code-generator-page.component.html',
  styleUrls: ['./device-order-ais-new-register-qr-code-generator-page.component.scss']
})
export class DeviceOrderAisNewRegisterQrCodeGeneratorPageComponent implements OnInit, OnDestroy {

  transaction: Transaction;
  priceOption: PriceOption;

  timeCounterSubscription: Subscription;
  checkResponseMpaySubscription: Subscription;

  qrCode: string;
  countdown: string;
  refreshCount: number = 0;
  totalAmount: number;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private pageLoadingService: PageLoadingService,
    private alertService: AlertService,
    private tokenService: TokenService,
    private qrCodePageService: QrCodePageService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void {
    this.onGenerateQRCode();
  }

  onGenerateQRCode(): void {
    this.refreshCount++;
    const MPAY_QRCODE = environment.MPAY_QRCODE;
    const isThaiQRCode = this.isQRCode('THAI_QR');
    const user = this.tokenService.getUser();
    const order = this.transaction.data.order;
    const mpayPayment = this.transaction.data.mpayPayment;
    const mpayStatus = this.transaction.data.mpayPayment.mpayStatus;
    const company = this.priceOption.productStock.company;
    let totalAmount = 0;

    if (company === 'WDS') {
      if (this.getStatusPay() === 'DEVICE') {
        totalAmount = +mpayStatus.amountDevice;
      } else if (this.getStatusPay() === 'AIRTIME' && mpayStatus.statusAirTime && mpayStatus.statusDevice) {
        totalAmount = +mpayStatus.amountAirTime;
        const qrid = mpayStatus.orderIdDevice.split('_');
        this.refreshCount = +qrid[1] + 1;
      } else {
        totalAmount = this.getTotalAmount();
      }
    } else {
      totalAmount = this.getTotalAmount();
    }
    this.totalAmount = totalAmount;
    const orderId = `${order.soId}_${this.refreshCount}`;

    const params: any = {
      orderId: orderId,
      amount: totalAmount,
      qrType: isThaiQRCode ? MPAY_QRCODE.PB_TYPE : MPAY_QRCODE.RB_TYPE,
      status: 'WAITING',
      locationCode: user.locationCode
    };

    this.pageLoadingService.openLoading();
    this.qrCodePageService.mpayInquiry({
      orderId: orderId
    }).then((resp: any) => {
      const data = resp.data || {};
      if (data.status === 'SUCCESS') {
        const fields = ['status', 'tranId', 'tranDtm', 'amount', 'qrType'];
        fields.forEach(field => {
          params[field] = data[field];
        });
        return true;
      }

      let serviceId = isThaiQRCode ? MPAY_QRCODE.PB_SERVICE_ID : MPAY_QRCODE.RL_SERVICE_ID;
      let terminalId = isThaiQRCode ? MPAY_QRCODE.PB_TERMINAL_ID : MPAY_QRCODE.RL_TERMINAL_ID;
      // tslint:disable-next-line:no-shadowed-variable
      let company = 'AWN';
      if (this.getStatusPay() === 'DEVICE') {
        if (this.priceOption.productStock.company === 'WDS' && this.transaction.data.payment.paymentType === 'QR_CODE') {
          company = this.priceOption.productStock.company;
          serviceId = isThaiQRCode ? MPAY_QRCODE.PB_WDS_SERVICE_ID : MPAY_QRCODE.RL_WDS_SERVICE_ID;
          terminalId = isThaiQRCode ? MPAY_QRCODE.PB_WDS_TERMINAL_ID : MPAY_QRCODE.RL_WDS_TERMINAL_ID;
        }
      }
      return this.qrCodePageService.mpayInsert(params).then(() => {
        return this.qrCodePageService.generateQRCode({
          orderId: orderId,
          channel: 'WEB',
          serviceId: serviceId,
          terminalId: terminalId,
          qrType: isThaiQRCode ? MPAY_QRCODE.PB_TYPE : MPAY_QRCODE.RB_TYPE,
          locationName: user.locationCode,
          amount: totalAmount,
          company: company
        });
      });
    })
      .then((resp: any) => {
        // this.transaction.data.mpayPayment = Object.assign({}, params);
        if (resp === true) { // true inquiry success
          this.onNext();
          return;
        }
        const data = resp.data || {};
        this.handlerQRCodeMpay(orderId, data.qrCodeStr);
      }).then(() => this.pageLoadingService.closeLoading());
  }

  getStatusPay(): string {
    const mpayPayment = this.transaction.data.mpayPayment;
    const payment: any = this.transaction.data.payment || {};
    const advancePayment: any = this.transaction.data.advancePayment || {};
    const tread = this.priceOption.trade;
    if (tread.advancePay.installmentFlag === 'Y') {
      return 'DEVICE&AIRTIME';
    } else {
      // if(payment.paymentType === 'QR_CODE' && advancePayment.paymentType === 'QR_CODE'
      // && this.priceOption.productStock.company !== 'WDS') {
      //   return 'DEVICE&AIRTIME';
      // }
      if (mpayPayment.mpayStatus && mpayPayment.mpayStatus.statusDevice && mpayPayment.mpayStatus.statusDevice === 'WAITING') {
        return 'DEVICE';
      } else {
        return 'AIRTIME';
      }
    }
  }

  // getStatusPay(): string {
  //   const company = this.priceOption.productStock.company;
  //   const mpayPayment = this.transaction.data.mpayPayment;
  //   const payment: any = this.transaction.data.payment || {};
  //   const advancePayment: any = this.transaction.data.advancePayment || {};
  //   if (company === 'AWN') {
  //     if (payment.paymentType === 'QR_CODE' && advancePayment.paymentType === 'QR_CODE') {
  //       return 'DEVICE&AIRTIME';
  //     } else {
  //       return mpayPayment.mpayStatus.statusDevice === 'WAITING' ? 'DEVICE' : 'AIRTIME';
  //     }
  //   } else {
  //     return mpayPayment.mpayStatus.statusDevice === 'WAITING' ? 'DEVICE' : 'AIRTIME';
  //   }
  // }

  getTotalAmount(): number {
    const trade = this.priceOption.trade;
    const payment: any = this.transaction.data.payment || {};
    const advancePayment: any = this.transaction.data.advancePayment || {};
    let total: number = 0;
    const advancePay = trade.advancePay || {};

    if (trade.advancePay.installmentFlag === 'Y') {
      return +trade.promotionPrice +  +advancePay.amount;
    }
    if (payment.paymentType === 'QR_CODE') {
      total += +trade.promotionPrice;
    }
    if (advancePayment.paymentType === 'QR_CODE') {
      total += +advancePay.amount;
    }
    return total;
  }

  handlerQRCodeMpay(orderId: string, message: string): void {
    this.qrCodePageService.convertMessageToQRCode(message)
      .then(qrCode => {
        this.qrCode = qrCode;

        if (this.timeCounterSubscription) {
          this.timeCounterSubscription.unsubscribe();
        }

        if (this.checkResponseMpaySubscription) {
          this.checkResponseMpaySubscription.unsubscribe();
        }

        this.checkResponseMpaySubscription = this.qrCodePageService.checkPaymentResponseMpayStatus(orderId)
          .subscribe((obs: any) => {
            const mpay = {
              locationCode: obs.locationCode,
              qrType: obs.qrType,
              startDtm: obs.startDtm,
              status: obs.status,
              tranDtm: obs.status
            };
            this.transaction.data.mpayPayment = Object.assign(this.transaction.data.mpayPayment , mpay);
            if (this.priceOption.productStock.company === 'AWN') {
              this.transaction.data.mpayPayment = Object.assign(this.transaction.data.mpayPayment , obs);
            } else {
              const status = this.getStatusPay();
              if (status === 'DEVICE') {
                this.transaction.data.mpayPayment.mpayStatus.orderIdDevice =  obs.orderId;
                this.transaction.data.mpayPayment.mpayStatus.statusDevice =  'SUCCESS';
                this.transaction.data.mpayPayment.tranId = obs.tranId;
                this.transaction.data.mpayPayment.amount = obs.amount;


              } else if (status === 'AIRTIME') {
                this.transaction.data.mpayPayment.mpayStatus.orderIdAirTime =  obs.orderId;
                this.transaction.data.mpayPayment.mpayStatus.statusAirTime =  'SUCCESS';
                this.transaction.data.mpayPayment.qrAirtimeTransId = obs.tranId;
                this.transaction.data.mpayPayment.qrAirtimeAmt = obs.amount;
              } else {
                this.transaction.data.mpayPayment = Object.assign(this.transaction.data.mpayPayment , obs);
              }
            }
            this.onNext();
          });

        this.timeCounterSubscription = this.qrCodePageService.getTimeCounter(300)
          .subscribe(obs => {
            if (obs) {
              this.countdown = moment.utc(obs).format('mm : ss');
            } else {
              this.countdown = null;
            }
          },
            (error) => this.alertService.error(error),
            () => {
              // timeout order id
              this.checkResponseMpaySubscription.unsubscribe();
              // Refresh generate qrcode
              this.alertService.question('สิ้นสุดระยะเวลาชำระเงิน กรุณากดปุ่ม "REFRESH"<br> เพื่อทำรายการใหม่', 'Refresh')
                .then((data: any) => {
                  if (data.value) {
                    this.onGenerateQRCode();
                  } else {
                    this.onBack();
                  }
                });
            });
      })
      .catch(error => this.alertService.error(error));
  }

  warningTimeOut(): boolean {
    if (this.countdown) {
      const time = this.countdown.split(' : ');
      const min = time[0];
      const sec = time[1];
      if ( +min === 0 && +sec <= 15 ) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  isQRCode(qrCodeType: 'THAI_QR' | 'LINE_QR'): boolean {
    const payment: any = this.transaction.data.payment || {};
    const advancePayment: any = this.transaction.data.advancePayment || {};
    return payment.paymentQrCodeType === qrCodeType
      || advancePayment.paymentQrCodeType === qrCodeType;
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_QR_CODE_SUMMARY_PAGE]);
  }

  onNext(): void {
    const mpayPayment = this.transaction.data.mpayPayment;
    const mpayStatus = this.transaction.data.mpayPayment.mpayStatus;
    if (this.priceOption.productStock.company === 'AWN') {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_QR_CODE_QUEUE_PAGE]);
    } else {
      if (mpayStatus && mpayStatus.statusAirTime && mpayStatus.statusAirTime !== 'WAITING') {
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_QR_CODE_QUEUE_PAGE]);
      } else {
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_QR_CODE_SUMMARY_PAGE]);
      }

      }
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);

    if (this.timeCounterSubscription) {
      this.timeCounterSubscription.unsubscribe();
    }
    if (this.checkResponseMpaySubscription) {
      this.checkResponseMpaySubscription.unsubscribe();
    }
  }

  isDeveloperMode(): boolean {
    return 'LOCAL' === environment.name;
  }
}

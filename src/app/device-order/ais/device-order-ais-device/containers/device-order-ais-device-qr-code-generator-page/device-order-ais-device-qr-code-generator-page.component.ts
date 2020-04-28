import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ROUTE_DEVICE_AIS_DEVICE_QR_CODE_SUMMARY_PAGE, ROUTE_DEVICE_AIS_DEVICE_QR_CODE_QUEUE_PAGE } from 'src/app/device-order/ais/device-order-ais-device/constants/route-path.constant';
import * as moment from 'moment';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { TokenService, PageLoadingService, AlertService } from 'mychannel-shared-libs';
import { QrCodePageService } from 'src/app/device-order/services/qr-code-page.service';
@Component({
  selector: 'app-device-order-ais-device-qr-code-generator-page',
  templateUrl: './device-order-ais-device-qr-code-generator-page.component.html',
  styleUrls: ['./device-order-ais-device-qr-code-generator-page.component.scss']
})
export class DeviceOrderAisDeviceQrCodeGeneratorPageComponent implements OnInit, OnDestroy {
  transaction: Transaction;
  priceOption: PriceOption;

  timeCounterSubscription: Subscription;
  checkResponseMpaySubscription: Subscription;
  qrCode: string;
  countdown: string;
  refreshCount: number = 0;

  constructor(
    private router: Router,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private tokenService: TokenService,
    private pageLoadingService: PageLoadingService,
    private qrCodePageService: QrCodePageService,
    private alertService: AlertService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void {
    this.onGenerateQRCode();
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

  onGenerateQRCode(): void {
    this.refreshCount++;
    const MPAY_QRCODE = environment.MPAY_QRCODE;
    const isThaiQRCode = this.isQRCode('THAI_QR');
    const user = this.tokenService.getUser();
    const order = this.transaction.data.order;

    const orderId = `${order.soId}_${this.refreshCount}`;
    const totalAmount = this.getTotalAmount();

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

      return this.qrCodePageService.mpayInsert(params).then(() => {
        return this.qrCodePageService.generateQRCode({
          orderId: orderId,
          channel: 'WEB',
          serviceId: isThaiQRCode ? MPAY_QRCODE.PB_SERVICE_ID : MPAY_QRCODE.RL_SERVICE_ID,
          terminalId: isThaiQRCode ? MPAY_QRCODE.PB_TERMINAL_ID : MPAY_QRCODE.RL_TERMINAL_ID,
          qrType: isThaiQRCode ? MPAY_QRCODE.PB_TYPE : MPAY_QRCODE.RB_TYPE,
          locationName: user.locationCode,
          amount: totalAmount
        });
      });
    }).then((resp: any) => {
      this.transaction.data.mpayPayment = Object.assign({}, params);
      if (resp === true) { // true inquiry success
        this.onNext();
        return;
      }
      const data = resp.data || {};
      this.handlerQRCodeMpay(orderId, data.qrCodeStr);
    }).then(() => this.pageLoadingService.closeLoading());
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
          .subscribe(obs => {
            const mpay = {
              locationCode: obs.locationCode,
              qrType: obs.qrType,
              startDtm: obs.startDtm,
              status: obs.status,
              tranDtm: obs.status
            };
            this.transaction.data.mpayPayment = Object.assign(this.transaction.data.mpayPayment, mpay);
            if (this.priceOption.productStock.company === 'AWN') {
              this.transaction.data.mpayPayment = Object.assign(this.transaction.data.mpayPayment, obs);
            } else {
              const status = this.getStatusPay();
              this.transaction.data.mpayPayment.orderId = obs.orderId;
              if (status === 'DEVICE') {
                this.transaction.data.mpayPayment.mpayStatus.orderIdDevice = obs.orderId;
                this.transaction.data.mpayPayment.mpayStatus.statusDevice = 'SUCCESS';
                this.transaction.data.mpayPayment.tranId = obs.tranId;
                this.transaction.data.mpayPayment.amount = obs.amount;
              } else if (status === 'AIRTIME') {
                this.transaction.data.mpayPayment.mpayStatus.orderIdAirTime = obs.orderId;
                this.transaction.data.mpayPayment.mpayStatus.statusAirTime = 'SUCCESS';
                this.transaction.data.mpayPayment.qrAirtimeTransId = obs.tranId;
                this.transaction.data.mpayPayment.qrAirtimeAmt = obs.amount;
              } else {
                this.transaction.data.mpayPayment = Object.assign(this.transaction.data.mpayPayment, obs);
              }
            }
            this.onNext();
          });

        this.timeCounterSubscription = this.qrCodePageService.getTimeCounter(1200)
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
      });
  }

  getStatusPay(): string {
    const mpayPayment = this.transaction.data.mpayPayment;
    const tread = this.priceOption.trade;
    if (tread.advancePay.installmentFlag === 'Y') {
      return 'DEVICE&AIRTIME';
    } else {
      if (mpayPayment.mpayStatus && mpayPayment.mpayStatus.statusDevice && mpayPayment.mpayStatus.statusDevice === 'WAITING') {
        return 'DEVICE';
      } else {
        return 'AIRTIME';
      }
    }
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_AIS_DEVICE_QR_CODE_QUEUE_PAGE]);
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_AIS_DEVICE_QR_CODE_SUMMARY_PAGE]);
  }

  isQRCode(qrCodeType: 'THAI_QR' | 'LINE_QR'): boolean {
    const payment: any = this.transaction.data.payment || {};
    const advancePayment: any = this.transaction.data.advancePayment || {};
    return payment.paymentQrCodeType === qrCodeType
      || advancePayment.paymentQrCodeType === qrCodeType;
  }

  getTotalAmount(): number {
    const trade = this.priceOption.trade;
    const payment: any = this.transaction.data.payment || {};

    let total: number = 0;
    if (payment.paymentType === 'QR_CODE') {
      total += +trade.promotionPrice;
    }

    return total;
  }

  isDeveloperMode(): boolean {
    return 'LOCAL' === environment.name;
  }

  summary(amount: number[]): number {
    return amount.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
  }

}

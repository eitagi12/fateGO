import { Component, OnInit, OnDestroy } from '@angular/core';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { HomeService, PageLoadingService, AlertService, TokenService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { QrCodePageService } from 'src/app/device-order/services/qr-code-page.service';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_QR_CODE_QUEUE_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_QR_CODE_SUMMARY_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-existing-best-buy-shop-qr-code-payment-generator-page',
  templateUrl: './device-order-ais-existing-best-buy-shop-qr-code-payment-generator-page.component.html',
  styleUrls: ['./device-order-ais-existing-best-buy-shop-qr-code-payment-generator-page.component.scss']
})
export class DeviceOrderAisExistingBestBuyShopQrCodePaymentGeneratorPageComponent implements OnInit, OnDestroy {

  transaction: Transaction;
  priceOption: PriceOption;

  timeCounterSubscription: Subscription;
  checkResponseMpaySubscription: Subscription;

  qrCode: string;
  countdown: string;
  refreshCount: number = 0;

  deposit: number = 0;

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
    this.deposit = this.transaction.data.preBooking
      && this.transaction.data.preBooking.depositAmt ? -Math.abs(+this.transaction.data.preBooking.depositAmt) : 0;
    this.onGenerateQRCode();
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
    })
      .then((resp: any) => {
        this.transaction.data.mpayPayment = Object.assign({}, params);
        if (resp === true) { // true inquiry success
          this.onNext();
          return;
        }
        const data = resp.data || {};
        this.handlerQRCodeMpay(orderId, data.qrCodeStr);
      }).then(() => this.pageLoadingService.closeLoading());
  }

  getTotalAmount(): number {
    const trade = this.priceOption.trade;
    const payment: any = this.transaction.data.payment || {};
    const advancePayment: any = this.transaction.data.advancePayment || {};

    let total: number = 0;
    if (payment.paymentType === 'QR_CODE') {
      total += +trade.promotionPrice;
    }
    if (advancePayment.paymentType === 'QR_CODE') {
      const advancePay = trade.advancePay || {};
      total += +advancePay.amount;
    }
    if (this.deposit) {
      total += this.deposit;
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
          .subscribe(obs => {
            this.transaction.data.mpayPayment = obs;
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

  isQRCode(qrCodeType: 'THAI_QR' | 'LINE_QR'): boolean {
    const payment: any = this.transaction.data.payment || {};
    const advancePayment: any = this.transaction.data.advancePayment || {};
    return payment.paymentQrCodeType === qrCodeType
      || advancePayment.paymentQrCodeType === qrCodeType;
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_QR_CODE_SUMMARY_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  summary(amount: number[]): number {
    return amount.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
  }

  isDeveloperMode(): boolean {
    return 'LOCAL' === environment.name;
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

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_QR_CODE_QUEUE_PAGE]);
  }

  // getTotalAmount(): number {
  //   return this.summary([+this.priceOption.trade.promotionPrice + this.deposit]);
  // }

}

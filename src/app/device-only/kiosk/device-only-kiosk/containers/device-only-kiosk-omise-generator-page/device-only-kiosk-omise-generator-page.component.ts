import { Component, OnInit, OnDestroy } from '@angular/core';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { HomeService, PageLoadingService, AlertService, TokenService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { QrCodeOmiseService } from 'src/app/device-only/services/qr-code-omise.service';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { ROUTE_DEVICE_ONLY_KIOSK_CHECKOUT_PAYMENT_QR_CODE_PAGE, ROUTE_DEVICE_ONLY_KIOSK_OMISE_QUEUE_PAGE, ROUTE_DEVICE_ONLY_KIOSK_OMISE_SUMMARY_PAGE } from 'src/app/device-only/kiosk/device-only-kiosk/constants/route-path.constant';

@Component({
  selector: 'app-device-only-kiosk-omise-generator-page',
  templateUrl: './device-only-kiosk-omise-generator-page.component.html',
  styleUrls: ['./device-only-kiosk-omise-generator-page.component.scss']
})
export class DeviceOnlyKioskOmiseGeneratorPageComponent implements OnInit, OnDestroy {

  transaction: Transaction;
  priceOption: PriceOption;

  timeCounterSubscription: Subscription;
  checkResponseOmiseSubscription: Subscription;

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
    private qrCodeOmiseService: QrCodeOmiseService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void {
    this.onGenerateQRCode();
  }

  onGenerateQRCode(): void {
    this.totalAmount = this.getTotalAmount();
    const orderId = this.transaction.data.omise.orderId || '';
    const qrCodeStr = this.transaction.data.omise.qrCodeStr || '';

    this.handlerQRCodeMpay(orderId, qrCodeStr);
  }

  handlerQRCodeMpay(orderId: string, qrCodeStr: string): void {
    this.qrCodeOmiseService.convertMessageToQRCode(qrCodeStr)
      .then(qrCode => {
        this.qrCode = qrCode;

        if (this.timeCounterSubscription) {
          this.timeCounterSubscription.unsubscribe();
        }

        if (this.checkResponseOmiseSubscription) {
          this.checkResponseOmiseSubscription.unsubscribe();
        }

        this.checkResponseOmiseSubscription = this.qrCodeOmiseService.checkPaymentResponseOrderStatus(orderId)
          .subscribe((data: any) => {
            if (data.paymentCode === '0000' && data.paymentStatus === 'SUCCESS' && data.transactionId) {
              this.transaction.data.omise.tranId = data.transactionId || '';
              this.transaction.data.omise.creditCardNo = data.creditCardNo || '';
              this.transaction.data.omise.cardExpireDate = data.cardExpireDate || '';
              this.onNext();
            } else {
              // Refresh generate qrcode
              this.alertService.question('ชำระค่าสินค้าและบริการไม่สำเร็จ กรุณาทำรายการใหม่')
                .then((dataAlert: any) => {
                  this.onBack();
                });
            }
          });

        this.timeCounterSubscription = this.qrCodeOmiseService.getTimeCounter(300)
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
              this.checkResponseOmiseSubscription.unsubscribe();

              // check Retrive Order
              this.pageLoadingService.openLoading();
              this.qrCodeOmiseService.retriveOrder({ params: { orderId: orderId } }).then(() => {
                return this.qrCodeOmiseService.queryOrder({
                  params: {
                    orderId: orderId,
                    randomID: new Date().getTime()
                  }
                }).then((respQueryOrder: any) => {
                  const data = respQueryOrder.data || {};
                  if (data.paymentCode === '0000' && data.paymentStatus === 'SUCCESS' && data.transactionId) {
                    this.transaction.data.omise.tranId = data.transactionId || '';
                    this.transaction.data.omise.creditCardNo = data.creditCardNo || '';
                    this.transaction.data.omise.cardExpireDate = data.cardExpireDate || '';
                    this.pageLoadingService.closeLoading();
                    this.onNext();
                  } else {
                    this.alertService.question('ชำระค่าสินค้าและบริการไม่สำเร็จ กรุณาทำรายการใหม่')
                      .then((dataAlert: any) => {
                        this.onBack();
                      });
                  }
                });
              }).catch((error: any) => {
                const errors: any = error.error && error.error.errors || {};
                if (errors.code === '0002') {
                  this.alertService.question('สิ้นสุดระยะเวลาชำระเงิน กรุณาทำรายการใหม่')
                    .then((dataAlert: any) => {
                      this.onBack();
                    });
                } else {
                  return Promise.reject(error);
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
      if (+min === 0 && +sec <= 15) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  getTotalAmount(): number {
    const trade = this.priceOption.trade;
    const payment: any = this.transaction.data.payment || {};
    const advancePayment: any = this.transaction.data.advancePayment || {};
    let total: number = 0;
    const advancePay = trade.advancePay || {};

    if (trade.advancePay.installmentFlag === 'Y') {
      return this.summary([+trade.promotionPrice, +advancePay.amount]);
    }

    if (this.qrCodeOmiseService.isPaymentOnlineCredit(this.transaction, 'payment')) {
      total += +trade.promotionPrice;
    }
    if (this.qrCodeOmiseService.isPaymentOnlineCredit(this.transaction, 'advancePayment')) {
      total += +advancePay.amount;
    }
    return total;
  }

  summary(amount: number[]): number {
    return amount.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ONLY_KIOSK_OMISE_SUMMARY_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ONLY_KIOSK_OMISE_QUEUE_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);

    if (this.timeCounterSubscription) {
      this.timeCounterSubscription.unsubscribe();
    }
    if (this.checkResponseOmiseSubscription) {
      this.checkResponseOmiseSubscription.unsubscribe();
    }
  }

  isDeveloperMode(): boolean {
    return 'LOCAL' === environment.name;
  }
}

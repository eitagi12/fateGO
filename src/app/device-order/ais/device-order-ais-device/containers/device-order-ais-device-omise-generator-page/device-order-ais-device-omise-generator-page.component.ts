import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { HomeService, PageLoadingService, AlertService, TokenService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import * as moment from 'moment';
import { ROUTE_DEVICE_AIS_DEVICE_OMISE_SUMMARY_PAGE, ROUTE_DEVICE_AIS_DEVICE_OMISE_QUEUE_PAGE } from '../../constants/route-path.constant';
import { QrCodeOmiseService } from 'src/app/device-only/services/qr-code-omise.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-device-order-ais-device-omise-generator-page',
  templateUrl: './device-order-ais-device-omise-generator-page.component.html',
  styleUrls: ['./device-order-ais-device-omise-generator-page.component.scss']
})
export class DeviceOrderAisDeviceOmiseGeneratorPageComponent implements OnInit, OnDestroy {

  transaction: Transaction;
  priceOption: PriceOption;

  timeCounterSubscription: Subscription;
  checkResponseOmiseSubscription: Subscription;
  phoneSMSForm: FormGroup;

  qrCode: string;
  countdown: string;
  refreshCount: number = 0;
  totalAmount: number;
  orderId: string;
  mobileNoForm: FormGroup;
  shortUrl: string;

  constructor(
    private router: Router,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private pageLoadingService: PageLoadingService,
    private alertService: AlertService,
    private qrCodeOmiseService: QrCodeOmiseService,
    private http: HttpClient,
    private fb: FormBuilder,
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void {
    this.onGenerateQRCode();
    this.createQueueForm();
    this.orderId += this.transaction.data.omise.orderId;
    this.shortUrl = this.transaction.data.omise.qrCodeStr;
  }

  public createQueueForm(): void {
    this.phoneSMSForm = this.fb.group({
      phoneNo: (['', Validators.compose([
        Validators.required,
        Validators.minLength(10),
        Validators.pattern(/([0-9]{10})/)
      ])])
    });
    this.phoneSMSForm.valueChanges.subscribe((value) => {
    });
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

        this.timeCounterSubscription = this.qrCodeOmiseService.getTimeCounter(1200) // 20 minute
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
    let total: number = 0;

    if (this.qrCodeOmiseService.isPaymentOnlineCredit(this.transaction, 'payment')) {
      total += +trade.promotionPrice;
    }
    return total;
  }

  summary(amount: number[]): number {
    return amount.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
  }

  sendSMSUrl(params: any): Promise<any> {
    const requestBody: any = {
      recipient: {
        recipientIdType: '0',
        recipientIdData: (params.mobileNo).replace(/^0+/, '66')
      },
      content: `สำหรับการชำระเงินค่าสินค้าผ่านบัตรเครดิตออนไลน์ คลิก ${params.urlPayment}`,
      sender: 'AIS'
    };
    return this.http.post('/api/customerportal/newregister/send-sms', requestBody).toPromise()
    .then(() => {
    });
  }

  generateShortLink(url: string, mobileNo: string): Promise<any>  {
    let urlLink: string = url;
    if (environment.ENABLE_SHORT_LINK) {
      const splitUrl: any = url.split('?');
      urlLink = `${environment.PREFIX_SHORT_LINK}?${splitUrl[1]}`;
    }
    return this.sendSMSUrl({ mobileNo: mobileNo, urlPayment: urlLink }).then(() => {
      return { shortUrl: urlLink };
    });
  }

  onSentSms(): void {
      const phoneNo = this.phoneSMSForm.controls['phoneNo'].value;
      const msisdn = `66${phoneNo.substring(1, phoneNo.length)}`;
      const paymentUrl = this.shortUrl;
      this.generateShortLink( paymentUrl, msisdn);
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_AIS_DEVICE_OMISE_SUMMARY_PAGE]);
}

onNext(): void {
    this.router.navigate([ROUTE_DEVICE_AIS_DEVICE_OMISE_QUEUE_PAGE]);
}

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
    if (this.timeCounterSubscription) {
      this.timeCounterSubscription.unsubscribe();
    }
    if (this.checkResponseOmiseSubscription) {
      this.checkResponseOmiseSubscription.unsubscribe();
    }
    localStorage.removeItem('phoneNoQR');
  }

}

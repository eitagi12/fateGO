import { Component, OnInit, OnDestroy } from '@angular/core';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { HomeService, PageLoadingService, AlertService, User, TokenService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { QrCodeOmiseService } from 'src/app/device-only/services/qr-code-omise.service';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ROUTE_DEVICE_ONLY_AIS_QR_CODE_QUEUE_PAGE, ROUTE_DEVICE_ONLY_AIS_QR_CODE_SUMMARY_PAGE } from '../../constants/route-path.constant';
import { CustomerInformationService } from 'src/app/device-only/services/customer-information.service';

@Component({
  selector: 'app-device-only-ais-omise-generator-page',
  templateUrl: './device-only-ais-omise-generator-page.component.html',
  styleUrls: ['./device-only-ais-omise-generator-page.component.scss']
})
export class DeviceOnlyAisOmiseGeneratorPageComponent implements OnInit, OnDestroy {

  transaction: Transaction;
  priceOption: PriceOption;

  timeCounterSubscription: Subscription;
  checkResponseOmiseSubscription: Subscription;
  phoneSMSForm: FormGroup;

  qrCode: string;
  countdown: string;
  refreshCount: number = 0;
  totalAmount: number;
  user: User;
  urlLink: any;
  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private pageLoadingService: PageLoadingService,
    private alertService: AlertService,
    private qrCodeOmiseService: QrCodeOmiseService,
    private http: HttpClient,
    private fb: FormBuilder,
    private tokenService: TokenService,
    private customerInformationService: CustomerInformationService,
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void {
    this.onGenerateQRCode();
    this.createQueueForm();
    if (this.transaction.data.payment.paymentForm === 'FULL') {
      this.urlLink = this.transaction.data.omise.shortUrl;
    } else {
      this.urlLink = this.transaction.data.omise.qrCodeStr;
    }
    this.user = this.tokenService.getUser();
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
              // this.alertService.question('ชำระค่าสินค้าและบริการไม่สำเร็จ กรุณาทำรายการใหม่')
              //   .then((dataAlert: any) => {
              //     this.onBack();
              //   });
              this.showPopupMessageFail('ชำระค่าสินค้าและบริการไม่สำเร็จ กรุณาทำรายการใหม่');
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
              let paramsReq: {};
              if (this.transaction.data.payment.paymentForm === 'FULL') {
                paramsReq = {
                  params: {
                    orderId: orderId
                  }
                };
              } else {
                paramsReq = {
                  params: {
                    orderId: orderId,
                    company: 'AWN'
                  }
                };
              }
              this.qrCodeOmiseService.retriveOrder(paramsReq).then(() => {
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
                    // this.alertService.question('ชำระค่าสินค้าและบริการไม่สำเร็จ กรุณาทำรายการใหม่')
                    //   .then((dataAlert: any) => {
                    //     this.onBack();
                    //   });
                    this.showPopupMessageFail('ชำระค่าสินค้าและบริการไม่สำเร็จ กรุณาทำรายการใหม่');
                  }
                });
              }).catch((error: any) => {
                const errors: any = error.error && error.error.errors || {};
                if (errors.code === '0002') {
                  this.showPopupMessage('สิ้นสุดระยะเวลาชำระเงิน กรุณาทำรายการใหม่');
                  // this.alertService.question('สิ้นสุดระยะเวลาชำระเงิน กรุณาทำรายการใหม่')
                  //   .then((dataAlert: any) => {
                  //     this.onBack();
                  //   });
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

  showPopupMessage(message: string): void {
    this.alertService.notify({
      type: 'question',
      showConfirmButton: true,
      confirmButtonText: 'REFRESH',
      cancelButtonText: 'CANCEL',
      showCancelButton: true,
      reverseButtons: true,
      allowEscapeKey: false,
      text: message,
      timer: 180000
    }).then(btn => {
      if (btn.value) { // refresh
        this.refreshCreateOrder();
      } else { // cancel
        this.onBack();
      }
    });
  }

  showPopupMessageFail(message: string): void {
    this.alertService.notify({
      // type: 'question',
      showConfirmButton: true,
      confirmButtonText: 'BACK',
      // cancelButtonText: 'CANCEL',
      // showCancelButton: true,
      reverseButtons: true,
      allowEscapeKey: false,
      text: message,
      timer: 180000
    }).then(btn => {
      if (btn.value) { // back
        this.onBack();
      }
    });
  }

  refreshCreateOrder(): void {
    this.pageLoadingService.openLoading();
    const mobileNoSms = this.customerInformationService.getMobileNoSms();
    if (this.transaction.data.payment.paymentForm === 'FULL') {
      const params = this.createDataGenerateQR();
      this.qrCodeOmiseService.createOrder(params).then((res: any) => {
        const data = res && res.data;
        this.transaction.data.omise = {
          ...this.transaction.data.omise,
          qrCodeStr: data.redirectUrl,
          orderId: data.orderId
        };
        this.transactionService.update(this.transaction);
        const paymentUrl = this.transaction.data.omise.qrCodeStr;
        this.generateShortLink(paymentUrl, mobileNoSms);
        this.urlLink = this.transaction.data.omise.shortUrl;
        this.pageLoadingService.closeLoading();
        const orderId = this.transaction.data.omise.orderId || '';
        const qrCodeStr = this.transaction.data.omise.qrCodeStr || '';
        this.handlerQRCodeMpay(orderId, qrCodeStr);
      }).catch((err) => {
        this.alertService.error('ระบบไม่สามารถทำรายการได้ขณะนี้ กรุณาทำรายการอีกครั้ง');
      });
    } else {
      const params = this.createDataInstallment();
      this.qrCodeOmiseService.createOrderInstallment(params).then((res: any) => {
        const data = res && res.data;
        this.transaction.data.omise = {
          ...this.transaction.data.omise,
          qrCodeStr: decodeURIComponent(data.endpointUrl),
          orderId: data.orderId,
          saleId: data.saleId
        };
        this.transactionService.update(this.transaction);
        this.urlLink = this.transaction.data.omise.qrCodeStr;
        this.sendSMSUrl({ mobileNo: mobileNoSms, urlPayment: this.transaction.data.omise.qrCodeStr });
        this.pageLoadingService.closeLoading();
        const orderId = this.transaction.data.omise.orderId || '';
        const qrCodeStr = this.transaction.data.omise.qrCodeStr || '';
        this.handlerQRCodeMpay(orderId, qrCodeStr);
      }).catch((err) => {
        this.alertService.error('ระบบไม่สามารถทำรายการได้ขณะนี้ กรุณาทำรายการอีกครั้ง');
      });
    }
  }

  createDataGenerateQR(): any {
    const shippingInfo = this.transaction.data.shippingInfo;
    const customer = shippingInfo.firstName + ' ' + shippingInfo.lastName;
    const productStock = this.priceOption.productStock;
    const productDetail = this.priceOption.productDetail;
    const trade = this.priceOption.trade;
    const phoneNo = this.customerInformationService.getMobileNoSms();
    const color = productStock.colorName || productStock.color;
    return {
      companyCode: productStock.company,
      companyName: 'บริษัท แอดวานซ์ ไวร์เลส เน็ทเวอร์ค จำกัด',
      locationCode: this.user.locationCode,
      locationName: this.transaction.data.seller.locationName,
      mobileNo: phoneNo,
      customer: customer,
      orderList: [
        {
          name: productDetail.name + 'สี' + color,
          price: trade.promotionPrice
        }
      ]
    };
  }

  createDataInstallment(): any {
    const shippingInfo = this.transaction.data.shippingInfo;
    const customer = shippingInfo.firstName + ' ' + shippingInfo.lastName;
    const productStock = this.priceOption.productStock;
    const productDetail = this.priceOption.productDetail;
    const trade = this.priceOption.trade;
    const phoneNo = this.customerInformationService.getMobileNoSms();
    const color = productStock.colorName || productStock.color;

    return {
      orderDesc: productDetail.name + 'สี' + color,
      amount: trade.promotionPrice,
      currency: 'THB',
      paymentMethod: '13',
      installmentInfo: {
        issuerBank: this.transaction.data.payment.paymentMethod.issuerBank,
        installmentTerm: this.transaction.data.payment.paymentMethod.month
      },
      soId: this.transaction.data.order.soId,
      companyCode: productStock.company,
      companyName: 'บริษัท แอดวานซ์ ไวร์เลส เน็ทเวอร์ค จำกัด',
      locationCode: this.user.locationCode,
      locationName: this.transaction.data.seller.locationName,
      mobileNo: phoneNo,
      customer: customer,
      orderList: [{
        price: trade.promotionPrice,
        name: productDetail.name + 'สี' + color
      }]
    };
  }

  generateShortLink(url: string, mobileNo: string): Promise<any> {
    let urlLink: string = url;
    if (environment.ENABLE_SHORT_LINK) {
      const splitUrl: any = url.split('?');
      urlLink = `${environment.PREFIX_SHORT_LINK}?${splitUrl[1]}`;
      this.transaction.data.omise.shortUrl = urlLink;
      this.transactionService.update(this.transaction);
    }
    return this.sendSMSUrl({ mobileNo: mobileNo, urlPayment: urlLink }).then(() => {
    });
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

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ONLY_AIS_QR_CODE_SUMMARY_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ONLY_AIS_QR_CODE_QUEUE_PAGE]);
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
    localStorage.removeItem('phoneNoQR');
  }

  isDeveloperMode(): boolean {
    return 'LOCAL' === environment.name;
  }
}

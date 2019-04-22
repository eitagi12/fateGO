import { Component, OnInit, OnDestroy } from '@angular/core';
import { HomeService, AlertService, PageActivityService, TokenService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { interval, Observable, Subscription, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ROUTE_DEVICE_ORDER_AIS_BEST_BUY_QR_CODE_SUMMARY_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_QR_CODE_QUEUE_PAGE } from '../../constants/route-path.constant';
import { toDataURL } from 'qrcode';
import { Transaction, Payment } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { environment } from 'src/environments/environment';
import { ImageBrannerQRCode, QRCodePaymentService, QRCodePrePostMpayModel, QRCodeModel } from 'src/app/shared/services/qrcode-payment.service';

export class QRodePrePostMpayModel {
  orderId: string;
  tranDtm: string;
  tranId: string;
  amount: number;
  qrType: string;
  status: string;
  locationCode: string;
  offerId: string;
  startDtm: string;
}

@Component({
  selector: 'app-device-order-ais-existing-best-buy-qr-code-payment-generator-page',
  templateUrl: './device-order-ais-existing-best-buy-qr-code-payment-generator-page.component.html',
  styleUrls: ['./device-order-ais-existing-best-buy-qr-code-payment-generator-page.component.scss']
})
export class DeviceOrderAisExistingBestBuyQrCodePaymentGeneratorPageComponent implements OnInit, OnDestroy {

  transaction: Transaction;
  priceOption: PriceOption;
  payment: Payment;

  // qrCode
  subscription$: Subscription;
  private checkInquiryCallbackMpaySubscribtion$: Subscription;
  intravalTimeSubscription$: Subscription;
  currentDateTime: number;
  currentTimeCounter: BehaviorSubject<number> = new BehaviorSubject(null);
  orderID: string;
  isPaid: boolean = false;
  timeCounterRenderer: string;
  textQRCode: string;
  isTimeLowerThanFifthteenSeconds: boolean;
  qrCodePrePostMpayModel: QRodePrePostMpayModel;
  refreshCount: number = 1;
  NEW_LINE: string = '\n';
  qrCodeImageSrc: string;
  startTimeInMininte: number = 5;
  brannerImagePaymentQrCode: ImageBrannerQRCode;
  mcLoadingQrcodePaymentService: Promise<any>; // for mcLoading
  timeLowerThanOrEqualToZero: boolean;

  isPayment: false;
  isAdavance: false;
  deposit: number;

  // transaction: Transaction;
  // priceOption: PriceOption;
  // refreshCount: number = 1;
  // textQRCode: string;
  // private counter$: Observable<number>;
  // private currentTimeCounter: number;
  // private subscription$: Subscription;
  // isPaid: boolean = false;
  // timeCounterRenderer: string;
  // isTimeLowerThanFifthteenSeconds: boolean;
  // qrCodePrePostMpayModel: any;
  // orderID: string;
  // checkInquiryCallbackMpaySubscribtion$: Subscription;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private qrcodePaymentService: QRCodePaymentService,
    private alertService: AlertService,
    private tokenService: TokenService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.payment = this.transaction.data.payment;
    this.qrCodePrePostMpayModel = new QRCodePrePostMpayModel();
    this.brannerImagePaymentQrCode = this.qrcodePaymentService.getBrannerImagePaymentQrCodeType(this.payment.paymentQrCodeType);

  }

  ngOnInit(): void {
    this.deposit = this.transaction.data.preBooking
      && this.transaction.data.preBooking.depositAmt ? -Math.abs(+this.transaction.data.preBooking.depositAmt) : 0;
    this.initialOrderID();
    if (this.orderID && this.payment.paymentQrCodeType) {
      this.orderID = `${this.orderID}_${this.refreshCount}`;
      // this.getQRCode(this.mockTHPayGetQRCodeRequest); // mock
      this.getQRCode(this.setBodyRequestForGetQRCode());

      this.setBodyRequestForPreMpay();
      this.qrcodePaymentService.insertPreMpay(this.qrCodePrePostMpayModel).then(
        (data: any) => {
          console.log(data);
          this.qrcodePaymentService.updateMpayObjectInTransaction(this.qrCodePrePostMpayModel);
        },
        (error: any) => {
          this.alertService.error(error);
        }
      );
      this.subscribeInquiryCallbackMpay();
    } else {
      // handler when not found soID
      //   this.alertService.error('เกิดข้อผิดพลาด ระบบไม่สามารถเรียก orderID(soID) มาใช้งานได้');
      //   this.alertService.error('เกิดข้อผิดพลาด ระบบไม่สามารถเรียก Summary price มาใช้งานได้');
      //   this.alertService.error('ไม่พบการเลือกชนิด QRCode ในระบบ');
    }
  }

  getQRCode(qrModel: QRCodeModel): void {
    this.mcLoadingQrcodePaymentService = this.qrcodePaymentService.getQRCode(qrModel).then(
      (qrcode: any) => {
        this.processQRCode(qrcode);
      },
      (error: any) => {
        if (error && error.error && error.error.errors && error.error.errors.respCode && error.error.errors.respDesc) {
          this.alertService.error(error.error.errors.respDesc);
        } else {
          this.alertService.error(error);
        }
      });
  }

  goToMpaySummaryPage(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_QR_CODE_SUMMARY_PAGE]);
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_QR_CODE_SUMMARY_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  summary(amount: number[]): number {
    return amount.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
  }

  initialOrderID(): void {
    const orderID: { soID: string, error: string } = this.qrcodePaymentService.getSoID();
    if (orderID.error !== null) {
      // this.alertService.error(orderID.error);

      // mock on error อย่าลืมเอาออก
      if (this.isDeveloperMode()) {
        this.orderID = '66343';
      }
    } else {
      this.orderID = orderID.soID;
    }
  }

  isDeveloperMode(): boolean {
    return 'LOCAL' === environment.name;
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }

    if (this.checkInquiryCallbackMpaySubscribtion$) {
      this.checkInquiryCallbackMpaySubscribtion$.unsubscribe();
    }
  }

  processQRCode(qrCodeResponse: any): void {
    if (qrCodeResponse && qrCodeResponse.data) {
      this.textQRCode = qrCodeResponse.data.qrCodeStr;
      // const validTime: moment.Moment = moment(qrCode.data.qrCodeValidity, "DD/MM/YYYY'T'HH:mm:ss'Z'");
      this.currentDateTime = qrCodeResponse.data.currentDate;
      const validTime: number = this.getFiveMinuteValidTime(qrCodeResponse.data.currentDate);
      this.getTimeCounter(validTime);
      this.renderTime();

    } else {
      // handler when not found data
    }

    if (this.textQRCode) {
      toDataURL(this.textQRCode, { errorCorrectionLevel: 'H' }, (error, url) => {
        if (error) {
          console.error(error);
        }
        this.qrCodeImageSrc = url;
      });
    }
  }

  getFiveMinuteValidTime(currentDateTime: number): number {
    return currentDateTime + (60000 * this.startTimeInMininte);
  }

  getTimeCounter(furture: number): void {
    const diff: number = furture - this.currentDateTime;
    const intravalTime = interval(1000);
    this.intravalTimeSubscription$ = intravalTime.subscribe((index: number) => {
      this.currentTimeCounter.next(Math.floor((diff / 1000) - index));
    });
  }

  renderTime(): void {
    this.subscription$ = this.currentTimeCounter.subscribe((x: number) => {
      this.timeCounterRenderer = this.qrcodePaymentService.convertTimeForRender(x);
      this.isTimeLowerThanFifthteenSeconds = this.isTimeLowerThanFifthteenSecondsFn(x);
      const times: number = this.qrcodePaymentService.convertTimeToMinutes(x);
      this.timeLowerThanOrEqualToZero = times < 0;
      if (this.timeLowerThanOrEqualToZero) {
        this.inquiryMpay().then((isSuccess: boolean) => {
          if (isSuccess) {
            this.updateMpayDataStatus();
            this.goToMpayQueuePage();
          } else {
            this.subscription$.unsubscribe();
            this.showPopupMessage('สิ้นสุดระยะเวลาชำระเงิน กรุณากดปุ่ม "REFRESH"' + this.NEW_LINE + 'เพื่อทำรายการใหม่');
          }
        });
      } else if (this.isPaid) {
        this.qrcodePaymentService.updateMpayObjectInTransaction(this.qrCodePrePostMpayModel);
        this.goToMpayQueuePage();
      }
    });
  }

  isTimeLowerThanFifthteenSecondsFn(t: number): boolean {
    const fifthteenSeconds = 15;
    const m: number = this.qrcodePaymentService.convertTimeToMinutes(t);
    const s: number = this.qrcodePaymentService.convertTimeToSeconds(t, m);
    if (((m === 0 && s < fifthteenSeconds) || m < 0)) {
      return true;
    } else {
      return false;
    }
  }

  inquiryMpay(): Promise<boolean> {
    return this.qrcodePaymentService.getInquiryMpay({ orderId: this.orderID }).then((res: any) => {
      if (res && res.data && res.data.status && res.data.status === 'SUCCESS') {
        this.qrCodePrePostMpayModel.status = res.data.status;
        this.qrCodePrePostMpayModel.tranId = res.data.tranId;
        this.qrCodePrePostMpayModel.tranDtm = res.data.tranDtm;
        this.qrCodePrePostMpayModel.amount = res.data.amount;
        this.qrCodePrePostMpayModel.qrType = res.data.qrType;

        // set transactionId
        this.transaction.transactionId = res.data.tranId;
        return true;
      }
      return false;
    });
  }

  updateMpayDataStatus(): void {
    this.qrcodePaymentService.updatePostMpay(this.qrCodePrePostMpayModel).then(
      (data: any) => {
        this.qrcodePaymentService.updateMpayObjectInTransaction(this.qrCodePrePostMpayModel);
      },
      (error: any) => {
        this.alertService.error(error);
      }
    );
  }

  goToMpayQueuePage(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_QR_CODE_QUEUE_PAGE]);
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
      console.log('btn', btn);
      if (btn.value) { // refresh
        this.onRefreshQRCode();
      } else { // cancel
        this.goToMpaySummaryPage();
      }

    });
  }

  onRefreshQRCode(): void {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
    if (this.intravalTimeSubscription$) {
      this.intravalTimeSubscription$.unsubscribe();
    }

    this.currentTimeCounter.next(null);

    if (this.orderID && this.payment.paymentQrCodeType) {
      this.inquiryMpay().then((isSuccess: boolean) => {
        if (isSuccess) {
          this.updateMpayDataStatus();
          this.goToMpayQueuePage();
        } else {
          this.initialOrderID();
          this.refreshCount = this.refreshCount + 1;
          this.orderID = `${this.orderID}_${this.refreshCount}`;
          this.getQRCode(this.setBodyRequestForGetQRCode());
          this.setBodyRequestForPreMpay();
          this.qrcodePaymentService.updatePostMpay(this.qrCodePrePostMpayModel).then(
            (data: any) => {
              this.qrcodePaymentService.updateMpayObjectInTransaction(this.qrCodePrePostMpayModel);
            },
            (error: any) => {
              this.showPopupMessage(error);
            }
          );
          this.subscribeInquiryCallbackMpay();
        }
      }).catch((error: any) => {
        this.showPopupMessage(error);
      });
    }
  }

  setBodyRequestForGetQRCode(): QRCodeModel {
    const qrModel: QRCodeModel = new QRCodeModel();
    qrModel.orderId = this.orderID;
    qrModel.channel = 'WEB';

    if (this.payment.paymentQrCodeType === 'LINE_QR') {
      qrModel.serviceId = environment.MPAY_QRCODE.RL_SERVICE_ID;
      qrModel.terminalId = environment.MPAY_QRCODE.RL_TERMINAL_ID;
    } else if (this.payment.paymentQrCodeType === 'THAI_QR') {
      qrModel.serviceId = environment.MPAY_QRCODE.PB_SERVICE_ID;
      qrModel.terminalId = environment.MPAY_QRCODE.PB_TERMINAL_ID;
    }
    qrModel.locationName = this.tokenService.getUser().locationCode;
    qrModel.amount = this.getSummaryAmount();
    qrModel.qrType = this.brannerImagePaymentQrCode.code;
    return qrModel;
  }

  setBodyRequestForPreMpay(): void {
    this.qrCodePrePostMpayModel.orderId = this.orderID;
    this.qrCodePrePostMpayModel.amount = this.getSummaryAmount();
    this.qrCodePrePostMpayModel.qrType = this.brannerImagePaymentQrCode.code;
    this.qrCodePrePostMpayModel.status = 'WAITING';
  }

  getSummaryAmount(): number {
    return this.summary([+this.priceOption.trade.promotionPrice + this.deposit]);
  }

  // subscribe payment 'SUCCESS' every 5 sec
  subscribeInquiryCallbackMpay(): void {
    this.checkInquiryCallbackMpaySubscribtion$ = this.qrcodePaymentService.checkInquiryCallbackMpay({ orderId: this.orderID })
      .subscribe(
        (resp: any) => {
          console.log('checkInquiryCallbackMpay', resp);
          const data = resp.data || {};
          if (data && data.DATA && data.DATA.mpay_payment
            && data.DATA.mpay_payment.status && data.DATA.mpay_payment.status === 'SUCCESS') {
            this.qrCodePrePostMpayModel = data.DATA.mpay_payment;
            this.isPaid = true;
          } else {
            if (data && !data.DATA) {
              // this.goToMpayErrorPage();
              this.alertService.error('ระบบไม่สามารถใช้งานได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง ภายหลัง');
            } else {
              if (data && data.DATA && data.DATA.mpay_payment
                && data.DATA.mpay_payment.startDtm) {
                this.qrCodePrePostMpayModel.startDtm = data.DATA.mpay_payment.startDtm;
              }
            }
          }
        },
        (error: any) => {
          this.alertService.error(error);
        }
      );
  }
}

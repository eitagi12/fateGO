import { Component, OnInit, OnDestroy } from '@angular/core';
import { Transaction, Payment } from 'src/app/shared/models/transaction.model';
import { Router } from '@angular/router';
import { HomeService, AlertService, TokenService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_QR_CODE_SUMMARY_PAGE, ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_QR_CODE_QUEUE_PAGE, ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_QR_CODE_ERROR_PAGE } from '../../constants/route-path.constant';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Observable, Subscription, interval, Observer, BehaviorSubject } from 'rxjs';
import { QRCodePaymentService, QRCodeModel, QRCodePrePostMpayModel, ImageBrannerQRCode } from 'src/app/shared/services/qrcode-payment.service';
import { toDataURL } from 'qrcode';
import { environment } from 'src/environments/environment';

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
  selector: 'app-device-order-ais-new-register-qr-code-generator-page',
  templateUrl: './device-order-ais-new-register-qr-code-generator-page.component.html',
  styleUrls: ['./device-order-ais-new-register-qr-code-generator-page.component.scss']
})
export class DeviceOrderAisNewRegisterQrCodeGeneratorPageComponent implements OnInit, OnDestroy {

  transaction: Transaction;
  priceOption: PriceOption;
  payment: Payment;

  // qrCode
  subscription$: Subscription;
  // private checkInquiryCallbackMpaySubscribtion$: Subscription;
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
  brannerImagePaymentQrCode: ImageBrannerQRCode ;
  mcLoadingQrcodePaymentService: Promise<any>; // for mcLoading
  timeLowerThanOrEqualToZero: boolean;

  isPayment: false;
  isAdavance: false;

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
    }
  }

  public getQRCode(qrModel: QRCodeModel): void {
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

  getSummaryAmount(): number {
    return this.summary([+this.priceOption.trade.promotionPrice + (+this.priceOption.trade.advancePay.amount)]);
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_QR_CODE_SUMMARY_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_QR_CODE_QUEUE_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  summary(amount: number[]): number {
    return amount.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
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

  goToMpayQueuePage(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_QR_CODE_QUEUE_PAGE]);
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

  goToMpaySummaryPage(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_QR_CODE_SUMMARY_PAGE]);
  }

  setBodyRequestForGetQRCode(): QRCodeModel {
    const qrModel: QRCodeModel = new QRCodeModel();
    qrModel.orderId = this.orderID;
    qrModel.channel = 'WEB';

    if (this.payment.paymentQrCodeType === 'LINE_QR') {
      qrModel.serviceId = environment.MPAY_QRCODE_SERVICE_ID.RL;
      qrModel.terminalId = environment.MPAY_QRCODE_TERMINAL_ID.RL;
    } else if (this.payment.paymentQrCodeType === 'THAI_QR') {
      qrModel.serviceId = environment.MPAY_QRCODE_SERVICE_ID.PB;
      qrModel.terminalId = environment.MPAY_QRCODE_TERMINAL_ID.PB;
    }
    qrModel.locationName = this.tokenService.getUser().locationCode;
    qrModel.amount = this.getSummaryAmount();
    qrModel.qrType = this.brannerImagePaymentQrCode.code;
    return qrModel;
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

  setBodyRequestForPreMpay(): void {
    this.qrCodePrePostMpayModel.orderId = this.orderID;
    this.qrCodePrePostMpayModel.amount = this.getSummaryAmount();
    this.qrCodePrePostMpayModel.qrType = this.brannerImagePaymentQrCode.code;
    this.qrCodePrePostMpayModel.status = 'WAITING';
  }

  // subscribe payment 'SUCCESS' every 5 sec
  subscribeInquiryCallbackMpay(): void {
    this.qrcodePaymentService.checkInquiryCallbackMpay({ orderId: this.orderID })
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
              this.goToMpayErrorPage();
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

  goToMpayErrorPage(): void {
    alert('goToMpayErrorPage');
    // this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_QR_CODE_ERROR_PAGE]);
  }

  isDeveloperMode(): boolean {
    return 'LOCAL' === environment.name;
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }

}

export class MockQRTesting {
  private mockTHPayGetQRCodeRequest: QRCodeModel = {
    orderId: '6666',
    channel: 'POS',
    serviceId: environment.MPAY_QRCODE_SERVICE_ID.PB,
    terminalId: environment.MPAY_QRCODE_TERMINAL_ID.PB,
    locationName: 'Shop01',
    amount: 2345,
    qrType: '003',
    macAddress: '00-14-22-01-23-45'
  };

  private mockLinePayGetQRCodeRequest: QRCodeModel = {
    orderId: '6666',
    channel: 'POS',
    serviceId: environment.MPAY_QRCODE_SERVICE_ID.RL,
    terminalId: environment.MPAY_QRCODE_TERMINAL_ID.RL,
    locationName: 'Shop01',
    amount: 2345,
    qrType: '002',
    macAddress: '00-14-22-01-23-45'
  };

  private mockResponsTHAIQrcode: any =
    {
      data: {
        respDesc: 'Success',
        orderId: '6666',
        // tslint:disable-next-line:max-line-length
        qrCodeStr: '00020101021130740016A00000067701011201150105548038329010216500000000000468303110000001234631940016A00000067701011301031100203CsB035601165000000000004683021100000012346030710000000406Shop01530376454072345.005802TH5914MPAY_PROMPTPAY6211070710000006304E98D',
        qrFormat: 'TEXT',
        qrCodeValidity: '24 / 03 / 2019T09: 37: 33Z',
        respCode: '0000',
        currentDate: 1552988218913
      }
    };
}

import { Component, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { Router } from '@angular/router';
import { Transaction, Payment } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { AlertService, HomeService, TokenService, PageActivityService } from 'mychannel-shared-libs';
import { ROUTE_DEVICE_ONLY_ASP_QR_CODE_SUMMARY_PAGE, ROUTE_DEVICE_ONLY_ASP_QR_CODE_QUEUE_PAGE } from '../../constants/route-path.constant';
import { HomeButtonService } from 'src/app/device-only/services/home-button.service';
import { Subscription, BehaviorSubject, interval } from 'rxjs';
import { QRodePrePostMpayModel } from 'src/app/device-only/ais/device-only-ais/containers/device-only-ais-qr-code-generate-page/device-only-ais-qr-code-generate-page.component';
import { ImageBrannerQRCode, QRCodePrePostMpayModel, QRCodePaymentService, QRCodeModel } from 'src/app/shared/services/qrcode-payment.service';
import { environment } from 'src/environments/environment';
import { toDataURL } from 'qrcode';

@Component({
  selector: 'app-device-only-asp-qr-code-generate-page',
  templateUrl: './device-only-asp-qr-code-generate-page.component.html',
  styleUrls: ['./device-only-asp-qr-code-generate-page.component.scss']
})
export class DeviceOnlyAspQrCodeGeneratePageComponent implements OnInit, OnDestroy {
  private transaction: Transaction;
  private priceOption: PriceOption;
  private subscription$: Subscription;
  private payment: Payment;
  private brannerImagePaymentQrCode: ImageBrannerQRCode;
  private qrCodePrePostMpayModel: QRodePrePostMpayModel;
  private refreshQRCode: EventEmitter<boolean>;
  private mcLoadingQrcodePaymentService: Promise<any>;
  private checkInquiryCallbackMpaySubscribtion$: Subscription;
  private currentTimeCounter: BehaviorSubject<number> = new BehaviorSubject(null);
  private intravalTimeSubscription$: Subscription;
  private price: any;
  private orderID: string;
  private deposit: number;
  private isPaid: boolean = false;
  private textQRCode: string;
  private currentDateTime: number;
  private qrCodeImageSrc: string;
  private timeCounterRenderer: string;
  private isTimeLowerThanFifthteenSeconds: boolean;
  private timeLowerThanOrEqualToZero: boolean;
  private NEW_LINE: string = '\n';
  private refreshCount: number = 1;
  private startTimeInMininte: number = 5;

  constructor(
    private router: Router,
    private alertService: AlertService,
    private homeService: HomeService,
    private homeButtonService: HomeButtonService,
    private tokenService: TokenService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private qrcodePaymentService: QRCodePaymentService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.payment = this.transaction.data.payment;
    this.refreshQRCode = new EventEmitter<boolean>();
    this.qrCodePrePostMpayModel = new QRCodePrePostMpayModel();
    this.brannerImagePaymentQrCode = this.qrcodePaymentService.getBrannerImagePaymentQrCodeType(this.payment.paymentQrCodeType);
  }

  ngOnInit(): void {
    // REFACTOR'S CODE //
    this.homeButtonService.initEventButtonHome();
    this.getPriceOption();
    this.initialOrderID();
    this.calculateSummary();
    this.getQRCodeforMpay();
  }

  private getPriceOption(): void {
    this.price = this.priceOption.trade.priceType === 'NORMAL' ? this.priceOption.trade.normalPrice : this.priceOption.trade.promotionPrice;
  }

  private calculateSummary(): void {
    this.deposit = this.transaction.data.preBooking
      && this.transaction.data.preBooking.depositAmt ? -Math.abs(+this.transaction.data.preBooking.depositAmt) : 0;
  }

  private getQRCodeforMpay(): void {
    if (this.orderID && this.payment.paymentQrCodeType) {
      this.orderID = `${this.orderID}_${this.refreshCount}`;
      // this.transaction.data.payment = this.orderID;
      this.getQRCode(this.setBodyRequestForGetQRCode());
      this.setBodyRequestForPreMpay();
      this.insertQrcodePaymentService();
      this.subscribeInquiryCallbackMpay();
    }
  }

  private insertQrcodePaymentService(): void {
    this.qrcodePaymentService.insertPreMpay(this.qrCodePrePostMpayModel).then((data: any) => {
      this.qrcodePaymentService.updateMpayObjectInTransaction(this.qrCodePrePostMpayModel);
    },
    (error: any) => {
      this.alertService.error(error);
    });
  }

  // subscribe payment 'SUCCESS' every 5 sec
  private subscribeInquiryCallbackMpay(): void {
    this.checkInquiryCallbackMpaySubscribtion$ = this.qrcodePaymentService.checkInquiryCallbackMpay({ orderId: this.orderID })
      .subscribe(
        (resp: any) => {
          const data = resp.data || {};
          if (data && data.DATA && data.DATA.mpay_payment
            && data.DATA.mpay_payment.status && data.DATA.mpay_payment.status === 'SUCCESS') {
            this.qrCodePrePostMpayModel = data.DATA.mpay_payment;
            this.isPaid = true;
          } else {
            if (data && !data.DATA) {
              this.goToMpayErrorPage();
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

  private goToMpayErrorPage(): void {
    // this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_QR_CODE_ERROR_PAGE]);
  }

  private getQRCode(qrModel: QRCodeModel): void {
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

  private processQRCode(qrCodeResponse: any): void {
    if (qrCodeResponse && qrCodeResponse.data) {
      this.textQRCode = qrCodeResponse.data.qrCodeStr;
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

  private  renderTime(): void {
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

  private showPopupMessage(message: string): void {
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
        this.onRefreshQRCode();
      } else { // cancel
        this.onBack();
      }

    });
  }

  private onRefreshQRCode(): void {
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

  private goToMpayQueuePage(): void {
    this.router.navigate([ROUTE_DEVICE_ONLY_ASP_QR_CODE_QUEUE_PAGE]);
  }

  private updateMpayDataStatus(): void {
    this.qrcodePaymentService.updatePostMpay(this.qrCodePrePostMpayModel).then(
      (data: any) => {
        this.qrcodePaymentService.updateMpayObjectInTransaction(this.qrCodePrePostMpayModel);
      },
      (error: any) => {
        this.alertService.error(error);
      }
    );
  }

  private inquiryMpay(): Promise<boolean> {
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
      } else {

        return false;
      }
    });
  }

  private isTimeLowerThanFifthteenSecondsFn(t: number): boolean {
    const fifthteenSeconds = 15;
    const m: number = this.qrcodePaymentService.convertTimeToMinutes(t);
    const s: number = this.qrcodePaymentService.convertTimeToSeconds(t, m);
    if (((m === 0 && s < fifthteenSeconds) || m < 0)) {
      return true;
    } else {
      return false;
    }
  }

  private getTimeCounter(furture: number): void {
    const diff: number = furture - this.currentDateTime;
    const intravalTime = interval(1000);
    this.intravalTimeSubscription$ = intravalTime.subscribe((index: number) => {
      this.currentTimeCounter.next(Math.floor((diff / 1000) - index));
    });
  }

  private getFiveMinuteValidTime(currentDateTime: number): number {
    return currentDateTime + (60000 * this.startTimeInMininte);
  }

  private setBodyRequestForGetQRCode(): QRCodeModel {
    const qrModel: QRCodeModel = new QRCodeModel();
    const MPAY_QRCODE = environment.MPAY_QRCODE;
    const isThaiQRCode = this.isQRCode('THAI_QR');

    qrModel.orderId = this.orderID;
    qrModel.channel = 'WEB';
    qrModel.company = this.priceOption.productStock.company;

        if (this.priceOption.productStock.company === 'WDS' && this.transaction.data.payment.paymentType === 'QR_CODE') {
          qrModel.company = this.priceOption.productStock.company;
          qrModel.serviceId = isThaiQRCode ? MPAY_QRCODE.PB_WDS_SERVICE_ID : MPAY_QRCODE.RL_WDS_SERVICE_ID;
          qrModel.terminalId = isThaiQRCode ? MPAY_QRCODE.PB_WDS_TERMINAL_ID : MPAY_QRCODE.RL_WDS_TERMINAL_ID;
      } else {
          qrModel.company = this.priceOption.productStock.company;
          qrModel.serviceId = isThaiQRCode ? MPAY_QRCODE.PB_SERVICE_ID : MPAY_QRCODE.RL_SERVICE_ID;
          qrModel.terminalId = isThaiQRCode ? MPAY_QRCODE.PB_TERMINAL_ID : MPAY_QRCODE.RL_TERMINAL_ID;
      }
    qrModel.locationName = this.tokenService.getUser().locationCode;
    qrModel.amount = this.getSummaryAmount();
    qrModel.qrType = this.brannerImagePaymentQrCode.code;
    return qrModel;
  }

  private isQRCode(qrCodeType: 'THAI_QR' | 'LINE_QR'): boolean {
    const payment: any = this.transaction.data.payment || {};
    return payment.paymentQrCodeType === qrCodeType;
  }

  private setBodyRequestForPreMpay(): void {
    this.qrCodePrePostMpayModel.orderId = this.orderID;
    this.qrCodePrePostMpayModel.amount = this.getSummaryAmount();
    this.qrCodePrePostMpayModel.qrType = this.brannerImagePaymentQrCode.code;
    this.qrCodePrePostMpayModel.status = 'WAITING';
  }

  private getSummaryAmount(): number {
    return this.summary([+this.price + this.deposit]);
  }

  private summary(amount: number[]): number {
    return amount.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
  }

  private initialOrderID(): void {
    const orderID: { soID: string, error: string } = this.qrcodePaymentService.getSoID();
    if (orderID.error !== null) {
      if (this.isDeveloperMode()) {
        this.orderID = '66343';
      }
    } else {
      this.orderID = orderID.soID;
    }
  }

  private isDeveloperMode(): boolean {
    return 'LOCAL' === environment.name;
  }

  public onHome(): void {
    this.homeService.goToHome();
  }

  public onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ONLY_ASP_QR_CODE_SUMMARY_PAGE]);
  }

  private onRefresh(): void {
    location.reload();
    this.refreshQRCode.emit(true);
  }

  ngOnDestroy(): void {
    // this.transactionService.update(this.transaction);
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
    if (this.checkInquiryCallbackMpaySubscribtion$) {
      this.checkInquiryCallbackMpaySubscribtion$.unsubscribe();
    }
  }
}

import { Component, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService, TokenService, PageLoadingService, User, HomeService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { Transaction, Payment } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { toDataURL } from 'qrcode';
import { ImageBrannerQRCode, QRCodeModel, QRCodePaymentService, QRCodePrePostMpayModel } from 'src/app/shared/services/qrcode-payment.service';
import { environment } from 'src/environments/environment';
import { Subscription, BehaviorSubject } from 'rxjs';
import { interval } from 'rxjs';
import { ROUTE_SHOP_PREMIUM_QR_CODE_SUMMARY_PAGE, ROUTE_SHOP_PREMIUM_RESULT_PAGE } from 'src/app/device-only/ais-shop-premium/constants/route-path.constant';
import { QueueService } from 'src/app/device-only/services/queue.service';
import { SharedTransactionService } from 'src/app/shared/services/shared-transaction.service';
import { CreateOrderService } from 'src/app/device-only/services/create-order.service';
import { HttpClient } from '@angular/common/http';

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
  selector: 'app-device-only-shop-premium-qr-code-generator-page',
  templateUrl: './device-only-shop-premium-qr-code-generator-page.component.html',
  styleUrls: ['./device-only-shop-premium-qr-code-generator-page.component.scss']
})
export class DeviceOnlyShopPremiumQrCodeGeneratorPageComponent implements OnInit, OnDestroy {

  transaction: Transaction;
  priceOption: PriceOption;
  payment: Payment;
  user: User;
  refreshQRCode: EventEmitter<boolean>;
  // qrcode
  private checkInquiryCallbackMpaySubscribtion$: Subscription;
  textQRCode: string;
  qrCodeImageSrc: string;
  mcLoadingQrcodePaymentService: Promise<any>;
  brannerImagePaymentQrCode: ImageBrannerQRCode;
  orderID: string;
  timeCounterRenderer: string;
  subscription$: Subscription;
  currentTimeCounter: BehaviorSubject<number> = new BehaviorSubject(null);
  isTimeLowerThanFifthteenSeconds: boolean;
  timeLowerThanOrEqualToZero: boolean;
  NEW_LINE: string = '\n';
  qrCodePrePostMpayModel: QRodePrePostMpayModel;
  diff: number;
  startTimeInMininte: number = 5;
  currentDateTime: number;
  intravalTimeSubscription$: Subscription;
  isPaid: boolean = false;
  refreshCount: number = 1;
  price: String;

  constructor(
    private router: Router,
    private http: HttpClient,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private alertService: AlertService,
    private qrcodePaymentService: QRCodePaymentService,
    private tokenService: TokenService,
    private createOrderService: CreateOrderService,
    private queueService: QueueService,
    private pageLoadingService: PageLoadingService,
    private sharedTransactionService: SharedTransactionService,
    private homeService: HomeService,
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.user = this.tokenService.getUser();
    this.payment = this.transaction.data.payment;
    this.refreshQRCode = new EventEmitter<boolean>();
    this.qrCodePrePostMpayModel = new QRCodePrePostMpayModel();
    this.brannerImagePaymentQrCode = this.qrcodePaymentService.getBrannerImagePaymentQrCodeType(this.payment.paymentQrCodeType);
    this.homeService.callback = () => {
      this.alertService.question('ต้องการยกเลิกรายการขายหรือไม่ การยกเลิก ระบบจะคืนสินค้าเข้าสต๊อคสาขาทันที', 'ตกลง', 'ยกเลิก')
        .then((response: any) => {
          if (response.value === true) {
            this.returnStock().then(() => {
              this.transaction.data.order = {};
              this.transactionService.remove();
              window.location.href = '/';
            });
          }
        });
    };
  }

  ngOnInit(): void {
    this.price = this.priceOption.productDetail.price;
    this.initialOrderID();
    if (this.orderID && this.payment.paymentQrCodeType) {
      this.orderID = `${this.orderID}_${this.refreshCount}`;
      this.getQRCode(this.setBodyRequestForGetQRCode());
      this.setBodyRequestForPreMpay();
      this.qrcodePaymentService.insertPreMpay(this.qrCodePrePostMpayModel).then(
        () => {
          this.qrcodePaymentService.updateMpayObjectInTransaction(this.qrCodePrePostMpayModel);
        },
        (error: any) => {
          this.alertService.error(error);
        }
      );
      this.subscribeInquiryCallbackMpay();
    }
  }

  setBodyRequestForPreMpay(): void {
    this.qrCodePrePostMpayModel.orderId = this.orderID;
    this.qrCodePrePostMpayModel.amount = this.getSummaryAmount();
    this.qrCodePrePostMpayModel.qrType = this.brannerImagePaymentQrCode.code;
    this.qrCodePrePostMpayModel.status = 'WAITING';
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

  onBack(): void {
    this.router.navigate([ROUTE_SHOP_PREMIUM_QR_CODE_SUMMARY_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  genQueue(): void {
    this.pageLoadingService.openLoading();
    this.queueService.getQueueZ(this.user.locationCode)
      .then((resp: any) => {
        const queueNo = resp.data.queue;
        this.transaction.data.queue = { queueNo: queueNo };
        this.createOrderAndupdateTransaction();
      });
  }

  createOrderAndupdateTransaction(): void {
    this.createOrderService.createDeviceSellingOrderShopPremium(this.transaction, this.priceOption).then(() => {
      this.sharedTransactionService.updateSharedTransaction(this.transaction, this.priceOption, true).then(() => {
        this.pageLoadingService.closeLoading();
        this.router.navigate([ROUTE_SHOP_PREMIUM_RESULT_PAGE]);
      });
    });
  }

  onRefresh(): void {
    location.reload();
    this.refreshQRCode.emit(true);
  }

  summary(amount: number[]): number {
    return amount.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
  }

  processQRCode(qrCodeResponse: any): void {
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

  isQRCode(qrCodeType: 'THAI_QR' | 'LINE_QR'): boolean {
    const payment: any = this.transaction.data.payment || {};
    return payment.paymentQrCodeType === qrCodeType;
  }

  setBodyRequestForGetQRCode(): QRCodeModel {
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

  getSummaryAmount(): number {
    return this.summary([+this.price]);
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
          } else {
            this.subscription$.unsubscribe();
            this.showPopupMessage('สิ้นสุดระยะเวลาชำระเงิน กรุณากดปุ่ม "REFRESH"' + this.NEW_LINE + 'เพื่อทำรายการใหม่');
          }
        });
      } else if (this.isPaid) {
        this.updateMpayObjectInTransaction();
      }
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
      if (btn.value) { // refresh
        this.onRefreshQRCode();
      } else { // cancel
        this.onBack();
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
        this.transaction.transactionId = res.data.tranId;
        return true;
      } else {

        return false;
      }
    });
  }

  updateMpayDataStatus(): void {
    this.qrcodePaymentService.updatePostMpay(this.qrCodePrePostMpayModel).then(
      () => {
        this.updateMpayObjectInTransaction();
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
        } else {
          this.initialOrderID();
          this.refreshCount = this.refreshCount + 1;
          this.orderID = `${this.orderID}_${this.refreshCount}`;
          this.getQRCode(this.setBodyRequestForGetQRCode());
          this.setBodyRequestForPreMpay();
          this.qrcodePaymentService.updatePostMpay(this.qrCodePrePostMpayModel).then(
            () => {
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

  initialOrderID(): void {
    const orderID: { soID: string, error: string } = this.qrcodePaymentService.getSoID();
    if (orderID.error !== null) {
      this.alertService.error(orderID.error);
    } else {
      this.orderID = orderID.soID;
    }
  }

  // subscribe payment 'SUCCESS' every 5 sec
  subscribeInquiryCallbackMpay(): void {
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

  returnStock(): Promise<void> {
    return new Promise(resolve => {
      const transaction = this.transactionService.load();
      const promiseAll = [];
      if (transaction && transaction.data) {
        if (transaction.data.order && transaction.data.order.soId) {
          const order = this.http.post('/api/salesportal/dt/remove-cart', {
            soId: transaction.data.order.soId,
            userId: this.user.username
          }).toPromise().catch(() => Promise.resolve());
          promiseAll.push(order);
        }
      }
      Promise.all(promiseAll).then(() => resolve());
    });
  }

  async updateMpayObjectInTransaction(): Promise<void> {
    this.transaction.data.mpayPayment = this.qrCodePrePostMpayModel;
    await this.transactionService.update(this.transaction);
    await this.genQueue();
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
}

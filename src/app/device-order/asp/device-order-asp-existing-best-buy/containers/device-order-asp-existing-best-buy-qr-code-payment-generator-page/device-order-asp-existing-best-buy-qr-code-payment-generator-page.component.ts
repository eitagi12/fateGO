import { Component, OnInit, OnDestroy } from '@angular/core';
import { HomeService, AlertService, PageActivityService, TokenService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { interval, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { toDataURL } from 'qrcode';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { environment } from 'src/environments/environment';
import { ROUTE_DEVICE_ORDER_ASP_BEST_BUY_QR_CODE_SUMMARY_PAGE, ROUTE_DEVICE_ORDER_ASP_BEST_BUY_QR_CODE_QUEUE_PAGE } from '../../constants/route-path.constant';

////////////////////////  ดึง Service จาก flow ais  /////////////////////////
import { QrcodePaymentService, QrCodeModel } from 'src/app/device-order/ais/device-order-ais-existing-best-buy/services/qrcode-payment.service';

@Component({
  selector: 'app-device-order-asp-existing-best-buy-qr-code-payment-generator-page',
  templateUrl: './device-order-asp-existing-best-buy-qr-code-payment-generator-page.component.html',
  styleUrls: ['./device-order-asp-existing-best-buy-qr-code-payment-generator-page.component.scss']
})
export class DeviceOrderAspExistingBestBuyQrCodePaymentGeneratorPageComponent implements OnInit, OnDestroy {

  transaction: Transaction;
  priceOption: PriceOption;
  deposit: number;
  refreshCount: number = 1;
  textQRCode: string;
  private counter$: Observable<number>;
  private currentTimeCounter: number;
  private subscription$: Subscription;
  isPaid: boolean = false;
  timeCounterRenderer: string;
  isTimeLowerThanFifthteenSeconds: boolean;
  qrCodePrePostMpayModel: any;
  orderID: string;
  checkInquiryCallbackMpaySubscribtion$: Subscription;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private alertService: AlertService,
    private pageActivityService: PageActivityService,
    private qrcodePaymentService: QrcodePaymentService,
    private tokenService: TokenService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void {
    this.deposit = this.transaction.data.preBooking
      && this.transaction.data.preBooking.depositAmt ? -Math.abs(+this.transaction.data.preBooking.depositAmt) : 0;
    const payment = this.transaction.data.payment;
    const order = this.transaction.data.order;
    // if (this.transaction
    //   && this.transaction.data
    //   && this.transaction.data.order
    //   && this.transaction.data.order.soId) {

    // } else {
    //   this.alertService.error('เกิดข้อผิดพลาด ระบบไม่สามารถเรียก orderID(soID) มาใช้งานได้');
    //   this.alertService.error('เกิดข้อผิดพลาด ระบบไม่สามารถเรียก Summary price มาใช้งานได้');
    //   this.alertService.error('ไม่พบการเลือกชนิด QRCode ในระบบ');
    // }

    // [SORRY Krap]
    /*if (order.soId && payment.qrCode.qrType) {
      this.orderID = `${order.soId}_${this.refreshCount}`;
      this.getQRCode(this.setBodyRequestForGetQRCode(order.soId, payment.qrCode.qrType));
      this.setBodyRequestForPreMpay();
      this.qrcodePaymentService.insertPreMpay(this.qrCodePrePostMpayModel).then((data: any) => {
        this.transaction.data.mpayPayment = this.qrCodePrePostMpayModel;
      });
      this.subscribeInquiryCallbackMpay();
    }*/
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_ASP_BEST_BUY_QR_CODE_SUMMARY_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  summary(amount: number[]): number {
    return amount.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
  }

  public getQRCode(qrModel: QrCodeModel): void {
    this.qrcodePaymentService.getQRCode(qrModel).then((qrcode: any) => {
      this.processQRCode(qrcode);
    }).catch((e: any) => {
      this.notifyMessage(e.error.developerMessage);
    });
  }

  processQRCode(qrCode: any): void {
    toDataURL(qrCode.qrCodeStr, { errorCorrectionLevel: 'H' }, (error, url) => {
      if (error) {
        console.error(error);
      }
      this.textQRCode = url;
    });
    const currentDateTime: number = qrCode.currentDate;
    const validTime: number = this.getFiveMinuteValidTime(currentDateTime);
    this.getTimeCounter(validTime, currentDateTime);
    this.renderTime();
  }

  getFiveMinuteValidTime(currentDateTime: number): number {
    const startTimeInMininte: number = 5;
    return currentDateTime + (60000 * startTimeInMininte);
  }

  getTimeCounter(furture: number, currentDateTime: number): void {
    const diff: number = furture - currentDateTime;
    this.counter$ = interval(1000).pipe(map((x: number, index: number) => {
      this.currentTimeCounter = Math.floor((diff / 1000) - index);
      return this.currentTimeCounter;
    }));
  }

  renderTime(): void {
    this.subscription$ = this.counter$.subscribe((x: number) => {
      this.timeCounterRenderer = this.qrcodePaymentService.convertTimeForRender(x);
      this.isTimeLowerThanFifthteenSeconds = this.isTimeLowerThanFifthteenSecondsFn(x);
      const times: number = this.qrcodePaymentService.convertTimeToMinutes(x);
      const timeLowerThanOrEqualToZero: boolean = times < 0;
      if (timeLowerThanOrEqualToZero) {
        this.inquiryMpay().then((isSuccess: boolean) => {
          if (isSuccess) {
            this.updateMpayDataStatus();
            this.goToMpayQueuePage();
          } else {
            this.subscription$.unsubscribe();
            this.checkInquiryCallbackMpaySubscribtion$.unsubscribe();
            this.notifyMessage('สิ้นสุดระยะเวลาชำระเงิน กรุณากดปุ่ม "REFRESH" \n เพื่อทำรายการใหม่');
          }
        });
      } else if (this.isPaid) {
        // this.transaction.data.mpayPayment = this.qrCodePrePostMpayModel;
        this.goToMpayQueuePage();
      }
    });
  }

  goToMpayQueuePage(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_ASP_BEST_BUY_QR_CODE_QUEUE_PAGE]);
  }

  setBodyRequestForGetQRCode(soId: string, qrType: string): QrCodeModel {
    // --Start Mock data
    const isRabbitLinePay: boolean = qrType === '002';
    const isThaiQRCode: boolean = qrType === '003';
    let serviceId: string;
    let terminalId: number;
    if (isRabbitLinePay) {
      serviceId = environment.MPAY_QRCODE_SERVICE_ID.RL;
      terminalId = environment.MPAY_QRCODE_TERMINAL_ID.RL;
    } else if (isThaiQRCode) {
      serviceId = environment.MPAY_QRCODE_SERVICE_ID.PB;
      terminalId = environment.MPAY_QRCODE_TERMINAL_ID.PB;
    }
    const user = this.tokenService.getUser();
    return {
      orderId: soId,
      channel: 'WEB',
      serviceId: serviceId,
      terminalId: terminalId,
      locationName: user.locationCode,
      amount: this.summary([+this.priceOption.trade.promotionPrice, this.deposit]),
      qrType: qrType,
      macAddress: '77-D0-2B-C4-55-33'
    };
  }

  isTimeLowerThanFifthteenSecondsFn(t: number): boolean {
    const fifthteenSeconds: number = 15;
    const m: number = this.qrcodePaymentService.convertTimeToMinutes(t);
    const s: number = this.qrcodePaymentService.convertTimeToSeconds(t, m);
    if (((m === 0 && s < fifthteenSeconds) || m < 0)) {
      return true;
    } else {
      return false;
    }
  }

  inquiryMpay(): Promise<boolean> {
    return this.qrcodePaymentService.getInquiryMpay(this.orderID).then((res: any) => {
      console.log(res);
      if (res && res.data && res.data.respDesc && res.data.status === 'SUCCESS') {
        this.qrCodePrePostMpayModel = res.data.status;
        this.qrCodePrePostMpayModel.tranId = res.data.tranId;
        this.qrCodePrePostMpayModel.tranDtm = res.data.tranDtm;
        this.qrCodePrePostMpayModel.amount = res.data.amount;
        this.qrCodePrePostMpayModel.qrType = res.data.qrType;
        return true;
      }
      return false;
    });
  }

  updateMpayDataStatus(): void {
    this.qrcodePaymentService.updatePostMpay(this.qrCodePrePostMpayModel).then((data: any) => {
      // this.transaction.data.mpayPayment = this.qrCodePrePostMpayModel;
    });
  }

  notifyMessage(message: string): void {
    this.alertService.notify({
      type: 'question',
      cancelButtonText: 'CANCLE',
      confirmButtonText: 'REFRESH',
      showCancelButton: true,
      showConfirmButton: true,
      reverseButtons: true,
      allowEscapeKey: false,
      text: message,
      timer: 180000
    }).then((data) => {
      if (!data.value) {
        this.router.navigate([ROUTE_DEVICE_ORDER_ASP_BEST_BUY_QR_CODE_SUMMARY_PAGE]);
      }
      this.onRefreshQRCode();
    });
  }

  onRefreshQRCode(): void {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
    if (this.checkInquiryCallbackMpaySubscribtion$) {
      this.checkInquiryCallbackMpaySubscribtion$.unsubscribe();
    }
    /*if (this.transaction.data.order.soId && this.transaction.data.payment.qrCode.qrType) {
      this.inquiryMpay().then((isSuccess: boolean) => {
        if (isSuccess) {
          this.updateMpayDataStatus();
          this.goToMpayQueuePage();
        } else {
          this.refreshCount = this.refreshCount + 1;
          this.orderID = `${this.transaction.data.order.soId}_${this.refreshCount}`;
          this.getQRCode(this.setBodyRequestForGetQRCode(this.transaction.data.order.soId, this.transaction.data.payment.qrCode.qrType));
          this.setBodyRequestForPreMpay();
          this.qrcodePaymentService.updatePostMpay(this.qrCodePrePostMpayModel).then((data: any) => {
            // this.transaction.data.mpayPayment = this.qrCodePrePostMpayModel;
          }).catch((error: any) => {
            this.notifyMessage(error);
          });
          this.subscribeInquiryCallbackMpay();
        }
      }).catch((error: any) => {
        this.notifyMessage(error);
      });
    }*/
  }

  subscribeInquiryCallbackMpay(): void {
    this.checkInquiryCallbackMpaySubscribtion$ = this.qrcodePaymentService.checkInquiryCallbackMpay(this.orderID)
      .subscribe(
        (data: any) => {
          if (data && data.DATA && data.DATA.mpay_payment
            && data.DATA.mpay_payment.status && data.DATA.mpay_payment.status === 'SUCCESS') {
            this.qrCodePrePostMpayModel = data.DATA.mpay_payment;
            this.isPaid = true;
          } else {
            if (data && data.DATA && data.DATA.mpay_payment
              && data.DATA.mpay_payment.startDtm) {
              this.qrCodePrePostMpayModel.startDtm = data.DATA.mpay_payment.startDtm;
            }
          }
        });
  }

  setBodyRequestForPreMpay(): void {
    // --Start Mock data
    this.qrCodePrePostMpayModel = {
      orderId: this.orderID,
      amount: this.summary([+this.priceOption.trade.promotionPrice, this.deposit]),
      // qrType: this.transaction.data.payment.qrCode.qrType,
      status: 'WAITING',
    };
    // --End Mock data
  }

  ngOnDestroy(): void {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
    if (this.checkInquiryCallbackMpaySubscribtion$) {
      this.checkInquiryCallbackMpaySubscribtion$.unsubscribe();
    }
    this.transactionService.update(this.transaction);
  }

}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Transaction, Prebooking, Customer } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User, PageLoadingService, AlertService, TokenService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { QRCodePaymentService } from 'src/app/shared/services/qrcode-payment.service';
import { SharedTransactionService } from 'src/app/shared/services/shared-transaction.service';
import { QueuePageService } from 'src/app/device-order/services/queue-page.service';
import { ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_RESULT_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-existing-best-buy-shop-qr-code-queue-page',
  templateUrl: './device-order-ais-existing-best-buy-shop-qr-code-queue-page.component.html',
  styleUrls: ['./device-order-ais-existing-best-buy-shop-qr-code-queue-page.component.scss']
})
export class DeviceOrderAisExistingBestBuyShopQrCodeQueuePageComponent implements OnInit, OnDestroy {

  transaction: Transaction;
  priceOption: PriceOption;
  queueFrom: FormGroup;
  mobileFrom: FormGroup;
  queue: string;
  transId: string;
  deposit: number;
  mobileNo: string;
  isAutoGenQueue: boolean;
  user: User;
  queueWording: string = 'เบอร์โทรศัพท์รับหมายเลขคิวเพื่อชำระสินค้าของท่านคือ';
  color: string;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private pageLoadingService: PageLoadingService,
    private alertService: AlertService,
    private tokenService: TokenService,
    private qrCodeService: QRCodePaymentService,
    private sharedTransactionService: SharedTransactionService,
    private queuePageService: QueuePageService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.user = this.tokenService.getUser();
  }

  ngOnInit(): void {
    this.queueWording = this.isLocationPhuket() ? 'เบอร์โทรศัพท์รับหมายเลขสั่งซื้อเพื่อชำระสินค้าของท่านคือ'
                      : this.queueWording;
    this.isAutoGenQueue = this.user.locationCode === '1100';
    this.deposit = this.transaction.data.preBooking
      && this.transaction.data.preBooking.depositAmt ? -Math.abs(+this.transaction.data.preBooking.depositAmt) : 0;
    // this.getTransactionId();
    this.color = this.priceOption.productStock.color ? this.priceOption.productStock.color : this.priceOption.productStock.colorName || '';
    this.createForm();
  }

  getTransactionId(): void {
    const order = this.transaction.data.order || {};
    this.qrCodeService.getInquiryCallbackMpay({ orderId: order.soId }).then((transId: any) => {
      if (transId && transId.data && transId.data.DATA && transId.data.DATA.mpay_payment) {
        this.transId = transId.data.DATA.mpay_payment.tranId;
        // this.transaction.data.mpayPayment.tranId = this.transId;
      } else {
        this.alertService.error('เกิดข้อผิดพลาด ระบบไม่สามารถเรียก orderID(soID) มาใช้งานได้');
      }
    });
  }

  createForm(): void {
    this.mobileFrom = this.fb.group({
      'mobileNo': ['', Validators.compose([Validators.required, Validators.pattern(/^0[6-9]{1}[0-9]{8}/)])],
    });

    if (this.transaction.data.simCard.mobileNo) {
      this.mobileFrom.patchValue({mobileNo: this.transaction.data.simCard.mobileNo});
      this.mobileNo = this.transaction.data.simCard.mobileNo;
    }

    this.mobileFrom.valueChanges.subscribe((value) => {
      this.mobileNo = value.mobileNo;
    });

    this.queueFrom = this.fb.group({
      'queue': ['', Validators.compose([Validators.required, Validators.pattern(/([A-Y]{1}[0-9]{3})/)])],
    });

    this.queueFrom.valueChanges.subscribe((value) => {
      this.queue = value.queue;
    });
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    if (this.isAutoGenQueue) {
      this.onSendSMSQueue(this.mobileNo).then((queue) => {
        if (queue) {
          this.transaction.data.queue = { queueNo: queue };
          return this.queuePageService.createDeviceSellingOrder(this.transaction, this.priceOption).then(() => {
            return this.sharedTransactionService.updateSharedTransaction(this.transaction, this.priceOption).then(() => {
                    this.pageLoadingService.closeLoading();
                    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_RESULT_PAGE]);
                  });
          });
        } else {
          this.isAutoGenQueue = false;
          this.pageLoadingService.closeLoading();
          this.alertService.error('ขออภัยค่ะ ระบบไม่สามารถ กดรับบัตรคิวอัตโนมัติได้ \n กรุณาระบุหมายเลขคิว');
          return;
        }
      }).catch(() => {
        this.isAutoGenQueue = false;
        this.pageLoadingService.closeLoading();
        this.alertService.error('ขออภัยค่ะ ระบบไม่สามารถ กดรับบัตรคิวอัตโนมัติได้ \n กรุณาระบุหมายเลขคิว');
        return;
      });
    } else {
      this.transaction.data.queue = { queueNo: this.queue };
      this.queuePageService.createDeviceSellingOrder(this.transaction, this.priceOption).then(() => {
        return this.sharedTransactionService.updateSharedTransaction(this.transaction, this.priceOption).then(() => {
          this.pageLoadingService.closeLoading();
          this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_RESULT_PAGE]);
        });
      });
    }
  }

  summary(amount: number[]): number {
    return amount.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

  isLocationPhuket(): boolean {
    return this.user.locationCode === '1213' && this.tokenService.isAisUser();
  }

  onSendSMSQueue(mobileNo: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.isLocationPhuket()) {
        return this.http.post('/api/salesportal/device-order/transaction/get-queue-qmatic', {
          mobileNo: mobileNo
        }).toPromise()
          .then((respQueue: any) => {
            const data = respQueue.data && respQueue.data.result ? respQueue.data.result : {};
            resolve(data.queueNo);
          });
      } else {
        return this.http.post('/api/salesportal/device-order/transaction/auto-gen-queue', {
          mobileNo: mobileNo
        }).toPromise()
          .then((response: any) => {
            if (response && response.data && response.data.data && response.data.data.queueNo) {
              resolve(response.data.data.queueNo);
            } else {
              reject(null);
            }
          });
      }
    });
  }

  getPaymentBalance(): number {
    const trade = this.priceOption.trade;
    const payment: any = this.transaction.data.payment || {};
    const advancePayment: any = this.transaction.data.advancePayment || {};

    let summary = 0;
    if (payment.paymentType === 'QR_CODE') {
      summary += +trade.promotionPrice;
    }
    if (advancePayment.paymentType === 'QR_CODE') {
      const advancePay = trade.advancePay || {};
      summary += +advancePay.amount;
    }

    if (this.deposit) {
      summary += this.deposit;
    }
    return summary;
  }

  getOutStandingBalance(): number {
    const trade = this.priceOption.trade;
    const payment: any = this.transaction.data.payment || {};
    const advancePayment: any = this.transaction.data.advancePayment || {};

    let summary = 0;
    if (payment.paymentType !== 'QR_CODE') {
      summary += +trade.promotionPrice;
    }
    if (advancePayment.paymentType !== 'QR_CODE') {
      const advancePay = trade.advancePay || {};
      summary += +advancePay.amount;
    }
    return summary;
  }

  checkValid(): boolean {
    if (!this.isAutoGenQueue) {
      return !!this.queueFrom.invalid;
    } else {
      return !!this.mobileFrom.invalid;
    }
  }

}

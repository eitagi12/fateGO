import { Component, OnInit, OnDestroy } from '@angular/core';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User, PageLoadingService, TokenService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
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
  user: User;
  queueWording: string = 'เบอร์โทรศัพท์รับหมายเลขคิวเพื่อชำระสินค้าของท่านคือ';
  color: string;
  queueType: string;
  inputType: string;
  errorQueue: boolean = false;
  skipQueue: boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private pageLoadingService: PageLoadingService,
    private tokenService: TokenService,
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
    this.setQueueType();
    this.deposit = this.transaction.data.preBooking
      && this.transaction.data.preBooking.depositAmt ? -Math.abs(+this.transaction.data.preBooking.depositAmt) : 0;
    this.transId = !!this.transaction.data.mpayPayment ? this.transaction.data.mpayPayment.tranId : '';
    this.color = this.priceOption.productStock.color ? this.priceOption.productStock.color : this.priceOption.productStock.colorName || '';
    this.createForm();
  }

  setQueueType(): void {
    this.queuePageService.checkQueueLocation().then((queueType) => {
      this.queueType = queueType;
    }).then(() => this.createForm());
  }

  checkInput(event: any, type: string): void {
    this.inputType = type;
    if (type === 'mobileNo') {
      this.queueFrom.reset();
    } else {
      this.mobileFrom.reset();
    }
  }

  createForm(): void {
    this.mobileFrom = this.fb.group({
      'mobileNo': ['', Validators.compose([Validators.required, Validators.pattern(/^0[6-9]{1}[0-9]{8}/)])],
    });

    if (this.transaction.data.simCard.mobileNo && this.queueType === 'SMART_SHOP') {
      this.mobileFrom.patchValue({ mobileNo: this.transaction.data.simCard.mobileNo });
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

  onSkip(): void {
    this.http.get('/api/salesportal/device-sell/gen-queue', { params: { locationCode: this.user.locationCode } }).toPromise()
      .then((resp: any) => {
        const queueNo = resp.data.queue;
        this.skipQueue = true;
        this.transaction.data.queue = { queueNo: queueNo };
        this.createOrderAndupdateTransaction();
      });
  }

  createOrderAndupdateTransaction(): void {
    this.queuePageService.createDeviceSellingOrder(this.transaction, this.priceOption).then(() => {
      return this.sharedTransactionService.updateSharedTransaction(this.transaction, this.priceOption).then(() => {
        this.pageLoadingService.closeLoading();
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_RESULT_PAGE]);
      });
    });
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    if (!this.queueType || this.queueType === 'MANUAL' || this.inputType === 'queue') {
      this.transaction.data.queue = { queueNo: this.queue };
      this.createOrderAndupdateTransaction();
    } else {
      if (this.isLocationPhuket()) {
        this.genQueuePhuket();
      } else {
        this.genQueueAuto();
      }
    }
  }

  genQueuePhuket(): void {
    this.http.post('/api/salesportal/device-order/transaction/get-queue-qmatic', {
      mobileNo: this.mobileNo
    }).toPromise()
      .then((response: any) => {
        const data = response.data && response.data.result ? response.data.result : {};
        if (data.queueNo) {
          this.transaction.data.queue = { queueNo: data.queueNo };
          this.createOrderAndupdateTransaction();
        } else {
          this.onSkip();
        }
      }).catch((error) => {
        this.onSkip();
      });
  }

  genQueueAuto(): void {
    this.http.post('/api/salesportal/device-order/transaction/auto-gen-queue', {
      mobileNo: this.mobileNo
    }).toPromise()
      .then((response: any) => {
        if (response && response.data && response.data.data && response.data.data.queueNo) {
          this.transaction.data.queue = { queueNo: response.data.data.queueNo };
          this.createOrderAndupdateTransaction();
        } else {
          this.queueType = 'MANUAL';
          this.errorQueue = true;
          this.pageLoadingService.closeLoading();
        }
      }).catch((error) => {
        this.queueType = 'MANUAL';
        this.errorQueue = true;
        this.pageLoadingService.closeLoading();
      });
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
    if (this.queueType === 'AUTO_GEN_Q') {
      return this.mobileFrom.invalid && this.queueFrom.invalid;
    } else if (this.queueType === 'SMART_SHOP') {
      return this.mobileFrom.invalid;
    } else {
      return this.queueFrom.invalid;
    }
  }

  checkSkip(): boolean {
    return this.mobileFrom.value['mobileNo'] ? true : false;
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Transaction, Payment } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { REGEX_MOBILE, PageLoadingService } from 'mychannel-shared-libs';
import { QueuePageService } from 'src/app/device-order/services/queue-page.service';
import { SharedTransactionService } from 'src/app/shared/services/shared-transaction.service';
import { SummaryPageService } from 'src/app/device-order/services/summary-page.service';
import { ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_OMISE_QUEUE_PAGE } from 'src/app/device-order/ais/device-order-ais-existing-prepaid-hotdeal/constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-existing-prepaid-hotdeal-omise-queue-page',
  templateUrl: './device-order-ais-existing-prepaid-hotdeal-omise-queue-page.component.html',
  styleUrls: ['./device-order-ais-existing-prepaid-hotdeal-omise-queue-page.component.scss']
})
export class DeviceOrderAisExistingPrepaidHotdealOmiseQueuePageComponent implements OnInit, OnDestroy {

  transaction: Transaction;
  priceOption: PriceOption;
  queueFrom: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private pageLoadingService: PageLoadingService,
    private queuePageService: QueuePageService,
    public summaryPageService: SummaryPageService,
    private sharedTransactionService: SharedTransactionService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void {
    this.createForm();
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    this.queuePageService.getQueueQmatic(this.queueFrom.value.mobileNo)
      .then((resp: any) => {
        const data = resp.data && resp.data.result ? resp.data.result : {};
        return data.queueNo;
      })
      .then((queueNo: string) => {
        this.transaction.data.queue = {
          queueNo: queueNo
        };
        return this.queuePageService.createDeviceSellingOrderList(this.transaction, this.priceOption)
          .then(() => {
            return this.sharedTransactionService.updateSharedTransaction(this.transaction, this.priceOption);
          });
      })
      .then(() => {
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_OMISE_QUEUE_PAGE]);
      })
      .then(() => this.pageLoadingService.closeLoading());
  }

  getPaymentBalance(): number {
    const trade = this.priceOption.trade;
    const payment: any = this.transaction.data.payment || {};
    const advancePayment: any = this.transaction.data.advancePayment || {};
    let summary = 0;
    const advancePay = trade.advancePay || {};
    if (trade.advancePay.installmentFlag === 'Y') {
      return this.summary([+trade.promotionPrice, +advancePay.amount]);
    }

    if (payment.paymentOnlineCredit) {
      summary += +trade.promotionPrice;
    }
    if (advancePayment.paymentOnlineCredit) {
      summary += +advancePay.amount;
    }
    return summary;
  }

  getOutStandingBalance(): number {
    const trade = this.priceOption.trade;
    const payment: any = this.transaction.data.payment || {};
    const advancePayment: any = this.transaction.data.advancePayment || {};
    let summary = 0;
    const advancePay = trade.advancePay || {};

    if (trade.advancePay.installmentFlag === 'Y') {
      return this.summary([+trade.promotionPrice, +advancePay.amount]);
    }

    if (!payment.paymentOnlineCredit) {
      summary += +trade.promotionPrice;
    }
    if (!advancePayment.paymentOnlineCredit) {
      summary += +advancePay.amount;
    }
    return summary;
  }

  summary(amount: number[]): number {
    return amount.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
  }

  createForm(): void {
    this.queueFrom = this.fb.group({
      'mobileNo': ['', Validators.compose([Validators.required, Validators.pattern(REGEX_MOBILE)])],
    });
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}

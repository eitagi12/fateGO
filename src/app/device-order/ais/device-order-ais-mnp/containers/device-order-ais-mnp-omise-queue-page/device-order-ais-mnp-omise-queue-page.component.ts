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
import { ROUTE_DEVICE_ORDER_AIS_MNP_OMISE_RESULT_PAGE } from 'src/app/device-order/ais/device-order-ais-mnp/constants/route-path.constant';
import { QrCodeOmisePageService } from 'src/app/device-order/services/qr-code-omise-page.service';

@Component({
  selector: 'app-device-order-ais-mnp-omise-queue-page',
  templateUrl: './device-order-ais-mnp-omise-queue-page.component.html',
  styleUrls: ['./device-order-ais-mnp-omise-queue-page.component.scss']
})
export class DeviceOrderAisMnpOmiseQueuePageComponent implements OnInit, OnDestroy {
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
    public qrCodeOmisePageService: QrCodeOmisePageService,
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
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_OMISE_RESULT_PAGE]);
      })
      .then(() => this.pageLoadingService.closeLoading());
  }

  getPaymentBalance(): number {
    const trade = this.priceOption.trade;
    let summary = 0;
    const advancePay = trade.advancePay || {};
    if (trade.advancePay.installmentFlag === 'Y') {
      return this.summary([+trade.promotionPrice, +advancePay.amount]);
    }

    if (this.qrCodeOmisePageService.isPaymentOnlineCredit(this.transaction, 'payment')) {
      summary += +trade.promotionPrice;
    }
    if (this.qrCodeOmisePageService.isPaymentOnlineCredit(this.transaction, 'advancePayment')) {
      summary += +advancePay.amount;
    }
    return summary;
  }

  getOutStandingBalance(): number {
    const trade = this.priceOption.trade;
    let summary = 0;
    const advancePay = trade.advancePay || {};

    if (trade.advancePay.installmentFlag === 'Y') {
      return this.summary([+trade.promotionPrice, +advancePay.amount]);
    }

    if (!this.qrCodeOmisePageService.isPaymentOnlineCredit(this.transaction, 'payment')) {
      summary += +trade.promotionPrice;
    }
    if (!this.qrCodeOmisePageService.isPaymentOnlineCredit(this.transaction, 'advancePayment')) {
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
    this.queueFrom.controls['mobileNo'].setValue(this.transaction.data.simCard.mobileNo);
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { ROUTE_DEVICE_ORDER_AIS_MNP_RESULT_PAGE } from '../../constants/route-path.constant';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PageLoadingService, REGEX_MOBILE } from 'mychannel-shared-libs';
import { SharedTransactionService } from 'src/app/shared/services/shared-transaction.service';
import { QueuePageService } from 'src/app/device-order/services/queue-page.service';

@Component({
  selector: 'app-device-order-ais-mnp-qr-code-queue-page',
  templateUrl: './device-order-ais-mnp-qr-code-queue-page.component.html',
  styleUrls: ['./device-order-ais-mnp-qr-code-queue-page.component.scss']
})
export class DeviceOrderAisMnpQrCodeQueuePageComponent implements OnInit, OnDestroy {

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
        return this.queuePageService.createDeviceSellingOrder(this.transaction, this.priceOption)
          .then(() => {
            return this.sharedTransactionService.updateSharedTransaction(this.transaction, this.priceOption);
          });
      })
      .then(() => {
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_RESULT_PAGE]);
      })
      .then(() => this.pageLoadingService.closeLoading());
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

  summary(amount: number[]): number {
    return amount.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
  }

  createForm(): void {
    this.queueFrom = this.fb.group({
      'mobileNo': ['', Validators.compose([Validators.required, Validators.pattern(REGEX_MOBILE)])],
    });

    // set default input mobileNo
    this.queueFrom.controls['mobileNo'].setValue(this.transaction.data.simCard.mobileNo);
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

}

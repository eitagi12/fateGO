import { Component, OnInit, OnDestroy } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { REGEX_MOBILE, PageLoadingService } from 'mychannel-shared-libs';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Router } from '@angular/router';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { QueuePageService } from 'src/app/device-order/services/queue-page.service';
import { SharedTransactionService } from 'src/app/shared/services/shared-transaction.service';
import { ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_RESULT_PAGE } from '../../constants/route-path.constant';
import { HttpClient } from '@angular/common/http';
import { CreateDeviceOrderAisExistingPrepaidHotdealService } from '../../service/create-device-order-ais-existing-prepaid-hotdeal.service';

@Component({
  selector: 'app-device-order-ais-existing-prepaid-hotdeal-qr-code-queue-page',
  templateUrl: './device-order-ais-existing-prepaid-hotdeal-qr-code-queue-page.component.html',
  styleUrls: ['./device-order-ais-existing-prepaid-hotdeal-qr-code-queue-page.component.scss']
})
export class DeviceOrderAisExistingPrepaidHotdealQrCodeQueuePageComponent implements OnInit, OnDestroy {

  transaction: Transaction;
  priceOption: PriceOption;
  queueFrom: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private pageLoadingService: PageLoadingService,
    private http: HttpClient,
    private queuePageService: QueuePageService,
    private sharedTransactionService: SharedTransactionService,
    private createDeviceOrderPrepaidHotdealService: CreateDeviceOrderAisExistingPrepaidHotdealService
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
        return this.http.post('/api/salesportal/device-sell/order',
        this.createDeviceOrderPrepaidHotdealService.getRequestDeviceSellOrder(this.transaction, this.priceOption)).toPromise()
          .then(() => {
            delete this.transaction.data.mainPackage;
            return this.sharedTransactionService.updateSharedTransaction(this.transaction, this.priceOption);
          });
      })
      .then(() => {
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_RESULT_PAGE]);
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
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, Aggregate } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction, Payment } from 'src/app/shared/models/transaction.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_AGREEMENT_SIGN_PAGE, ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_QUEUE_PAGE, ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_QR_CODE_SUMMARY_PAGE } from '../../constants/route-path.constant';

export interface Balance {
  remainingBalance: number;
  transferBalance: number;
  validityDate: string;
}
export interface CurrentServices {
  canTransfer: boolean;
  serviceCode: string;
  serviceName: string;
}

@Component({
  selector: 'app-device-order-ais-pre-to-post-aggregate-page',
  templateUrl: './device-order-ais-pre-to-post-aggregate-page.component.html',
  styleUrls: ['./device-order-ais-pre-to-post-aggregate-page.component.scss']
})
export class DeviceOrderAisPreToPostAggregatePageComponent implements OnInit, OnDestroy {
  transaction: Transaction;
  aggregate: Aggregate;
  priceOption: PriceOption;
  payment: Payment;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.payment = this.transaction.data.payment;
  }

  ngOnInit(): void { }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_AGREEMENT_SIGN_PAGE]);
  }

  onNext(): void {
    console.log(this.payment.paymentType);

    if (this.payment.paymentType === 'CREDIT' || this.payment.paymentType === 'DEBIT') {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_QUEUE_PAGE]);
    } else if (this.payment.paymentType === 'QR_CODE') {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_QR_CODE_SUMMARY_PAGE]);
    }
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    // this.transactionService.update(this.transaction);
  }

  summary(amount: number[]): number {
    return amount.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
  }
}

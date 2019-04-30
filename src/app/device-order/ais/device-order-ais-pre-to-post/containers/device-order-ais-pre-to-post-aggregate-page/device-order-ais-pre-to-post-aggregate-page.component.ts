import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, Aggregate } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction, Payment } from 'src/app/shared/models/transaction.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import {
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_AGREEMENT_SIGN_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_QUEUE_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_QR_CODE_SUMMARY_PAGE
} from '../../constants/route-path.constant';
@Component({
  selector: 'app-device-order-ais-pre-to-post-aggregate-page',
  templateUrl: './device-order-ais-pre-to-post-aggregate-page.component.html',
  styleUrls: ['./device-order-ais-pre-to-post-aggregate-page.component.scss']
})
export class DeviceOrderAisPreToPostAggregatePageComponent implements OnInit {
  transaction: Transaction;
  aggregate: Aggregate;
  priceOption: PriceOption;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void { }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_AGREEMENT_SIGN_PAGE]);
  }

  onNext(): void {
    const payment: any = this.transaction.data.payment || {};
    const advancePayment: any = this.transaction.data.advancePayment || {};

    if (payment.paymentType === 'QR_CODE' || advancePayment.paymentType === 'QR_CODE') {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_QR_CODE_SUMMARY_PAGE]);
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_QUEUE_PAGE]);
    }
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  getThumbnail(): string {
    const product = (this.priceOption.productDetail.products || []).find((p: any) => {
      return p.colorName === this.priceOption.productStock.color;
    });
    return product && product.images ? product.images.thumbnail : '';
  }

  summary(amount: number[]): number {
    return amount.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
  }
}

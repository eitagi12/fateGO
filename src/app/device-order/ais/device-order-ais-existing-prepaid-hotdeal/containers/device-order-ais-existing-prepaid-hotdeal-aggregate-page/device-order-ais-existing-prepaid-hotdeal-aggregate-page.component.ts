import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, Aggregate } from 'mychannel-shared-libs';
import {
  ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_SUMMARY_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_QUEUE_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_QR_CODE_SUMMARY_PAGE
} from '../../constants/route-path.constant';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { Transaction, Payment } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';

@Component({
  selector: 'app-device-order-ais-existing-prepaid-hotdeal-aggregate-page',
  templateUrl: './device-order-ais-existing-prepaid-hotdeal-aggregate-page.component.html',
  styleUrls: ['./device-order-ais-existing-prepaid-hotdeal-aggregate-page.component.scss']
})
export class DeviceOrderAisExistingPrepaidHotdealAggregatePageComponent implements OnInit {

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

  ngOnInit(): void {
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

  onNext(): void {
    if (this.isQrCodePayment()) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_QR_CODE_SUMMARY_PAGE]);
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_QUEUE_PAGE]);
    }
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_SUMMARY_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  isQrCodePayment(): boolean {
    const payment: Payment = this.transaction.data.payment;
    return payment.paymentType === 'QR_CODE';
  }

}

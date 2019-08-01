import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, Aggregate } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction, Payment } from 'src/app/shared/models/transaction.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { ROUTE_DEVICE_AIS_DEVICE_SUMMARY_PAGE, ROUTE_DEVICE_AIS_DEVICE_QUEUE_PAGE } from 'src/app/device-order/ais/device-order-ais-device/constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-device-aggregate-page',
  templateUrl: './device-order-ais-device-aggregate-page.component.html',
  styleUrls: ['./device-order-ais-device-aggregate-page.component.scss']
})
export class DeviceOrderAisDeviceAggregatePageComponent implements OnInit {
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
    this.router.navigate([ROUTE_DEVICE_AIS_DEVICE_SUMMARY_PAGE]);
  }

  onNext(): void {
    const payment: any = this.transaction.data.payment || {};
    const advancePayment: any = this.transaction.data.advancePayment || {};
    this.router.navigate([ROUTE_DEVICE_AIS_DEVICE_QUEUE_PAGE]);

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

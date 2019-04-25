import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, DeviceSelling, Aggregate } from 'mychannel-shared-libs';
import { ROUTE_DEVICE_ORDER_AIS_EXISTING_AGREEMENT_SIGN_PAGE, ROUTE_DEVICE_ORDER_AIS_EXISTING_QUEUE_PAGE, ROUTE_DEVICE_ORDER_AIS_EXISTING_QR_CODE_SUMMARY_PAGE } from '../../constants/route-path.constant';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';

@Component({
  selector: 'app-device-order-ais-existing-aggregate-page',
  templateUrl: './device-order-ais-existing-aggregate-page.component.html',
  styleUrls: ['./device-order-ais-existing-aggregate-page.component.scss']
})
export class DeviceOrderAisExistingAggregatePageComponent implements OnInit {
  transaction: Transaction;
  aggregate: Aggregate;
  priceOption: PriceOption;
  deviceSelling: DeviceSelling;

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
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_AGREEMENT_SIGN_PAGE]);
  }

  onNext(): void {
    const payment = this.transaction.data.payment;
    switch (payment.paymentType) {
      case 'QR_CODE':
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_QR_CODE_SUMMARY_PAGE]);
        break;
      default:
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_QUEUE_PAGE]);
        break;
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

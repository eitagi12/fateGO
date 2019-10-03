import { Component, OnInit, OnDestroy } from '@angular/core';
import { Transaction, Payment } from 'src/app/shared/models/transaction.model';
import { Aggregate, HomeService } from 'mychannel-shared-libs';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { ROUTE_DEVICE_ORDER_AIS_EXISTING_AGREEMENT_SIGN_PAGE, ROUTE_DEVICE_ORDER_AIS_EXISTING_QUEUE_PAGE, ROUTE_DEVICE_ORDER_AIS_EXISTING_QR_CODE_SUMMARY_PAGE, ROUTE_DEVICE_ORDER_AIS_EXISTING_OMISE_SUMMARY_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-existing-aggregate-page',
  templateUrl: './device-order-ais-existing-aggregate-page.component.html',
  styleUrls: ['./device-order-ais-existing-aggregate-page.component.scss']
})
export class DeviceOrderAisExistingAggregatePageComponent implements OnInit, OnDestroy {

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
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_AGREEMENT_SIGN_PAGE]);
  }

  onNext(): void {
    const payment: any = this.transaction.data.payment || {};
    const advancePayment: any = this.transaction.data.advancePayment || {};

    this.router.navigate([this.checkRouteNavigate(payment, advancePayment)]);
  }

  checkRouteNavigate(payment: any, advancePayment: any): string {
    if (payment.paymentType === 'QR_CODE' || advancePayment.paymentType === 'QR_CODE') {
      return ROUTE_DEVICE_ORDER_AIS_EXISTING_QR_CODE_SUMMARY_PAGE;
    } else if (payment.paymentOnlineCredit || advancePayment.paymentOnlineCredit) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_OMISE_SUMMARY_PAGE]);
    } else {
      return ROUTE_DEVICE_ORDER_AIS_EXISTING_QUEUE_PAGE;
    }
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
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

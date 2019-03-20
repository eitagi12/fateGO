import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, Aggregate } from 'mychannel-shared-libs';
import { ROUTE_DEVICE_ONLY_AIS_KEY_IN_QUEUE, ROUTE_DEVICE_ONLY_AIS_SUMMARY_PAGE } from '../../constants/route-path.constant';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { TransactionAction, Transaction } from 'src/app/shared/models/transaction.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
@Component({
  selector: 'app-device-only-ais-checkout-payment-page',
  templateUrl: './device-only-ais-checkout-payment-page.component.html',
  styleUrls: ['./device-only-ais-checkout-payment-page.component.scss']
})

export class DeviceOnlyAisCheckoutPaymentPageComponent implements OnInit, OnDestroy {
  transaction: Transaction;
  checkout: Aggregate;
  priceOption: PriceOption;
  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void {
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ONLY_AIS_SUMMARY_PAGE]);
  }
  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ONLY_AIS_KEY_IN_QUEUE]);
  }
  onHome(): void {
    this.homeService.goToHome();
  }
  ngOnDestroy(): void {
  }
  summary(aomunt: number[]): number {
    return aomunt.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
  }
}

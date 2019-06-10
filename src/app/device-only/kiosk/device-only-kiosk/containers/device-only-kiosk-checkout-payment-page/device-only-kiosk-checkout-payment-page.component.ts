import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_DEVICE_ONLY_KIOSK_SUMMARY_PAGE, ROUTE_DEVICE_ONLY_KIOSK_QUEUE_PAGE,  } from '../../constants/route-path.constant';
import { HomeButtonService } from 'src/app/device-only/services/home-button.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HomeService, Aggregate } from 'mychannel-shared-libs';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Transaction } from 'src/app/shared/models/transaction.model';

@Component({
  selector: 'app-device-only-kiosk-checkout-payment-page',
  templateUrl: './device-only-kiosk-checkout-payment-page.component.html',
  styleUrls: ['./device-only-kiosk-checkout-payment-page.component.scss']
})
export class DeviceOnlyKioskCheckoutPaymentPageComponent implements OnInit , OnDestroy {
  transaction: Transaction;
  checkout: Aggregate;
  priceOption: PriceOption;
  price: any;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private homeButtonService: HomeButtonService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void {
    this.price = this.priceOption.trade.priceType === 'NORMAL' ? this.priceOption.trade.normalPrice : this.priceOption.trade.promotionPrice;
    this.homeButtonService.initEventButtonHome();
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ONLY_KIOSK_SUMMARY_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ONLY_KIOSK_QUEUE_PAGE]);
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

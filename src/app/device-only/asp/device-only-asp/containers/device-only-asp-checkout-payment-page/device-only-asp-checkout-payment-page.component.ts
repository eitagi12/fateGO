import { Component, OnInit, OnDestroy } from '@angular/core';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Router } from '@angular/router';
import { ROUTE_DEVICE_ONLY_ASP_QUEUE_PAGE, ROUTE_DEVICE_ONLY_ASP_SUMMARY_PAGE } from '../../constants/route-path.constant';
import { HomeService } from 'mychannel-shared-libs';
import { HomeButtonService } from 'src/app/device-only/services/home-button.service';

@Component({
  selector: 'app-device-only-asp-checkout-payment-page',
  templateUrl: './device-only-asp-checkout-payment-page.component.html',
  styleUrls: ['./device-only-asp-checkout-payment-page.component.scss']
})
export class DeviceOnlyAspCheckoutPaymentPageComponent implements OnInit, OnDestroy {
  private  transaction: Transaction;
  private  priceOption: PriceOption;
  private price: any;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private homeButtonService: HomeButtonService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void {
    this.homeButtonService.initEventButtonHome();
    this.getPriceOption();
  }

  private getPriceOption(): void {
    this.price = this.priceOption.trade.priceType === 'NORMAL' ? this.priceOption.trade.normalPrice : this.priceOption.trade.promotionPrice;
  }

  private summary(aomunt: number[]): number {
    return aomunt.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
  }

  public onHome(): void {
    this.homeService.goToHome();
  }

  public onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ONLY_ASP_SUMMARY_PAGE]);
  }

  public onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ONLY_ASP_QUEUE_PAGE]);
  }

  ngOnDestroy(): void {
  }

}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, AlertService } from 'mychannel-shared-libs';
import { ROUTE_DEVICE_ONLY_AIS_SUMMARY_PAGE, ROUTE_DEVICE_ONLY_AIS_QR_CODE_SUMMARY_PAGE } from '../../constants/route-path.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { HomeButtonService } from 'src/app/device-only/services/home-button.service';
@Component({
  selector: 'app-device-only-ais-checkout-payment-qr-code-page',
  templateUrl: './device-only-ais-checkout-payment-qr-code-page.component.html',
  styleUrls: ['./device-only-ais-checkout-payment-qr-code-page.component.scss']
})
export class DeviceOnlyAisCheckoutPaymentQrCodePageComponent implements OnInit, OnDestroy {
  transaction: Transaction;
  priceOption: PriceOption;
  campaignName: string = 'โครงการ ซื้อเครื่องเปล่า';
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

  summary(aomunt: number[]): number {
    return aomunt.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
  }

  onBack(): void {
  this.router.navigate([ROUTE_DEVICE_ONLY_AIS_SUMMARY_PAGE]);
  }

  onNext(): void {
    // QR code
    this.router.navigate([ROUTE_DEVICE_ONLY_AIS_QR_CODE_SUMMARY_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
  }

}

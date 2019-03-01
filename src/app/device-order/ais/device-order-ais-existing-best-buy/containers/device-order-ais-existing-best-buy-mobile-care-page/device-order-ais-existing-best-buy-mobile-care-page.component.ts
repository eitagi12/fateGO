import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { ApiRequestService, PageLoadingService, HomeService, MobileCare, ShoppingCart, BillingSystemType } from 'mychannel-shared-libs';
import { ROUTE_DEVICE_ORDER_AIS_BEST_BUY_MOBILE_CARE_AVAILABLE_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SUMMARY_PAGE } from 'src/app/device-order/ais/device-order-ais-existing-best-buy/constants/route-path.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { ShoppingCartService } from 'src/app/device-order/service/shopping-cart.service';
import { MobileCareService } from 'src/app/device-order/service/mobile-care.service';
import { MOBILE_CARE_PACKAGE_KEY_REF } from 'src/app/device-order/constants/cpc.constant';

@Component({
  selector: 'app-device-order-ais-existing-best-buy-mobile-care-page',
  templateUrl: './device-order-ais-existing-best-buy-mobile-care-page.component.html',
  styleUrls: ['./device-order-ais-existing-best-buy-mobile-care-page.component.scss']
})
export class DeviceOrderAisExistingBestBuyMobileCarePageComponent implements OnInit, OnDestroy {

  identityValid = true;
  transaction: Transaction;
  wizards = WIZARD_DEVICE_ORDER_AIS;
  mobileCare: MobileCare;
  priceOption: PriceOption;
  shoppingCart: ShoppingCart;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private apiRequestService: ApiRequestService,
    private http: HttpClient,
    private priceOptionService: PriceOptionService,
    private shoppingCartService: ShoppingCartService,
    private mobileCareService: MobileCareService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit() {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    delete this.transaction.data.mobileCarePackage;
    this.callService();

  }

  onCompleted(mobileCare: any) {
    this.transaction.data.mobileCarePackage = mobileCare;
  }

  onHome() {
    this.homeService.goToHome();
  }

  onBack() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_MOBILE_CARE_AVAILABLE_PAGE]);
  }

  onNext() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SUMMARY_PAGE]);
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

  callService() {
    const billingSystem = this.transaction.data.simCard.billingSystem || BillingSystemType.IRB;
    const chargeType = this.transaction.data.simCard.chargeType;
    const endUserPrice = +this.priceOption.trade.normalPrice;
    const exMobileCare = this.transaction.data.existingMobileCare;

    this.pageLoadingService.openLoading();
    this.mobileCareService.getMobileCare({
      packageKeyRef: MOBILE_CARE_PACKAGE_KEY_REF,
      billingSystem: BillingSystemType.IRB
    }, chargeType, billingSystem, endUserPrice).then((mobileCare: any) => {
      this.mobileCare = {
        promotions: mobileCare,
        // campaignPrice: 0
        existingMobileCare: exMobileCare ? true : false
      };
      if (this.mobileCare.promotions && this.mobileCare.promotions.length > 0) {
        this.mobileCare.promotions[0].active = true;
      }
    })
      .then(() => this.pageLoadingService.closeLoading());
  }


}

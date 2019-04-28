import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { MobileCare, ShoppingCart, HomeService, PageLoadingService, BillingSystemType } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { MobileCareService } from 'src/app/device-order/services/mobile-care.service';
import { ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_MOBILE_CARE_AVAILABLE_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_PAYMENT_DETAIL_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_SUMMARY_PAGE } from '../../constants/route-path.constant';
import { MOBILE_CARE_PACKAGE_KEY_REF } from 'src/app/device-order/constants/cpc.constant';

@Component({
  selector: 'app-device-order-ais-existing-best-buy-shop-mobile-care-page',
  templateUrl: './device-order-ais-existing-best-buy-shop-mobile-care-page.component.html',
  styleUrls: ['./device-order-ais-existing-best-buy-shop-mobile-care-page.component.scss']
})
export class DeviceOrderAisExistingBestBuyShopMobileCarePageComponent implements OnInit, OnDestroy {

  wizards: any = WIZARD_DEVICE_ORDER_AIS;

  priceOption: PriceOption;
  transaction: Transaction;
  mobileCare: MobileCare;
  shoppingCart: ShoppingCart;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private priceOptionService: PriceOptionService,
    private transactionService: TransactionService,
    private pageLoadingService: PageLoadingService,
    private shoppingCartService: ShoppingCartService,
    private mobileCareService: MobileCareService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    delete this.transaction.data.mobileCarePackage;
    this.callService();
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onBack(): void {
    if (this.transaction.data.existingMobileCare) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_MOBILE_CARE_AVAILABLE_PAGE]);
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_PAYMENT_DETAIL_PAGE]);
    }
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_SUMMARY_PAGE]);
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

  onCompleted(mobileCare: any): void {
    this.transaction.data.mobileCarePackage = mobileCare;
  }

  callService(): void {
    const billingSystem = ( this.transaction.data.simCard.billingSystem === 'RTBS')
                ? BillingSystemType.IRB : this.transaction.data.simCard.billingSystem || BillingSystemType.IRB;
    const chargeType = this.transaction.data.simCard.chargeType;
    const endUserPrice = +this.priceOption.trade.normalPrice;
    const exMobileCare = this.transaction.data.existingMobileCare;

    this.pageLoadingService.openLoading();
    this.mobileCareService.getMobileCare({
      packageKeyRef: MOBILE_CARE_PACKAGE_KEY_REF,
      billingSystem: billingSystem
    }, chargeType, billingSystem, endUserPrice).then((mobileCare: any) => {
      this.mobileCare = {
        promotions: mobileCare,
        existingMobileCare: !!exMobileCare
      };
      if (this.mobileCare.promotions && this.mobileCare.promotions.length > 0) {
        this.mobileCare.promotions[0].active = true;
      }
      return;
    })
      .then(() => this.pageLoadingService.closeLoading());
  }

}

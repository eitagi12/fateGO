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
import { ROUTE_DEVICE_ORDER_AIS_MNP_CONFIRM_USER_INFORMATION_PAGE, ROUTE_DEVICE_ORDER_AIS_MNP_SUMMARY_PAGE } from '../../constants/route-path.constant';
import { MOBILE_CARE_PACKAGE_KEY_REF } from 'src/app/device-order/constants/cpc.constant';

@Component({
  selector: 'app-device-order-ais-mnp-mobile-care-page',
  templateUrl: './device-order-ais-mnp-mobile-care-page.component.html',
  styleUrls: ['./device-order-ais-mnp-mobile-care-page.component.scss']
})
export class DeviceOrderAisMnpMobileCarePageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;

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
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    delete this.transaction.data.mobileCarePackage;
    this.callService();
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_CONFIRM_USER_INFORMATION_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_SUMMARY_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onCompleted(mobileCare: any): void {
    this.transaction.data.mobileCarePackage = mobileCare;
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

  callService(): void {
    const billingSystem = this.transaction.data.simCard.billingSystem || BillingSystemType.IRB;
    const chargeType = this.transaction.data.mainPackage.customAttributes.billingSystem;
    const endUserPrice = +this.priceOption.trade.normalPrice;

    this.pageLoadingService.openLoading();
    this.mobileCareService.getMobileCare({
      packageKeyRef: MOBILE_CARE_PACKAGE_KEY_REF,
      billingSystem: BillingSystemType.IRB
    }, chargeType, billingSystem, endUserPrice).then((mobileCare: any) => {
      this.mobileCare = {
        promotions: mobileCare
      };
      if (this.mobileCare.promotions && this.mobileCare.promotions.length > 0) {
        this.mobileCare.promotions[0].active = true;
      }
    })
      .then(() => this.pageLoadingService.closeLoading());
  }
}

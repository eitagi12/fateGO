import { Component, OnInit, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { WIZARD_DEVICE_ORDER_AIS, WIZARD_DEVICE_ORDER_ASP } from 'src/app/device-order/constants/wizard.constant';
import { ApiRequestService, PageLoadingService, HomeService, MobileCare, ShoppingCart, BillingSystemType, VAT, TokenService } from 'mychannel-shared-libs';
import { ROUTE_DEVICE_ORDER_ASP_BEST_BUY_MOBILE_CARE_AVAILABLE_PAGE, ROUTE_DEVICE_ORDER_ASP_BEST_BUY_SUMMARY_PAGE, ROUTE_DEVICE_ORDER_ASP_BEST_BUY_PAYMENT_DETAIL_PAGE } from 'src/app/device-order/asp/device-order-asp-existing-best-buy/constants/route-path.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { MobileCareService } from 'src/app/device-order/services/mobile-care.service';
import { MOBILE_CARE_PACKAGE_KEY_REF } from 'src/app/device-order/constants/cpc.constant';

@Component({
  selector: 'app-device-order-asp-existing-best-buy-mobile-care-page',
  templateUrl: './device-order-asp-existing-best-buy-mobile-care-page.component.html',
  styleUrls: ['./device-order-asp-existing-best-buy-mobile-care-page.component.scss']
})
export class DeviceOrderAspExistingBestBuyMobileCarePageComponent implements OnInit, OnDestroy {

  wizards: any = this.tokenService.isTelewizUser() ? WIZARD_DEVICE_ORDER_ASP : WIZARD_DEVICE_ORDER_AIS;
  active: number = this.tokenService.isTelewizUser() ? 4 : 3;

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
    private mobileCareService: MobileCareService,
    private tokenService: TokenService
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
      this.router.navigate([ROUTE_DEVICE_ORDER_ASP_BEST_BUY_MOBILE_CARE_AVAILABLE_PAGE]);
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_ASP_BEST_BUY_PAYMENT_DETAIL_PAGE]);
    }
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_ASP_BEST_BUY_SUMMARY_PAGE]);
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

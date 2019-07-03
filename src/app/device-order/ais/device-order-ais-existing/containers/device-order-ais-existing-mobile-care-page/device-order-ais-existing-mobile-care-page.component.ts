import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { Router } from '@angular/router';
import { HomeService, MobileCare, PageLoadingService, ShoppingCart, BillingSystemType } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Transaction, ExistingMobileCare } from 'src/app/shared/models/transaction.model';
import {
  ROUTE_DEVICE_ORDER_AIS_EXISTING_MOBILE_CARE_AVAILABLE_PAGE,
  ROUTE_DEVICE_ORDER_AIS_EXISTING_SUMMARY_PAGE,
  ROUTE_DEVICE_ORDER_AIS_EXISTING_SELECT_PACKAGE_PAGE,
  ROUTE_DEVICE_ORDER_AIS_EXISTING_EFFECTIVE_START_DATE_PAGE,
  ROUTE_DEVICE_ORDER_AIS_EXISTING_SELECT_PACKAGE_ONTOP_PAGE
} from '../../constants/route-path.constant';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { MobileCareService } from 'src/app/device-order/services/mobile-care.service';
import { MOBILE_CARE_PACKAGE_KEY_REF } from 'src/app/device-order/constants/cpc.constant';

@Component({
  selector: 'app-device-order-ais-existing-mobile-care-page',
  templateUrl: './device-order-ais-existing-mobile-care-page.component.html',
  styleUrls: ['./device-order-ais-existing-mobile-care-page.component.scss']
})
export class DeviceOrderAisExistingMobileCarePageComponent implements OnInit, OnDestroy {

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
    const packageOntop = this.transaction.data.deleteOntopPackage;
    console.log('packageOntop', packageOntop);
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    delete this.transaction.data.mobileCarePackage;
    this.callService();
  }

  onBack(): void {
    const deleteOntopPackage = this.transaction.data.deleteOntopPackage;
    if (deleteOntopPackage && deleteOntopPackage.length > 0) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_SELECT_PACKAGE_ONTOP_PAGE]);
    } else if (this.transaction.data.mainPackage) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_EFFECTIVE_START_DATE_PAGE]);
    } else {
      if (this.transaction.data.existingMobileCare) {
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_MOBILE_CARE_AVAILABLE_PAGE]);
      } else {
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_SELECT_PACKAGE_PAGE]);
      }

    }
  }
  checkRouteByExistingMobileCare(): string {
    if (this.transaction.data.existingMobileCare) {
      return ROUTE_DEVICE_ORDER_AIS_EXISTING_MOBILE_CARE_AVAILABLE_PAGE;
    } else {
      return ROUTE_DEVICE_ORDER_AIS_EXISTING_SELECT_PACKAGE_PAGE;
    }
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_SUMMARY_PAGE]);
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
    this.pageLoadingService.openLoading();

    const billingSystem = (this.transaction.data.simCard.billingSystem === 'RTBS')
      ? BillingSystemType.IRB : this.transaction.data.simCard.billingSystem || BillingSystemType.IRB;
    const chargeType = this.transaction.data.simCard.chargeType;
    const endUserPrice = +this.priceOption.trade.normalPrice;
    const exMobileCare = this.transaction.data.existingMobileCare;

    this.callGetMobileCareService(billingSystem, chargeType, endUserPrice, exMobileCare);
  }

  callGetMobileCareService(billingSystem: string, chargeType: any, endUserPrice: number, exMobileCare: ExistingMobileCare): void {
    this.mobileCareService.getMobileCare({
      packageKeyRef: MOBILE_CARE_PACKAGE_KEY_REF,
      billingSystem: billingSystem
    }, chargeType, billingSystem, endUserPrice)
      .then((mobileCare: any) => this.haveMobileCarePromotions(mobileCare, exMobileCare))
      .then(() => this.pageLoadingService.closeLoading());
  }

  haveMobileCarePromotions(mobileCare: any, exMobileCare: ExistingMobileCare): void {
    this.mobileCare = this.mappingMobileCare(mobileCare, exMobileCare);
    if (this.mobileCare.promotions && this.mobileCare.promotions.length > 0) {
      this.mobileCare.promotions[0].active = true;
    }
    return;
  }

  mappingMobileCare(mobileCare: any, exMobileCare: ExistingMobileCare): MobileCare {
    return {
      promotions: mobileCare,
      existingMobileCare: !!exMobileCare
    };
  }
}

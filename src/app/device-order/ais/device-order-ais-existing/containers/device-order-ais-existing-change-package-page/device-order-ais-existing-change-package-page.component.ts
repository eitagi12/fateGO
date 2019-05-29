import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_DEVICE_ORDER_AIS_EXISTING_ELIGIBLE_MOBILE_PAGE, ROUTE_DEVICE_ORDER_AIS_EXISTING_MOBILE_DETAIL_PAGE } from '../../constants/route-path.constant';
import { HomeService, ShoppingCart, AlertService, PageLoadingService } from 'mychannel-shared-libs';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { CheckChangeServiceService } from 'src/app/device-order/services/check-change-service.service';

@Component({
  selector: 'app-device-order-ais-existing-change-package-page',
  templateUrl: './device-order-ais-existing-change-package-page.component.html',
  styleUrls: ['./device-order-ais-existing-change-package-page.component.scss']
})
export class DeviceOrderAisExistingChangePackagePageComponent implements OnInit {

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;
  transaction: Transaction;
  priceOption: PriceOption;
  shoppingCart: ShoppingCart;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private shoppingCartService: ShoppingCartService,
    private pageLoadingService: PageLoadingService,
    private alertService: AlertService,
    private checkChangeService: CheckChangeServiceService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_ELIGIBLE_MOBILE_PAGE]);
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    this.checkKnoxGuard();
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  checkKnoxGuard(): void {
    const isKnoxGuard: boolean = (this.priceOption.trade && this.priceOption.trade.serviceLockHs &&
      this.priceOption.trade.serviceLockHs === 'KG');
    if (isKnoxGuard) {
      this.checkChangeService.CheckServiceKnoxGuard(this.transaction.data.simCard.mobileNo).then(() => {
        this.pageLoadingService.closeLoading();
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_MOBILE_DETAIL_PAGE]);
      }).catch((resp) => {
        this.alertService.error(resp);
      });
    } else {
      this.pageLoadingService.closeLoading();
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_MOBILE_DETAIL_PAGE]);
    }
  }
}

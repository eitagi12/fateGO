import { Component, OnInit } from '@angular/core';

import { ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_VALIDATE_CUSTOMER_PAGE, ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_ELIGIBLE_MOBILE_PAGE, ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_VALIDATE_IDENTIFY_PAGE, ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_MOBILE_DETAIL_PAGE } from '../../constants/route-path.constant';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { Transaction, TransactionAction } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { ShoppingCart, HomeService, PageLoadingService, AlertService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { CheckChangeServiceService } from 'src/app/device-order/services/check-change-service.service';

@Component({
  selector: 'app-device-order-ais-existing-gadget-change-package-page',
  templateUrl: './device-order-ais-existing-gadget-change-package-page.component.html',
  styleUrls: ['./device-order-ais-existing-gadget-change-package-page.component.scss']
})
export class DeviceOrderAisExistingGadgetChangePackagePageComponent implements OnInit {

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
    if (TransactionAction.KEY_IN_MOBILE_NO) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_VALIDATE_CUSTOMER_PAGE]);
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_ELIGIBLE_MOBILE_PAGE]);
    }
  }

  onNext(): void {
    if (TransactionAction.KEY_IN_MOBILE_NO) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_VALIDATE_IDENTIFY_PAGE]);
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_MOBILE_DETAIL_PAGE]);
    }
  }

  onHome(): void {
    this.homeService.goToHome();
  }

}

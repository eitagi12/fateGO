import { Component, OnInit } from '@angular/core';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { ShoppingCart, HomeService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { ROUTE_DEVICE_ORDER_AIS_MNP_VERIFY_INSTANT_SIM_PAGE, ROUTE_DEVICE_ORDER_AIS_MNP_BY_PATTERN_PAGE, ROUTE_DEVICE_ORDER_AIS_MNP_CUSTOMER_INFO_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-mnp-select-number-page',
  templateUrl: './device-order-ais-mnp-select-number-page.component.html',
  styleUrls: ['./device-order-ais-mnp-select-number-page.component.scss']
})
export class DeviceOrderAisMnpSelectNumberPageComponent implements OnInit {

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;
  transaction: Transaction;
  shoppingCart: ShoppingCart;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private shoppingCartService: ShoppingCartService,
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
  }

  onVerifyInstantSim(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_VERIFY_INSTANT_SIM_PAGE]);

  }
  onByPattern(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_BY_PATTERN_PAGE]);
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_CUSTOMER_INFO_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }
}

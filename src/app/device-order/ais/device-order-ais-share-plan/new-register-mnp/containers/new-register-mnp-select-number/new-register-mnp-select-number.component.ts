import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, ShoppingCart } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import {
  ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_CUSTOMER_INFO_PAGE,
  ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_VERIFY_INSTANT_SIM_PAGE,
  ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_BY_PATTERN_PAGE
} from '../../constants/route-path.constant';
import { WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN } from 'src/app/device-order/constants/wizard.constant';
import { Transaction } from 'src/app/device-order/ais/device-order-ais-mnp/models/transaction.model';

@Component({
  selector: 'app-new-register-mnp-select-number',
  templateUrl: './new-register-mnp-select-number.component.html',
  styleUrls: ['./new-register-mnp-select-number.component.scss']
})
export class NewRegisterMnpSelectNumberComponent implements OnInit {
  wizards: string[] = WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN;
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
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_VERIFY_INSTANT_SIM_PAGE]);

  }
  onByPattern(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_BY_PATTERN_PAGE]);
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_CUSTOMER_INFO_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

}

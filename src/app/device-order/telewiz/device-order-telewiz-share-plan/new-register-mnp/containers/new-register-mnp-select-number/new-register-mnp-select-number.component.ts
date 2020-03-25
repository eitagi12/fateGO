import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ShoppingCart } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import {
  ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_CUSTOMER_INFO_PAGE,
  ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_VERIFY_INSTANT_SIM_PAGE,
  ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_BY_PATTERN_PAGE
} from '../../constants/route-path.constant';
import {
  WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN_TELEWIZ,
  WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN_JAYMART
} from 'src/app/device-order/constants/wizard.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { RemoveCartService } from '../../services/remove-cart.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';

@Component({
  selector: 'app-new-register-mnp-select-number',
  templateUrl: './new-register-mnp-select-number.component.html',
  styleUrls: ['./new-register-mnp-select-number.component.scss']
})
export class NewRegisterMnpSelectNumberComponent implements OnInit {
  wizards: string[];
  wizardTelewiz: string[] = WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN_TELEWIZ;
  wizardJaymart: string[] = WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN_JAYMART;
  transaction: Transaction;
  shoppingCart: ShoppingCart;
  priceOption: PriceOption;
  isJaymart: boolean = false;

  constructor(
    private router: Router,
    private transactionService: TransactionService,
    private shoppingCartService: ShoppingCartService,
    private removeCartService: RemoveCartService,
    private priceOptionService: PriceOptionService

  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.getShoppingCartDataSuperKhumTelewiz();
    this.checkJaymart();
  }

  checkJaymart(): void {
    const retailChain = this.priceOption.queryParams.isRole;
    if (retailChain && retailChain === 'Retail Chain') {
      this.wizards = this.wizardJaymart;
      this.isJaymart = !this.isJaymart;
    } else {
      this.wizards = this.wizardTelewiz;
    }
  }

  onVerifyInstantSim(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_VERIFY_INSTANT_SIM_PAGE]);

  }
  onByPattern(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_BY_PATTERN_PAGE]);
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_CUSTOMER_INFO_PAGE]);
  }

  onHome(): void {
    this.removeCartService.backToReturnStock('/', this.transaction);
  }
}

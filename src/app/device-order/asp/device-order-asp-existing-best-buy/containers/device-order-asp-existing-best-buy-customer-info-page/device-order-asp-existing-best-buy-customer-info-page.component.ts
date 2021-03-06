import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { HomeService, CustomerInfo, ShoppingCart, Utils, TokenService } from 'mychannel-shared-libs';
import { ROUTE_DEVICE_ORDER_ASP_BEST_BUY_VALIDATE_CUSTOMER_PAGE, ROUTE_DEVICE_ORDER_ASP_BEST_BUY_ELIGIBLE_MOBILE_PAGE, ROUTE_DEVICE_ORDER_ASP_BEST_BUY_VALIDATE_CUSTOMER_REPI_PAGE, ROUTE_DEVICE_ORDER_ASP_BEST_BUY_PAYMENT_DETAIL_PAGE } from 'src/app/device-order/asp/device-order-asp-existing-best-buy/constants/route-path.constant';
import { Transaction, Customer, TransactionAction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { WIZARD_DEVICE_ORDER_AIS, WIZARD_DEVICE_ORDER_ASP } from 'src/app/device-order/constants/wizard.constant';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';

@Component({
  selector: 'app-device-order-asp-existing-best-buy-customer-info-page',
  templateUrl: './device-order-asp-existing-best-buy-customer-info-page.component.html',
  styleUrls: ['./device-order-asp-existing-best-buy-customer-info-page.component.scss']
})
export class DeviceOrderAspExistingBestBuyCustomerInfoPageComponent implements OnInit, OnDestroy {

  wizards: any = this.tokenService.isTelewizUser() ? WIZARD_DEVICE_ORDER_ASP : WIZARD_DEVICE_ORDER_AIS;
  active: number = this.tokenService.isTelewizUser() ? 3 : 2;

  transaction: Transaction;
  customerInfo: CustomerInfo;
  shoppingCart: ShoppingCart;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private shoppingCartService: ShoppingCartService,
    private tokenService: TokenService
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    const customer: Customer = this.transaction.data.customer;
    this.customerInfo = {
      titleName: customer.titleName,
      firstName: customer.firstName,
      lastName: customer.lastName,
      idCardNo: customer.idCardNo,
      idCardType: 'บัตรประชาชน',
      birthdate: customer.birthdate,
      mobileNo: customer.mainMobile,
    };
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onBack(): void {
    const action = this.transaction.data.action;
    if (action === TransactionAction.KEY_IN || action === TransactionAction.READ_CARD) {
      this.router.navigate([ROUTE_DEVICE_ORDER_ASP_BEST_BUY_VALIDATE_CUSTOMER_PAGE]);
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_ASP_BEST_BUY_VALIDATE_CUSTOMER_REPI_PAGE]);
    }
  }

  onNext(): void {
    const action = this.transaction.data.action;
    if (action === TransactionAction.KEY_IN || action === TransactionAction.READ_CARD) {
      this.router.navigate([ROUTE_DEVICE_ORDER_ASP_BEST_BUY_ELIGIBLE_MOBILE_PAGE]);
    } else {
      if (TransactionAction.READ_CARD_REPI === action) {
        this.transaction.data.action = TransactionAction.READ_CARD;
      } else {
        this.transaction.data.action = TransactionAction.KEY_IN;
      }
      this.router.navigate([ROUTE_DEVICE_ORDER_ASP_BEST_BUY_PAYMENT_DETAIL_PAGE]);
    }
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}

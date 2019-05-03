import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { Transaction, Customer, TransactionAction } from 'src/app/shared/models/transaction.model';
import { CustomerInfo, ShoppingCart, HomeService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_VALIDATE_CUSTOMER_REPI_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_ELIGIBLE_MOBILE_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_PAYMENT_DETAIL_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_VALIDATE_CUSTOMER_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-existing-best-buy-shop-customer-info-page',
  templateUrl: './device-order-ais-existing-best-buy-shop-customer-info-page.component.html',
  styleUrls: ['./device-order-ais-existing-best-buy-shop-customer-info-page.component.scss']
})
export class DeviceOrderAisExistingBestBuyShopCustomerInfoPageComponent implements OnInit, OnDestroy {

  wizards: any = WIZARD_DEVICE_ORDER_AIS;

  transaction: Transaction;
  customerInfo: CustomerInfo;
  shoppingCart: ShoppingCart;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private shoppingCartService: ShoppingCartService
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
    const repi = this.transaction.data.customer.repi;
    if ((action === TransactionAction.KEY_IN || action === TransactionAction.READ_CARD) && !repi) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_VALIDATE_CUSTOMER_PAGE]);
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_VALIDATE_CUSTOMER_REPI_PAGE]);
    }
  }

  onNext(): void {
    const action = this.transaction.data.action;
    if (action === TransactionAction.KEY_IN || action === TransactionAction.READ_CARD) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_ELIGIBLE_MOBILE_PAGE]);
    } else {
      if (TransactionAction.KEY_IN_REPI === action) {
        this.transaction.data.action = TransactionAction.KEY_IN;
      } else {
        this.transaction.data.action = TransactionAction.READ_CARD;
      }
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_PAYMENT_DETAIL_PAGE]);
    }
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

}

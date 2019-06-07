import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, CustomerInfo, ShoppingCart } from 'mychannel-shared-libs';
import {
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_SELECT_NUMBER_PAGE,
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_PAYMENT_DETAIL_PAGE
} from 'src/app/device-order/ais/device-order-ais-new-register/constants/route-path.constant';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { Transaction, Customer } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-device-order-ais-new-register-customer-info-page',
  templateUrl: './device-order-ais-new-register-customer-info-page.component.html',
  styleUrls: ['./device-order-ais-new-register-customer-info-page.component.scss']
})
export class DeviceOrderAisNewRegisterCustomerInfoPageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;

  transaction: Transaction;
  customerInfo: CustomerInfo;
  shoppingCart: ShoppingCart;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private shoppingCartService: ShoppingCartService,
    private translateService: TranslateService
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    const customer: Customer = this.transaction.data.customer;
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    delete this.shoppingCart.mobileNo;
    this.customerInfo = this.mappingCustomerInfo(customer);

    this.translateService.onLangChange.subscribe(() => this.customerInfo.idCardType = this.isEngLanguage() ? 'ID Card' : 'บัตรประชาชน');
  }

  mappingCustomerInfo(customer: Customer): CustomerInfo {
    return {
      titleName: customer.titleName,
      firstName: customer.firstName,
      lastName: customer.lastName,
      idCardNo: customer.idCardNo,
      idCardType: this.isEngLanguage() ? 'ID Card' : 'บัตรประชาชน',
      birthdate: customer.birthdate,
      mobileNo: customer.mainMobile,
    };
  }

  isEngLanguage(): boolean {
    return this.translateService.currentLang === 'EN';
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_PAYMENT_DETAIL_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_SELECT_NUMBER_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

}

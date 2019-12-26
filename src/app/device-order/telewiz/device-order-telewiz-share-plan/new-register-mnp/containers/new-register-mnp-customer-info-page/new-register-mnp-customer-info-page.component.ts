import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerInfo, ShoppingCart } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN_TELEWIZ } from 'src/app/device-order/constants/wizard.constant';
import {
  ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_SELECT_NUMBER_PAGE,
  ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_PAYMENT_DETAIL_PAGE
} from '../../constants/route-path.constant';
import { Transaction, Customer } from 'src/app/shared/models/transaction.model';
import { RemoveCartService } from '../../services/remove-cart.service';
@Component({
  selector: 'app-new-register-mnp-customer-info-page',
  templateUrl: './new-register-mnp-customer-info-page.component.html',
  styleUrls: ['./new-register-mnp-customer-info-page.component.scss']
})
export class NewRegisterMnpCustomerInfoPageComponent implements OnInit, OnDestroy {
  wizards: string[] = WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN_TELEWIZ;

  transaction: Transaction;
  customerInfo: CustomerInfo;
  shoppingCart: ShoppingCart;
  translateSubscription: Subscription;
  constructor(
    private router: Router,
    private transactionService: TransactionService,
    private shoppingCartService: ShoppingCartService,
    private translateService: TranslateService,
    private removeCartService: RemoveCartService
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    const customer: Customer = this.transaction.data.customer;
    this.shoppingCart = this.shoppingCartService.getShoppingCartDataSuperKhum();
    delete this.shoppingCart.mobileNo;
    this.customerInfo = this.mappingCustomerInfo(customer);

    this.translateSubscription = this.translateService.onLangChange
      .subscribe(() => this.customerInfo.idCardType = this.isEngLanguage() ? 'ID Card' : 'บัตรประชาชน');
  }

  mappingCustomerInfo(customer: Customer): CustomerInfo {
    return {
      titleName: customer.titleName,
      firstName: customer.firstName,
      lastName: customer.lastName,
      idCardNo: customer.idCardNo,
      idCardType: this.isEngLanguage() ? 'ID Card' : 'บัตรประชาชน',
      birthdate: customer.birthdate,
      mobileNo: customer.mainMobile || '-',
    };
  }

  isEngLanguage(): boolean {
    return this.translateService.currentLang === 'EN';
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_PAYMENT_DETAIL_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_SELECT_NUMBER_PAGE]);
  }

  onHome(): void {
    this.removeCartService.backToReturnStock('/', this.transaction);
  }

  ngOnDestroy(): void {
    if (this.translateSubscription) {
      this.translateSubscription.unsubscribe();
    }
    this.transactionService.update(this.transaction);
  }
}

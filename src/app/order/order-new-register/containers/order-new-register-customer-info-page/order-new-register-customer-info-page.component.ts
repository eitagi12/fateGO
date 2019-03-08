import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_ORDER_NEW_REGISTER } from 'src/app/order/constants/wizard.constant';
import { Transaction, Customer } from 'src/app/shared/models/transaction.model';
import { CustomerInfo, HomeService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import {
  ROUTE_ORDER_NEW_REGISTER_VALIDATE_CUSTOMER_PAGE,
  ROUTE_ORDER_NEW_REGISTER_ID_CARD_CAPTURE_PAGE,
} from 'src/app/order/order-new-register/constants/route-path.constant';

@Component({
  selector: 'app-order-new-register-customer-info-page',
  templateUrl: './order-new-register-customer-info-page.component.html',
  styleUrls: ['./order-new-register-customer-info-page.component.scss']
})
export class OrderNewRegisterCustomerInfoPageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_ORDER_NEW_REGISTER;

  transaction: Transaction;
  customerInfo: CustomerInfo;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
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

  onBack(): void {
    this.router.navigate([ROUTE_ORDER_NEW_REGISTER_VALIDATE_CUSTOMER_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_ORDER_NEW_REGISTER_ID_CARD_CAPTURE_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { WIZARD_ORDER_PRE_TO_POST } from 'src/app/order/constants/wizard.constant';
import { Transaction, TransactionAction, Customer } from 'src/app/shared/models/transaction.model';
import { CustomerInfo, HomeService, PageLoadingService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import {
  ROUTE_ORDER_PRE_TO_POST_ID_CARD_CAPTURE_PAGE,
  ROUTE_ORDER_PRE_TO_POST_VALIDATE_CUSTOMER_ID_CARD_REPI_PAGE,
  ROUTE_ORDER_PRE_TO_POST_CURRENT_INFO_PAGE,
  ROUTE_ORDER_PRE_TO_POST_VALIDATE_CUSTOMER_REPI_PAGE,
  ROUTE_ORDER_PRE_TO_POST_ID_CARD_CAPTURE_REPI_PAGE,
  ROUTE_ORDER_PRE_TO_POST_SELECT_PACKAGE_PAGE
} from 'src/app/order/order-pre-to-post/constants/route-path.constant';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-order-pre-to-post-customer-info-page',
  templateUrl: './order-pre-to-post-customer-info-page.component.html',
  styleUrls: ['./order-pre-to-post-customer-info-page.component.scss']
})
export class OrderPreToPostCustomerInfoPageComponent implements OnInit, OnDestroy {

  wizards = WIZARD_ORDER_PRE_TO_POST;
  transaction: Transaction;
  customerInfo: CustomerInfo;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit() {
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

  onBack() {
    const action = this.transaction.data.action;
    if (action === TransactionAction.READ_CARD_REPI) {
      this.router.navigate([ROUTE_ORDER_PRE_TO_POST_VALIDATE_CUSTOMER_ID_CARD_REPI_PAGE]);
    } else if (action === TransactionAction.KEY_IN_REPI) {
      this.router.navigate([ROUTE_ORDER_PRE_TO_POST_VALIDATE_CUSTOMER_REPI_PAGE]);
    } else {
      this.router.navigate([ROUTE_ORDER_PRE_TO_POST_CURRENT_INFO_PAGE]);
    }
  }

  onNext() {
    const action = this.transaction.data.action;

    if (action === TransactionAction.KEY_IN) {
      this.router.navigate([ROUTE_ORDER_PRE_TO_POST_ID_CARD_CAPTURE_PAGE]);
    } else if (action === TransactionAction.KEY_IN_REPI) {
      this.router.navigate([ROUTE_ORDER_PRE_TO_POST_ID_CARD_CAPTURE_REPI_PAGE]);
    } else if (action === TransactionAction.READ_CARD || action === TransactionAction.READ_CARD_REPI) {
      this.router.navigate([ROUTE_ORDER_PRE_TO_POST_SELECT_PACKAGE_PAGE]);
    }
  }

  onHome() {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}

import { Component, OnInit } from '@angular/core';
import { WIZARD_ORDER_MNP } from 'src/app/order/constants/wizard.constant';
import { Transaction, Customer, TransactionAction } from 'src/app/shared/models/transaction.model';
import { CustomerInfo, HomeService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import {
  ROUTE_ORDER_MNP_VALIDATE_CUSTOMER_PAGE,
  ROUTE_ORDER_MNP_ID_CARD_CAPTURE_PAGE,
  ROUTE_ORDER_MNP_VALIDATE_CUSTOMER_KEY_IN_PAGE,
  ROUTE_ORDER_MNP_VALIDATE_CUSTOMER_ID_CARD_PAGE,
  ROUTE_ORDER_MNP_SELECT_PACKAGE_PAGE
} from 'src/app/order/order-mnp/constants/route-path.constant';

@Component({
  selector: 'app-order-mnp-customer-info-page',
  templateUrl: './order-mnp-customer-info-page.component.html',
  styleUrls: ['./order-mnp-customer-info-page.component.scss']
})
export class OrderMnpCustomerInfoPageComponent implements OnInit {

  wizards: string[] = WIZARD_ORDER_MNP;

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
    if (this.transaction.data.customer.caNumber) {
      if (this.transaction.data.action === TransactionAction.KEY_IN) {
        this.router.navigate([ROUTE_ORDER_MNP_VALIDATE_CUSTOMER_PAGE]);
      } else {
        this.router.navigate([ROUTE_ORDER_MNP_VALIDATE_CUSTOMER_ID_CARD_PAGE]);
      }
    } else {
      this.router.navigate([ROUTE_ORDER_MNP_VALIDATE_CUSTOMER_KEY_IN_PAGE]);
    }
  }

  onNext(): void {
    if (this.transaction.data.action === TransactionAction.KEY_IN) {
      this.router.navigate([ROUTE_ORDER_MNP_ID_CARD_CAPTURE_PAGE]);
    } else {
      this.router.navigate([ROUTE_ORDER_MNP_SELECT_PACKAGE_PAGE]);
    }
  }

  onHome(): void {
    this.homeService.goToHome();
  }

}

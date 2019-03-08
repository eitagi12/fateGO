import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerInfo, HomeService } from 'mychannel-shared-libs';

import { WIZARD_DEVICE_ORDER_AIS } from '../../../../constants/wizard.constant';
import {
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_ID_CARD_CAPTURE_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_VALIDATE_CUSTOMER_ID_CARD_REPI_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_CURRENT_INFO_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_VALIDATE_CUSTOMER_REPI_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_ID_CARD_CAPTURE_REPI_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_SELECT_PACKAGE_PAGE
} from '../../constants/route-path.constant';
import { Transaction, TransactionAction, Customer } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';

@Component({
  selector: 'app-device-order-ais-pre-to-post-customer-info-page',
  templateUrl: './device-order-ais-pre-to-post-customer-info-page.component.html',
  styleUrls: ['./device-order-ais-pre-to-post-customer-info-page.component.scss']
})
export class DeviceOrderAisPreToPostCustomerInfoPageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;
  transaction: Transaction;
  customerInfo: CustomerInfo;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
  ) {
    this.transaction = this.transactionService.load();
    this.homeService.callback = () => {
      window.location.href = '/smart-shop';
    };
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
    const action = this.transaction.data.action;
    if (action === TransactionAction.READ_CARD_REPI) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_VALIDATE_CUSTOMER_ID_CARD_REPI_PAGE]);
    } else if (action === TransactionAction.KEY_IN_REPI) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_VALIDATE_CUSTOMER_REPI_PAGE]);
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_CURRENT_INFO_PAGE]);
    }
  }

  onNext(): void {
    const action = this.transaction.data.action;

    if (action === TransactionAction.KEY_IN) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_ID_CARD_CAPTURE_PAGE]);
    } else if (action === TransactionAction.KEY_IN_REPI) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_ID_CARD_CAPTURE_REPI_PAGE]);
    } else if (action === TransactionAction.READ_CARD || action === TransactionAction.READ_CARD_REPI) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_SELECT_PACKAGE_PAGE]);
    }
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}

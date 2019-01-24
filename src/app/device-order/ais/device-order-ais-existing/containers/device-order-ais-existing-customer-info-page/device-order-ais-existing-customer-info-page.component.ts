import { Component, OnInit } from '@angular/core';
import { Transaction, Customer } from 'src/app/shared/models/transaction.model';
import { CustomerInfo, HomeService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import {
  ROUTE_DEVICE_ORDER_AIS_EXISTING_VALIDATE_CUSTOMER_ID_CARD_PAGE,
  ROUTE_DEVICE_ORDER_AIS_EXISTING_ELIGIBLE_MOBILE_PAGE
} from '../../constants/route-path.constant';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';


@Component({
  selector: 'app-device-order-ais-existing-customer-info-page',
  templateUrl: './device-order-ais-existing-customer-info-page.component.html',
  styleUrls: ['./device-order-ais-existing-customer-info-page.component.scss']
})
export class DeviceOrderAisExistingCustomerInfoPageComponent implements OnInit {

  wizards = WIZARD_DEVICE_ORDER_AIS;

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
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_VALIDATE_CUSTOMER_ID_CARD_PAGE]);
  }

  onNext() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_ELIGIBLE_MOBILE_PAGE]);
  }

  onHome() {
    this.homeService.goToHome();
  }

// tslint:disable-next-line: use-life-cycle-interface
  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

}

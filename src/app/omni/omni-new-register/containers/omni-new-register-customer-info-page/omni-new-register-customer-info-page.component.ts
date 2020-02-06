import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_OMNI_NEW_REGISTER } from 'src/app/omni/constants/wizard.constant';
import { Customer } from 'src/app/shared/models/transaction.model';
import { CustomerInfo, HomeService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';

import {
  ROUTE_OMNI_NEW_REGISTER_VALIDATE_CUSTOMER_PAGE,
  ROUTE_OMNI_NEW_REGISTER_ID_CARD_CAPTURE_PAGE,
} from 'src/app/omni/omni-new-register/constants/route-path.constant';
import { TransactionService } from 'src/app/omni/omni-shared/services/transaction.service';
import { Transaction } from 'src/app/omni/omni-shared/models/transaction.model';

@Component({
  selector: 'app-omni-new-register-customer-info-page',
  templateUrl: './omni-new-register-customer-info-page.component.html',
  styleUrls: ['./omni-new-register-customer-info-page.component.scss']
})
export class OmniNewRegisterCustomerInfoPageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_OMNI_NEW_REGISTER;

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

  onBack(): any {
    window.location.href = `/sales-portal/reserve-stock/verify`;
  }

  onNext(): void {
    this.router.navigate([ROUTE_OMNI_NEW_REGISTER_ID_CARD_CAPTURE_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

}

import { Component, OnInit } from '@angular/core';
import { WIZARD_ORDER_NEW_REGISTER } from 'src/app/order/constants/wizard.constant';
import {
  ROUTE_ORDER_NEW_REGISTER_CONFIRM_USER_INFORMATION_PAGE,
  ROUTE_ORDER_NEW_REGISTER_AGREEMENT_SIGN_PAGE
} from 'src/app/order/order-new-register/constants/route-path.constant';
import { Router } from '@angular/router';
import { HomeService, ConfirmCustomerInfo, BillingInfo, TelNoBillingInfo, MailBillingInfo, TokenService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';

@Component({
  selector: 'app-order-new-register-summary-page',
  templateUrl: './order-new-register-summary-page.component.html',
  styleUrls: ['./order-new-register-summary-page.component.scss']
})
export class OrderNewRegisterSummaryPageComponent implements OnInit {

  wizards = WIZARD_ORDER_NEW_REGISTER;

  transaction: Transaction;
  confirmCustomerInfo: ConfirmCustomerInfo;
  billingInfo: BillingInfo;
  mailBillingInfo: MailBillingInfo;
  telNoBillingInfo: TelNoBillingInfo;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit() {
    const customer = this.transaction.data.customer;
    const mainPackage = this.transaction.data.mainPackage;
    const billingInformation = this.transaction.data.billingInformation;
    const billCycleData = billingInformation.billCycleData;
    const simCard = this.transaction.data.simCard;

    this.confirmCustomerInfo = {
      titleName: customer.titleName,
      firstName: customer.firstName,
      lastName: customer.lastName,
      idCardNo: customer.idCardNo,
      mobileNo: simCard.mobileNo,
      mainPackage: mainPackage.shortNameThai,
      onTopPackage: '',
      packageDetail: mainPackage.statementThai,
      idCardType: customer.idCardType
    };
    this.billingInfo = {
      billingMethod: {
        text: billCycleData.billingMethodText
      },
      billingAddress: {
        text: billCycleData.billAddressText
      },
      billingCycle: {
        text: billCycleData.billCycleText
      },
    };

    this.mailBillingInfo = {
      mobileNo: simCard.mobileNo,
      email: billCycleData.email,
      address: billCycleData.billAddressText,
      billChannel: billCycleData.billChannel
    };

    this.telNoBillingInfo = {
      mobileNo: billCycleData.mobileNoContact,
      phoneNo: billCycleData.phoneNoContact,
    };
  }

  onBack() {
    this.router.navigate([ROUTE_ORDER_NEW_REGISTER_CONFIRM_USER_INFORMATION_PAGE]);
  }
  onNext() {
    this.router.navigate([ROUTE_ORDER_NEW_REGISTER_AGREEMENT_SIGN_PAGE]);
  }

  onHome() {
    this.homeService.goToHome();
  }
}

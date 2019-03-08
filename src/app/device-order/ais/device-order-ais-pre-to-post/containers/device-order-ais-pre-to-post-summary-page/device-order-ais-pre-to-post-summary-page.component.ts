import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HomeService, ConfirmCustomerInfo, BillingInfo, MailBillingInfo, TelNoBillingInfo, TokenService } from 'mychannel-shared-libs';

import { WIZARD_DEVICE_ORDER_AIS } from '../../../../constants/wizard.constant';
import {
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_EAPPLICATION_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_CONFIRM_USER_INFORMATION_PAGE
} from '../../constants/route-path.constant';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';

@Component({
  selector: 'app-device-order-ais-pre-to-post-summary-page',
  templateUrl: './device-order-ais-pre-to-post-summary-page.component.html',
  styleUrls: ['./device-order-ais-pre-to-post-summary-page.component.scss']
})
export class DeviceOrderAisPreToPostSummaryPageComponent implements OnInit {

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;
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

  ngOnInit(): void {
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
      packageDetail: mainPackage.statementThai
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

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_CONFIRM_USER_INFORMATION_PAGE]);
  }
  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_EAPPLICATION_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WIZARD_ORDER_PRE_TO_POST } from 'src/app/order/constants/wizard.constant';
import {
  ROUTE_ORDER_PRE_TO_POST_AGREEMENT_SIGN_PAGE,
  ROUTE_ORDER_PRE_TO_POST_CONFIRM_USER_INFORMATION_PAGE
} from 'src/app/order/order-pre-to-post/constants/route-path.constant';
import { HomeService, ConfirmCustomerInfo, BillingInfo, MailBillingInfo, TelNoBillingInfo, TokenService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient } from '@angular/common/http';
import { Transaction } from 'src/app/shared/models/transaction.model';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
const Moment = moment;
@Component({
  selector: 'app-order-pre-to-post-summary-page',
  templateUrl: './order-pre-to-post-summary-page.component.html',
  styleUrls: ['./order-pre-to-post-summary-page.component.scss']
})
export class OrderPreToPostSummaryPageComponent implements OnInit {

  wizards = WIZARD_ORDER_PRE_TO_POST;
  transaction: Transaction;
  confirmCustomerInfo: ConfirmCustomerInfo;
  billingInfo: BillingInfo;
  mailBillingInfo: MailBillingInfo;
  telNoBillingInfo: TelNoBillingInfo;

  translationSubscribe: Subscription;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private translateService: TranslateService
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

    this.mapCustomerInfoByLang(this.translateService.currentLang);
    this.translationSubscribe = this.translateService.onLangChange.subscribe(lang => {
      this.mapCustomerInfoByLang(lang.lang);
    });
  }

  mapCustomerInfoByLang(lang: string): void {
    const billingInformation = this.transaction.data.billingInformation;
    const billCycleData = billingInformation.billCycleData;
    const bills = billCycleData.billCycleText.split(' ');
    let billCycleTextEng = '-';
    if (lang === 'EN') {
      this.confirmCustomerInfo.mainPackage = this.transaction.data.mainPackage.shortNameEng;
      this.confirmCustomerInfo.packageDetail = this.transaction.data.mainPackage.statementEng;
    } else {
      this.confirmCustomerInfo.mainPackage = this.transaction.data.mainPackage.shortNameThai;
      this.confirmCustomerInfo.packageDetail = this.transaction.data.mainPackage.statementThai;
    }

    if (bills[3] === 'สิ้นเดือน') {
      billCycleTextEng = `From the ${Moment([0, 0, bills[1]]).format('Do')} to the end of every month`;
    } else {
      billCycleTextEng = `From the ${Moment([0, 0, bills[1]]).format('Do')} to the ${Moment([0, 0, bills[3]]).format('Do')} of every month`;
    }
    this.transaction.data.billingInformation.billCycleData.billCycleTextEng = billCycleTextEng;
  }

  onBack() {
    this.router.navigate([ROUTE_ORDER_PRE_TO_POST_CONFIRM_USER_INFORMATION_PAGE]);
  }
  onNext() {
    this.router.navigate([ROUTE_ORDER_PRE_TO_POST_AGREEMENT_SIGN_PAGE]);
  }

  onHome() {
    this.homeService.goToHome();
  }

}

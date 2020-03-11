import { Component, OnInit, TemplateRef } from '@angular/core';
import { WIZARD_ORDER_MNP } from 'src/app/order/constants/wizard.constant';
import { Router } from '@angular/router';
import { HomeService, ConfirmCustomerInfo, Utils, BillingInfo, MailBillingInfo, TelNoBillingInfo, BillingSystemType, TokenService } from 'mychannel-shared-libs';
import {
  ROUTE_ORDER_MNP_CONFIRM_USER_INFORMATION_PAGE,
  ROUTE_ORDER_MNP_AGREEMENT_SIGN_PAGE
} from 'src/app/order/order-mnp/constants/route-path.constant';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient } from '@angular/common/http';
import { Transaction, MainPackage } from 'src/app/shared/models/transaction.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-order-mnp-summary-page',
  templateUrl: './order-mnp-summary-page.component.html',
  styleUrls: ['./order-mnp-summary-page.component.scss']
})
export class OrderMnpSummaryPageComponent implements OnInit {

  wizards: string[] = WIZARD_ORDER_MNP;

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
    private translation: TranslateService
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    const customer = this.transaction.data.customer;
    const mainPackage = this.transaction.data.mainPackage;
    const onTopPackage = this.transaction.data.onTopPackage || {};
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
      onTopPackage: onTopPackage.shortNameThai,
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

    this.mapCustomerInfoByLang(this.translation.currentLang);
    this.translationSubscribe = this.translation.onLangChange.subscribe(lang => {
      this.mapCustomerInfoByLang(lang.lang);
    });

  }

  mapCustomerInfoByLang(lang: string): void {
    if (lang === 'EN') {
      this.confirmCustomerInfo.mainPackage = this.transaction.data.mainPackage.shortNameEng;
      this.confirmCustomerInfo.packageDetail = this.transaction.data.mainPackage.statementEng;
      this.confirmCustomerInfo.onTopPackage = this.transaction.data.onTopPackage.shortNameEng;
    } else {
      this.confirmCustomerInfo.mainPackage = this.transaction.data.mainPackage.shortNameThai;
      this.confirmCustomerInfo.packageDetail = this.transaction.data.mainPackage.statementThai;
      this.confirmCustomerInfo.onTopPackage = this.transaction.data.onTopPackage.shortNameThai;
    }
  }

  onBack(): void {
    this.router.navigate([ROUTE_ORDER_MNP_CONFIRM_USER_INFORMATION_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_ORDER_MNP_AGREEMENT_SIGN_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

}

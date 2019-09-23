import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_NEW_SHARE_PLAN_MNP_CONFIRM_USER_INFORMATION_PAGE, ROUTE_NEW_SHARE_PLAN_MNP_AGREEMENT_SIGN_PAGE } from '../../constants/route-path.constant';
import { WIZARD_ORDER_NEW_REGISTER } from 'src/app/order/constants/wizard.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { ConfirmCustomerInfo, BillingInfo, MailBillingInfo, TelNoBillingInfo, HomeService } from 'mychannel-shared-libs';
import { Subscription } from 'rxjs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
const Moment = moment;
@Component({
  selector: 'app-new-share-plan-mnp-summary-page',
  templateUrl: './new-share-plan-mnp-summary-page.component.html',
  styleUrls: ['./new-share-plan-mnp-summary-page.component.scss']
})
export class NewSharePlanMnpSummaryPageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_ORDER_NEW_REGISTER;

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
    this.mapCustomerInfoByLang(this.translation.currentLang);
    this.translationSubscribe = this.translation.onLangChange.subscribe(lang => {
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

  onBack(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_CONFIRM_USER_INFORMATION_PAGE]);
  }
  onNext(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_AGREEMENT_SIGN_PAGE]);
  }

  ngOnDestroy(): void {
    this.translationSubscribe.unsubscribe();
    this.transactionService.save(this.transaction);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

}

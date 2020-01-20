import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { WIZARD_OMNI_NEW_REGISTER } from 'src/app/omni/constants/wizard.constant';
import {
  ROUTE_OMNI_NEW_REGISTER_FACE_CONFIRM_PAGE,
  ROUTE_OMNI_NEW_REGISTER_ECONTRACT_PAGE,
  ROUTE_OMNI_NEW_REGISTER_ฺBILLING_INFO_PAGE
} from 'src/app/omni/omni-new-register/constants/route-path.constant';
import { Router } from '@angular/router';

import { Seller } from 'src/app/shared/models/transaction.model';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
import { OmniNewRegisterSummarySellerCodeComponent } from '../omni-new-register-summary-seller-code/omni-new-register-summary-seller-code.component';
import { BillingInfo } from '../omni-new-register-billing-info/omni-new-register-billing-info.component';
import { HomeService, AlertService, ConfirmCustomerInfo, MailBillingInfo, TelNoBillingInfo } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/omni/omni-shared/services/transaction.service';
import { Transaction } from 'src/app/omni/omni-shared/models/transaction.model';
const Moment = moment;

@Component({
  selector: 'app-omni-new-register-summary-page',
  templateUrl: './omni-new-register-summary-page.component.html',
  styleUrls: ['./omni-new-register-summary-page.component.scss']
})
export class OmniNewRegisterSummaryPageComponent implements OnInit, OnDestroy {
  @ViewChild(OmniNewRegisterSummarySellerCodeComponent) summarySellerCode: OmniNewRegisterSummarySellerCodeComponent;
  wizards: string[] = WIZARD_OMNI_NEW_REGISTER;
  transaction: Transaction;
  confirmCustomerInfo: ConfirmCustomerInfo;
  billingInfo: BillingInfo;
  mailBillingInfo: MailBillingInfo;
  telNoBillingInfo: TelNoBillingInfo;
  translationSubscribe: Subscription;
  seller: Seller;
  isMailBillingInfoValid: boolean;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private alertService: AlertService,
    private http: HttpClient
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    const customer = this.transaction.data.customer;
    const mainPackage = this.transaction.data.mainPackage;
    const billingInformation = this.transaction.data.billingInformation;
    const billCycleData = billingInformation.billCycles[0];
    const simCard = this.transaction.data.simCard;
    const billCycle = billingInformation.billCycles[0];
    this.getBllingCycle((billCycle ? billCycle.bill : null) || customer.billCycle
    ).then((billCycleText: string) => {
      console.log('billCycleText', billCycleText);
      this.billingInfo.billingCycle.text = billCycleText;
    });

    this.confirmCustomerInfo = {
      titleName: customer.titleName,
      firstName: customer.firstName,
      lastName: customer.lastName,
      idCardNo: customer.idCardNo,
      mobileNo: simCard.mobileNo,
      mainPackage: mainPackage.mainPackageName,
      onTopPackage: '',
      packageDetail: mainPackage.mainPackageDesc,
      idCardType: customer.idCardType
    };

    this.billingInfo = {
      billingAddress: {
        text: billCycleData.billingAddr
      },
      billingCycle: {
        text: billCycleData.bill
      },
    };

    // this.mailBillingInfo = {
    //   mobileNo: simCard.mobileNo,
    //   email: '',
    //   address: billCycleData.billingAddr,
    //   billChannel: billCycleData.billChannel
    // };

    this.mailBillingInfo = {
      mobileNo: '0994480011',
      email: 'sssssssss@aaaaa.ccc',
      address: '11 billCycleData',
      billChannel: 'eBill'
    };

    this.telNoBillingInfo = {
      mobileNo: simCard.mobileNo,
      phoneNo: simCard.mobileNo,
    };
  }

  getBllingCycle(billCycle: string): Promise<string> {
    if (!billCycle) {
      return this.http.get('/api/customerportal/newRegister/queryBillCycle', {
        params: {
          coProject: 'Y'
        }
      })
        .toPromise()
        .then((resp: any) => {
          const data = resp.data.billCycles || [];
          const defaultBillCycle = data.map((billing: any) => {
            const bills = billing.billCycle.split(' ');
            return {
              billCycle: billing,
              text: `วันที่ ${bills[1]} ถึงวันที่ ${bills[3]} ของทุกเดือน`,
              billDefault: billing.billDefault
            };
          }).find(bill => bill.billDefault === 'Y');

          this.transaction.data.customer.billCycle = defaultBillCycle.billCycle.bill;
          return defaultBillCycle.text;
        });
    }
    return this.http.get('/api/customerportal/get-billing-cycle', {
      params: { billCycle: billCycle }
    }).toPromise()
      .then((resp: any) => {
        return resp.data;
      });
  }

  onBack(): void {
    this.router.navigate([ROUTE_OMNI_NEW_REGISTER_FACE_CONFIRM_PAGE]);
  }
  onNext(): void {
    // const seller: Seller = this.summarySellerCode.setASCCode();
    // if (!seller.ascCode) {
    //   this.alertService.warning('กรุณากรอกข้อมูลให้ถูกต้อง');
    //   return;
    // }
    // this.http.get(`/api/customerportal/checkSeller/` + `${seller.ascCode}`).toPromise().then((response: any) => {
    //   if (response.data.condition === true) {
    //     this.transaction.data.seller = {
    //       ...this.transaction.data.seller,
    //       locationName: seller.locationName,
    //       locationCode: seller.locationCode,
    //       ascCode: seller.ascCode
    //     };
    this.router.navigate([ROUTE_OMNI_NEW_REGISTER_ECONTRACT_PAGE]);
    //   } else {
    //     this.alertService.warning(response.data.message);
    //   }
    // });
  }

  onMailBillingInfoCompleted(mailBillingInfo: any): void {
    if (!mailBillingInfo) {
      return;
    }
    const billingInformation = this.transaction.data.billingInformation;
    const billCycleData = billingInformation.billCycleData || {};

    billCycleData.email = mailBillingInfo.email;
    billCycleData.billChannel = mailBillingInfo.billChannel;
    billCycleData.billMedia = mailBillingInfo.billMedia;
    billCycleData.receiveBillMethod = mailBillingInfo.receiveBillMethod;

    this.transaction.data.billingInformation.billCycleData = billCycleData;
    billCycleData.email = this.mailBillingInfo.email;
    billCycleData.billChannel = this.mailBillingInfo.billChannel;
    billCycleData.billMedia = '';
    billCycleData.receiveBillMethod = '';

    this.transaction.data.billingInformation.billCycleData = billCycleData;

  }

  getBillChannel(): any {
    const mainPackage = this.transaction.data.mainPackage;
    const billingInformation = this.transaction.data.billingInformation;
    const mergeBilling: any = billingInformation.mergeBilling;

    // default ตามรอบบิลที่เลือก
    if (mergeBilling.billMedia === 'SMS and eBill') {
      return 'eBill';
    } else if (mergeBilling.billMedia === 'Hard Copy') {
      return 'address';
    } else if (mergeBilling.billMedia === 'SMS + Email') {
      return 'other';
    }

    if (billingInformation && billingInformation.billCycleData) {
      return billingInformation.billCycleData.billChannel;
    }
  }

  onMailBillingInfoError(valid: boolean): void {
    this.isMailBillingInfoValid = valid;
  }

  onEditAddress(): void {
    this.router.navigate([ROUTE_OMNI_NEW_REGISTER_ฺBILLING_INFO_PAGE]);
  }

  ngOnDestroy(): void {
    // this.translationSubscribe.unsubscribe();
    this.transactionService.save(this.transaction);
  }

  onHome(): void {
    this.homeService.goToHome();
  }
}

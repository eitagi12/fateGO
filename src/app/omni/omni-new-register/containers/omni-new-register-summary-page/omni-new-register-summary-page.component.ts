import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { WIZARD_OMNI_NEW_REGISTER } from 'src/app/omni/constants/wizard.constant';
import {
  ROUTE_OMNI_NEW_REGISTER_FACE_CONFIRM_PAGE,
  ROUTE_OMNI_NEW_REGISTER_ECONTRACT_PAGE
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
    console.log('customer', customer);
    console.log('this.transaction', this.transaction);
    const mainPackage = this.transaction.data.mainPackage;
    const billingInformation = this.transaction.data.billingInformation;
    const billCycleData = billingInformation.billCycleData;
    // const billCycleData = {
    //   billingName: 'KANYARATH RIDNIM Billing A-- 0889544399',
    //   mobileNo: [
    //     '0889544399'
    //   ],
    //   billCycleFrom: '1',
    //   billCycleTo: 'สิ้นเดือน',
    //   payDate: '',
    //   billingAddr: 'ที่อยู่ 1   ตำบลป่าโมก อำเภอป่าโมก อ่างทอง 14130',
    //   billAcctNo: '31900050206923',
    //   bill: '18',
    //   billingSystem: 'IRB',
    //   productPkg: '',
    //   billMedia: 'SMS and eBill'
    // };
    const simCard = this.transaction.data.simCard;

    // this.confirmCustomerInfo = {
    //   titleName: 'นาย',
    //   firstName: 'อารมณ์',
    //   lastName: 'สีเทา',
    //   idCardNo: '1639800145180',
    //   mobileNo: '0899999999',
    //   mainPackage: 'แพ็ค โคตรรวย',
    //   onTopPackage: '',
    //   packageDetail: 'NET 900GB',
    //   idCardType: 'บัตร ปชช.'
    // };

    // this.mailBillingInfo = {
    //   mobileNo: '0899999999',
    //   email: 'color@gg.com',
    //   address: '115/5 เอาระนะ',
    //   billChannel: 'eBill',

    // };

    // this.telNoBillingInfo = {
    //   mobileNo: '0899999999',
    //   phoneNo: '0888888888'
    // };

    // this.billingInfo = {

    //   billingAddress: {
    //     text: '111/44 สุขุม 12052'
    //   },
    //   billingCycle: {
    //     text: '11/10/2020'
    //   },
    // };

    this.confirmCustomerInfo = {
      titleName: customer.titleName,
      firstName: customer.firstName,
      lastName: customer.lastName,
      idCardNo: customer.idCardNo,
      mobileNo: simCard.mobileNo,
      mainPackage: '',
      onTopPackage: '',
      packageDetail: '',
      idCardType: customer.idCardType
    };

    this.billingInfo = {
      // billingMethod: {
      //   text: billCycleData.billingMethodText
      // },
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
    // const billingInformation = this.transaction.data.billingInformation;
    // const billCycleData = billingInformation.billCycleData || {};

    // billCycleData.email = mailBillingInfo.email;
    // billCycleData.billChannel = mailBillingInfo.billChannel;
    // billCycleData.billMedia = mailBillingInfo.billMedia;
    // billCycleData.receiveBillMethod = mailBillingInfo.receiveBillMethod;

    // this.transaction.data.billingInformation.billCycleData = billCycleData;

    // const billCycleData = {
    //   billingName: 'KANYARATH RIDNIM Billing A-- 0889544399',
    //   mobileNo: [
    //     '0889544399'
    //   ],
    //   billCycleFrom: '1',
    //   billCycleTo: 'สิ้นเดือน',
    //   payDate: '',
    //   billingAddr: 'ที่อยู่ 1   ตำบลป่าโมก อำเภอป่าโมก อ่างทอง 14130',
    //   billAcctNo: '31900050206923',
    //   bill: '18',
    //   billingSystem: 'IRB',
    //   productPkg: '',
    //   billMedia: 'SMS and eBill',
    //   email: '',
    //   billChannel: '',
    //   receiveBillMethod: '',
    // };

    // billCycleData.email = this.mailBillingInfo.email;
    // billCycleData.billChannel = this.mailBillingInfo.billChannel;
    // billCycleData.billMedia = '';
    // billCycleData.receiveBillMethod = '';

    // this.transaction.data.billingInformation.billCycleData = billCycleData;

  }

  onMailBillingInfoError(valid: boolean): void {
    this.isMailBillingInfoValid = valid;
  }

  ngOnDestroy(): void {
    // this.translationSubscribe.unsubscribe();
    // this.transactionService.save(this.transaction);
  }

  onHome(): void {
    this.homeService.goToHome();
  }
}

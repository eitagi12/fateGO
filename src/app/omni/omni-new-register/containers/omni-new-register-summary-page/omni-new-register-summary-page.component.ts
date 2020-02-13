import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { WIZARD_OMNI_NEW_REGISTER } from 'src/app/omni/constants/wizard.constant';
import {
  ROUTE_OMNI_NEW_REGISTER_FACE_CONFIRM_PAGE,
  ROUTE_OMNI_NEW_REGISTER_ECONTRACT_PAGE,
  ROUTE_OMNI_NEW_REGISTER_ฺBILLING_INFO_PAGE,
  ROUTE_OMNI_NEW_REGISTER_FACE_COMPARE_PAGE,
  ROUTE_OMNI_NEW_REGISTER_EBILLING_PAGE
} from 'src/app/omni/omni-new-register/constants/route-path.constant';
import { Router } from '@angular/router';

import { Seller } from 'src/app/shared/models/transaction.model';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
import { OmniNewRegisterSummarySellerCodeComponent } from '../omni-new-register-summary-seller-code/omni-new-register-summary-seller-code.component';
import { BillingInfo } from '../omni-new-register-billing-info/omni-new-register-billing-info.component';
import { HomeService, AlertService, ConfirmCustomerInfo, MailBillingInfo, TelNoBillingInfo, Utils, BillingSystemType } from 'mychannel-shared-libs';
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
  isTelNoBillingValid: boolean;
  eBill: boolean;
  isNext: boolean = false;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private alertService: AlertService,
    private http: HttpClient,
    private utils: Utils,
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    const customer = this.transaction.data.customer;
    const mainPackage = this.transaction.data.mainPackage;
    const billingInformation = this.transaction.data.billingInformation;
    const simCard = this.transaction.data.simCard;
    const billCycle = billingInformation.billCycles[0];
    const billCycleData = billingInformation.billCycleData[0];

    this.getBllingCycle((billCycle ? billCycle.bill : null) || customer.billCycle
    ).then((billCycleText: string) => {
      this.billingInfo.billingCycle.text = billCycleText;
    });
    this.eBill = !(mainPackage.billingSystem === BillingSystemType.BOS);

    const customerAddress = this.utils.getCurrentAddress({
      homeNo: customer.homeNo,
      moo: customer.moo,
      mooBan: customer.mooBan,
      room: customer.room,
      floor: customer.floor,
      buildingName: customer.buildingName,
      soi: customer.soi,
      street: customer.street,
      tumbol: customer.tumbol,
      amphur: customer.amphur,
      province: customer.province,
      zipCode: customer.zipCode
    }
    );

    this.confirmCustomerInfo = {
      titleName: customer.titleName,
      firstName: customer.firstName,
      lastName: customer.lastName,
      idCardNo: customer.idCardNo,
      mobileNo: this.transaction.data.cusMobileNo,
      mainPackage: mainPackage.mainPackageName,
      onTopPackage: '',
      packageDetail: mainPackage.mainPackageDesc,
      idCardType: customer.idCardType
    };

    this.billingInfo = {
      billingAddress: {
        text: (billCycleData ? billCycleData.billAddressText : null) || customerAddress,
        isEdit: true
      },
      billingCycle: {
        text: billCycle.bill,
        isEdit: true,
        onEdit: () => {
          this.router.navigate([ROUTE_OMNI_NEW_REGISTER_EBILLING_PAGE]);
        },
      },
    };

    this.mailBillingInfo = {
      mobileNo: this.transaction.data.cusMobileNo,
      email: (billCycleData ? billCycleData.email : null) || '',
      address: this.billingInfo.billingAddress.text,
      billChannel: (billCycleData ? billCycleData.billChannel : null) || 'eBill'
    };

    this.telNoBillingInfo = {
      mobileNo: this.transaction.data.cusMobileNo,
      phoneNo: billCycleData.phoneNo || '',
    };
    this.isCheckBilling();
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
    if (this.transaction.data.faceRecognition.kyc = true) {
      this.router.navigate([ROUTE_OMNI_NEW_REGISTER_FACE_CONFIRM_PAGE]);
    } else {
      this.router.navigate([ROUTE_OMNI_NEW_REGISTER_FACE_COMPARE_PAGE]);

    }
  }
  onNext(): void {
    const seller: Seller = this.summarySellerCode.setASCCode();
    if (!seller.ascCode) {
      this.alertService.warning('กรุณากรอกข้อมูลให้ถูกต้อง');
      return;
    }
    this.http.get(`/api/customerportal/checkSeller/` + `${seller.ascCode}`).toPromise().then((response: any) => {
      if (response.data.condition === true) {
        this.transaction.data.seller = {
          ...this.transaction.data.seller,
          locationDestName: seller.locationName,
          locationCode: seller.locationCode,
          ascCode: seller.ascCode || seller.employeeId
        };
        const billingInformation = this.transaction.data.billingInformation;
        const billCycleData = billingInformation.billCycleData;
        this.transaction.data.billingInformation.billCycleData[0] = {
          email: this.mailBillingInfo.email || '',
          billMedia: billCycleData.billMedia,
          billChannel: this.mailBillingInfo.billChannel,
          mobileNoContact: billCycleData.mobileNoContact,
          phoneNoContact: billCycleData.phoneNoContact,
          billCycleText: this.billingInfo.billingCycle.text,
          billAddressText: this.billingInfo.billingAddress.text,
          customer: (billCycleData ? billCycleData[0].customer : null) || this.transaction.data.customer
        };
        this.router.navigate([ROUTE_OMNI_NEW_REGISTER_ECONTRACT_PAGE]);
      } else {
        this.alertService.warning(response.data.message);
      }
    });
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
    billCycleData.email = mailBillingInfo.email;
    billCycleData.billChannel = mailBillingInfo.billChannel;
    billCycleData.billMedia = mailBillingInfo.billMedia;
    billCycleData.receiveBillMethod = '';

    this.transaction.data.billingInformation.billCycleData = billCycleData;

  }

  getBillChannel(): any {
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

  onTelNoBillingCompleted(telNoBilling: any): void {
    const billingInformation = this.transaction.data.billingInformation;
    const billCycleData = billingInformation.billCycleData || {};

    billCycleData.mobileNoContact = telNoBilling.mobileNo;
    billCycleData.phoneNoContact = telNoBilling.phoneNo;

    this.transaction.data.billingInformation.billCycleData = billCycleData;

  }

  onTelNoBillingError(valid: boolean): void {
    this.isTelNoBillingValid = valid;
  }

  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  isCheckBilling(): boolean {
    if (this.billingInfo.billingAddress.text) {
      return this.isNext = true;
    }
  }

}

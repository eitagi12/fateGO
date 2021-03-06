import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_NEW_SHARE_PLAN_MNP_SUMMARY_PAGE, ROUTE_NEW_SHARE_PLAN_MNP_EBILLING_ADDRESS_PAGE, ROUTE_NEW_SHARE_PLAN_MNP_EBILLING_PAGE, ROUTE_NEW_SHARE_PLAN_MNP_SELECT_PACKAGE_MEMBER_PAGE } from '../../constants/route-path.constant';
import { Subscription } from 'rxjs';
import { TelNoBillingInfo, BillingInfo, MailBillingInfo, AlertService, Utils, BillingSystemType } from 'mychannel-shared-libs';
import { WIZARD_ORDER_NEW_SHARE_PLAN_MNP } from 'src/app/order/constants/wizard.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

export interface ConfirmCustomerInfo {
  titleName: string;
  firstName: string;
  lastName: string;
  idCardNo: string;
  mobileNo: string;
  mobileNoMember: string;
  mainPackage: string;
  mainPackageMember: string;
  onTopPackage?: string;
  packageDetail: string;
  packageDetailMember: string;
  idCardType?: string;
}

@Component({
  selector: 'app-new-share-plan-mnp-confirm-user-information-page',
  templateUrl: './new-share-plan-mnp-confirm-user-information-page.component.html',
  styleUrls: ['./new-share-plan-mnp-confirm-user-information-page.component.scss']
})
export class NewSharePlanMnpConfirmUserInformationPageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_ORDER_NEW_SHARE_PLAN_MNP;
  transaction: Transaction;
  confirmCustomerInfo: ConfirmCustomerInfo;
  billingInfo: BillingInfo;
  mailBillingInfo: MailBillingInfo;
  telNoBillingInfo: TelNoBillingInfo;
  eBill: boolean;
  isTelNoBillingValid: boolean;
  isMailBillingInfoValid: boolean;
  translationSubscribe: Subscription;

  constructor(
    private router: Router,
    private transactionService: TransactionService,
    private alertService: AlertService,
    private utils: Utils,
    private http: HttpClient,
    private translation: TranslateService
  ) {
    this.transaction = this.transactionService.load();
    // New register profile not found.
    if (!this.transaction.data.billingInformation) {
      this.transaction.data.billingInformation = {};
    }
    this.translationSubscribe = this.translation.onLangChange.subscribe(lang => {
      this.mapCustomerInfoByLang(lang.lang);
    });
  }

  ngOnInit(): void {
    const customer = this.transaction.data.customer;
    const mainPackage = this.transaction.data.mainPackage;
    const mainPackageMember = this.transaction.data.mainPackageMember;
    const simCard = this.transaction.data.simCard;
    const billingInformation = this.transaction.data.billingInformation;
    const billCycleData: any = billingInformation.billCycleData || {};
    this.eBill = !(mainPackage.billingSystem === BillingSystemType.BOS);
    this.confirmCustomerInfo = {
      titleName: customer.titleName,
      firstName: customer.firstName,
      lastName: customer.lastName,
      idCardNo: customer.idCardNo,
      mobileNo: simCard.mobileNo,
      mobileNoMember: simCard.mobileNoMember,
      mainPackage: mainPackage.shortNameThai,
      mainPackageMember: mainPackageMember.customAttributes.shortNameThai,
      onTopPackage: '',
      packageDetail: mainPackage.statementThai,
      packageDetailMember: mainPackageMember.customAttributes.inStatementThai,
      idCardType: customer.idCardType
    };
    this.mailBillingInfo = {
      email: billCycleData.email,
      mobileNo: simCard.mobileNo,
      address: billCycleData.billAddressText,
      billChannel: this.getBillChannel()
    };
    this.telNoBillingInfo = {
      mobileNo: billCycleData.mobileNoContact,
      phoneNo: billCycleData.phoneNoContact,
    };
    this.initBillingInfo();
    this.mapCustomerInfoByLang(this.translation.currentLang);
  }

  mapCustomerInfoByLang(lang: string): void {
    if (lang === 'EN') {
      this.confirmCustomerInfo.mainPackage = this.transaction.data.mainPackage.shortNameEng;
      this.confirmCustomerInfo.packageDetail = this.transaction.data.mainPackage.statementEng;
      this.confirmCustomerInfo.mainPackageMember = this.transaction.data.mainPackageMember.customAttributes.shortNameEng;
      this.confirmCustomerInfo.packageDetailMember = this.transaction.data.mainPackageMember.customAttributes.inStatementEng;
    } else {
      this.confirmCustomerInfo.mainPackage = this.transaction.data.mainPackage.shortNameThai;
      this.confirmCustomerInfo.packageDetail = this.transaction.data.mainPackage.statementThai;
      this.confirmCustomerInfo.mainPackageMember = this.transaction.data.mainPackageMember.customAttributes.shortNameThai;
      this.confirmCustomerInfo.packageDetailMember = this.transaction.data.mainPackageMember.customAttributes.inStatementThai;
    }
  }

  initBillingInfo(): void {
    const billingInformation = this.transaction.data.billingInformation || {};
    const mergeBilling = billingInformation.mergeBilling;
    const billCycle = billingInformation.billCycle;
    const billCycles = [] = billingInformation.billCycles;
    const customer: any = billingInformation.billDeliveryAddress || this.transaction.data.customer;
    const engFlag = customer.province && !!customer.province.match(/[a-z]/i) ? 'Y' : 'N';
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
    }, engFlag);
    this.billingInfo = {
      // merge bill ไม่เมื่อเลือก package net extrem
      billingMethod: {
        text: this.isMergeBilling() ? `${billingInformation.mergeBilling.mobileNo[0]}` : null,
        // net extrem แก้ไขไม่ได้, โปรไฟล์ใหม่แก้ไขไม่ได้
        isEdit: !!(customer.caNumber && customer.billCycle && billCycles && billCycles.length > 0),
        // net extrem ลบไม่ได้, มีบิลใหม่ลบได้แล้วแสดงบิลเก่า
        isDelete: !!mergeBilling
      },
      billingAddress: {
        text: (this.isMergeBilling() ? mergeBilling.billingAddr : null) || customerAddress || '-',
        isEdit: !(!!mergeBilling),
        onEdit: () => {
          this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_EBILLING_ADDRESS_PAGE]);
        }
      },
      billingCycle: {
        text: '-',
        // net extrem ลบไม่ได้, merge bill ลบไม่ได้
        isEdit: !(!!mergeBilling),
        isDelete: !(!!mergeBilling) && !!billCycle,
        onEdit: () => {
          this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_EBILLING_PAGE]);
        },
        onDelete: () => {
          delete billingInformation.billCycle;
          this.billingInfo.billingCycle.isDelete = false;
          this.getBllingCycle(customer.billCycle).then((billCycleText: string) => {
            this.billingInfo.billingCycle.text = billCycleText;
          });
        }
      }
    };

    // disable all
    if (this.isPackageNetExtreme()) {
      Object.keys(this.billingInfo).forEach(key => {
        this.billingInfo[key].isEdit = false;
        this.billingInfo[key].isDelete = false;
      });
    }

    // default billing
    this.getBllingCycle(
      (mergeBilling ? mergeBilling.bill : null) || (billCycle ? billCycle.bill : null) || customer.billCycle
    ).then((billCycleText: string) => {
      this.billingInfo.billingCycle.text = billCycleText;
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
  }

  onMailBillingInfoError(valid: boolean): void {
    this.isMailBillingInfoValid = valid;
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

  isNext(): boolean {
    return this.isTelNoBillingValid && this.isMailBillingInfoValid;
  }

  onBack(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_SELECT_PACKAGE_MEMBER_PAGE]);
  }

  onNext(): void {
    if (!this.customerValid() && !this.isMergeBilling()) {
      this.alertService.warning(this.translation.instant('กรุณาใส่ข้อมูลที่อยู่จัดส่งเอกสาร'));
      return;
    }
    const billingInformation = this.transaction.data.billingInformation;
    const billCycleData = billingInformation.billCycleData;
    billCycleData.billAddressText = this.billingInfo.billingAddress.text;
    billCycleData.billingMethodText = this.billingInfo.billingMethod.text;
    billCycleData.billCycleText = this.billingInfo.billingCycle.text;
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_SUMMARY_PAGE]);
  }

  onEditAddress(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_EBILLING_ADDRESS_PAGE]);
  }

  getBillChannel(): any {
    const mainPackage = this.transaction.data.mainPackage;
    const billingInformation = this.transaction.data.billingInformation;
    const mergeBilling: any = billingInformation.mergeBilling;

    // default ตามรอบบิลที่เลือก
    if (this.isMergeBilling()) {
      if (mergeBilling.billMedia === 'SMS and eBill') {
        return 'eBill';
      } else if (mergeBilling.billMedia === 'Hard Copy') {
        return 'address';
      } else if (mergeBilling.billMedia === 'SMS + Email') {
        return 'other';
      }
    }

    if (billingInformation && billingInformation.billCycleData) {
      return billingInformation.billCycleData.billChannel;
    }

    const billingSystem = mainPackage.billingSystem;
    if (billingSystem && billingSystem === BillingSystemType.BOS) {
      return 'other';
    } else {
      return 'eBill';
    }
  }

  customerValid(): boolean {
    const billingInformation = this.transaction.data.billingInformation || {};
    // ถ้าเป็น Newca จะไม่มี data.customer เลยต้องเช็คจากที่อยู่ว่า มีที่อยู่(billDeliveryAddress)ไหม
    const customer = billingInformation.billDeliveryAddress || this.transaction.data.customer;
    return !!(customer.homeNo
      && customer.province
      && customer.amphur
      && customer.tumbol
      && customer.zipCode
    );
  }

  getBllingCycle(billCycle: string): Promise<string> {
    if (!billCycle) { // NewCa จะ defaultBill
      return this.http.get('/api/customerportal/newRegister/queryBillCycle', {
        params: {
          coProject: 'N'
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

  isPackageNetExtreme(): boolean {
    const REGEX_NET_EXTREME = /[Nn]et[Ee]xtreme/;
    const mainPackage = this.transaction.data.mainPackage;
    return mainPackage && REGEX_NET_EXTREME.test(mainPackage.productPkg);
  }

  isMergeBilling(): boolean {
    const billingInformation = this.transaction.data.billingInformation;
    return billingInformation ? (!!billingInformation.mergeBilling) : false;
  }

  ngOnDestroy(): void {
    this.translationSubscribe.unsubscribe();
    this.transactionService.save(this.transaction);
  }

}

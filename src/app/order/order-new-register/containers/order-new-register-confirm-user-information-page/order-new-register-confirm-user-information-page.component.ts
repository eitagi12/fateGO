import { Component, OnInit, OnDestroy } from '@angular/core';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { ConfirmCustomerInfo, BillingInfo, BillingSystemType, MailBillingInfo, TelNoBillingInfo, Utils, AlertService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { HomeService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import {
  ROUTE_ORDER_NEW_REGISTER_ON_TOP_PAGE,
  ROUTE_ORDER_NEW_REGISTER_EBILLING_ADDRESS_PAGE,
  ROUTE_ORDER_NEW_REGISTER_SUMMARY_PAGE,
  ROUTE_ORDER_NEW_REGISTER_SELECT_PACKAGE_PAGE,
  ROUTE_ORDER_NEW_REGISTER_MERGE_BILLING_PAGE,
  ROUTE_ORDER_NEW_REGISTER_EBILLING_PAGE,
} from 'src/app/order/order-new-register/constants/route-path.constant';
import { WIZARD_ORDER_NEW_REGISTER } from 'src/app/order/constants/wizard.constant';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-order-new-register-confirm-user-information-page',
  templateUrl: './order-new-register-confirm-user-information-page.component.html',
  styleUrls: ['./order-new-register-confirm-user-information-page.component.scss'],
})
export class OrderNewRegisterConfirmUserInformationPageComponent implements OnInit, OnDestroy {
  wizards = WIZARD_ORDER_NEW_REGISTER;

  transaction: Transaction;
  confirmCustomerInfo: ConfirmCustomerInfo;
  billingInfo: BillingInfo;
  mailBillingInfo: MailBillingInfo;
  telNoBillingInfo: TelNoBillingInfo;

  eBill: boolean;
  isTelNoBillingValid: boolean;
  isMailBillingInfoValid: boolean;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private alertService: AlertService,
    private utils: Utils,
    private http: HttpClient,
  ) {
    this.transaction = this.transactionService.load();

    // New register profile not found.
    if (!this.transaction.data.billingInformation) {
      this.transaction.data.billingInformation = {};
    }
  }

  ngOnInit() {
    const customer = this.transaction.data.customer;
    const mainPackage = this.transaction.data.mainPackage;
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
      mainPackage: mainPackage.shortNameThai,
      onTopPackage: '',
      packageDetail: mainPackage.statementThai
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
  }

  initBillingInfo() {
    const customer = this.transaction.data.customer;
    const billingInformation = this.transaction.data.billingInformation;
    const mergeBilling = billingInformation.mergeBilling;
    const billCycle = billingInformation.billCycle;

    const customerAddress = this.utils.getCurrentAddress({
      homeNo: customer.homeNo,
      moo: customer.moo,
      room: customer.room,
      floor: customer.floor,
      buildingName: customer.buildingName,
      soi: customer.soi,
      street: customer.street,
      tumbol: customer.tumbol,
      amphur: customer.amphur,
      province: customer.province,
      zipCode: customer.zipCode
    });

    this.billingInfo = {
      // merge bill ไม่เมื่อเลือก package net extrem
      billingMethod: {
        text: this.isMergeBilling() ? `${billingInformation.mergeBilling.mobileNo[0]}` : null,
        // net extrem แก้ไขไม่ได้, โปรไฟล์ใหม่แก้ไขไม่ได้
        isEdit: !!customer.billCycle,
        // isEdit: false,
        // net extrem ลบไม่ได้, มีบิลใหม่ลบได้แล้วแสดงบิลเก่า
        isDelete: !!mergeBilling,
        // isDelete: false,
        onEdit: () => {
          this.router.navigate([ROUTE_ORDER_NEW_REGISTER_MERGE_BILLING_PAGE]);
        },
        onDelete: () => {
          delete this.transaction.data.billingInformation.mergeBilling;

          this.billingInfo.billingMethod.text = null;
          this.billingInfo.billingMethod.isDelete = false;

          // enable config
          this.billingInfo.billingAddress.isEdit = true;
          this.billingInfo.billingAddress.text = customerAddress;

          this.billingInfo.billingCycle.isEdit = true;
          this.billingInfo.billingCycle.isDelete = false;

          this.getBllingCycle(customer.billCycle).then((billCycleText: string) => {
            this.billingInfo.billingCycle.text = billCycleText;
          });
        }
      },
      billingAddress: {
        text: (this.isMergeBilling() ? mergeBilling.billingAddr : null) || customerAddress || '-',
        isEdit: !(!!mergeBilling),
        // isEdit: !(isMergeBilling || isPackageNetExtreme),
        onEdit: () => {
          this.router.navigate([ROUTE_ORDER_NEW_REGISTER_EBILLING_ADDRESS_PAGE]);
        }
      },
      billingCycle: {
        text: '-',
        // net extrem ลบไม่ได้, merge bill ลบไม่ได้
        isEdit: !(!!mergeBilling),
        isDelete: !(!!mergeBilling) && !!billCycle,
        onEdit: () => {
          this.router.navigate([ROUTE_ORDER_NEW_REGISTER_EBILLING_PAGE]);
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

  onMailBillingInfoCompleted(mailBillingInfo: any) {
    const billingInformation = this.transaction.data.billingInformation;
    const billCycleData = billingInformation.billCycleData || {};

    billCycleData.email = mailBillingInfo.email;
    billCycleData.billChannel = mailBillingInfo.billChannel;
    billCycleData.billMedia = mailBillingInfo.billMedia;
    billCycleData.receiveBillMethod = mailBillingInfo.receiveBillMethod;

    this.transaction.data.billingInformation.billCycleData = billCycleData;
  }

  onMailBillingInfoError(valid: boolean) {
    this.isMailBillingInfoValid = valid;
  }

  onTelNoBillingCompleted(telNoBilling: any) {
    const billingInformation = this.transaction.data.billingInformation;
    const billCycleData = billingInformation.billCycleData || {};

    billCycleData.mobileNoContact = telNoBilling.mobileNo;
    billCycleData.phoneNoContact = telNoBilling.phoneNo;

    this.transaction.data.billingInformation.billCycleData = billCycleData;
  }

  onTelNoBillingError(valid: boolean) {
    this.isTelNoBillingValid = valid;
  }

  onBack() {
    if (this.isPackageNetExtreme()) {
      this.router.navigate([ROUTE_ORDER_NEW_REGISTER_MERGE_BILLING_PAGE]);
    } else {
      if (this.transaction.data.onTopPackage) {
        this.router.navigate([ROUTE_ORDER_NEW_REGISTER_ON_TOP_PAGE]);
      } else {
        this.router.navigate([ROUTE_ORDER_NEW_REGISTER_SELECT_PACKAGE_PAGE]);
      }
    }
  }

  onNext() {
    if (!this.customerValid()) {
      this.alertService.warning('กรุณาใส่ข้อมูลที่อยู่จัดส่งเอกสาร');
      return;
    }

    const billingInformation = this.transaction.data.billingInformation;
    const billCycleData = billingInformation.billCycleData;
    billCycleData.billAddressText = this.billingInfo.billingAddress.text;
    billCycleData.billingMethodText = this.billingInfo.billingMethod.text;
    billCycleData.billCycleText = this.billingInfo.billingCycle.text;

    this.router.navigate([ROUTE_ORDER_NEW_REGISTER_SUMMARY_PAGE]);
  }

  onEditAddress() {
    this.router.navigate([ROUTE_ORDER_NEW_REGISTER_EBILLING_ADDRESS_PAGE]);
  }

  onHome() {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
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

    // เลือกบิลตามแพจเกจ
    const billingSystem = mainPackage.billingSystem;
    if (billingSystem && billingSystem === BillingSystemType.BOS) {
      return 'other';
    } else {
      return 'eBill';
    }
  }

  customerValid(): boolean {
    const customer = this.transaction.data.customer;

    return !!(customer.homeNo
      && customer.province
      && customer.amphur
      && customer.tumbol
      && customer.zipCode);
  }

  getBllingCycle(billCycle: string): Promise<string> {
    if (!billCycle) {
      return this.http.get('/api/customerportal/newRegister/queryBillCycle')
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

          this.transaction.data.billingInformation.billCycle = defaultBillCycle.billCycle;
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

}

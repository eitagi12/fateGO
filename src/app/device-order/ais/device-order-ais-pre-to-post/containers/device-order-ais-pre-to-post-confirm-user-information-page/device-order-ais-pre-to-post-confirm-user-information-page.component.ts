import { Component, OnInit, OnDestroy } from '@angular/core';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { ConfirmCustomerInfo, BillingInfo, BillingSystemType, MailBillingInfo, TelNoBillingInfo, Utils, AlertService, ShoppingCart } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { HomeService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient } from '@angular/common/http';
import { WIZARD_DEVICE_ORDER_AIS } from '../../../../constants/wizard.constant';

import {
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_SUMMARY_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_MOBILE_CARE_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_EBILLING_ADDRESS_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_MERGE_BILLING_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_ON_TOP_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_EBILLING_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_SELECT_PACKAGE_PAGE
} from '../../constants/route-path.constant';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-device-order-ais-pre-to-post-confirm-user-information-page',
  templateUrl: './device-order-ais-pre-to-post-confirm-user-information-page.component.html',
  styleUrls: ['./device-order-ais-pre-to-post-confirm-user-information-page.component.scss']
})
export class DeviceOrderAisPreToPostConfirmUserInformationPageComponent implements OnInit, OnDestroy {
  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;

  transaction: Transaction;
  confirmCustomerInfo: ConfirmCustomerInfo;
  billingInfo: BillingInfo;
  mailBillingInfo: MailBillingInfo;
  telNoBillingInfo: TelNoBillingInfo;
  shoppingCart: ShoppingCart;

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
    private shoppingCartService: ShoppingCartService,
    private translateService: TranslateService
  ) {
    this.transaction = this.transactionService.load();

    // New register profile not found.
    if (!this.transaction.data.billingInformation) {
      this.transaction.data.billingInformation = {};
    }
  }

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    const customer = this.transaction.data.customer;
    const mainPackage = this.transaction.data.mainPackage;
    const simCard = this.transaction.data.simCard;
    const billingInformation = this.transaction.data.billingInformation;
    const billCycleData: any = billingInformation.billCycleData || {};

    this.eBill = !(mainPackage.billingSystem === BillingSystemType.BOS);

    this.translateService.onLangChange.subscribe(onChange => {
      this.confirmCustomerInfo = {
        titleName: customer.titleName,
        firstName: customer.firstName,
        lastName: customer.lastName,
        idCardNo: customer.idCardNo,
        mobileNo: simCard.mobileNo,
        mainPackage: (onChange.lang === 'TH') ? mainPackage.title : (mainPackage.customAttributes || {}).shortNameEng,
        onTopPackage: '',
        packageDetail: (onChange.lang === 'TH') ? mainPackage.detailTH : mainPackage.detailEN
      };
    });

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

  initBillingInfo(): void {
    const billingInformation = this.transaction.data.billingInformation || {};
    const mergeBilling = billingInformation.mergeBilling;
    const billCycle = billingInformation.billCycle;
    const billCycles = [] = billingInformation.billCycles;
    const customer: any = billingInformation.billDeliveryAddress || this.transaction.data.customer;

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
    });

    this.billingInfo = {
      // merge bill ไม่เมื่อเลือก package net extrem
      billingMethod: {
        text: this.isMergeBilling() ? `${billingInformation.mergeBilling.mobileNo[0]}` : null,
        // net extrem แก้ไขไม่ได้, โปรไฟล์ใหม่แก้ไขไม่ได้
        isEdit: false,
        // isEdit: !!(customer.caNumber && customer.billCycle && billCycles && billCycles.length > 0),
        // net extrem ลบไม่ได้, มีบิลใหม่ลบได้แล้วแสดงบิลเก่า
        isDelete: false,
        // isDelete: !!mergeBilling,
        onEdit: () => {
          // this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_MERGE_BILLING_PAGE]);
        },
        onDelete: () => {
          delete this.transaction.data.billingInformation.mergeBilling;
          // delete this.transaction.data.billingInformation.billCycle;
          delete this.transaction.data.billingInformation.billCycleData;
          const simCard = this.transaction.data.simCard;
          const billCycleData: any = billingInformation.billCycleData || {};

          this.billingInfo.billingMethod.text = null;
          this.billingInfo.billingMethod.isDelete = false;

          // enable config
          this.billingInfo.billingAddress.isEdit = true;
          this.billingInfo.billingAddress.text = customerAddress;

          this.billingInfo.billingCycle.isEdit = true;
          this.billingInfo.billingCycle.isDelete = false;

          // this.mailBillingInfo.billChannel = this.getBillChannel();
          this.mailBillingInfo = {
            email: billCycleData.email,
            mobileNo: simCard.mobileNo,
            address: billCycleData.billAddressText,
            billChannel: this.getBillChannel()
          };
          const bill = billCycle && billCycle.bill ? billCycle.bill : customer.billCycle;
          this.billingInfo.billingCycle.isDelete = !!(billCycle && billCycle.bill);
          this.getBllingCycle(bill).then((billCycleText: string) => {
            this.billingInfo.billingCycle.text = billCycleText;
          });

        }
      },
      billingAddress: {
        text: (this.isMergeBilling() ? mergeBilling.billingAddr : null) || customerAddress || '-',
        isEdit: !(!!mergeBilling),
        // isEdit: !(isMergeBilling || isPackageNetExtreme),
        onEdit: () => {
          this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_EBILLING_ADDRESS_PAGE]);
        }
      },
      billingCycle: {
        text: '-',
        // net extrem ลบไม่ได้, merge bill ลบไม่ได้
        isEdit: !(!!mergeBilling),
        isDelete: !(!!mergeBilling) && !!billCycle,
        onEdit: () => {
          this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_EBILLING_PAGE]);
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

  onBack(): void {
    // if (this.isPackageNetExtreme()) {
    //   // this.router.navigate([ROUTE_ORDER_NEW_REGISTER_MERGE_BILLING_PAGE]);
    // } else {
    //   if (this.transaction.data.onTopPackage) {
    //     // this.router.navigate([ROUTE_ORDER_NEW_REGISTER_ON_TOP_PAGE]);
    //   } else {
    //     // this.router.navigate([ROUTE_ORDER_NEW_REGISTER_SELECT_PACKAGE_PAGE]);
    //   }
    // }
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_SELECT_PACKAGE_PAGE]);
  }

  onNext(): void {

    if (!this.customerValid() && !this.isMergeBilling()) {
      this.alertService.warning('กรุณาใส่ข้อมูลที่อยู่จัดส่งเอกสาร');
      return;
    }

    const billingInformation = this.transaction.data.billingInformation;
    const billCycleData = billingInformation.billCycleData;
    billCycleData.billAddressText = this.billingInfo.billingAddress.text;
    billCycleData.billingMethodText = this.billingInfo.billingMethod.text;
    billCycleData.billCycleText = this.billingInfo.billingCycle.text;

    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_MOBILE_CARE_PAGE]);
  }

  onEditAddress(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_EBILLING_ADDRESS_PAGE]);
  }

  onHome(): void {
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
    if (billingInformation && billingInformation.billCycleData) {
      return billingInformation.billCycleData.billChannel;
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
    const billingInformation = this.transaction.data.billingInformation || {};
    // ถ้าเป็น Newca จะไม่มี data.customer เลยต้องเช็คจากที่อยู่ว่า มีที่อยู่(billDeliveryAddress)ไหม
    const customer = billingInformation.billDeliveryAddress || this.transaction.data.customer;
    return !!(customer.homeNo
      && customer.province
      && customer.amphur
      && customer.tumbol
      && customer.zipCode);
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

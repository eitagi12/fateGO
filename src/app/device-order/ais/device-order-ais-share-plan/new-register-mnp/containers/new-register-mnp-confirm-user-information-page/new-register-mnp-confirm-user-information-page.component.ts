import { Component, OnInit, OnDestroy } from '@angular/core';
import { Transaction, MainPackage } from 'src/app/shared/models/transaction.model';
import { ConfirmCustomerInfo, BillingInfo, BillingSystemType, MailBillingInfo, TelNoBillingInfo, Utils, AlertService, ShoppingCart } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { HomeService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient } from '@angular/common/http';
import {
  ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_EDIT_BILLING_ADDRESS_PAGE,
  ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_EBILLING_PAGE,
  ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_NETWORK_TYPE,
  ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_MOBILE_CARE_PAGE
} from '../../constants/route-path.constant';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN } from 'src/app/device-order/constants/wizard.constant';
import * as moment from 'moment';
const Moment = moment;

@Component({
  selector: 'app-new-register-mnp-confirm-user-information-page',
  templateUrl: './new-register-mnp-confirm-user-information-page.component.html',
  styleUrls: ['./new-register-mnp-confirm-user-information-page.component.scss']
})
export class NewRegisterMnpConfirmUserInformationPageComponent implements OnInit, OnDestroy {
  wizards: string[] = WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN;

  transaction: Transaction;
  confirmCustomerInfo: ConfirmCustomerInfo;
  billingInfo: BillingInfo;
  mailBillingInfo: MailBillingInfo;
  telNoBillingInfo: TelNoBillingInfo;
  shoppingCart: ShoppingCart;
  translateSubscription: Subscription;

  eBill: boolean;
  isTelNoBillingValid: boolean;
  isMailBillingInfoValid: boolean;

  confirmMemberInfo: any;

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
    const mainPackage = this.transaction.data.mainPackage;
    const customer = this.transaction.data.customer;
    const simCard = this.transaction.data.simCard;
    const billingInformation = this.transaction.data.billingInformation;
    const billCycleData: any = billingInformation.billCycleData || {};

    this.eBill = !(mainPackage.billingSystem === BillingSystemType.BOS);

    const memberSimCard = simCard.memberSimCard['member1'];
    const memberMainPackage = mainPackage.memberMainPackage['member1'];
   this.confirmMemberInfo = {
    mobileNo: memberSimCard.mobileNo,
    mainPackage: this.changeMainPackageLanguage(memberMainPackage),
    packageDetail: this.changePackageDetailLanguage(memberMainPackage)
  };
    this.confirmCustomerInfo = {
      titleName: customer.titleName,
      firstName: customer.firstName,
      lastName: customer.lastName,
      idCardNo: customer.idCardNo,
      mobileNo: simCard.mobileNo,
      mainPackage: this.changeMainPackageLanguage(mainPackage),
      onTopPackage: '',
      packageDetail: this.changePackageDetailLanguage(mainPackage)
    };

    this.translateSubscription = this.translateService.onLangChange.subscribe(() => {
      this.confirmCustomerInfo.mainPackage = this.changeMainPackageLanguage(mainPackage);
      this.confirmCustomerInfo.packageDetail = this.changePackageDetailLanguage(mainPackage);
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

  changePackageDetailLanguage(mainPackage: MainPackage): string {
    return (this.translateService.currentLang === 'TH') ? mainPackage.detailTH : mainPackage.detailEN;
  }

  changeMainPackageLanguage(mainPackage: MainPackage): string {
    return (this.translateService.currentLang === 'TH') ? mainPackage.title : (mainPackage.customAttributes || {}).shortNameEng;
  }

  initBillingInfo(): void {

    const billingInformation = this.transaction.data.billingInformation || {};
    const mergeBilling = billingInformation.mergeBilling;
    const billCycle = billingInformation.billCycle;
    const customer: any = billingInformation.billDeliveryAddress || this.transaction.data.customer;
    const simCard = this.transaction.data.simCard;
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
      billingMethod: {
        text: simCard.mobileNo,
        isEdit: false,
        isDelete: false,
        onEdit: () => {
          //
        },
        onDelete: () => {
          delete this.transaction.data.billingInformation.mergeBilling;
          delete this.transaction.data.billingInformation.billCycleData;

          const billCycleData: any = billingInformation.billCycleData || {};

          this.billingInfo.billingMethod.text = null;
          this.billingInfo.billingMethod.isDelete = false;

          this.billingInfo.billingAddress.isEdit = true;
          this.billingInfo.billingAddress.text = customerAddress;

          this.billingInfo.billingCycle.isEdit = true;
          this.billingInfo.billingCycle.isDelete = false;

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
        text: customerAddress,
        isEdit: !(!!mergeBilling),
        onEdit: () => {
          this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_EDIT_BILLING_ADDRESS_PAGE]);
        }
      },
      billingCycle: {
        text: '-',
        isEdit: !(!!mergeBilling),
        isDelete: !(!!true) && !!billingInformation.billCycles,
        onEdit: () => {
          this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_EBILLING_PAGE]);
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
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_NETWORK_TYPE]);
  }

  onNext(): void {

    if (!this.customerValid() && !this.isMergeBilling()) {
      this.alertService.warning(this.translateService.instant('กรุณาใส่ข้อมูลที่อยู่จัดส่งเอกสาร'));
      return;
    }
    const billingInformation = this.transaction.data.billingInformation;
    const billCycleData = billingInformation.billCycleData;
    billCycleData.billAddressText = this.billingInfo.billingAddress.text;
    billCycleData.billingMethodText = this.billingInfo.billingMethod.text;
    billCycleData.billCycleText = this.billingInfo.billingCycle.text;

    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_MOBILE_CARE_PAGE]);
  }

  onEditAddress(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_EDIT_BILLING_ADDRESS_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    if (this.translateSubscription) {
      this.translateSubscription.unsubscribe();
    }
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

  getBillCycleText(bill: string): string {
    if (bill) {
      const bills = bill.split(' ');
      if (this.translateService.currentLang === 'TH') {
        return bill;
      } else {
        if (bills[3] === 'สิ้นเดือน') {
          return `From the ${Moment([0, 0, bills[1]]).format('Do')} to the end of every month`;
        } else {
          return `From the ${Moment([0, 0, bills[1]]).format('Do')} to the ${Moment([0, 0, bills[3]]).format('Do')} of every month`;
        }
      }
    }
  }

}

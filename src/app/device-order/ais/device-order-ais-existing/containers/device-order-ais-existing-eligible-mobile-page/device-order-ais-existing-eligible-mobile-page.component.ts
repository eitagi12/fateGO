import { Component, OnInit } from '@angular/core';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { HomeService, ShoppingCart } from 'mychannel-shared-libs';
import { Transaction, Customer } from 'src/app/shared/models/transaction.model';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import {
  ROUTE_DEVICE_ORDER_AIS_EXISTING_CUSTOMER_INFO_PAGE,
  ROUTE_DEVICE_ORDER_AIS_EXISTING_CHANGE_PACKAGE_PAGE,
  ROUTE_DEVICE_ORDER_AIS_EXISTING_MOBILE_DETAIL_PAGE
} from '../../constants/route-path.constant';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { HttpClient } from '@angular/common/http';
import { PrivilegeService } from 'src/app/device-order/services/privilege.service';
import { CustomerInfoService } from 'src/app/device-order/services/customer-info.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';

export interface BillingAccount {
  billingName: string;
  mobileNo: string[];
  billCycleFrom: string;
  billCycleTo: string;
  payDate: string;
  billingAddr: string;
  billAcctNo: string;
  bill: string;
  productPkg: string;
  billMedia: string;
}

interface EligibleMobile {
  mobileNo: string;
  mobileStatus: 'Active' | 'Suspended';
  privilegeCode?: string;
  privilegeMessage?: string;
}

@Component({
  selector: 'app-device-order-ais-existing-eligible-mobile-page',
  templateUrl: './device-order-ais-existing-eligible-mobile-page.component.html',
  styleUrls: ['./device-order-ais-existing-eligible-mobile-page.component.scss']
})
export class DeviceOrderAisExistingEligibleMobilePageComponent implements OnInit {

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;
  eligibleMobiles: Array<EligibleMobile>;
  selectMobileNo: EligibleMobile;
  transaction: Transaction;
  priceOption: PriceOption;
  billingAccountList: Array<BillingAccount>;
  billingNetExtremeList: Array<BillingAccount>;
  shoppingCart: ShoppingCart;

  idCardNo: string;

  constructor(
    private router: Router,
    private http: HttpClient,
    private transactionService: TransactionService,
    private homeService: HomeService,
    private priceOptionService: PriceOptionService,
    private privilegeService: PrivilegeService,
    private customerInfoService: CustomerInfoService,
    private shoppingCartService: ShoppingCartService,
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();

    delete this.transaction.data.currentPackage;
  }

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    if (this.transaction.data.customer) {
      this.idCardNo = this.transaction.data.customer.idCardNo;
      const ussdCode = this.priceOption.trade.ussdCode;
      this.http.post('/api/customerportal/query-eligible-mobile-list', {
        idCardNo: '1670300171423',
        ussdCode: ussdCode,
        mobileType: `Post-paid`,
        chkMainProFlg: true
      }).toPromise()
        .then((response: any) => {
          const eMobileResponse = response.data;
          this.eligibleMobiles = eMobileResponse.postpaid || [];
        });
    } else {
      this.onBack();
    }
  }

  onComplete(eligibleMobile: EligibleMobile): void {
    this.selectMobileNo = eligibleMobile;
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_CUSTOMER_INFO_PAGE]);
  }

  onNext(): void {
    this.transaction.data.simCard = { mobileNo: this.selectMobileNo.mobileNo, persoSim: false };
    if (this.selectMobileNo.privilegeCode) {
      this.transaction.data.customer.privilegeCode = this.selectMobileNo.privilegeCode;
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_MOBILE_DETAIL_PAGE]);

    } else if (this.selectMobileNo.privilegeMessage === `MT_INVALID_CRITERIA_MAINPRO`) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_CHANGE_PACKAGE_PAGE]);

    } else {
      const ussdCode = this.priceOption.trade.ussdCode;
      this.privilegeService.requestUsePrivilege(this.selectMobileNo.mobileNo, ussdCode, this.selectMobileNo.privilegeCode)
      .then((privilegeCode) => {
        this.transaction.data.customer.privilegeCode = privilegeCode;
        this.transaction.data.simCard = { mobileNo: this.selectMobileNo.mobileNo };
        if (this.transaction.data.customer && this.transaction.data.customer.firstName === '-') {
          this.customerInfoService.getCustomerProfileByMobileNo(this.transaction.data.simCard.mobileNo,
            this.transaction.data.customer.idCardNo).then((customer: Customer) => {
              this.transaction.data.customer = { ...this.transaction.data.customer, ...customer };
            });
        }
      }).then(() => this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_MOBILE_DETAIL_PAGE]));
    }
  }

  onHome(): void {
    this.homeService.goToHome();
  }

// tslint:disable-next-line: use-life-cycle-interface
  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}

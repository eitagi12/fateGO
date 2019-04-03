import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, ShoppingCart, EligibleMobile } from 'mychannel-shared-libs';
import {
  ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_CUSTOMER_INFO_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_VALIDATE_CUSTOMER_ID_CARD_PAGE
} from '../../constants/route-path.constant';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient } from '@angular/common/http';

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
@Component({
  selector: 'app-device-order-ais-existing-prepaid-hotdeal-eligible-mobile-page',
  templateUrl: './device-order-ais-existing-prepaid-hotdeal-eligible-mobile-page.component.html',
  styleUrls: ['./device-order-ais-existing-prepaid-hotdeal-eligible-mobile-page.component.scss']
})
export class DeviceOrderAisExistingPrepaidHotdealEligibleMobilePageComponent implements OnInit {

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;
  shoppingCart: ShoppingCart;
  eligibleMobiles: Array<EligibleMobile>;
  selectMobileNo: EligibleMobile;
  transaction: Transaction;
  billingAccountList: Array<BillingAccount>;
  billingNetExtremeList: Array<BillingAccount>;

  idCardNo: string;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private http: HttpClient,
    private shoppingCartService: ShoppingCartService,
    private transactionService: TransactionService,
  ) {
    this.transaction = this.transactionService.load();
    this.shoppingCart = Object.assign(this.shoppingCartService.getShoppingCartData(), {
      mobileNo: ''
    });
  }

  ngOnInit(): void {
    if (this.transaction.data.customer) {
      this.idCardNo = this.transaction.data.customer.idCardNo;
      this.getMobileList();
    } else {
      this.onBack();
    }
  }

  getMobileList(): void {
    this.http.get(`/api/customerportal/newRegister/${this.idCardNo}/queryPrepaidMobileList`).toPromise()
      .then((resp: any) => {
        const postpaidMobileList = resp.data.postpaidMobileList || [];
        this.mapPrepaidMobileNo(postpaidMobileList);
      })
      .catch(() => {
      });
  }

  mapPrepaidMobileNo(mobileList: any): void {
    const mobiles: Array<EligibleMobile> = new Array<EligibleMobile>();
    mobileList.forEach(element => {
      mobiles.push({ mobileNo: element.mobileNo, mobileStatus: element.status });
    });
    this.eligibleMobiles = mobiles;
  }

  onComplete(eligibleMobile: EligibleMobile): void {
    this.selectMobileNo = eligibleMobile;
  }

  onNext(): void {
    this.transaction.data.simCard = { mobileNo: this.selectMobileNo.mobileNo , persoSim: false };
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_CUSTOMER_INFO_PAGE]);
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_VALIDATE_CUSTOMER_ID_CARD_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

}

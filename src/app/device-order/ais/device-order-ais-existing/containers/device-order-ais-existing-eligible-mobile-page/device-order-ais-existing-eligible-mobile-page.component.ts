import { Component, OnInit } from '@angular/core';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { EligibleMobile, HomeService } from 'mychannel-shared-libs';
import { Transaction, TransactionAction } from 'src/app/shared/models/transaction.model';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import {
  ROUTE_DEVICE_ORDER_AIS_EXISTING_CUSTOMER_INFO_PAGE,
  ROUTE_DEVICE_ORDER_AIS_EXISTING_CHANGE_PACKAGE_PAGE
} from '../../constants/route-path.constant';


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
  selector: 'app-device-order-ais-existing-eligible-mobile-page',
  templateUrl: './device-order-ais-existing-eligible-mobile-page.component.html',
  styleUrls: ['./device-order-ais-existing-eligible-mobile-page.component.scss']
})
export class DeviceOrderAisExistingEligibleMobilePageComponent implements OnInit {

  wizards = WIZARD_DEVICE_ORDER_AIS;
  eligibleMobiles: Array<EligibleMobile>;
  selectMobileNo: EligibleMobile;
  transaction: Transaction;
  billingAccountList: Array<BillingAccount>;
  billingNetExtremeList: Array<BillingAccount>;

  idCardNo: string;

  constructor(
    private router: Router,
    private http: HttpClient,
    private transactionService: TransactionService,
    private homeService: HomeService
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit() {
    if (this.transaction.data.customer) {
      this.idCardNo = this.transaction.data.customer.idCardNo;
      this.getMobileList();
    } else {
      this.onBack();
    }
  }

  getMobileList() {
    this.http.get(`/api/customerportal/newRegister/${this.idCardNo}/queryPrepaidMobileList`).toPromise()
      .then((resp: any) => {
        const postpaidMobileList = resp.data.postpaidMobileList || [];
        this.mapPrepaidMobileNo(postpaidMobileList);
      })
      .catch(() => {
      });
  }

  mapPrepaidMobileNo(mobileList) {
    const mobiles: Array<EligibleMobile> = new Array<EligibleMobile>();
    mobileList.forEach(element => {
      mobiles.push({ mobileNo: element.mobileNo, mobileStatus: element.status });
    });
    this.eligibleMobiles = mobiles;
  }

  onComplete(eligibleMobile: EligibleMobile) {
    this.selectMobileNo = eligibleMobile;
  }

  onBack() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_CUSTOMER_INFO_PAGE]);
  }

  onNext() {
    this.transaction.data.simCard = { mobileNo: this.selectMobileNo.mobileNo, persoSim: false };
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_CHANGE_PACKAGE_PAGE]);
  }

  onHome() {
    this.homeService.goToHome();
  }


// tslint:disable-next-line: use-life-cycle-interface
  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}

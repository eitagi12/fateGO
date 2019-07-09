import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { EligibleMobile, AlertService, HomeService } from 'mychannel-shared-libs';
import {
  ROUTE_ORDER_PRE_TO_POST_CURRENT_INFO_PAGE,
  ROUTE_ORDER_PRE_TO_POST_VALIDATE_CUSTOMER_ID_CARD_PAGE,
  ROUTE_ORDER_PRE_TO_POST_VERIFY_DOCUMENT_PAGE,
  ROUTE_ORDER_PRE_TO_POST_PASSPORT_INFO_PAGE
} from '../../constants/route-path.constant';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from 'ngx-store';
import { Transaction, TransactionAction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { WIZARD_ORDER_PRE_TO_POST } from 'src/app/order/constants/wizard.constant';

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
  selector: 'app-order-pre-to-post-eligible-mobile-page',
  templateUrl: './order-pre-to-post-eligible-mobile-page.component.html',
  styleUrls: ['./order-pre-to-post-eligible-mobile-page.component.scss']
})
export class OrderPreToPostEligibleMobilePageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_ORDER_PRE_TO_POST;
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
        const prepaidMobileList = resp.data.prepaidMobileList || [];
        const mobileList = prepaidMobileList.filter((order: any) => {
          return ['Submit for Approve', 'Pending', 'Submitted', 'Request',
            'Saveteam', 'QueryBalance', 'Response', 'Notification', 'BAR Processing',
            'BAR', 'Terminating'].find((statusCode: any) => {
              return statusCode !== order.statusCode && order.servicePackageId !== '8';
            });
        });
        this.mapPrepaidMobileNo(mobileList);
      })
      .catch(() => {
        this.eligibleMobiles = [];
      });
  }

  mapPrepaidMobileNo(mobileList: { forEach: (arg0: (element: any) => void) => void; }): void {
    const mobiles: Array<EligibleMobile> = new Array<EligibleMobile>();
    mobileList.forEach(element => {
      mobiles.push({ mobileNo: element.mobileNo, mobileStatus: element.status });
    });
    this.eligibleMobiles = mobiles;
  }

  onComplete(eligibleMobile: EligibleMobile): void {
    this.selectMobileNo = eligibleMobile;
  }

  onBack(): void {
    const action = this.transaction.data.action;
    if (action === TransactionAction.READ_PASSPORT) {
      this.router.navigate([ROUTE_ORDER_PRE_TO_POST_PASSPORT_INFO_PAGE]);
    } else {
      this.router.navigate([ROUTE_ORDER_PRE_TO_POST_VERIFY_DOCUMENT_PAGE]);
    }
  }

  onNext(): void {

    this.transaction.data.simCard = { mobileNo: this.selectMobileNo.mobileNo, persoSim: false };
    this.router.navigate([ROUTE_ORDER_PRE_TO_POST_CURRENT_INFO_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}

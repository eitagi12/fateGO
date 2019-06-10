import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { EligibleMobile, HomeService, ShoppingCart, PageLoadingService } from 'mychannel-shared-libs';
import { HttpClient } from '@angular/common/http';

import { WIZARD_DEVICE_ORDER_AIS } from '../../../../constants/wizard.constant';
import {
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_PAYMENT_DETAIL_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_CURRENT_INFO_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_VALIDATE_CUSTOMER_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_VALIDATE_CUSTOMER_ID_CARD_PAGE
} from '../../constants/route-path.constant';

import { Transaction, TransactionAction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PrivilegeService } from 'src/app/device-order/services/privilege.service';

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
  selector: 'app-device-order-ais-pre-to-post-eligible-mobile-page',
  templateUrl: './device-order-ais-pre-to-post-eligible-mobile-page.component.html',
  styleUrls: ['./device-order-ais-pre-to-post-eligible-mobile-page.component.scss']
})
export class DeviceOrderAisPreToPostEligibleMobilePageComponent implements OnInit, OnDestroy {

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
    private homeService: HomeService,
    private privilegeService: PrivilegeService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private shoppingCartService: ShoppingCartService,
    private pageLoadingService: PageLoadingService,
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    delete this.shoppingCart.mobileNo;
    if (this.transaction.data.customer) {
      const idCardNo = this.transaction.data.customer.idCardNo;
      const ussdCode = this.priceOption.trade.ussdCode;

      this.http.post('/api/customerportal/query-eligible-mobile-list', {
        idCardNo: idCardNo,
        ussdCode: ussdCode,
        mobileType: `Pre-paid`
      }).toPromise()
        .then((response: any) => {
          const eMobileResponse = response.data;
          this.eligibleMobiles = eMobileResponse.prepaid || [];

        //   const prepaidMobileList: any = res.data.prepaidMobileList || [];
        //   mobileList = prepaidMobileList.filter((order: any) => {

        //     // tslint:disable-next-line:typedef
        //     return ['Submit for Approve', 'Pending', 'Submitted', 'Request',
        //       'Saveteam', 'QueryBalance', 'Response', 'Notification', 'BAR Processing',
        //       'BAR', 'Terminating'].find((statusCode: any) => {
        //         return statusCode !== order.statusCode;
        //       });
        //   });
        });

    } else {
      this.onBack();
    }
  }

  onComplete(eligibleMobile: EligibleMobile): void {
    this.selectMobileNo = eligibleMobile;
  }

  onBack(): void {
    const action = this.transaction.data.action;
    if (action === TransactionAction.READ_CARD) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_VALIDATE_CUSTOMER_ID_CARD_PAGE]);
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_VALIDATE_CUSTOMER_PAGE]);
    }
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    this.transaction.data.simCard = { mobileNo: this.selectMobileNo.mobileNo, persoSim: false };

    if (this.selectMobileNo.privilegeCode) {
      this.transaction.data.customer.privilegeCode = this.selectMobileNo.privilegeCode;
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_CURRENT_INFO_PAGE]);

    } else {
      const ussdCode = this.priceOption.trade.ussdCode;
      this.requestPrivilege(ussdCode);

    }
    this.pageLoadingService.closeLoading();
  }

  requestPrivilege(ussdCode: any): void {
    this.privilegeService.requestUsePrivilege
      (
        this.selectMobileNo.mobileNo, ussdCode,
        this.selectMobileNo.privilegeCode
      )
      .then((privilegeCode) => {
        this.transaction.data.customer.privilegeCode = privilegeCode;
        this.transaction.data.simCard = { mobileNo: this.selectMobileNo.mobileNo };
      })
      .then(() =>  this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_CURRENT_INFO_PAGE]));
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}

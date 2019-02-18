import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { HomeService, PageLoadingService, ApiRequestService, EligibleMobile } from 'mychannel-shared-libs';
import { ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CUSTOMER_INFO_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_MOBILE_DETAIL_PAGE } from 'src/app/device-order/ais/device-order-ais-existing-best-buy/constants/route-path.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';

@Component({
  selector: 'app-device-order-ais-existing-best-buy-eligible-mobile-page',
  templateUrl: './device-order-ais-existing-best-buy-eligible-mobile-page.component.html',
  styleUrls: ['./device-order-ais-existing-best-buy-eligible-mobile-page.component.scss']
})
export class DeviceOrderAisExistingBestBuyEligibleMobilePageComponent implements OnInit, OnDestroy {

  identityValid = true;
  transaction: Transaction;
  eligiblePrepaid: EligibleMobile[];
  eligiblePostpaid: EligibleMobile[];

  constructor(
    private router: Router,
    private homeService: HomeService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private apiRequestService: ApiRequestService,
    private http: HttpClient
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit() {
    this.getEligibleMobileNo();
  }

  onHome() {
    this.homeService.goToHome();
  }

  onBack() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CUSTOMER_INFO_PAGE]);
  }

  onNext() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_MOBILE_DETAIL_PAGE]);
  }

  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
  }

  getEligibleMobileNo() {
    const idCardNo = this.transaction.data.customer.idCardNo;
    // const trade = this.transaction.data.mainPromotion.trade;
    this.http.post('/api/customerportal/query-eligible-mobile-list', {
      idCardNo: '1100701704931',
      ussdCode: '*999*02#' || '*999*03*9#',
      mobileType: 'All'
    }).toPromise()
    .then((response: any) => {
      const eMobileResponse = response.data;
      if (eMobileResponse.postpaid.length > 0) {
        this.eligiblePostpaid = eMobileResponse.postpaid.map((eligibleMobile) => {
          return {
            mobileNo : eligibleMobile.mobileNo,
            mobileStatus : eligibleMobile.mobileStatus,
          };
        });
      }
      if (eMobileResponse.prepaid.length > 0) {
        this.eligiblePrepaid = eMobileResponse.prepaid.map((eligibleMobile) => {
          return {
            mobileNo : eligibleMobile.mobileNo,
            mobileStatus : eligibleMobile.mobileStatus,
          };
        });
      }
    });

  }

}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { HomeService, PageLoadingService, ApiRequestService, EligibleMobile } from 'mychannel-shared-libs';
import { ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CUSTOMER_INFO_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_MOBILE_DETAIL_PAGE } from 'src/app/device-order/ais/device-order-ais-existing-best-buy/constants/route-path.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';

@Component({
  selector: 'app-device-order-ais-existing-best-buy-eligible-mobile-page',
  templateUrl: './device-order-ais-existing-best-buy-eligible-mobile-page.component.html',
  styleUrls: ['./device-order-ais-existing-best-buy-eligible-mobile-page.component.scss']
})
export class DeviceOrderAisExistingBestBuyEligibleMobilePageComponent implements OnInit, OnDestroy {

  wizards = WIZARD_DEVICE_ORDER_AIS;

  identityValid = false;
  transaction: Transaction;
  eligiblePrepaid: any[];
  eligiblePostpaid: any[];
  mobileNo: any;
  errorMsg = 'ไม่พบหมายเลขที่รับสิทธิ์ได้ในโครงการนี้';

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
    this.transaction.data.customer.privilegeCode = this.mobileNo.privilegeCode || '';
    this.transaction.data.simCard = { mobileNo: this.mobileNo.mobileNo };
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_MOBILE_DETAIL_PAGE]);
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

  getEligibleMobileNo() {
    const idCardNo = this.transaction.data.customer.idCardNo;
    const trade = this.transaction.data.mainPromotion.trade;
    this.http.post('/api/customerportal/query-eligible-mobile-list', {
      idCardNo: idCardNo,
      ussdCode: '*999*02#', // trade.ussdCode ||
      mobileType: 'All'
    }).toPromise()
    .then((response: any) => {
      const eMobileResponse = response.data;
      this.eligiblePostpaid = eMobileResponse.postpaid;
      this.eligiblePrepaid = eMobileResponse.prepaid;
    });

  }

  onCompleted(mobileNo: any) {
    if (mobileNo) {
      this.identityValid = true;
      this.mobileNo = mobileNo;
    }
  }

}

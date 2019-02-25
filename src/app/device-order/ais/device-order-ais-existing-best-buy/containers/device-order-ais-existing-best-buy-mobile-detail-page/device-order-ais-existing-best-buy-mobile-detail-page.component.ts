import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { ApiRequestService, PageLoadingService, HomeService } from 'mychannel-shared-libs';
import { ROUTE_DEVICE_ORDER_AIS_BEST_BUY_ELIGIBLE_MOBILE_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_PAYMENT_DETAIL_PAGE } from 'src/app/device-order/ais/device-order-ais-existing-best-buy/constants/route-path.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';

@Component({
  selector: 'app-device-order-ais-existing-best-buy-mobile-detail-page',
  templateUrl: './device-order-ais-existing-best-buy-mobile-detail-page.component.html',
  styleUrls: ['./device-order-ais-existing-best-buy-mobile-detail-page.component.scss']
})
export class DeviceOrderAisExistingBestBuyMobileDetailPageComponent implements OnInit, OnDestroy {

  identityValid = true;
  transaction: Transaction;
  mobileInfo: MobileInfo;

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
  }

  onHome() {
    this.homeService.goToHome();
  }

  onBack() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_ELIGIBLE_MOBILE_PAGE]);
  }

  onNext() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_PAYMENT_DETAIL_PAGE]);
  }

  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
  }

  getMobileInfo() {
    const mobileNo = this.transaction.data.simCard.mobileNo;
    this.http.get(`/api/mobile-detail/${mobileNo}`).toPromise().then((response) => {
      const mobileDetail = response.data || {};
      const serviceYear = mobileDetail.serviceYear;
      this.mobileInfo = {
        mobileNo: mobileNo,
        chargeType: this.mapChargeType(mobileDetail.chargeType),
        status: mobileDetail.mobileStatus,
        sagment: mobileDetail.mobileSegment,
        serviceYear: `${serviceYear.year || ''} ปี ${serviceYear.month || ''} เดือน ${serviceYear.day || ''} วัน`,
        mainPackage: mobileDetail.packageTitle
      };
    });
  }


  mapChargeType(chargeType: string): string {
    if ('Post-paid' === chargeType) {
      return 'รายเดือน';
    } else {
      return 'เติมเงิน';
    }
  }

}

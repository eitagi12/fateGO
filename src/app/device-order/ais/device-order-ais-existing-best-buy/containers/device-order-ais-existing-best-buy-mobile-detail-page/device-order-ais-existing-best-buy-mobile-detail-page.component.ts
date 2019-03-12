import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { ApiRequestService, PageLoadingService, HomeService, MobileInfo, ShoppingCart } from 'mychannel-shared-libs';
import { ROUTE_DEVICE_ORDER_AIS_BEST_BUY_ELIGIBLE_MOBILE_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_PAYMENT_DETAIL_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_VALIDATE_CUSTOMER_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_VALIDATE_CUSTOMER_REPI_PAGE } from 'src/app/device-order/ais/device-order-ais-existing-best-buy/constants/route-path.constant';
import { Transaction, TransactionAction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';

@Component({
  selector: 'app-device-order-ais-existing-best-buy-mobile-detail-page',
  templateUrl: './device-order-ais-existing-best-buy-mobile-detail-page.component.html',
  styleUrls: ['./device-order-ais-existing-best-buy-mobile-detail-page.component.scss']
})
export class DeviceOrderAisExistingBestBuyMobileDetailPageComponent implements OnInit, OnDestroy {

  wizards: any = WIZARD_DEVICE_ORDER_AIS;
  transaction: Transaction;
  mobileInfo: MobileInfo;
  shoppingCart: ShoppingCart;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private apiRequestService: ApiRequestService,
    private http: HttpClient,
    private shoppingCartService: ShoppingCartService
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    this.getMobileInfo();
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onBack(): void {
    const action = this.transaction.data.action;
    if (action === TransactionAction.KEY_IN || action === TransactionAction.READ_CARD) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_ELIGIBLE_MOBILE_PAGE]);
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_VALIDATE_CUSTOMER_PAGE]);
    }
  }

  onNext(): void {
    const action = this.transaction.data.action;
    if (action === TransactionAction.KEY_IN || action === TransactionAction.READ_CARD) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_PAYMENT_DETAIL_PAGE]);
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_VALIDATE_CUSTOMER_REPI_PAGE]);
    }
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

  getMobileInfo(): void {
    this.pageLoadingService.openLoading();
    const mobileNo = this.transaction.data.simCard.mobileNo;
    this.http.get(`/api/customerportal/mobile-detail/${mobileNo}`).toPromise().then((response: any) => {
      const mobileDetail = response.data || {};
      const serviceYear = mobileDetail.serviceYear;
      this.mobileInfo = {
        mobileNo: mobileNo,
        chargeType: this.mapChargeType(mobileDetail.chargeType),
        status: mobileDetail.mobileStatus,
        sagment: mobileDetail.mobileSegment,
        serviceYear: this.serviceYearWording(serviceYear.year, serviceYear.month, serviceYear.day),
        mainPackage: mobileDetail.packageTitle
      };

      this.transaction.data.simCard.chargeType = mobileDetail.chargeType;
      this.transaction.data.simCard.billingSystem = mobileDetail.billingSystem;
      this.pageLoadingService.closeLoading();
    });
  }

  mapChargeType(chargeType: string): 'รายเดือน' | 'เติมเงิน' {
    if ('Post-paid' === chargeType) {
      return 'รายเดือน';
    } else {
      return 'เติมเงิน';
    }
  }

  serviceYearWording(year: string, month: string, day: string): string {
    let serviceYearWording = '';
    if (year) {
      serviceYearWording = `${year || ''} ปี `;
    }

    if (month) {
      serviceYearWording += `${month} เดือน`;
    }

    if (day) {
      serviceYearWording += `${day} วัน`;
    }

    return serviceYearWording;
  }

}

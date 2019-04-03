import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, MobileInfo, ShoppingCart, PageLoadingService, AlertService } from 'mychannel-shared-libs';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import {
  ROUTE_DEVICE_ORDER_AIS_EXISTING_PAYMENT_DETAIL_PAGE,
  ROUTE_DEVICE_ORDER_AIS_EXISTING_ELIGIBLE_MOBILE_PAGE
} from '../../constants/route-path.constant';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { HttpClient } from '@angular/common/http';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';

@Component({
  selector: 'app-device-order-ais-existing-mobile-detail-page',
  templateUrl: './device-order-ais-existing-mobile-detail-page.component.html',
  styleUrls: ['./device-order-ais-existing-mobile-detail-page.component.scss']
})
export class DeviceOrderAisExistingMobileDetailPageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;
  transaction: Transaction;
  mobileInfo: MobileInfo;
  shoppingCart: ShoppingCart;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private http: HttpClient,
    private alertService: AlertService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private shoppingCartService: ShoppingCartService
  ) {
      this.transaction = this.transactionService.load();
   }

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    this.getMobileInfo();
  }

  getMobileInfo(): void {
    this.pageLoadingService.openLoading();
    const mobileNo = this.transaction.data.simCard.mobileNo;
    this.http.get(`/api/customerportal/mobile-detail/${mobileNo}`).toPromise()
    .then((response: any) => {
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
    }).catch(err => {
      this.pageLoadingService.closeLoading();
      this.alertService.error(err.error.resultDescription || `ระบบไม่สามารถแสดงข้อมูลได้ในขณะนี้`);
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

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_ELIGIBLE_MOBILE_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_PAYMENT_DETAIL_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

}

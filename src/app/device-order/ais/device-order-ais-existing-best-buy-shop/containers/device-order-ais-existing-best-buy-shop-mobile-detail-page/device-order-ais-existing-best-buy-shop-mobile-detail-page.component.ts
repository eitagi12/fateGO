import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { Transaction, TransactionAction } from 'src/app/shared/models/transaction.model';
import { MobileInfo, ShoppingCart, HomeService, PageLoadingService, BillingSystemType } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient } from '@angular/common/http';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_ELIGIBLE_MOBILE_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_VALIDATE_CUSTOMER_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_PAYMENT_DETAIL_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_VALIDATE_CUSTOMER_REPI_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-existing-best-buy-shop-mobile-detail-page',
  templateUrl: './device-order-ais-existing-best-buy-shop-mobile-detail-page.component.html',
  styleUrls: ['./device-order-ais-existing-best-buy-shop-mobile-detail-page.component.scss']
})
export class DeviceOrderAisExistingBestBuyShopMobileDetailPageComponent implements OnInit, OnDestroy {

  wizards: any = WIZARD_DEVICE_ORDER_AIS;
  transaction: Transaction;
  mobileInfo: MobileInfo;
  shoppingCart: ShoppingCart;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private http: HttpClient,
    private shoppingCartService: ShoppingCartService
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    if (this.transaction.data.action === TransactionAction.KEY_IN
      || this.transaction.data.action === TransactionAction.READ_CARD) {
        this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    }
    this.getMobileInfo();
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onBack(): void {
    const action = this.transaction.data.action;
    if (action === TransactionAction.KEY_IN || action === TransactionAction.READ_CARD) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_ELIGIBLE_MOBILE_PAGE]);
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_VALIDATE_CUSTOMER_PAGE]);
    }
  }

  onNext(): void {
    const action = this.transaction.data.action;
    if (action === TransactionAction.KEY_IN || action === TransactionAction.READ_CARD) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_PAYMENT_DETAIL_PAGE]);
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_VALIDATE_CUSTOMER_REPI_PAGE]);
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
      const serviceYear = mobileDetail.serviceYear || {};
      this.mobileInfo = {
        mobileNo: mobileNo,
        chargeType: this.mapChargeType(mobileDetail.chargeType),
        status: mobileDetail.mobileStatus,
        sagment: mobileDetail.mobileSegment,
        serviceYear: this.serviceYearWording(serviceYear.year || '0', serviceYear.month || '0', serviceYear.day || '0'),
        mainPackage: mobileDetail.packageTitle
      };

      this.transaction.data.simCard.chargeType = mobileDetail.chargeType;
      this.transaction.data.simCard.billingSystem = this.mapBillingSystem(mobileDetail.billingSystem, mobileDetail.chargeType);
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
      serviceYearWording = `${year || ''} ปี`;
    }

    if (month) {
      serviceYearWording += ` ${month} เดือน`;
    }

    if (day) {
      serviceYearWording += ` ${day} วัน`;
    }

    return serviceYearWording.trim();
  }

  mapBillingSystem(billingSystem: string, chargeType: string): string {
    if ((billingSystem === 'RTBS' && chargeType === 'Post-paid')) {
      return BillingSystemType.IRB;
    } else if (billingSystem === 'IRB' && chargeType === 'Pre-paid') {
      return 'RTBS';
    } else {
      return billingSystem;
    }
  }

}

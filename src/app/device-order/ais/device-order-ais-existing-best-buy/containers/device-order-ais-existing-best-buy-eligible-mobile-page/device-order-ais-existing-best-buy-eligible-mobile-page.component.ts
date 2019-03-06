import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { HomeService, PageLoadingService, ApiRequestService, EligibleMobile, AlertService, ShoppingCart } from 'mychannel-shared-libs';
import { ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CUSTOMER_INFO_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_MOBILE_DETAIL_PAGE } from 'src/app/device-order/ais/device-order-ais-existing-best-buy/constants/route-path.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { ShoppingCartService } from 'src/app/device-order/service/shopping-cart.service';

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
  shoppingCart: ShoppingCart;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private apiRequestService: ApiRequestService,
    private http: HttpClient,
    private alertService: AlertService,
    private shoppingCartService: ShoppingCartService
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit() {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    this.getEligibleMobileNo();
  }

  onHome() {
    this.homeService.goToHome();
  }

  onBack() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CUSTOMER_INFO_PAGE]);
  }

  onNext() {
    if (this.mobileNo.privilegeCode) {
      this.transaction.data.customer.privilegeCode = this.mobileNo.privilegeCode;
      this.transaction.data.simCard = { mobileNo: this.mobileNo.mobileNo };
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_MOBILE_DETAIL_PAGE]);
      return;
    }

    const trade = this.transaction.data.mainPromotion.trade;
    this.http.post('/api/salesportal/privilege/request-use-privilege', {
      msisdn: this.mobileNo.mobileNo,
      shortCode: trade.ussdCode
    }).toPromise()
    .then((response: any) => {
      const privilege = response.data;
      if (privilege && privilege.description && privilege.description.toUpperCase() === 'SUCCESS') {
        this.transaction.data.customer.privilegeCode = privilege.msgBarcode;
        this.transaction.data.simCard = { mobileNo: this.mobileNo.mobileNo };
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_MOBILE_DETAIL_PAGE]);
      } else {
        this.alertService.error(privilege.description);
      }
    }).catch((err) => {
      const errResponse: any = JSON.parse(err.data.response.developerMessage.replace('500 - ', ''));
      this.alertService.error(errResponse);
    });

  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

  getEligibleMobileNo() {
    const idCardNo = this.transaction.data.customer.idCardNo;
    const trade = this.transaction.data.mainPromotion.trade;
    this.http.post('/api/customerportal/query-eligible-mobile-list', {
      idCardNo: idCardNo,
      ussdCode: trade.ussdCode || '*999*02#',
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

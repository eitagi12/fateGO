import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { HomeService, PageLoadingService, ApiRequestService, EligibleMobile, AlertService, ShoppingCart } from 'mychannel-shared-libs';
import { ROUTE_DEVICE_ORDER_ASP_BEST_BUY_CUSTOMER_INFO_PAGE, ROUTE_DEVICE_ORDER_ASP_BEST_BUY_MOBILE_DETAIL_PAGE, ROUTE_DEVICE_ORDER_ASP_BEST_BUY_VALIDATE_CUSTOMER_ID_CARD_PAGE, ROUTE_DEVICE_ORDER_ASP_BEST_BUY_VALIDATE_CUSTOMER_PAGE } from 'src/app/device-order/asp/device-order-asp-existing-best-buy/constants/route-path.constant';
import { Transaction, Customer } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { CustomerInfoService } from '../../services/customer-info.service';
import { PrivilegeService } from '../../services/privilege.service';

@Component({
  selector: 'app-device-order-asp-existing-best-buy-eligible-mobile-page',
  templateUrl: './device-order-asp-existing-best-buy-eligible-mobile-page.component.html',
  styleUrls: ['./device-order-asp-existing-best-buy-eligible-mobile-page.component.scss']
})
export class DeviceOrderAspExistingBestBuyEligibleMobilePageComponent implements OnInit, OnDestroy {

  wizards: any = WIZARD_DEVICE_ORDER_AIS;

  identityValid: boolean = false;
  transaction: Transaction;
  eligiblePrepaid: any[];
  eligiblePostpaid: any[];
  mobileNo: any;
  errorMsg: string = 'ไม่พบหมายเลขที่รับสิทธิ์ได้ในโครงการนี้';
  shoppingCart: ShoppingCart;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private http: HttpClient,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private shoppingCartService: ShoppingCartService,
    private privilegeService: PrivilegeService,
    private customerInfoService: CustomerInfoService
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    this.getEligibleMobileNo();
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onBack(): void {
    if (this.transaction.data.customer.caNumber) {
      this.router.navigate([ROUTE_DEVICE_ORDER_ASP_BEST_BUY_CUSTOMER_INFO_PAGE]);
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_ASP_BEST_BUY_VALIDATE_CUSTOMER_PAGE]);
    }
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    const trade = this.transaction.data.mainPromotion.trade;
    this.privilegeService.requestUsePrivilege(this.mobileNo.mobileNo, trade.ussdCode, this.mobileNo.privilegeCode).then((privilegeCode) => {
      this.transaction.data.customer.privilegeCode = privilegeCode;
      this.transaction.data.simCard = { mobileNo: this.mobileNo.mobileNo };
      if (this.transaction.data.customer && this.transaction.data.customer.firstName === '-') {
        this.customerInfoService.getCustomerProfileByMobileNo(this.transaction.data.simCard.mobileNo,
          this.transaction.data.customer.idCardNo).then((customer: Customer) => {
            this.transaction.data.customer = { ...this.transaction.data.customer, ...customer };
            this.pageLoadingService.closeLoading();
            this.router.navigate([ROUTE_DEVICE_ORDER_ASP_BEST_BUY_MOBILE_DETAIL_PAGE]);
          });
      } else {
        this.pageLoadingService.closeLoading();
        this.router.navigate([ROUTE_DEVICE_ORDER_ASP_BEST_BUY_MOBILE_DETAIL_PAGE]);
      }
    });
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

  getEligibleMobileNo(): void {
    const idCardNo = this.transaction.data.customer.idCardNo;
    const trade = this.transaction.data.mainPromotion.trade;
    this.http.post('/api/customerportal/query-eligible-mobile-list', {
      idCardNo: idCardNo,
      ussdCode: trade.ussdCode,
      mobileType: 'All'
    }).toPromise()
      .then((response: any) => {
        const eMobileResponse = response.data;
        this.eligiblePostpaid = eMobileResponse.postpaid;
        this.eligiblePrepaid = eMobileResponse.prepaid;
      });

  }

  onCompleted(mobileNo: any): void {
    if (mobileNo) {
      this.identityValid = true;
      this.mobileNo = mobileNo;
    }
  }

}

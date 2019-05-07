import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { HomeService, PageLoadingService, ApiRequestService, EligibleMobile, AlertService, ShoppingCart, TokenService } from 'mychannel-shared-libs';
import { ROUTE_DEVICE_ORDER_ASP_BEST_BUY_CUSTOMER_INFO_PAGE, ROUTE_DEVICE_ORDER_ASP_BEST_BUY_MOBILE_DETAIL_PAGE, ROUTE_DEVICE_ORDER_ASP_BEST_BUY_VALIDATE_CUSTOMER_ID_CARD_PAGE, ROUTE_DEVICE_ORDER_ASP_BEST_BUY_VALIDATE_CUSTOMER_PAGE } from 'src/app/device-order/asp/device-order-asp-existing-best-buy/constants/route-path.constant';
import { Transaction, Customer } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { WIZARD_DEVICE_ORDER_AIS, WIZARD_DEVICE_ORDER_ASP } from 'src/app/device-order/constants/wizard.constant';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PrivilegeService } from 'src/app/device-order/services/privilege.service';
import { CustomerInfoService } from 'src/app/device-order/services/customer-info.service';

@Component({
  selector: 'app-device-order-asp-existing-best-buy-eligible-mobile-page',
  templateUrl: './device-order-asp-existing-best-buy-eligible-mobile-page.component.html',
  styleUrls: ['./device-order-asp-existing-best-buy-eligible-mobile-page.component.scss']
})
export class DeviceOrderAspExistingBestBuyEligibleMobilePageComponent implements OnInit, OnDestroy {

  wizards: any = this.tokenService.isTelewizUser() ? WIZARD_DEVICE_ORDER_ASP : WIZARD_DEVICE_ORDER_AIS;
  active: number = this.tokenService.isTelewizUser() ? 3 : 2;

  identityValid: boolean = false;
  transaction: Transaction;
  priceOption: PriceOption;
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
    private customerInfoService: CustomerInfoService,
    private priceOptionService: PriceOptionService,
    private tokenService: TokenService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
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
    const trade = this.priceOption.trade;
    this.privilegeService.requestUsePrivilege(this.mobileNo.mobileNo, trade.ussdCode, this.mobileNo.privilegeCode).then((privilegeCode) => {
      this.transaction.data.customer.privilegeCode = privilegeCode;
      this.transaction.data.simCard = { mobileNo: this.mobileNo.mobileNo };
      if (!this.transaction.data.customer || !this.transaction.data.customer.firstName) {
        return this.customerInfoService.getCustomerProfileByMobileNo(this.transaction.data.simCard.mobileNo,
          this.transaction.data.customer.idCardNo).then((customer: Customer) => {
            this.transaction.data.customer = { ...this.transaction.data.customer, ...customer };
          });
      }
    }).then(() => {
      this.pageLoadingService.closeLoading();
      this.router.navigate([ROUTE_DEVICE_ORDER_ASP_BEST_BUY_MOBILE_DETAIL_PAGE]);
    });
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

  getEligibleMobileNo(): void {
    const idCardNo = this.transaction.data.customer.idCardNo;
    const trade = this.priceOption.trade;
    this.http.post('/api/customerportal/query-eligible-mobile-list', {
      idCardNo: idCardNo,
      ussdCode: trade.ussdCode,
      mobileType: 'All'
    }).toPromise()
      .then((response: any) => {
        const eMobileResponse = response.data;
        this.eligiblePostpaid = eMobileResponse.postpaid;
        this.eligiblePrepaid = eMobileResponse.prepaid;
      }).catch(() => {
        this.eligiblePostpaid = [];
        this.eligiblePrepaid = [];
      });
  }

  onCompleted(mobileNo: any): void {
    if (mobileNo) {
      this.identityValid = true;
      this.mobileNo = mobileNo;
    }
  }

}

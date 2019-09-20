import { Component, OnInit, OnDestroy } from '@angular/core';
import { EligibleMobile, HomeService, ShoppingCart, PageLoadingService, AlertService } from 'mychannel-shared-libs';
import { Transaction, BillingAccount } from 'src/app/shared/models/transaction.model';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
// tslint:disable-next-line: max-line-length
// import { ROUTE_DEVICE_ORDER_AIS_MNP_CUSTOMER_INFO_PAGE, ROUTE_DEVICE_ORDER_AIS_MNP_MOBILE_DETAIL_PAGE } from '../../constants/route-path.constant';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { PrivilegeService } from 'src/app/device-order/services/privilege.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { CheckChangeServiceService } from 'src/app/device-order/services/check-change-service.service';

@Component({
  selector: 'app-new-register-mnp-eligible-mobile-page',
  templateUrl: './new-register-mnp-eligible-mobile-page.component.html',
  styleUrls: ['./new-register-mnp-eligible-mobile-page.component.scss']
})
export class NewRegisterMnpEligibleMobilePageComponent implements OnInit, OnDestroy {
  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;

  eligibleMobiles: Array<EligibleMobile>;
  selectMobileNo: EligibleMobile;
  transaction: Transaction;
  priceOption: PriceOption;
  billingAccountList: Array<BillingAccount>;
  billingNetExtremeList: Array<BillingAccount>;
  shoppingCart: ShoppingCart;
  constructor(private router: Router,
    private http: HttpClient,
    private homeService: HomeService,
    private privilegeService: PrivilegeService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private shoppingCartService: ShoppingCartService,
    private pageLoadingService: PageLoadingService,
    private alertService: AlertService,
    private checkChangeService: CheckChangeServiceService) {
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
        mobileType: `Post-paid`
      }).toPromise()
        .then((response: any) => {
          const eMobileResponse = response.data;
          this.eligibleMobiles = eMobileResponse.postpaid || [];
        });

    } else {
      this.onBack();
    }
  }
  onComplete(eligibleMobile: EligibleMobile): void {
    this.selectMobileNo = eligibleMobile;
  }

  onBack(): void {
    // this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_CUSTOMER_INFO_PAGE]);
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    this.transaction.data.simCard = { mobileNo: this.selectMobileNo.mobileNo, persoSim: false };

    if (this.selectMobileNo.privilegeCode) {
      this.transaction.data.customer.privilegeCode = this.selectMobileNo.privilegeCode;
      this.checkKnoxGuard();
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
      .then(() => this.checkKnoxGuard());
  }

  checkKnoxGuard(): void {
    const isKnoxGuard: boolean = this.priceOption.trade && this.priceOption.trade.serviceLockHs;
    if (isKnoxGuard) {
      this.checkChangeService.CheckServiceKnoxGuard(this.selectMobileNo.mobileNo).then(() => {
        this.pageLoadingService.closeLoading();
        // this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_MOBILE_DETAIL_PAGE]);
      }).catch((resp) => {
        this.alertService.error(resp);
      });
    } else {
      this.pageLoadingService.closeLoading();
      // this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_MOBILE_DETAIL_PAGE]);
    }
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

}

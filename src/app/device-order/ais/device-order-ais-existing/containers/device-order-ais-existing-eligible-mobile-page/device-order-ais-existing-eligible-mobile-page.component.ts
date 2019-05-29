import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { HomeService, ShoppingCart, PageLoadingService, BillingSystemType, AlertService } from 'mychannel-shared-libs';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import {
  ROUTE_DEVICE_ORDER_AIS_EXISTING_CUSTOMER_INFO_PAGE,
  ROUTE_DEVICE_ORDER_AIS_EXISTING_CHANGE_PACKAGE_PAGE,
  ROUTE_DEVICE_ORDER_AIS_EXISTING_MOBILE_DETAIL_PAGE,
  ROUTE_DEVICE_ORDER_AIS_EXISTING_NON_PACKAGE_PAGE
} from '../../constants/route-path.constant';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { HttpClient } from '@angular/common/http';
import { PrivilegeService } from 'src/app/device-order/services/privilege.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { PromotionShelveService } from 'src/app/device-order/services/promotion-shelve.service';
import { CheckChangeServiceService } from 'src/app/device-order/services/check-change-service.service';

export interface BillingAccount {
  billingName: string;
  mobileNo: string[];
  billCycleFrom: string;
  billCycleTo: string;
  payDate: string;
  billingAddr: string;
  billAcctNo: string;
  bill: string;
  productPkg: string;
  billMedia: string;
}

interface EligibleMobile {
  mobileNo: string;
  mobileStatus: 'Active' | 'Suspended';
  privilegeCode?: string;
  privilegeMessage?: string;
}

@Component({
  selector: 'app-device-order-ais-existing-eligible-mobile-page',
  templateUrl: './device-order-ais-existing-eligible-mobile-page.component.html',
  styleUrls: ['./device-order-ais-existing-eligible-mobile-page.component.scss']
})
export class DeviceOrderAisExistingEligibleMobilePageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;
  eligibleMobiles: Array<EligibleMobile>;
  selectMobileNo: EligibleMobile;
  transaction: Transaction;
  priceOption: PriceOption;
  billingAccountList: Array<BillingAccount>;
  billingNetExtremeList: Array<BillingAccount>;
  shoppingCart: ShoppingCart;

  constructor(
    private router: Router,
    private http: HttpClient,
    private transactionService: TransactionService,
    private homeService: HomeService,
    private priceOptionService: PriceOptionService,
    private privilegeService: PrivilegeService,
    private pageLoadingService: PageLoadingService,
    private shoppingCartService: ShoppingCartService,
    private promotionShelveService: PromotionShelveService,
    private alertService: AlertService,
    private checkChangeService: CheckChangeServiceService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();

    delete this.transaction.data.currentPackage;
    delete this.transaction.data.promotionsShelves;
    delete this.transaction.data.contractFirstPack;
  }

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    delete this.shoppingCart.mobileNo;
    if (this.transaction.data.customer) {
      const idCardNo = this.transaction.data.customer.idCardNo;
      const ussdCode = this.priceOption.trade.ussdCode;

      this.callQueryEligibleMobileListService(idCardNo, ussdCode);
    } else {
      this.onBack();
    }
  }

  callQueryEligibleMobileListService(idCardNo: string, ussdCode: any): void {
    this.http.post('/api/customerportal/query-eligible-mobile-list', {
      idCardNo: idCardNo,
      ussdCode: ussdCode,
      mobileType: `Post-paid`,
      chkMainProFlg: true
    }).toPromise()
      .then((response: any) => {
        const eMobileResponse = response.data;
        this.eligibleMobiles = eMobileResponse.postpaid || [];
      });
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    this.transaction.data.simCard = { mobileNo: this.selectMobileNo.mobileNo, persoSim: false };

    this.callService()
      .then(promotionsShelves => this.checkRouteNavigate(promotionsShelves))
      .then(() => this.pageLoadingService.closeLoading());
  }

  checkRouteNavigate(promotionsShelves: any): void {
    if (this.havePackages(promotionsShelves) || this.notMathCritiriaMainPro()) {
      if (this.selectMobileNo.privilegeCode) {
        this.transaction.data.customer.privilegeCode = this.selectMobileNo.privilegeCode;
        this.checkKnoxGuard();

      } else if (this.isCritiriaMainPro) {
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_CHANGE_PACKAGE_PAGE]);

      } else {
        const ussdCode = this.priceOption.trade.ussdCode;
        this.requestPrivilege(ussdCode);

      }
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_NON_PACKAGE_PAGE]);
    }
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

  callService(): Promise<any> {
    const trade: any = this.priceOption.trade;
    const privilege: any = this.priceOption.privilege;
    const billingSystem = (this.transaction.data.simCard.billingSystem === 'RTBS')
      ? BillingSystemType.IRB : this.transaction.data.simCard.billingSystem || BillingSystemType.IRB;

    return this.callQueryContractFirstPackAndGetPromotionShelveServices(trade, billingSystem, privilege);
  }

  callQueryContractFirstPackAndGetPromotionShelveServices(trade: any, billingSystem: string, privilege: any): Promise<any> {
    return this.http.post(`/api/salesportal/query/contract-first-pack`, {
      option: '3',
      mobileNo: this.selectMobileNo.mobileNo || '',
      idCardNo: this.transaction.data.customer.idCardNo || '',
      profileType: 'All'
    }).toPromise()
      .then((resp: any) => {
        const contract = resp.data || {};
        if (contract) {
          this.transaction.data.contractFirstPack = contract;
        }
        return this.callGetPromotionShelveService(trade, billingSystem, privilege, contract);
      });
  }

  callGetPromotionShelveService(trade: any, billingSystem: string, privilege: any, contract: any): any[] | PromiseLike<any[]> {
    return this.promotionShelveService.getPromotionShelve({
      packageKeyRef: trade.packageKeyRef,
      orderType: `Change Service`,
      billingSystem: billingSystem
    }, +privilege.minimumPackagePrice, +privilege.maximumPackagePrice)
      .then((promotionShelves: any) => this.filterPromotions(promotionShelves, contract));
  }

  filterPromotions(promotionShelves: any = [], contract: any = {}): any[] {
    (promotionShelves || [])
    .forEach((promotionShelve: any) => {
      promotionShelve.promotions = (promotionShelve.promotions || [])
      .filter((promotion: any) => {
        promotion.items = this.filterItemsByFirstPackageAndInGroup(promotion, contract);
        return promotion.items.length > 0;
      });
    });
    return promotionShelves;

  }

  filterItemsByFirstPackageAndInGroup(promotion: any, contract: any): any {
    return (promotion.items || [])
      .filter((item: {
        value: {
          customAttributes: {
            priceExclVat: number;
            productPkg: any;
          };
        };
      }) => {
        const contractFirstPack = item.value.customAttributes.priceExclVat
          >= Math.max(contract.firstPackage || 0, contract.minPrice || 0, contract.initialPackage || 0);
        const inGroup = contract.inPackage.length > 0 ? contract.inPackage
          .some((inPack: any) => inPack === item.value.customAttributes.productPkg) : true;
        return contractFirstPack && inGroup;
      });
  }

  havePackages(promotionsShelves: any): boolean {
    return (promotionsShelves || []).length > 0
      && promotionsShelves.some(promotionsShelve => promotionsShelve.promotions.length > 0);

  }

  notMathCritiriaMainPro(): boolean {
    return !this.advancePay && !(this.selectMobileNo.privilegeMessage === `MT_INVALID_CRITERIA_MAINPRO`);
  }

  get isCritiriaMainPro(): boolean {
    return !this.advancePay && this.selectMobileNo.privilegeMessage === `MT_INVALID_CRITERIA_MAINPRO`;

  }

  get advancePay(): boolean {
    return !!(+(this.priceOption.trade.advancePay && this.priceOption.trade.advancePay.amount || 0) > 0);

  }

  onComplete(eligibleMobile: EligibleMobile): void {
    this.selectMobileNo = eligibleMobile;
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_CUSTOMER_INFO_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

  checkKnoxGuard(): void {
    const isKnoxGuard: boolean = (this.priceOption.trade && this.priceOption.trade.serviceLockHs &&
      this.priceOption.trade.serviceLockHs === 'KG');
    if (isKnoxGuard) {
      this.checkChangeService.CheckServiceKnoxGuard(this.selectMobileNo.mobileNo).then(() => {
        this.pageLoadingService.closeLoading();
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_MOBILE_DETAIL_PAGE]);
      }).catch((resp) => {
        this.alertService.error(resp);
      });
    } else {
      this.pageLoadingService.closeLoading();
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_MOBILE_DETAIL_PAGE]);
    }
  }
}

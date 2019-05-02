import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { HomeService, ShoppingCart, PageLoadingService, BillingSystemType } from 'mychannel-shared-libs';
import { Transaction, Customer } from 'src/app/shared/models/transaction.model';
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
import { CustomerInfoService } from 'src/app/device-order/services/customer-info.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { PromotionShelveService } from 'src/app/device-order/services/promotion-shelve.service';

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

  idCardNo: string;

  constructor(
    private router: Router,
    private http: HttpClient,
    private transactionService: TransactionService,
    private homeService: HomeService,
    private priceOptionService: PriceOptionService,
    private privilegeService: PrivilegeService,
    private pageLoadingService: PageLoadingService,
    private customerInfoService: CustomerInfoService,
    private shoppingCartService: ShoppingCartService,
    private promotionShelveService: PromotionShelveService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();

    delete this.transaction.data.currentPackage;
    delete this.transaction.data.promotionsShelves;
    delete this.transaction.data.contractFirstPack;
  }

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();

    if (this.transaction.data.customer) {
      this.idCardNo = this.transaction.data.customer.idCardNo;
      const ussdCode = this.priceOption.trade.ussdCode;

      this.http.post('/api/customerportal/query-eligible-mobile-list', {
        idCardNo: this.idCardNo,
        ussdCode: ussdCode,
        mobileType: `Post-paid`,
        chkMainProFlg: true
      }).toPromise()
        .then((response: any) => {
          const eMobileResponse = response.data;
          this.eligibleMobiles = eMobileResponse.postpaid || [];
        });

    } else {
      this.onBack();
    }
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    this.transaction.data.simCard = { mobileNo: this.selectMobileNo.mobileNo, persoSim: false };

    this.callService()
      .then(promotionsShelves => {

        if (this.havePackages(promotionsShelves) || this.isNotMathCritiriaMainPro) {
          this.router.navigate([this.setNavigatePathAndRequestPrivilege()]);

        } else {
          this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_NON_PACKAGE_PAGE]);
        }

      })
      .then(() => this.pageLoadingService.closeLoading());
  }

  setNavigatePathAndRequestPrivilege(): string {
    if (this.selectMobileNo.privilegeCode) {
      this.transaction.data.customer.privilegeCode = this.selectMobileNo.privilegeCode;
      return ROUTE_DEVICE_ORDER_AIS_EXISTING_MOBILE_DETAIL_PAGE;

    } else if (this.isCritiriaMainPro) {
      return ROUTE_DEVICE_ORDER_AIS_EXISTING_CHANGE_PACKAGE_PAGE;

    } else {
      const ussdCode = this.priceOption.trade.ussdCode;
      this.requestPrivilege(ussdCode);

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

        if (this.transaction.data.customer && this.transaction.data.customer.firstName === '-') {

          this.customerInfoService.getCustomerProfileByMobileNo
            (
              this.transaction.data.simCard.mobileNo,
              this.transaction.data.customer.idCardNo
            )
            .then((customer: Customer) => {
              this.transaction.data.customer = { ...this.transaction.data.customer, ...customer };
            });
        }

      }).then(() => ROUTE_DEVICE_ORDER_AIS_EXISTING_MOBILE_DETAIL_PAGE);
  }

  callService(): Promise<any> {
    const trade: any = this.priceOption.trade;
    const privilege: any = this.priceOption.privilege;
    const billingSystem = (this.transaction.data.simCard.billingSystem === 'RTBS')
      ? BillingSystemType.IRB : this.transaction.data.simCard.billingSystem || BillingSystemType.IRB;

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

        return this.promotionShelveService.getPromotionShelve(
          {
            packageKeyRef: trade.packageKeyRef,
            orderType: `Change Service`,
            billingSystem: billingSystem
          },
          +privilege.minimumPackagePrice, +privilege.maximumPackagePrice)
          .then((promotionShelves: any) => {
            return this.filterPromotionByFirstPack(promotionShelves, contract);

          });

      });
  }

  filterPromotionByFirstPack(promotionShelves: any = [], contract: any = {}): any[] {
    (promotionShelves || []).forEach((promotionShelve: any) => {
      promotionShelve.promotions = (promotionShelve.promotions || []).filter((promotion: any) => {
        promotion.items = (promotion.items || [])
          .filter(item => {
            const contractFirstPack = item.value.customAttributes.priceExclVat
              >= Math.max(contract.firstPackage || 0, contract.minPrice || 0, contract.initialPackage || 0);

            const inGroup = contract.inPackage.length > 0 ? contract.inPackage
              .some(inPack => inPack === item.value.customAttributes.productPkg) : true;

            return contractFirstPack && inGroup;

          });
        return promotion.items.length > 0;

      });
    });
    return promotionShelves;

  }

  havePackages(promotionsShelves: any): boolean {
    return (promotionsShelves || []).length > 0
      && promotionsShelves.some(promotionsShelve => promotionsShelve.promotions.length > 0);

  }

  get isCritiriaMainPro(): boolean {
    return !this.mathHotDeal && !this.advancePay
      && this.selectMobileNo.privilegeMessage === `MT_INVALID_CRITERIA_MAINPRO`;

  }

  get isNotMathCritiriaMainPro(): boolean {
    return !this.mathHotDeal && !this.advancePay
      && this.selectMobileNo.privilegeMessage !== `MT_INVALID_CRITERIA_MAINPRO`;

  }

  get advancePay(): boolean {
    return !!((this.priceOption.trade.advancePay && this.priceOption.trade.advancePay.amount || 0) > 0);

  }

  get mathHotDeal(): boolean {
    return !!this.priceOption.campaign.campaignName.match(/\b(\w*Hot\s+Deal\w*)\b/);

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
}

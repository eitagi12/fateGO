import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { Transaction, TransactionAction, BillingAccount } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { ProfileFbb } from 'src/app/shared/models/profile-fbb.model';

import { MobileInfo, ShoppingCart, HomeService, PageLoadingService, BillingSystemType, AlertService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { PromotionShelveService } from 'src/app/device-order/services/promotion-shelve.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { CustomerInfoService } from 'src/app/device-order/services/customer-info.service';
import { ProfileFbbService } from 'src/app/shared/services/profile-fbb.service';
import { ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_ELIGIBLE_MOBILE_PAGE, ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_CUSTOMER_INFO_PAGE, ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_PAYMENT_DETAIL_PAGE, ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_VALIDATE_CUSTOMER_PAGE, ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_NON_PACKAGE_PAGE } from 'src/app/device-order/ais/device-order-ais-existing-gadget/constants/route-path.constant';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-device-order-ais-existing-gadget-mobile-detail-page',
  templateUrl: './device-order-ais-existing-gadget-mobile-detail-page.component.html',
  styleUrls: ['./device-order-ais-existing-gadget-mobile-detail-page.component.scss']
})
export class DeviceOrderAisExistingGadgetMobileDetailPageComponent implements OnInit, OnDestroy {

  wizards: any = WIZARD_DEVICE_ORDER_AIS;
  transaction: Transaction;
  priceOption: PriceOption;
  mobileInfo: MobileInfo;
  profileFbb: ProfileFbb;
  shoppingCart: ShoppingCart;
  mobileNo: string;
  disableNextButton: boolean;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private alertService: AlertService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private profileFbbService: ProfileFbbService,
    private http: HttpClient,
    private shoppingCartService: ShoppingCartService,
    private promotionShelveService: PromotionShelveService,
    private translateService: TranslateService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.profileFbb = this.profileFbbService.load();
    this.homeService.callback = () => {
      this.alertService.question('ต้องการยกเลิกรายการขายหรือไม่ การยกเลิก ระบบจะคืนสินค้าเข้าสต๊อคสาขาทันที', 'ตกลง', 'ยกเลิก')
        .then((response: any) => {
          if (response.value === true) {
            this.returnStock().then(() => {
              this.transactionService.remove();
              window.location.href = '/';
            });
          }
        });
    };
  }

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    this.mobileNo = this.transaction.data.simCard.mobileNo;
    this.callServiceMobileDetail();
  }

  callServiceMobileDetail(): void {
    this.pageLoadingService.openLoading();
    this.http.get(`/api/customerportal/mobile-detail/${this.mobileNo}`).toPromise()
      .then((response: any) => {
        const mobileDetail = response.data;
        this.mappingMobileDetail(mobileDetail);
      }).then(() => this.pageLoadingService.closeLoading());
  }

  mappingMobileDetail(mobileDetail: any): any {
    const serviceYear = mobileDetail.serviceYear;
    const mainPack =  mobileDetail.futurePackage ? mobileDetail.futurePackage : mobileDetail.package;
    this.mobileInfo = this.mappingMobileInfo(mobileDetail, serviceYear, mainPack);
    this.transaction.data.simCard = {
      mobileNo: this.mobileNo,
      chargeType: mobileDetail.chargeType,
      billingSystem: mobileDetail.billingSystem,
    };
    if (mainPack) {
      this.disableNextButton = false;
      this.transaction.data.currentPackage = mainPack;
    } else {
      this.disableNextButton = true;
    }
    this.transaction.data.onTopPackage = mobileDetail.packageOntop;
  }

  mappingMobileInfo(mobileDetail: any, serviceYear: any, mainPack: any): MobileInfo {
    return {
      mobileNo: this.mobileNo || mobileDetail.mobileNo,
      chargeType: this.mapChargeType(mobileDetail.chargeType),
      status: mobileDetail.mobileStatus,
      sagment: mobileDetail.mobileSegment,
      serviceYear: this.serviceYearWording(serviceYear.year, serviceYear.month, serviceYear.day),
      mainPackage: this.changeMainPackageLangauge(mainPack)
    };
  }

  changeMainPackageLangauge(mainPack: any = {}): string {
    return (this.translateService.currentLang === 'EN') ? mainPack.titleEng : mainPack.title;
  }

  mapChargeType(chargeType: string): any {
    if ('Post-paid' === chargeType) {
      return this.isEngLanguage() ? 'Postpaid' : 'รายเดือน';
    } else {
      return this.isEngLanguage() ? 'Prepaid' : 'เติมเงิน';
    }
  }

  serviceYearWording(year: string, month: string, day: string): string {
    let serviceYearWording = '';
    if (year) {
      serviceYearWording = this.isEngLanguage() ? `${year || ''} year ` : `${year || ''} ปี `;
    }

    if (month) {
      serviceYearWording += this.isEngLanguage() ? `${month} month ` : `${month} เดือน `;
    }

    if (day) {
      serviceYearWording += this.isEngLanguage() ? `${day} day` : `${month} วัน`;
    }

    return serviceYearWording;
  }

  isEngLanguage(): boolean {
    return this.translateService.currentLang === 'EN';
  }

  havePackages(promotionsShelves: any): boolean {
    return (promotionsShelves || []).length > 0
      && promotionsShelves.some(promotionsShelve => promotionsShelve.promotions.length > 0);

  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onBack(): void {
    const action = this.transaction.data.action;
    if (action === TransactionAction.KEY_IN_MOBILE_NO) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_VALIDATE_CUSTOMER_PAGE]);
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_ELIGIBLE_MOBILE_PAGE]);
    }
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    this.mappingMobileBillAccountAndIsAirtimeAndCheckWarning(this.mobileNo);
  }

  mappingMobileBillAccountAndIsAirtimeAndCheckWarning(mobileNo: string): void {
    const { mobileBillAccount, isAirtime }: {
      mobileBillAccount: string[];
      isAirtime: boolean;
    } = this.mappingMobileBillAccountAndIsAirtime(mobileNo);
    this.checkWarningBillingAccountMessage(mobileBillAccount, isAirtime);
  }

  mappingMobileBillAccountAndIsAirtime(mobileNo: string): {
    mobileBillAccount: string[];
    isAirtime: boolean;
  } {
    const billCycles = this.transaction.data.billingInformation.billCycles;
    const billingAccountList: any = [];
    const mobileNoList: any = [];

    billCycles.forEach((list: any) => billingAccountList.push(list));
    billingAccountList.forEach((billings: { mobileNo: any; }) => mobileNoList.push(billings.mobileNo));

    let isAirtime: boolean = false;
    if (this.priceOption.trade) {
      const trade = this.priceOption.trade;
      isAirtime = !!(trade.advancePay.amount > 0);
    }

    const mobileBillAccount = this.mapBillingCyclesByMobileNo(billCycles, mobileNo);
    return { mobileBillAccount, isAirtime };
  }

  mapBillingCyclesByMobileNo(billCycles: BillingAccount[], mobileNo: string): string[] {
    return billCycles.map(billcycle => billcycle.mobileNo).find((mobile) => mobile.includes(mobileNo));
  }

  checkWarningBillingAccountMessage(mobileBillAccount: string[], isAirtime: boolean): void {
    if (mobileBillAccount && mobileBillAccount.length > 1 && isAirtime) {
      this.alertService.warning('หมายเลขนี้มีการรวมบิล ไม่สามารถทำรายการได้');
    } else {
      this.transaction.data.billingInformation.isNewBAFlag = false;
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_PAYMENT_DETAIL_PAGE]);

      /* ยกเลิกเช็ค contract firstpack รอคุย solution การเปลี่ยน main pro ที่ MC
       this.mappingMobileDetailAndPromotion(); */
    }
  }

  mappingMobileDetailAndPromotion(): void {
    this.callQueryContractFirstPackAndGetPromotionShelveServices()
      .then(promotionsShelves => {
        if (this.havePackages(promotionsShelves)) {
          this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_PAYMENT_DETAIL_PAGE]);
        } else {
          this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_NON_PACKAGE_PAGE]);
        }
      }).then(() => {
        this.pageLoadingService.closeLoading();
      });
  }

  callQueryContractFirstPackAndGetPromotionShelveServices(): Promise<any> {
    const trade: any = this.priceOption.trade;
    const privilege: any = this.priceOption.privilege;
    const billingSystem = 'All';
    return this.http.post(`/api/salesportal/query/contract-first-pack`, {
      option: '1',
      mobileNo: this.mobileNo,
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
      .filter((item: any) => {
        const customAttributes: any = item && (item.value || {}).customAttributes || {};
        const contractFirstPack = item.value.customAttributes.priceExclVat
          >= Math.max(contract.firstPackage || 0, contract.minPrice || 0, contract.initialPackage || 0);
        const inGroup = contract.inPackage.length > 0 ? contract.inPackage
          .some((inPack: any) => inPack === item.value.customAttributes.productPkg) : true;
        return contractFirstPack && inGroup && !this.mathCurrentPackage(customAttributes);
      });
  }

  mathCurrentPackage(customAttributes: any = {}): boolean {
    return !this.advancePay
      && this.transaction.data.currentPackage
      && this.transaction.data.currentPackage.promotionCode === customAttributes.promotionCode;
  }

  get advancePay(): boolean {
    return !!(+(this.priceOption.trade.advancePay && +this.priceOption.trade.advancePay.amount || 0) > 0);
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

  returnStock(): Promise<void> {
    return new Promise(resolve => {
      const transaction = this.transactionService.load();
      const promiseAll = [];
      if (transaction.data) {
        if (transaction.data.order && transaction.data.order.soId) {
          const order = this.http.post('/api/salesportal/device-sell/item/clear-temp-stock', {
            location: this.priceOption.productStock.location,
            soId: transaction.data.order.soId,
            transactionId: transaction.transactionId
          }).toPromise().catch(() => Promise.resolve());
          promiseAll.push(order);
        }
      }
      Promise.all(promiseAll).then(() => resolve());
    });
  }
}

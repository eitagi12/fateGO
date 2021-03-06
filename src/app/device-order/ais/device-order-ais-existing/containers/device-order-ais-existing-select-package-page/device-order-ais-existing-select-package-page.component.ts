import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { Transaction, ExistingMobileCare, HandsetSim5G } from 'src/app/shared/models/transaction.model';
import { PromotionShelve, HomeService, PageLoadingService, ShoppingCart, BillingSystemType, AlertService } from 'mychannel-shared-libs';
import { BsModalRef } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient } from '@angular/common/http';
import {
  ROUTE_DEVICE_ORDER_AIS_EXISTING_PAYMENT_DETAIL_PAGE,
  ROUTE_DEVICE_ORDER_AIS_EXISTING_EFFECTIVE_START_DATE_PAGE,
  ROUTE_DEVICE_ORDER_AIS_EXISTING_MOBILE_CARE_PAGE,
  ROUTE_DEVICE_ORDER_AIS_EXISTING_MOBILE_CARE_AVAILABLE_PAGE
} from '../../constants/route-path.constant';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { PromotionShelveService } from 'src/app/device-order/services/promotion-shelve.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-device-order-ais-existing-select-package-page',
  templateUrl: './device-order-ais-existing-select-package-page.component.html',
  styleUrls: ['./device-order-ais-existing-select-package-page.component.scss']
})
export class DeviceOrderAisExistingSelectPackagePageComponent implements OnInit, OnDestroy {

  @ViewChild('conditionTemplate')
  conditionTemplate: any;

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;

  transaction: Transaction;
  priceOption: PriceOption;
  promotionShelves: PromotionShelve[];
  condition: any;
  selectCurrentPackage: boolean;
  modalRef: BsModalRef;
  shoppingCart: ShoppingCart;

  translateSubscription: Subscription;

  constructor(
    private router: Router,
    private http: HttpClient,
    private homeService: HomeService,
    private alertService: AlertService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private shoppingCartService: ShoppingCartService,
    private promotionShelveService: PromotionShelveService,
    private translateService: TranslateService,
  ) {
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();

    delete this.transaction.data.mainPackageOneLove;
    if (this.transaction.data.existingMobileCare) {
      delete this.transaction.data.existingMobileCare;
    }

    if (this.transaction.data.billingInformation) {
      delete this.transaction.data.billingInformation.billCycle;
      delete this.transaction.data.billingInformation.mergeBilling;
    }

    this.translateSubscription = this.translateService.onLangChange.subscribe((lang: any) => {
      if (this.promotionShelves) {
        this.checkTranslateLang(lang);
      }
    });
  }

  changePackageTitleLanguage(currentPackage: any = {}): string {
    return (this.translateService.currentLang === 'EN') ? currentPackage.titleEng : currentPackage.title;
  }

  changePackageDetailLanguage(currentPackage: any = {}): string {
    return (this.translateService.currentLang === 'EN') ? currentPackage.inStatementEng : currentPackage.inStatementThai;
  }

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    this.callService()
      .then(filterPromotionByContractFirstPack => this.defualtSelected(filterPromotionByContractFirstPack))
      .then(() => this.pageLoadingService.closeLoading());
  }

  defualtSelected(promotion: any): void {
    this.promotionShelves = this.promotionShelveService
      .defaultBySelected(promotion, this.transaction.data.mainPackage);
    if (!this.advancePay && this.showSelectCurrentPackage && this.havePromotions) {
      this.promotionShelves[0].promotions[0].active = false;
    }
    if (this.promotionShelves) {
      this.checkTranslateLang(this.translateService.currentLang);
    }
  }

  onCompleted(promotion: any): void {
    // รอแก้ไขตัวแปรที่จะเก็บลงใน share transaction
    this.selectCurrentPackage = false;
    this.transaction.data.mainPackage = promotion;

  }

  onClickCurrentPackage(): void {
    this.selectCurrentPackage = true;
    this.transaction.data.mainPackage = null;
    this.promotionShelves[0].promotions.forEach((promotion: any) => promotion.active = false);

  }

  onBack(): void {
    delete this.transaction.data.mainPackage;
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_PAYMENT_DETAIL_PAGE]);

  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    const mobileNo = this.transaction.data.simCard.mobileNo;

    this.http.get(`/api/customerportal/get-existing-mobile-care/${mobileNo}`)
      .toPromise()
      .then((response: any) => {
        const exMobileCare = response.data || {};
        this.mappingExistingMobileCare(exMobileCare);

        if (this.isPackage5G()) {
          if (this.isMultiSim() && this.isSharePlan()) {
            this.alertService.warning(this.translateService.instant('แนะนำยกเลิก MultiSIM และ Share Plan'));
          } else if (this.isMultiSim()) {
            this.alertService.warning(this.translateService.instant('แนะนำยกเลิก MultiSIM'));
          } else if (this.isSharePlan()) {
            this.alertService.warning(this.translateService.instant('แนะนำยกเลิก Share Plan'));
          } else {
            this.pageLoadingService.closeLoading();
            this.router.navigate([this.checkRouteNavigate(exMobileCare)]);
          }
        } else {
          this.pageLoadingService.closeLoading();
          this.router.navigate([this.checkRouteNavigate(exMobileCare)]);
        }

      });
  }

  mappingExistingMobileCare(exMobileCare: any): void {
    if (exMobileCare.hasExistingMobileCare) {
      const existingMobileCare: ExistingMobileCare = exMobileCare.existMobileCarePackage;
      existingMobileCare.handSet = exMobileCare.existHandSet;
      this.transaction.data.existingMobileCare = existingMobileCare;
    }
  }

  checkRouteNavigate(exMobileCare: any = {}): string {
    if (this.selectCurrentPackage) {
      return this.checkRouteByExistingMobileCare(exMobileCare);

    } else {
      return ROUTE_DEVICE_ORDER_AIS_EXISTING_EFFECTIVE_START_DATE_PAGE;
    }
  }

  checkRouteByExistingMobileCare(exMobileCare: any = {}): string {
    if (exMobileCare.hasExistingMobileCare) {
      return ROUTE_DEVICE_ORDER_AIS_EXISTING_MOBILE_CARE_AVAILABLE_PAGE;

    } else {
      return ROUTE_DEVICE_ORDER_AIS_EXISTING_MOBILE_CARE_PAGE;
    }
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  callService(): Promise<any> {
    this.pageLoadingService.openLoading();
    const trade: any = this.priceOption.trade || {};
    const privilege: any = this.priceOption.privilege;
    const billingSystem = (this.transaction.data.simCard.billingSystem === 'RTBS')
      ? BillingSystemType.IRB : this.transaction.data.simCard.billingSystem || BillingSystemType.IRB;

    return this.callGetPromotionShelveService(trade, billingSystem, privilege);

  }

  callGetPromotionShelveService(trade: any, billingSystem: string, privilege: any): Promise<any> {
    return this.promotionShelveService.getPromotionShelve({
      packageKeyRef: trade.packageKeyRef || privilege.packageKeyRef,
      orderType: `Change Service`,
      billingSystem: billingSystem
    }, +privilege.minimumPackagePrice, +privilege.maximumPackagePrice)
      .then((promotionShelves: any) => {
        const contract = this.transaction.data.contractFirstPack || {};
        if (+trade.durationContract === 0) {
          return promotionShelves;
        } else {
          return this.filterPromotions(promotionShelves, contract);
        }
      });
  }

  filterPromotions(promotionShelves: any = [], contract: any = {}): any[] {
    (promotionShelves || []).forEach((promotionShelve: any) => {
      promotionShelve.promotions = (promotionShelve.promotions || []).filter((promotion: any) => {
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
        const contractFirstPack = customAttributes.priceExclVat
          >= Math.max(contract.firstPackage || 0, contract.minPrice || 0, contract.initialPackage || 0);
        const inGroup = (contract.inPackage || []).length > 0 ? contract.inPackage
          .some((inPack: any) => inPack === customAttributes.productPkg) : true;
        return contractFirstPack && inGroup && !this.mathCurrentPackage(customAttributes);
      });
  }

  mathCurrentPackage(customAttributes: any = {}): boolean {
    return !this.advancePay
      && this.transaction.data.currentPackage
      && this.transaction.data.currentPackage.promotionCode === customAttributes.promotionCode;
  }

  get showSelectCurrentPackage(): boolean {
    const currentPackage = this.transaction.data.currentPackage || {};
    return (+currentPackage.priceExclVat || 0) >= +this.priceOption.privilege.minimumPackagePrice;

  }

  get isContractFirstPack(): number {
    const contract = this.transaction.data.contractFirstPack || {};
    return Math.max(+contract.firstPackage || 0, +contract.minPrice || 0, +contract.initialPackage || 0);

  }

  get advancePay(): boolean {
    return !!(+(this.priceOption.trade.advancePay && +this.priceOption.trade.advancePay.amount || 0) > 0);
  }

  get havePromotions(): boolean {
    return this.promotionShelves && this.promotionShelves.some(arr => (arr && arr.promotions.length) > 0);
  }

  checkTranslateLang(lang: any): void {
    this.mapKeyTranslateSelectPackageTitle(this.promotionShelves).then(translateKey => {
      if (lang === 'EN' || lang.lang === 'EN' || lang === 'en' || lang.lang === 'en') {
        if (translateKey && lang && lang.translations) {
          const merge = { ...translateKey, ...lang.translations } || {};
          this.translateService.setTranslation('EN', merge);
        } else {
          this.getTranslateLoader('device-order', 'EN').then(resp => {
            const merge = { ...translateKey, ...resp } || {};
            this.translateService.setTranslation('EN', merge);
          });
        }
      }
    });

  }

  mapKeyTranslateSelectPackageTitle(promotionShelves: PromotionShelve[]): Promise<any> {
    const map = new Map();
    const TranslateKey = {};
    promotionShelves.filter(promotionShelve => {
      promotionShelve.promotions.map(key => key.items.map(item => {
        let replaceTitle = item.title.replace('บ.', '฿');
        replaceTitle = replaceTitle.replace('บาท', '฿');
        replaceTitle = replaceTitle.replace('แพ็กเกจ', 'Package');
        map.set([item.title.trim()], replaceTitle.trim() || item.title.trim());
      }));
    });
    map.forEach((value: any, key: any) => {
      TranslateKey[key] = value;
    });
    if (TranslateKey) {
      return Promise.resolve(TranslateKey);
    } else {
      return Promise.resolve(null);
    }
  }

  getTranslateLoader(moduleName: string, lang: string): Promise<any> {
    if (!moduleName || !lang) {
      return;
    }
    const fileLang = `i18n/${moduleName}.${lang}.json`.toLowerCase();
    return this.http.get(fileLang).toPromise();
  }

  isPackage5G(): boolean {
    const REGEX_PACKAGE_5G = /5[Gg]/;
    const mainPackage = this.transaction.data.mainPackage;
    if (mainPackage && mainPackage.customAttributes && REGEX_PACKAGE_5G.test(mainPackage.customAttributes.productPkg)) {
      return true;
    } else {
      return false;
    }
  }

  isMultiSim(): boolean {
    const handsetSim5G: HandsetSim5G = this.transaction.data.handsetSim5G || {} as HandsetSim5G;
    return handsetSim5G.isMultisim === 'Y' ? true : false;
  }

  isSharePlan(): boolean {
    const handsetSim5G: HandsetSim5G = this.transaction.data.handsetSim5G || {} as HandsetSim5G;
    return handsetSim5G.sharePlan ? true : false;
  }

  ngOnDestroy(): void {
    if (this.translateSubscription) {
      this.translateSubscription.unsubscribe();
    }
    this.transactionService.update(this.transaction);
  }

}

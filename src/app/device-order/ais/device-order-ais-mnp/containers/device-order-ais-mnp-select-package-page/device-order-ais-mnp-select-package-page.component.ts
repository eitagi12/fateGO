import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Transaction, ExistingMobileCare } from 'src/app/shared/models/transaction.model';
import { PromotionShelve, ShoppingCart, HomeService, PageLoadingService, BillingSystemType, AlertService, PromotionShelveGroup, I18nService } from 'mychannel-shared-libs';
import { BsModalRef } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { PromotionShelveService } from 'src/app/device-order/services/promotion-shelve.service';
import { HttpClient } from '@angular/common/http';
import { ROUTE_DEVICE_ORDER_AIS_MNP_EFFECTIVE_START_DATE_PAGE, ROUTE_DEVICE_ORDER_AIS_MNP_PAYMENT_DETAIL_PAGE, ROUTE_DEVICE_ORDER_AIS_MNP_MOBILE_CARE_PAGE, ROUTE_DEVICE_ORDER_AIS_MNP_NEW_BILLING_ACCOUNT_PAGE, ROUTE_DEVICE_ORDER_AIS_MNP_MOBILE_CARE_AVALIBLE_PAGE } from '../../constants/route-path.constant';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { promise } from 'protractor';
import { resolve } from 'path';
import { reject } from 'q';
import { LocalStorageService } from 'ngx-store';

@Component({
  selector: 'app-device-order-ais-mnp-select-package-page',
  templateUrl: './device-order-ais-mnp-select-package-page.component.html',
  styleUrls: ['./device-order-ais-mnp-select-package-page.component.scss']
})
export class DeviceOrderAisMnpSelectPackagePageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;

  @ViewChild('conditionTemplate')
  conditionTemplate: any;

  transaction: Transaction;
  priceOption: PriceOption;
  promotionShelves: PromotionShelve[];
  condition: any;
  modalRef: BsModalRef;
  shoppingCart: ShoppingCart;

  translateSubscription: Subscription;

  constructor(
    private router: Router,
    private http: HttpClient,
    private homeService: HomeService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private shoppingCartService: ShoppingCartService,
    private promotionShelveService: PromotionShelveService,
    private translateService: TranslateService
  ) {
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();

    delete this.transaction.data.mainPackageOneLove;

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

  get advancePay(): boolean {
    return !!((this.priceOption.trade.advancePay && this.priceOption.trade.advancePay.amount || 0) > 0);
  }

  get mathHotDeal(): boolean {
    return !!this.priceOption.campaign.campaignName.match(/\b(\w*Hot\s+Deal\w*)\b/);
  }

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    if (this.transaction.data.promotionsShelves) {

      this.promotionShelves = this.promotionShelveService
        .defaultBySelected(this.transaction.data.promotionsShelves, this.transaction.data.mainPackage);
    } else {
      this.callService();
    }
  }

  onCompleted(promotion: any): void {
    // รอแก้ไขตัวแปรที่จะเก็บลงใน share transaction
    this.transaction.data.mainPackage = promotion;
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_PAYMENT_DETAIL_PAGE]);
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    const mobileNo = this.transaction.data.simCard.mobileNo;

    // call เช็ค mobile care เดิม
    this.http.get(`/api/customerportal/get-existing-mobile-care/${mobileNo}`).toPromise().then((response: any) => {
      const exMobileCare = response.data || {};
      if (exMobileCare.hasExistingMobileCare) {
        const existingMobileCare: ExistingMobileCare = exMobileCare.existMobileCarePackage;
        existingMobileCare.handSet = exMobileCare.existHandSet;
        this.transaction.data.existingMobileCare = existingMobileCare;
      }

      // ถ้ามี mobileCare เดิม จะไปหน้า เลือกว่าจะเปลี่ยน mobileCare หรือ ไม่
      // ถ้าไม่มี mobileCare เดิม จะไปหน้าเลือกวันที่มีผลรอบบิล
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_EFFECTIVE_START_DATE_PAGE]);
    }).then(() => this.pageLoadingService.closeLoading());
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  callService(): void {
    this.pageLoadingService.openLoading();
    const trade: any = this.priceOption.trade;
    const privilege: any = this.priceOption.privilege;
    const billingSystem = (this.transaction.data.simCard.billingSystem === 'RTBS')
      ? BillingSystemType.IRB : this.transaction.data.simCard.billingSystem || BillingSystemType.IRB;

    this.promotionShelveService.getPromotionShelve(
      {
        packageKeyRef: trade.packageKeyRef || privilege.packageKeyRef,
        orderType: `Change Service`,
        billingSystem: billingSystem
      },
      +privilege.minimumPackagePrice, +privilege.maximumPackagePrice)
      .then((promotionShelves: any) => {
        this.promotionShelves = this.promotionShelveService.defaultBySelected(promotionShelves, this.transaction.data.mainPackage);
        if (this.promotionShelves) {
          this.checkTranslateLang(this.translateService.currentLang);
        }
      })
      .then(() => this.pageLoadingService.closeLoading());
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

  ngOnDestroy(): void {
    if (this.translateSubscription) {
      this.translateSubscription.unsubscribe();
    }
    this.transactionService.update(this.transaction);
  }
}

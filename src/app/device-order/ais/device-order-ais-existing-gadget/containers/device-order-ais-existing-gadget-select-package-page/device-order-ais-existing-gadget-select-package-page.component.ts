import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_PAYMENT_DETAIL_PAGE, ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_EFFECTIVE_START_DATE_PAGE, ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_SUMMARY_PAGE } from 'src/app/device-order/ais/device-order-ais-existing-gadget/constants/route-path.constant';
import { PromotionShelve, BillingSystemType, ShoppingCart, HomeService, PageLoadingService, AlertService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { HttpClient } from '@angular/common/http';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { PromotionShelveService } from 'src/app/device-order/services/promotion-shelve.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-device-order-ais-existing-gadget-select-package-page',
  templateUrl: './device-order-ais-existing-gadget-select-package-page.component.html',
  styleUrls: ['./device-order-ais-existing-gadget-select-package-page.component.scss']
})
export class DeviceOrderAisExistingGadgetSelectPackagePageComponent implements OnInit, OnDestroy {

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
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private shoppingCartService: ShoppingCartService,
    private promotionShelveService: PromotionShelveService,
    private translateService: TranslateService,
    private alertService: AlertService
  ) {
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();

    if (this.transaction.data.billingInformation) {
      delete this.transaction.data.billingInformation.billCycle;
      delete this.transaction.data.billingInformation.mergeBilling;
    }

    this.translateSubscription = this.translateService.onLangChange.subscribe((lang: any) => {
      if (this.promotionShelves) {
        this.checkTranslateLang(lang);
      }
    });
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

  changePackageTitleLanguage(currentPackage: any = {}): string {
    return (this.translateService.currentLang === 'EN') ? currentPackage.titleEng : currentPackage.title;
  }

  changePackageDetailLanguage(currentPackage: any = {}): string {
    return (this.translateService.currentLang === 'EN') ? currentPackage.inStatementEng : currentPackage.inStatementThai;
  }

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    const promotionByContractFirstPack = this.transaction.data.promotionsShelves || [];
    this.defualtSelected(promotionByContractFirstPack);
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
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_PAYMENT_DETAIL_PAGE]);

  }

  onNext(): void {
    if (this.selectCurrentPackage) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_SUMMARY_PAGE]);
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_EFFECTIVE_START_DATE_PAGE]);
    }
  }

  onHome(): void {
    this.homeService.goToHome();
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

  ngOnDestroy(): void {
    if (this.translateSubscription) {
      this.translateSubscription.unsubscribe();
    }
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

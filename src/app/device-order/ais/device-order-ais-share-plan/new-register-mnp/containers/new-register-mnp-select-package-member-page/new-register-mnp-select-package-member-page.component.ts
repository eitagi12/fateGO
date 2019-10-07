import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { PromotionShelve, ShoppingCart, HomeService, PageLoadingService, BillingSystemType } from 'mychannel-shared-libs';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { PromotionShelveService } from 'src/app/device-order/services/promotion-shelve.service';
import { WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN } from 'src/app/device-order/constants/wizard.constant';
import { ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_NETWORK_TYPE,
         ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_CONFIRM_USER_INFORMATION_PAGE
       } from '../../constants/route-path.constant';

@Component({
  selector: 'app-new-register-mnp-select-package-member-page',
  templateUrl: './new-register-mnp-select-package-member-page.component.html',
  styleUrls: ['./new-register-mnp-select-package-member-page.component.scss']
})
export class NewRegisterMnpSelectPackageMemberPageComponent implements OnInit, OnDestroy {
  wizards: string[] = WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN;

  @ViewChild('conditionTemplate')
  conditionTemplate: any;
  priceOption: PriceOption;
  transaction: Transaction;
  promotionShelves: PromotionShelve[];
  shoppingCart: ShoppingCart;
  condition: any;
  modalRef: BsModalRef;
  translateSubscription: Subscription;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private pageLoadingService: PageLoadingService,
    private priceOptionService: PriceOptionService,
    private transactionService: TransactionService,
    private shoppingCartService: ShoppingCartService,
    private promotionShelveService: PromotionShelveService,
    private http: HttpClient,
    private translateService: TranslateService
  ) {
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();

    this.translateSubscription = this.translateService.onLangChange.subscribe((lang: any) => {
      if (this.promotionShelves) {
        this.checkTranslateLang(lang);
      }
    });
  }

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    this.callService();
  }

  onCompleted(promotion: any): void {
    // รอแก้ไขตัวแปรที่จะเก็บลงใน share transaction
    this.transaction.data.mainPackage = promotion;
  }

  onBack(): void {
    delete this.transaction.data.mainPackage;
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_NETWORK_TYPE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_CONFIRM_USER_INFORMATION_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  callService(): void {
    this.pageLoadingService.openLoading();

    const trade: any = this.priceOption.trade;
    const privilege: any = this.priceOption.privilege;

    this.promotionShelveService.getPromotionShelve(
      {
        packageKeyRef: trade.packageKeyRef || privilege.packageKeyRef,
        orderType: 'New Registration',
        billingSystem: BillingSystemType.IRB
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

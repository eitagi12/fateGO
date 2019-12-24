import { Component, OnInit, OnDestroy } from '@angular/core';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { MobileCare, ShoppingCart, PageLoadingService, BillingSystemType } from 'mychannel-shared-libs';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RemoveCartService } from '../../services/remove-cart.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient } from '@angular/common/http';
import { WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN } from 'src/app/device-order/constants/wizard.constant';
import { MOBILE_CARE_PACKAGE_KEY_REF } from 'src/app/device-order/constants/cpc.constant';
import { MobileCareService } from 'src/app/device-only/services/mobile-care.service';
import {
  ROUTE_DEVICE_ORDER_ASP_SHARE_PLAN_NEW_REGISTER_MNP_CONFIRM_USER_INFORMATION_PAGE,
  ROUTE_DEVICE_ORDER_ASP_SHARE_PLAN_NEW_REGISTER_MNP_SUMMARY_PAGE
} from '../../constants/route-path.constant';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
@Component({
  selector: 'app-new-register-mnp-mobile-care-page',
  templateUrl: './new-register-mnp-mobile-care-page.component.html',
  styleUrls: ['./new-register-mnp-mobile-care-page.component.scss']
})
export class NewRegisterMnpMobileCarePageComponent implements OnInit, OnDestroy {
  wizards: string[] = WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN;

  priceOption: PriceOption;
  transaction: Transaction;
  mobileCare: MobileCare;
  shoppingCart: ShoppingCart;
  translateSubscription: Subscription;
  constructor(
    private shoppingCartService: ShoppingCartService,
    private router: Router,
    private removeCartService: RemoveCartService,
    private priceOptionService: PriceOptionService,
    private translateService: TranslateService,
    private transactionService: TransactionService,
    private pageLoadingService: PageLoadingService,
    private http: HttpClient,
    private mobileCareService: MobileCareService,
    ) {
      this.priceOption = this.priceOptionService.load();
      this.transaction = this.transactionService.load();
      this.translateSubscription = this.translateService.onLangChange.subscribe((lang: any) => {
        this.checkTranslateLang(lang);
      });
    }

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.getShoppingCartDataSuperKhum();
    delete this.transaction.data.mobileCarePackage;
    this.callService();
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_ASP_SHARE_PLAN_NEW_REGISTER_MNP_CONFIRM_USER_INFORMATION_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_ASP_SHARE_PLAN_NEW_REGISTER_MNP_SUMMARY_PAGE]);
  }

  onHome(): void {
    this.removeCartService.backToReturnStock('/', this.transaction);
  }

  onCompleted(mobileCare: any): void {
    this.transaction.data.mobileCarePackage = mobileCare;
  }

  ngOnDestroy(): void {
    if (this.translateSubscription) {
      this.translateSubscription.unsubscribe();
    }
    this.transactionService.update(this.transaction);
  }

  callService(): void {
    // tslint:disable-next-line: max-line-length
    const billingSystem = this.transaction.data.simCard.billingSystem || this.transaction.data.mainPackage.customAttributes.billingSystem || BillingSystemType.IRB;
    const chargeType = this.transaction.data.mainPackage.customAttributes.chargeType || 'Post-paid';
    const endUserPrice = +this.priceOption.trade.normalPrice;

    this.pageLoadingService.openLoading();
    this.mobileCareService.getMobileCare({
      packageKeyRef: MOBILE_CARE_PACKAGE_KEY_REF,
      billingSystem: BillingSystemType.IRB
    }, chargeType, billingSystem, endUserPrice).then((mobileCare: any) => {
      this.mobileCare = {
        promotions: mobileCare
      };
      if (this.mobileCare) {
        this.checkTranslateLang(this.translateService.currentLang);
      }
      if (this.mobileCare.promotions && this.mobileCare.promotions.length > 0) {
        this.mobileCare.promotions[0].active = true;
      }
    })
      .then(() => this.pageLoadingService.closeLoading());
  }

  checkTranslateLang(lang: any): void {
    this.mapKeyTranslateMobileCareTitle(this.mobileCare.promotions).then(translateKey => {
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

  mapKeyTranslateMobileCareTitle(mobileCare: any): Promise<any> {
    const map = new Map();
    const TranslateKey = {};
    mobileCare.map(key => key.items.map(item => {
      map.set([item.title.trim()], item.value.customAttributes.shortNameEng.trim());
    }));
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
}

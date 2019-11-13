import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { PromotionShelve, ShoppingCart, HomeService, PageLoadingService, BillingSystemType, PromotionShelveItem } from 'mychannel-shared-libs';
import { BsModalRef } from 'ngx-bootstrap';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { PromotionShelveService } from 'src/app/device-order/services/promotion-shelve.service';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import {
  ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_VERIFY_INSTANT_SIM_PAGE,
  ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_BY_PATTERN_PAGE,
  ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_NETWORK_TYPE
} from '../../constants/route-path.constant';
import { WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN } from 'src/app/device-order/constants/wizard.constant';

@Component({
  selector: 'app-new-register-mnp-select-package-page',
  templateUrl: './new-register-mnp-select-package-page.component.html',
  styleUrls: ['./new-register-mnp-select-package-page.component.scss']
})
export class NewRegisterMnpSelectPackagePageComponent implements OnInit, OnDestroy {
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
  promotionData: any;

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
    this.callService(this.translateService.currentLang);
  }

  onCompleted(promotion: any): void {
    console.log(promotion);
    this.transaction.data.mainPackage = promotion;
  }

  onBack(): void {
    delete this.transaction.data.mainPackage;
    if (this.transaction.data.simCard.simSerial) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_VERIFY_INSTANT_SIM_PAGE]);
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_BY_PATTERN_PAGE]);
    }
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_NETWORK_TYPE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  callService(language: string): void {
    this.pageLoadingService.openLoading();
    const trade: any = this.priceOption.trade;
    const privilege: any = this.priceOption.privilege;

    const mobileNo = this.transaction.data.simCard.mobileNo;
    const params: any = {
      orderType: 'New Registration',
      isPackageSharePlan: true
    };
    // this.promotionShelveService.getPromotionShelve(
      // {
      //   packageKeyRef: trade.packageKeyRef || privilege.packageKeyRef,
      //   orderType: 'New Registration',
      //   billingSystem: BillingSystemType.IRB
      // },
      // +privilege.minimumPackagePrice, +privilege.maximumPackagePrice)
      // .then((promotionShelves: any) => {
      //   this.promotionShelves = this.promotionShelveService.defaultBySelected(promotionShelves, this.transaction.data.mainPackage);
      //   if (this.promotionShelves) {
      //     console.log(this.promotionShelves);
      //     this.checkTranslateLang(this.translateService.currentLang);
      //   }
      // })
    this.http.get(`/api/customerportal/queryCheckMinimumPackage/${mobileNo}`, {
    }).toPromise()
      .then((resp: any) => {
        const data = resp.data || {};
        return data.MinimumPriceForPackage || 0;
      }).then((minPromotionPrice: string) => {
        return this.http.get('/api/customerportal/newRegister/queryMainPackage', {
          params: Object.assign({
            minPromotionPrice: minPromotionPrice,
            language: language
          }, params)
        }).toPromise();
      })
      .then((resp: any) => {
        const data = resp.data.packageList || [];
        this.promotionData = data;
        const promotionShelves: PromotionShelve[] = data.map((promotionShelve: any) => {
          return {
            title: promotionShelve.title,
            icon: (promotionShelve.icon || '').replace(/\.jpg$/, '').replace(/_/g, '-'),
            promotions: promotionShelve.subShelves
              .map((subShelve: any) => {
                return {
                  // group
                  id: subShelve.subShelveId,
                  title: subShelve.title,
                  sanitizedName: subShelve.sanitizedName,
                  items: (subShelve.items || []).map((promotion: any) => {
                    return {
                      // item
                      id: promotion.itemId,
                      title: language === 'EN' ? promotion.shortNameEng : promotion.shortNameThai,
                      detail: language === 'EN' ? promotion.statementEng : promotion.statementThai,
                      condition: subShelve.conditionCode,
                      value: promotion
                    };
                  })
                };
              })
          };
        });
        return Promise.resolve(promotionShelves);
      })
      .then((promotionShelves: PromotionShelve[]) => {
        this.promotionShelves = this.buildPromotionShelveActive(promotionShelves);
      })
      .then(() => {
        this.pageLoadingService.closeLoading();
      });
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

  buildPromotionShelveActive(promotionShelves: PromotionShelve[]): PromotionShelve[] {
    const mainPackage: any = this.transaction.data.mainPackage || {};
    if (!promotionShelves || promotionShelves.length <= 0) {
      return;
    }
    if (mainPackage) {
      let promotionShelveIndex = 0, promotionShelveGroupIndex = 0;
      for (let i = 0; i < promotionShelves.length; i++) {
        const promotions = promotionShelves[i].promotions || [];

        let itemActive = false;
        for (let ii = 0; ii < promotions.length; ii++) {
          const active = (promotions[ii].items || []).find((promotionShelveItem: PromotionShelveItem) => {
            return ('' + promotionShelveItem.id) === ('' + mainPackage.itemId);
          });
          if (!!active) {
            itemActive = true;
            promotionShelveIndex = i;
            promotionShelveGroupIndex = ii;
            continue;
          }
        }

        if (!itemActive) {
          promotions[0].active = true;
        }
      }
      promotionShelves[promotionShelveIndex].active = true;
      promotionShelves[promotionShelveIndex].promotions[promotionShelveGroupIndex].active = true;
    } else {
      promotionShelves[0].active = true;
      promotionShelves.forEach((promotionShelve: PromotionShelve) => {
        if (promotionShelve.promotions && promotionShelve.promotions.length > 0) {
          promotionShelve.promotions[0].active = true;
        }
      });
    }
    return promotionShelves;
  }

  ngOnDestroy(): void {
    if (this.translateSubscription) {
      this.translateSubscription.unsubscribe();
    }
    this.transactionService.update(this.transaction);
  }

}

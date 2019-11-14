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
  promotionCodes: string;

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
    this.transaction.data.mainPackage = promotion;
    this.callServiceRequestQueryListLov(this.translateService.currentLang);
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
    if (this.transaction.data.mainPackage) {
      if (this.transaction.data.mainPackage.customAttributes.promotionCode) {
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_NETWORK_TYPE]);
      }
    }
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
      .then(() => {
        this.pageLoadingService.closeLoading();
      });
  }

  callServiceRequestQueryListLov(language: string): void {
    this.pageLoadingService.openLoading();
    const RequestQueryListLovConfigInfo: any = {
      lovVal2: this.transaction.data.mainPackage.customAttributes.promotionCode
    };
    this.http.post(`/api/salesportal/queryListLovConfigInfo`, RequestQueryListLovConfigInfo).toPromise()
      .then((promotionCodes: any) => {
        this.promotionCodes = promotionCodes.data;
      }).then(() => {
        const RequestGetPromotionsByCodes: any = {
          promotionCodes: [this.promotionCodes]
        };
        return this.http.post(`/api/customerportal/myChannel/getPromotionsByCodes`, RequestGetPromotionsByCodes).toPromise()
          .then((res: any) => {
            console.log('res=>', res);

            const data = res.data.data || [];
            // mock packageList for subShelve
            const packageList: any = [{
              title: 'Member Share MNP',
              icon: '',
              promotions: [
                {
                  title: '3G Member Share MNP UL SWifi 0 Baht',
                  items: data
                }
              ]
            }];
            const promotionShelves: PromotionShelve[] = packageList.map((promotionShelve: any) => {
              return {
                title: promotionShelve.title,
                icon: (promotionShelve.icon || '').replace(/\.jpg$/, '').replace(/_/g, '-'),
                promotions: (promotionShelve.promotions || []).map((subShelve: any) => {
                  return {
                    // subShelve
                    id: '',
                    title: subShelve.title,
                    sanitizedName: '',
                    items: (subShelve.items || []).map((promotion: any) => {
                      return {
                        // item
                        id: promotion.id,
                        title: language === 'EN' ? promotion.customAttributes.shortNameEng : promotion.customAttributes.shortNameThai,
                        detail: language === 'EN' ? promotion.customAttributes.inStatementEng : promotion.customAttributes.inStatementThai,
                        condition: '',
                        value: promotion
                      };
                    })
                  };
                })
              };
            });
            return Promise.resolve(promotionShelves);
          });
      }).then((res) => {
        const mapMemberMainPackage = res[0]['promotions'][0]['items'][0].value || '';
        this.transaction.data.mainPackage.memberMainPackage = mapMemberMainPackage;
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

  ngOnDestroy(): void {
    if (this.translateSubscription) {
      this.translateSubscription.unsubscribe();
    }
    this.transactionService.update(this.transaction);
  }

}

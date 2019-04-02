import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { WIZARD_ORDER_MNP } from 'src/app/order/constants/wizard.constant';
import { Router } from '@angular/router';
import { HomeService, PromotionShelve, PageLoadingService, AlertService, PromotionShelveItem } from 'mychannel-shared-libs';
import {
  ROUTE_ORDER_MNP_CUSTOMER_INFO_PAGE,
  ROUTE_ORDER_MNP_ID_CARD_CAPTURE_PAGE,
  ROUTE_ORDER_MNP_ON_TOP_PAGE,
  ROUTE_ORDER_MNP_ONE_LOVE_PAGE
} from 'src/app/order/order-mnp/constants/route-path.constant';
import { HttpClient } from '@angular/common/http';
import { Transaction, TransactionAction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-mnp-select-package-page',
  templateUrl: './order-mnp-select-package-page.component.html',
  styleUrls: ['./order-mnp-select-package-page.component.scss']
})
export class OrderMnpSelectPackagePageComponent implements OnInit, OnDestroy {
  readonly MAX_PROMOTION_PRICE: number = 500;
  @ViewChild('conditionTemplate')
  conditionTemplate: any;
  wizards: string[] = WIZARD_ORDER_MNP;

  promotionShelves: PromotionShelve[];
  transaction: Transaction;
  promotionData: any;
  condition: any;
  modalRef: BsModalRef;

  translateSubscribe: Subscription;

  constructor(
    private router: Router,
    private transactionService: TransactionService,
    private pageLoadingService: PageLoadingService,
    private http: HttpClient,
    private homeService: HomeService,
    private alertService: AlertService,
    private modalService: BsModalService,
    private translateService: TranslateService,
  ) {
    this.transaction = this.transactionService.load();

    delete this.transaction.data.mainPackageOneLove;
    if (this.transaction.data.billingInformation) {
      delete this.transaction.data.billingInformation.billCycle;
      delete this.transaction.data.billingInformation.mergeBilling;
    }
  }

  ngOnInit(): void {
    this.callService(this.translateService.currentLang);
    this.translateSubscribe = this.translateService.onLangChange.subscribe(language => {
      this.callService(language.lang);
    });
  }

  onBack(): void {
    if (this.transaction.data.action === TransactionAction.KEY_IN) {
      this.router.navigate([ROUTE_ORDER_MNP_ID_CARD_CAPTURE_PAGE]);
    } else {
      this.router.navigate([ROUTE_ORDER_MNP_CUSTOMER_INFO_PAGE]);
    }
  }

  onNext(): void {
    if (this.isPackageOneLove()) {
      this.router.navigate([ROUTE_ORDER_MNP_ONE_LOVE_PAGE]);
    } else {
      this.router.navigate([ROUTE_ORDER_MNP_ON_TOP_PAGE]);
    }
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onCompleted(promotion: any): void {
    // รอแก้ไขตัวแปรที่จะเก็บลงใน share transaction
    this.transaction.data.mainPackage = promotion;
  }

  callService(language: string): void {
    this.pageLoadingService.openLoading();

    const billingInformation: any = this.transaction.data.billingInformation;
    const isNetExtreme = billingInformation &&
    billingInformation.billCyclesNetExtreme && billingInformation.billCyclesNetExtreme.length > 0 ? 'true' : 'false';
    const mobileNo = this.transaction.data.simCard.mobileNo;
    const params: any = {
      orderType: 'Port – In',
      isNetExtreme: isNetExtreme,
    };
    if (this.transaction.data.action === TransactionAction.READ_PASSPORT) {
      params.maxPromotionPrice = this.MAX_PROMOTION_PRICE;
    }
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
        const promotionShelves: PromotionShelve[] = data.map((promotionShelve: any) => {
          return {
            title: promotionShelve.title,
            // replace to class in css
            icon: (promotionShelve.icon || '').replace(/\.jpg$/, '').replace(/_/g, '-'),
            promotions: promotionShelve.subShelves
              .map((subShelve: any) => {
                return { // group
                  // เอาไว้เปิด carousel ให้ check ว่ามี id ลูกตรงกัน
                  id: subShelve.subShelveId,
                  title: subShelve.title,
                  sanitizedName: subShelve.sanitizedName,
                  items: (subShelve.items || []).map((promotion: any) => {
                    return { // item
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

  onTermConditions(condition: string): void {
    if (!condition) {
      this.alertService.warning('ระบบไม่สามารถแสดงข้อมูลได้ในขณะนี้');
      return;
    }
    this.pageLoadingService.openLoading();
    this.http.get('/api/customerportal/newRegister/termAndCondition', {
      params: { conditionCode: condition }
    }).toPromise()
      .then((resp: any) => {
        this.condition = resp.data || {};
        this.modalRef = this.modalService.show(this.conditionTemplate, { class: 'modal-lg' });
      })
      .then(() => {
        this.pageLoadingService.closeLoading();
      });
  }

  buildPromotionShelveActive(promotionShelves: PromotionShelve[]): PromotionShelve[] {
    const mainPackage: any = this.transaction.data.mainPackage || {};

    if (!promotionShelves && promotionShelves.length <= 0) {
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

  isPackageOneLove(): boolean {
    const REGEX_NET_EXTREME = /[Nn]et[Ee]xtreme/;
    const mainPackage = this.transaction.data.mainPackage;
    if (mainPackage && REGEX_NET_EXTREME.test(mainPackage.productPkg)) {
      return false;
    }
    return (+mainPackage.numberOfMobile) > 0;
  }

  ngOnDestroy(): void {
    this.translateSubscribe.unsubscribe();
    this.transactionService.update(this.transaction);
  }
}

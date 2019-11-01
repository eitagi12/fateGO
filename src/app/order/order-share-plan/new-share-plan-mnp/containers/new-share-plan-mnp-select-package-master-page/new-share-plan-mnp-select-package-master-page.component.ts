import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { WIZARD_ORDER_NEW_SHARE_PLAN_MNP } from 'src/app/order/constants/wizard.constant';
import { Transaction, TransactionAction } from 'src/app/shared/models/transaction.model';
import { PromotionShelve, HomeService, TokenService, PageLoadingService, AlertService, PromotionShelveItem } from 'mychannel-shared-libs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ReserveMobileService, SelectMobileNumberRandom } from 'src/app/order/order-shared/services/reserve-mobile.service';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { ROUTE_NEW_SHARE_PLAN_MNP_NETWORK_TYPE_PAGE, ROUTE_NEW_SHARE_PLAN_MNP_VERIFY_INSTANT_SIM_PAGE, ROUTE_NEW_SHARE_PLAN_MNP_VERIFY_BY_PATTERN_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-new-share-plan-mnp-select-package-master-page',
  templateUrl: './new-share-plan-mnp-select-package-master-page.component.html',
  styleUrls: ['./new-share-plan-mnp-select-package-master-page.component.scss']
})
export class NewSharePlanMnpSelectPackageMasterPageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_ORDER_NEW_SHARE_PLAN_MNP;
  @ViewChild('conditionTemplate')
  conditionTemplate: any;
  transaction: Transaction;
  promotionShelves: PromotionShelve[];
  promotionData: any;
  condition: any;
  modalRef: BsModalRef;
  translateSubscribe: Subscription;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private tokenService: TokenService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private reserveMobileService: ReserveMobileService,
    private alertService: AlertService,
    private modalService: BsModalService,
    private http: HttpClient,
    private translation: TranslateService
  ) {
    this.transaction = this.transactionService.load();
    if (this.transaction.data.billingInformation) {
      delete this.transaction.data.billingInformation.billCycle;
      delete this.transaction.data.billingInformation.mergeBilling;
    }
  }

  ngOnInit(): void {
    this.callService(this.translation.currentLang);
    this.translateSubscribe = this.translation.onLangChange.subscribe(language => {
      this.callService(language.lang);
    });
  }

  onBack(): void {
    const user = this.tokenService.getUser();
    if (this.transaction.data.simCard.simSerial) {
      this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_VERIFY_INSTANT_SIM_PAGE]);
    } else {
      const dataRequest: SelectMobileNumberRandom = {
        userId: user.username,
        mobileNo: this.transaction.data.simCard.mobileNo,
        action: 'Unlock'
      };
      this.reserveMobileService.selectMobileNumberRandom(dataRequest);
      this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_VERIFY_BY_PATTERN_PAGE]);
    }
  }

  onNext(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_NETWORK_TYPE_PAGE]);
  }

  onHome(): void {
    window.location.href = '/sales-portal/dashboard';
  }

  callService(language: string): void {
    this.pageLoadingService.openLoading();
    const mobileNo = this.transaction.data.simCard.mobileNo;
    const params: any = {
      orderType: 'New Registration',
      isPackageSharePlan: true
    };
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

  onCompleted(promotion: any): void {
    this.transaction.data.mainPackage = promotion;
  }

  onTermConditions(condition: string): void {
    if (!condition) {
      this.alertService.warning(this.translation.instant('ระบบไม่สามารถแสดงข้อมูลได้ในขณะนี้'));
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

  ngOnDestroy(): void {
    this.translateSubscribe.unsubscribe();
    this.transactionService.update(this.transaction);
  }

}

import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { PageLoadingService, PromotionShelve, PromotionShelveItem, AlertService } from 'mychannel-shared-libs';
import { HttpClient } from '@angular/common/http';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN } from 'src/app/device-order/constants/wizard.constant';
import { ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_SELECT_REASON_PAGE, ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_CONFIRM_USER_INFORMATION_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-new-register-mnp-select-package-member',
  templateUrl: './new-register-mnp-select-package-member.component.html',
  styleUrls: ['./new-register-mnp-select-package-member.component.scss']
})
export class NewRegisterMnpSelectPackageMemberComponent implements OnInit, OnDestroy {
  wizards: string[] = WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN;
  transaction: Transaction;
  translateSubscribe: Subscription;
  promotionCodes: string;
  promotionShelves: PromotionShelve[];
  condition: any;
  modalRef: BsModalRef;
  @ViewChild('conditionTemplate') conditionTemplate: any;

  constructor(
    private router: Router,
    private transactionService: TransactionService,
    private translation: TranslateService,
    private pageLoadingService: PageLoadingService,
    private http: HttpClient,
    private alertService: AlertService,
    private modalService: BsModalService
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.callService(this.translation.currentLang);
    this.translateSubscribe = this.translation.onLangChange.subscribe(language => {
      this.callService(language.lang);
    });
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_SELECT_REASON_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_CONFIRM_USER_INFORMATION_PAGE]);
  }

  callService(language: string): void {
    this.pageLoadingService.openLoading();
    const RequestQueryListLovConfigInfo: any = {
      lovVal2: this.transaction.data.mainPackage.promotionCode
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
            const data = res.data.data || [];
            // mock packageList for subShelve
            const packageList: any = [{
              title: 'Share Plan',
              icon: '',
              promotions: [
                {
                  title: 'New Share Plan MNP',
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
      })
      .then((promotionShelves: PromotionShelve[]) => {
        this.promotionShelves = this.buildPromotionShelveActive(promotionShelves);
      })
      .then(() => {
        this.pageLoadingService.closeLoading();
      });

  }

  buildPromotionShelveActive(promotionShelves: PromotionShelve[]): PromotionShelve[] {
    const mainPackageMember: any = this.transaction.data.mainPackage.memberMainPackage || {};
    if (!promotionShelves || promotionShelves.length <= 0) {
      return;
    }
    if (mainPackageMember) {
      let promotionShelveIndex = 0, promotionShelveGroupIndex = 0;
      for (let i = 0; i < promotionShelves.length; i++) {
        const promotions = promotionShelves[i].promotions || [];

        let itemActive = false;
        for (let ii = 0; ii < promotions.length; ii++) {
          const active = (promotions[ii].items || []).find((promotionShelveItem: PromotionShelveItem) => {
            return ('' + promotionShelveItem.id) === ('' + mainPackageMember.itemId);
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
    this.transaction.data.mainPackage.memberMainPackage = promotion;
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

import { OnDestroy, OnInit, Component, ViewChild } from '@angular/core';
import { WIZARD_ORDER_PRE_TO_POST } from 'src/app/order/constants/wizard.constant';
import { Transaction, TransactionAction, HandsetSim5G } from 'src/app/shared/models/transaction.model';
import { PromotionShelve, HomeService, PageLoadingService, AlertService, PromotionShelveItem } from 'mychannel-shared-libs';
import {
  ROUTE_ORDER_PRE_TO_POST_ID_CARD_CAPTURE_PAGE,
  ROUTE_ORDER_PRE_TO_POST_ON_TOP_PAGE,
  ROUTE_ORDER_PRE_TO_POST_CUSTOMER_INFO_PAGE,
  ROUTE_ORDER_PRE_TO_POST_VALIDATE_CUSTOMER_ID_CARD_REPI_PAGE,
  ROUTE_ORDER_PRE_TO_POST_ONE_LOVE_PAGE,
  ROUTE_ORDER_PRE_TO_POST_VERIFY_DOCUMENT_PAGE,
  ROUTE_ORDER_PRE_TO_POST_VERIFY_DOCUMENT_REPI_PAGE
} from 'src/app/order/order-pre-to-post/constants/route-path.constant';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-pre-to-post-select-package-page',
  templateUrl: './order-pre-to-post-select-package-page.component.html',
  styleUrls: ['./order-pre-to-post-select-package-page.component.scss']
})
export class OrderPreToPostSelectPackagePageComponent implements OnInit, OnDestroy {
  readonly MAX_PROMOTION_PRICE: number = 500;
  @ViewChild('conditionTemplate')
  conditionTemplate: any;

  wizards: string[] = WIZARD_ORDER_PRE_TO_POST;

  transaction: Transaction;
  promotionShelves: PromotionShelve[];
  condition: any;
  modalRef: BsModalRef;
  translateSubscribe: Subscription;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private alertService: AlertService,
    private modalService: BsModalService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private http: HttpClient,
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
    const action = this.transaction.data.action;
    if (action === TransactionAction.READ_CARD_REPI || action === TransactionAction.READ_PASSPORT_REPI) {
      this.router.navigate([ROUTE_ORDER_PRE_TO_POST_VERIFY_DOCUMENT_REPI_PAGE]);
    } else if (action === TransactionAction.READ_CARD || action === TransactionAction.READ_PASSPORT) {
      this.router.navigate([ROUTE_ORDER_PRE_TO_POST_CUSTOMER_INFO_PAGE]);
    } else if (action === TransactionAction.KEY_IN_REPI) {
      this.router.navigate([ROUTE_ORDER_PRE_TO_POST_VERIFY_DOCUMENT_PAGE]);
    } else {
      this.router.navigate([ROUTE_ORDER_PRE_TO_POST_ID_CARD_CAPTURE_PAGE]);
    }
  }

  onNext(): void {
    if (this.isPackageOneLove()) {
      this.router.navigate([ROUTE_ORDER_PRE_TO_POST_ONE_LOVE_PAGE]);
    } else if (this.isPackage5G()) {
      if (this.isMultiSim() && this.isSharePlan()) {
        this.alertService.warning(this.translateService.instant('แนะนำยกเลิก MultiSIM และ Share Plan'));
      } else if (this.isMultiSim()) {
        this.alertService.warning(this.translateService.instant('แนะนำยกเลิก MultiSIM'));
      } else if (this.isSharePlan()) {
        this.alertService.warning(this.translateService.instant('แนะนำยกเลิก Share Plan'));
      } else {
        this.router.navigate([ROUTE_ORDER_PRE_TO_POST_ON_TOP_PAGE]);
      }
    } else {
      this.router.navigate([ROUTE_ORDER_PRE_TO_POST_ON_TOP_PAGE]);
    }
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.translateSubscribe.unsubscribe();
    this.transactionService.update(this.transaction);
  }

  onCompleted(promotion: any): void {
    this.transaction.data.mainPackage = promotion;
  }

  callService(language: string): void {
    this.pageLoadingService.openLoading();
    const billingInformation = this.transaction.data.billingInformation;
    const mobileNo = this.transaction.data.simCard.mobileNo;
    const params: any = {
      orderType: 'Change Charge Type',
    };
    if (this.transaction.data.action === TransactionAction.READ_PASSPORT
      || this.transaction.data.action === TransactionAction.READ_PASSPORT_REPI) {
      params.maxPromotionPrice = this.MAX_PROMOTION_PRICE;
    }

    this.http.get(`/api/customerportal/greeting/${mobileNo}/profile`).toPromise()
      .then((greeting: any) => {
        let serviceYear = '';
        if (greeting.data.registerDate) {
          const regisDate: any = greeting.data.registerDate.split(' ');
          return regisDate[0].split('/').join('');
        } else if (greeting.data.serviceYear) {
          const svcService: any = greeting.data.serviceYear;
          let currentDate: any = moment();
          currentDate = currentDate.subtract(svcService.year, 'years');
          currentDate = currentDate.subtract(svcService.month, 'months');
          currentDate = currentDate.subtract(svcService.day, 'days');
          serviceYear = moment(currentDate).format('DDMMYYYY').toString();
        }
        return serviceYear || '';
      }).then((regisDate) => {

        const isNetExtreme = billingInformation
          && billingInformation.billCyclesNetExtreme
          && billingInformation.billCyclesNetExtreme.length > 0 ? 'true' : 'false';
        return this.http.get('/api/customerportal/newRegister/queryMainPackage', {
          params: Object.assign({
            registerDate: regisDate,
            isNetExtreme: isNetExtreme,
            language: language
          }, params)
        }).toPromise()

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
                          detail: language === 'EN' ? promotion.statementEng : promotion.shortNameThai,
                          condition: subShelve.conditionCode,
                          value: promotion
                        };
                      })
                    };
                  })
              };
            });
            return Promise.resolve(promotionShelves);
          }).then((promotionShelves: PromotionShelve[]) => {
            this.promotionShelves = this.buildPromotionShelveActive(promotionShelves);
          }).then(() => {
            this.pageLoadingService.closeLoading();
          });
      });
    // });
  }

  onTermConditions(condition: any): void {
    if (!condition) {
      this.alertService.warning(this.translateService.instant('ระบบไม่สามารถแสดงข้อมูลได้ในขณะนี้'));
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

  isPackage5G(): boolean {
    const REGEX_PACKAGE_5G = /5[Gg]/;
    const mainPackage = this.transaction.data.mainPackage;
    if (mainPackage && REGEX_PACKAGE_5G.test(mainPackage.productPkg)) {
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

}

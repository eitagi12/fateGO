
import { OnDestroy, OnInit, Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { PromotionShelve, HomeService, PageLoadingService, AlertService, PromotionShelveItem } from 'mychannel-shared-libs';
import * as moment from 'moment';

import {
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_ID_CARD_CAPTURE_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_ON_TOP_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_CUSTOMER_INFO_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_VALIDATE_CUSTOMER_ID_CARD_REPI_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_ONE_LOVE_PAGE
} from '../../constants/route-path.constant';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { WIZARD_ORDER_PRE_TO_POST } from 'src/app/order/constants/wizard.constant';
import { Transaction, TransactionAction } from 'src/app/shared/models/transaction.model';

@Component({
  selector: 'app-device-order-ais-pre-to-post-select-package-page',
  templateUrl: './device-order-ais-pre-to-post-select-package-page.component.html',
  styleUrls: ['./device-order-ais-pre-to-post-select-package-page.component.scss']
})
export class DeviceOrderAisPreToPostSelectPackagePageComponent implements OnInit, OnDestroy {

  @ViewChild('conditionTemplate')
  conditionTemplate: any;

  wizards = WIZARD_ORDER_PRE_TO_POST;

  transaction: Transaction;
  promotionShelves: PromotionShelve[];
  condition: any;
  modalRef: BsModalRef;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private alertService: AlertService,
    private modalService: BsModalService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private http: HttpClient
  ) {
    this.transaction = this.transactionService.load();

    delete this.transaction.data.mainPackageOneLove;
    if (this.transaction.data.billingInformation) {
      delete this.transaction.data.billingInformation.billCycle;
      delete this.transaction.data.billingInformation.mergeBilling;
    }
  }

  ngOnInit() {
    this.callService();
  }

  onBack() {
    const action = this.transaction.data.action;
    if (action === TransactionAction.READ_CARD_REPI) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_VALIDATE_CUSTOMER_ID_CARD_REPI_PAGE]);
    } else if (action === TransactionAction.READ_CARD) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_CUSTOMER_INFO_PAGE]);
    } else if (action === TransactionAction.KEY_IN_REPI) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_VALIDATE_CUSTOMER_ID_CARD_REPI_PAGE]);
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_ID_CARD_CAPTURE_PAGE]);
    }
  }

  onNext() {
    if (this.isPackageOneLove()) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_ONE_LOVE_PAGE]);
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_ON_TOP_PAGE]);
    }
  }

  onHome() {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

  onCompleted(promotion) {
    this.transaction.data.mainPackage = promotion;
  }

  callService() {

    this.pageLoadingService.openLoading();
    const billingInformation = this.transaction.data.billingInformation;
    const mobileNo = this.transaction.data.simCard.mobileNo;

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
          params: {
            orderType: 'Change Charge Type',
            registerDate: regisDate,
            isNetExtreme: isNetExtreme
          }
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
                          title: promotion.shortNameThai,
                          detail: promotion.statementThai,
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

  onTermConditions(condition: any) {
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
}

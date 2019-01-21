import { Component, OnInit, ViewChild } from '@angular/core';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { PromotionShelve, HomeService, PageLoadingService, AlertService, PromotionShelveItem } from 'mychannel-shared-libs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient } from '@angular/common/http';
import { ROUTE_DEVICE_ORDER_AIS_EXISTING_PAYMENT_DETAIL_PAGE, ROUTE_DEVICE_ORDER_AIS_EXISTING_EFFECTIVE_START_DATE_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-existing-select-package-page',
  templateUrl: './device-order-ais-existing-select-package-page.component.html',
  styleUrls: ['./device-order-ais-existing-select-package-page.component.scss']
})
export class DeviceOrderAisExistingSelectPackagePageComponent implements OnInit {

  @ViewChild('conditionTemplate')
  conditionTemplate: any;

  wizards = WIZARD_DEVICE_ORDER_AIS;

  transaction: Transaction;
  promotionShelves: PromotionShelve[];
  condition: any;
  modalRef: BsModalRef;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private alertService: AlertService,
    private modalService: BsModalService,
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

  onCompleted(promotion: any) {
    // รอแก้ไขตัวแปรที่จะเก็บลงใน share transaction
    this.transaction.data.mainPackage = promotion;
  }

  onBack() {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_PAYMENT_DETAIL_PAGE]);
  }

  onNext() {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_EFFECTIVE_START_DATE_PAGE]);
  }

  onHome() {
    this.homeService.goToHome();
  }

  callService() {
    this.pageLoadingService.openLoading();

    const billingInformation: any = this.transaction.data.billingInformation;
    const isNetExtreme = billingInformation.billCyclesNetExtreme && billingInformation.billCyclesNetExtreme.length > 0 ? 'true' : 'false';
    const mobileNo = this.transaction.data.simCard.mobileNo;

    this.http.get(`/api/customerportal/queryCheckMinimumPackage/${mobileNo}`, {
    }).toPromise()
      .then((resp: any) => {
        const data = resp.data || {};
        return data.MinimumPriceForPackage || 0;
      }).then((minimumPriceForPackage: string) => {
        return this.http.get('/api/customerportal/newRegister/queryMainPackage', {
          params: {
            orderType: 'New Registration',
            isNetExtreme: isNetExtreme,
            minPromotionPrice: minimumPriceForPackage
          }
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
      })
      .then((promotionShelves: PromotionShelve[]) => {
        this.promotionShelves = this.buildPromotionShelveActive(promotionShelves);
      })
      .then(() => {
        this.pageLoadingService.closeLoading();
      });

  }

  onTermConditions(condition: string) {
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
    this.transactionService.update(this.transaction);
  }
}

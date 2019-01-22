import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PromotionShelve, HomeService, PageLoadingService } from 'mychannel-shared-libs';

import { WIZARD_DEVICE_ORDER_AIS } from '../../../../constants/wizard.constant';
import {
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_SELECT_PACKAGE_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_MERGE_BILLING_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_CONFIRM_USER_INFORMATION_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_ONE_LOVE_PAGE
} from '../../constants/route-path.constant';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';

@Component({
  selector: 'app-device-order-ais-pre-to-post-on-top-page',
  templateUrl: './device-order-ais-pre-to-post-on-top-page.component.html',
  styleUrls: ['./device-order-ais-pre-to-post-on-top-page.component.scss']
})
export class DeviceOrderAisPreToPostOnTopPageComponent implements OnInit, OnDestroy {

  wizards = WIZARD_DEVICE_ORDER_AIS;

  promotionShelves: PromotionShelve[];
  transaction: Transaction;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private http: HttpClient,
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit() {
    this.callService();
  }

  callService() {
    this.http.get('/api/customerportal/newRegister/queryOnTopPackage', {
      params: {
        orderType: 'Change Charge Type',
        billingSystem: this.transaction.data.mainPackage.billingSystem
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
                  id: subShelve.subShelveId,
                  title: subShelve.title,
                  sanitizedName: subShelve.sanitizedName,
                  items: (subShelve.items || []).map((promotion: any) => {
                    return { // item
                      id: promotion.itemId,
                      title: promotion.shortNameThai,
                      detail: promotion.statementThai,
                      value: promotion
                    };
                  })
                };
              })
          };
        });
        return Promise.resolve(promotionShelves);
      }).then((promotionShelves: PromotionShelve[]) => {
        this.promotionShelves = promotionShelves;
        if (this.promotionShelves && this.promotionShelves.length > 0) {
          this.promotionShelves[0].active = true;
          if (this.promotionShelves[0].promotions && this.promotionShelves[0].promotions.length > 0) {
            this.promotionShelves[0].promotions[0].active = true;
          }
        } else {
          this.onNext();
        }
      }).then(() => {
        this.pageLoadingService.closeLoading();
      });

  }

  onCompleted(promotion: any) {
    this.transaction.data.mainPackage = promotion;
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }


  onTermConditions() { }

  onBack() {
    if (this.transaction.data.mainPackageOneLove) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_ONE_LOVE_PAGE]);
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_SELECT_PACKAGE_PAGE]);
    }
  }

  onNext() {
    this.isNetExtreme() ?
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_MERGE_BILLING_PAGE]) :
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_CONFIRM_USER_INFORMATION_PAGE]);
  }

  onHome() {
    this.homeService.goToHome();
  }

  isNetExtreme(): boolean {
    const productPkg = this.transaction.data.mainPackage.productPkg || '';
    const regexNetExtreme: RegExp = /[Nn]et[Ee]xtreme/;
    return regexNetExtreme.test(productPkg);
  }
}

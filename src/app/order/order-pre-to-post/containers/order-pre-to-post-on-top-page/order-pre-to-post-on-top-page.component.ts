import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { WIZARD_ORDER_PRE_TO_POST } from 'src/app/order/constants/wizard.constant';
import { PromotionShelve, HomeService, PageLoadingService } from 'mychannel-shared-libs';
import {
  ROUTE_ORDER_PRE_TO_POST_SELECT_PACKAGE_PAGE,
  ROUTE_ORDER_PRE_TO_POST_MERGE_BILLING_PAGE,
  ROUTE_ORDER_PRE_TO_POST_CONFIRM_USER_INFORMATION_PAGE,
  ROUTE_ORDER_PRE_TO_POST_ONE_LOVE_PAGE
} from 'src/app/order/order-pre-to-post/constants/route-path.constant';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient } from '@angular/common/http';
import { Transaction } from 'src/app/shared/models/transaction.model';

@Component({
  selector: 'app-order-pre-to-post-on-top-page',
  templateUrl: './order-pre-to-post-on-top-page.component.html',
  styleUrls: ['./order-pre-to-post-on-top-page.component.scss']
})
export class OrderPreToPostOnTopPageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_ORDER_PRE_TO_POST;

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

  ngOnInit(): void {
    this.callService();
  }

  callService(): void {
    // /api/customerportal/newRegister/queryOnTopPackage?orderType=Change%20Charge%20Type&billingSystem=IRB
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

  onCompleted(promotion: any): void {
    this.transaction.data.onTopPackage = promotion;
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

  onTermConditions(): void { }

  onBack(): void {
    if (this.transaction.data.mainPackageOneLove) {
      this.router.navigate([ROUTE_ORDER_PRE_TO_POST_ONE_LOVE_PAGE]);
    } else {
      this.router.navigate([ROUTE_ORDER_PRE_TO_POST_SELECT_PACKAGE_PAGE]);
    }
  }

  onNext(): void {
    this.isNetExtreme() ?
      this.router.navigate([ROUTE_ORDER_PRE_TO_POST_MERGE_BILLING_PAGE]) :
      this.router.navigate([ROUTE_ORDER_PRE_TO_POST_CONFIRM_USER_INFORMATION_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  isNetExtreme(): boolean {
    const productPkg = this.transaction.data.mainPackage.productPkg || '';
    const regexNetExtreme: RegExp = /[Nn]et[Ee]xtreme/;
    return regexNetExtreme.test(productPkg);
  }
}

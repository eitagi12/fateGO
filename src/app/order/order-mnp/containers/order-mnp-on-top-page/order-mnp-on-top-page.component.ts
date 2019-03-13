import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_ORDER_MNP } from 'src/app/order/constants/wizard.constant';
import { PromotionShelve, HomeService, PageLoadingService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient } from '@angular/common/http';
import {
  ROUTE_ORDER_MNP_MERGE_BILLING_PAGE,
  ROUTE_ORDER_MNP_SELECT_PACKAGE_PAGE,
  ROUTE_ORDER_MNP_CONFIRM_USER_INFORMATION_PAGE
} from 'src/app/order/order-mnp/constants/route-path.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';

@Component({
  selector: 'app-order-mnp-on-top-page',
  templateUrl: './order-mnp-on-top-page.component.html',
  styleUrls: ['./order-mnp-on-top-page.component.scss']
})
export class OrderMnpOnTopPageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_ORDER_MNP;

  promotionShelves: PromotionShelve[];
  transaction: Transaction;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private http: HttpClient
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.callService();
  }

  callService(): void {
    this.pageLoadingService.openLoading();
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
        this.pageLoadingService.closeLoading();
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
    this.transaction.data.mainPackage = promotion;
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

  onTermConditions(): void { }

  onBack(): void {
    this.router.navigate([ROUTE_ORDER_MNP_SELECT_PACKAGE_PAGE]);
  }

  onNext(): void {
    const mainPackage = this.transaction.data.mainPackage;
    this.isNetExtreme(mainPackage.productPkg) ?
      this.router.navigate([ROUTE_ORDER_MNP_MERGE_BILLING_PAGE]) :
      this.router.navigate([ROUTE_ORDER_MNP_CONFIRM_USER_INFORMATION_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  isNetExtreme(productPkg: string): boolean {
    const regexNetExtreme: RegExp = /[Nn]et[Ee]xtreme/;
    return regexNetExtreme.test(productPkg);
  }

}

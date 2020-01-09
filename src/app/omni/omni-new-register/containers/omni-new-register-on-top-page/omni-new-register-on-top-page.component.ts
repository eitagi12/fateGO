import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_OMNI_NEW_REGISTER } from 'src/app/omni/constants/wizard.constant';
import { Router } from '@angular/router';
import {
  ROUTE_OMNI_NEW_REGISTER_CONFIRM_USER_INFORMATION_PAGE,
  ROUTE_OMNI_NEW_REGISTER_ONE_LOVE_PAGE,
  ROUTE_OMNI_NEW_REGISTER_MERGE_BILLING_PAGE,
  ROUTE_OMNI_NEW_REGISTER_FACE_CONFIRM_PAGE,
} from 'src/app/omni/omni-new-register/constants/route-path.constant';
import { PromotionShelve, HomeService, PageLoadingService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-omni-new-register-on-top-page',
  templateUrl: './omni-new-register-on-top-page.component.html',
  styleUrls: ['./omni-new-register-on-top-page.component.scss']
})
export class OmniNewRegisterOnTopPageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_OMNI_NEW_REGISTER;

  transaction: Transaction;
  promotionShelves: PromotionShelve[];

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
    this.pageLoadingService.openLoading();
    // /api/customerportal/newRegister/queryOnTopPackage?orderType=Change%20Charge%20Type&billingSystem=IRB
    this.http.get('/api/customerportal/newRegister/queryOnTopPackage', {
      params: {
        orderType: 'New Registration',
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

  onBack(): void {
    if (this.transaction.data.mainPackageOneLove) {
      this.router.navigate([ROUTE_OMNI_NEW_REGISTER_ONE_LOVE_PAGE]);
    } else {
      this.router.navigate([ROUTE_OMNI_NEW_REGISTER_FACE_CONFIRM_PAGE]);
    }
  }

  onCompleted(promotion: any): void {
    this.transaction.data.mainPackage = promotion;
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

  onTermConditions(): void { }

  onNext(): void {
    if (this.isPackageNetExtreme()) {
      this.router.navigate([ROUTE_OMNI_NEW_REGISTER_MERGE_BILLING_PAGE]);
    } else {
      this.router.navigate([ROUTE_OMNI_NEW_REGISTER_CONFIRM_USER_INFORMATION_PAGE]);
    }
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  isPackageNetExtreme(): boolean {
    const REGEX_NET_EXTREME = /[Nn]et[Ee]xtreme/;
    const mainPackage = this.transaction.data.mainPackage;
    return mainPackage && REGEX_NET_EXTREME.test(mainPackage.productPkg);
  }

}

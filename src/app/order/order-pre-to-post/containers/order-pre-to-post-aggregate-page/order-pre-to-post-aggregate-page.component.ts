import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { WIZARD_ORDER_PRE_TO_POST } from 'src/app/order/constants/wizard.constant';
import {
  ROUTE_ORDER_PRE_TO_POST_RESULT_PAGE,
  ROUTE_ORDER_PRE_TO_POST_AGREEMENT_SIGN_PAGE,
  ROUTE_ORDER_PRE_TO_POST_EAPPLICATION_PAGE
} from 'src/app/order/order-pre-to-post/constants/route-path.constant';
import { HomeService, AisNativeService, PageLoadingService } from 'mychannel-shared-libs';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { Subscription } from 'rxjs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

export interface Balance {
  remainingBalance: number;
  transferBalance: number;
  validityDate: string;
}
export interface CurrentServices {
  canTransfer: boolean;
  serviceCode: string;
  serviceName: string;
}

@Component({
  selector: 'app-order-pre-to-post-aggregate-page',
  templateUrl: './order-pre-to-post-aggregate-page.component.html',
  styleUrls: ['./order-pre-to-post-aggregate-page.component.scss']
})
export class OrderPreToPostAggregatePageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_ORDER_PRE_TO_POST;

  transaction: Transaction;
  mobileNo: string;

  balance: Balance;
  serviceChange: CurrentServices[];
  serviceAfterChanged: CurrentServices[];

  constructor(
    private router: Router,
    private http: HttpClient,
    private transactionService: TransactionService,
    private homeService: HomeService,
    private pageLoadingService: PageLoadingService,
    public translationService: TranslateService,
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.mobileNo = this.transaction.data.simCard.mobileNo;

    this.pageLoadingService.openLoading();

    this.http.get(`/api/customerportal/newRegister/${this.mobileNo}/queryBalance`).toPromise()
      .then((resp: any) => {

        this.balance = resp.data || [];
        return this.http.get(`/api/customerportal/newRegister/${this.mobileNo}/queryCurrentServices`).toPromise();

      }).then((resp: any) => {

        const currentServices = resp.data || [];
        this.serviceChange = currentServices.services.filter(service => service.canTransfer);
        this.pageLoadingService.closeLoading();

      }).catch((error: any) => {
        this.pageLoadingService.closeLoading();
      });
  }

  onBack(): void {
    this.router.navigate([ROUTE_ORDER_PRE_TO_POST_AGREEMENT_SIGN_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_ORDER_PRE_TO_POST_EAPPLICATION_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { Router } from '@angular/router';
import { CreateEapplicationService } from 'src/app/shared/services/create-eapplication.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HomeService, PageLoadingService } from 'mychannel-shared-libs';
import {
  ROUTE_ORDER_PRE_TO_POST_AGREEMENT_SIGN_PAGE,
  ROUTE_ORDER_PRE_TO_POST_RESULT_PAGE,
  ROUTE_ORDER_PRE_TO_POST_EAPPLICATION_PAGE,
  ROUTE_ORDER_PRE_TO_POST_AGGREGATE_PAGE
} from '../../constants/route-path.constant';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-order-pre-to-post-eapplication-page',
  templateUrl: './order-pre-to-post-eapplication-page.component.html',
  styleUrls: ['./order-pre-to-post-eapplication-page.component.scss']
})
export class OrderPreToPostEapplicationPageComponent implements OnInit, OnDestroy {

  transaction: Transaction;
  getDataBase64Eapp: string;
  translationSubscribe: Subscription;

  constructor(
    private router: Router,
    private createEapplicationService: CreateEapplicationService,
    private transactionService: TransactionService,
    private translateService: TranslateService,
    private homeService: HomeService,
    private pageLoadingService: PageLoadingService) { }

  ngOnInit(): void {
    this.pageLoadingService.openLoading();
    this.transaction = this.transactionService.load();
    this.callService(this.transaction, this.translateService.currentLang);
    this.translationSubscribe = this.translateService.onLangChange.subscribe(language => {
      this.callService(this.transaction, language.lang);
    });
  }

  callService(transaction: Transaction, language: string): void {
    console.log('transaction', transaction);
    this.createEapplicationService.createEapplicationV2(transaction, language).then(res => {
      this.getDataBase64Eapp = 'data:image/jpeg;base64,' + res.data;
    }).then(() => {
      this.pageLoadingService.closeLoading();
    });
  }

  onBack(): void {
    this.router.navigate([ROUTE_ORDER_PRE_TO_POST_AGGREGATE_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_ORDER_PRE_TO_POST_RESULT_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.translationSubscribe.unsubscribe();
    this.transactionService.update(this.transaction);
  }

}

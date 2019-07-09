import { Component, OnInit, OnDestroy } from '@angular/core';
import { CreateEapplicationService } from 'src/app/shared/services/create-eapplication.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Router } from '@angular/router';
import {
  ROUTE_ORDER_NEW_REGISTER_AGREEMENT_SIGN_PAGE,
  ROUTE_ORDER_NEW_REGISTER_PERSO_SIM_PAGE,
  ROUTE_ORDER_NEW_REGISTER_SUMMARY_PAGE,
  ROUTE_ORDER_NEW_REGISTER_RESULT_PAGE
} from 'src/app/order/order-new-register/constants/route-path.constant';
import { HomeService, PageLoadingService } from 'mychannel-shared-libs';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-order-new-register-eapplication-page',
  templateUrl: './order-new-register-eapplication-page.component.html',
  styleUrls: ['./order-new-register-eapplication-page.component.scss']
})
export class OrderNewRegisterEapplicationPageComponent implements OnInit, OnDestroy {

  transaction: Transaction;
  getDataBase64Eapp: string;
  translationSubscribe: Subscription;

  constructor(
    private router: Router,
    private createEapplicationService: CreateEapplicationService,
    private transactionService: TransactionService,
    private homeService: HomeService,
    private translateService: TranslateService,
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
    this.createEapplicationService.createEapplicationV2(transaction, language).then(res => {
      this.getDataBase64Eapp = 'data:image/jpeg;base64,' + res.data;
    }).then(() => {
      this.pageLoadingService.closeLoading();
    });
  }

  onBack(): void {
    this.router.navigate([ROUTE_ORDER_NEW_REGISTER_AGREEMENT_SIGN_PAGE]);
  }

  onNext(): void {
    if (this.transaction.data.simCard.simSerial) {
      this.router.navigate([ROUTE_ORDER_NEW_REGISTER_RESULT_PAGE]);
    } else {
      this.router.navigate([ROUTE_ORDER_NEW_REGISTER_PERSO_SIM_PAGE]);
    }
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.translationSubscribe.unsubscribe();
    this.transactionService.save(this.transaction);
  }
}

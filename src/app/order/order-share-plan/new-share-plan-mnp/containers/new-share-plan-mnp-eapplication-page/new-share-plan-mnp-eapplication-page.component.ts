import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_NEW_SHARE_PLAN_MNP_AGREEMENT_SIGN_PAGE, ROUTE_NEW_SHARE_PLAN_MNP_RESULT_PAGE, ROUTE_NEW_SHARE_PLAN_MNP_PERSO_SIM_NEW_PAGE } from '../../constants/route-path.constant';
import { PageLoadingService, HomeService } from 'mychannel-shared-libs';
import { TranslateService } from '@ngx-translate/core';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { CreateEapplicationService } from 'src/app/shared/services/create-eapplication.service';
import { Subscription } from 'rxjs';
import { Transaction } from 'src/app/shared/models/transaction.model';

@Component({
  selector: 'app-new-share-plan-mnp-eapplication-page',
  templateUrl: './new-share-plan-mnp-eapplication-page.component.html',
  styleUrls: ['./new-share-plan-mnp-eapplication-page.component.scss']
})
export class NewSharePlanMnpEapplicationPageComponent implements OnInit, OnDestroy {

  transaction: Transaction;
  getDataBase64Eapp: string;
  translationSubscribe: Subscription;

  constructor(
    private router: Router,
    private createEapplicationService: CreateEapplicationService,
    private transactionService: TransactionService,
    private homeService: HomeService,
    private translateService: TranslateService,
    private pageLoadingService: PageLoadingService
  ) { }

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
      console.log('res DATA => ', res);
      this.getDataBase64Eapp = 'data:image/jpeg;base64,' + res.data;
    }).then(() => {
      this.pageLoadingService.closeLoading();
    });
  }

  onBack(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_AGREEMENT_SIGN_PAGE]);
  }

  onNext(): void {
    if (this.transaction.data.simCard.simSerial) {
      this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_RESULT_PAGE]);
    } else {
      this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_PERSO_SIM_NEW_PAGE]);
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

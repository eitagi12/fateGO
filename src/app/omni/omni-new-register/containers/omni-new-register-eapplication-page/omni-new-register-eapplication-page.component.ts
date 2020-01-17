import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {
  ROUTE_OMNI_NEW_REGISTER_AGREEMENT_SIGN_PAGE,
  ROUTE_OMNI_NEW_REGISTER_PERSO_SIM_PAGE,
  ROUTE_OMNI_NEW_REGISTER_SUMMARY_PAGE,
  ROUTE_OMNI_NEW_REGISTER_RESULT_PAGE
} from 'src/app/omni/omni-new-register/constants/route-path.constant';
import { HomeService, PageLoadingService } from 'mychannel-shared-libs';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Transaction } from 'src/app/omni/omni-shared/models/transaction.model';
import { CreateEapplicationService } from 'src/app/omni/omni-shared/services/create-eapplication.service';
import { TransactionService } from 'src/app/omni/omni-shared/services/transaction.service';

@Component({
  selector: 'app-omni-new-register-eapplication-page',
  templateUrl: './omni-new-register-eapplication-page.component.html',
  styleUrls: ['./omni-new-register-eapplication-page.component.scss']
})
export class OmniNewRegisterEapplicationPageComponent implements OnInit, OnDestroy {

  transaction: Transaction;
  getDataBase64Eapp: string;
  // translationSubscribe: Subscription;

  constructor(
    private router: Router,
    private createEapplicationService: CreateEapplicationService,
    private transactionService: TransactionService,
    private homeService: HomeService,
    private translateService: TranslateService,
    private pageLoadingService: PageLoadingService,
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.pageLoadingService.openLoading();
    this.callService(this.transaction);
    // this.translationSubscribe = this.translateService.onLangChange.subscribe(language => {
    // this.callService();
    // });
  }

  callService(transaction: Transaction): void {
    this.createEapplicationService.createEapplicationV2(transaction).then(res => {
      this.getDataBase64Eapp = 'data:image/jpeg;base64,' + res.data;
    }).then(() => {
      this.pageLoadingService.closeLoading();
    });
  }

  onBack(): void {
    this.router.navigate([ROUTE_OMNI_NEW_REGISTER_AGREEMENT_SIGN_PAGE]);
  }

  onNext(): void {
    if (this.transaction.data.simCard.mobileNo) {
      this.router.navigate([ROUTE_OMNI_NEW_REGISTER_RESULT_PAGE]);
    } else {
      this.router.navigate([ROUTE_OMNI_NEW_REGISTER_PERSO_SIM_PAGE]);
    }
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    // this.translationSubscribe.unsubscribe();
    this.transactionService.save(this.transaction);
  }
}

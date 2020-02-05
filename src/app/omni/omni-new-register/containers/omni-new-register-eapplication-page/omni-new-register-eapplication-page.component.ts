import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {
  ROUTE_OMNI_NEW_REGISTER_AGREEMENT_SIGN_PAGE,
  ROUTE_OMNI_NEW_REGISTER_PERSO_SIM_PAGE,
  ROUTE_OMNI_NEW_REGISTER_AGREEMENT_SIGN_KEY_IN_PAGE
} from 'src/app/omni/omni-new-register/constants/route-path.constant';
import { HomeService, PageLoadingService } from 'mychannel-shared-libs';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Transaction, TransactionAction } from 'src/app/omni/omni-shared/models/transaction.model';
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

  constructor(
    private router: Router,
    private createEapplicationService: CreateEapplicationService,
    private transactionService: TransactionService,
    private homeService: HomeService,
    private pageLoadingService: PageLoadingService,
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.pageLoadingService.openLoading();
    if (this.transaction.data.action === TransactionAction.KEY_IN) {
      this.callService(this.transaction);
    } else {
      this.callServiceV2(this.transaction);
    }
  }

  callService(transaction: Transaction): void {
    this.createEapplicationService.createEapplication(transaction).then(res => {
      this.getDataBase64Eapp = 'data:image/jpeg;base64,' + res.data;
    }).then(() => {
      this.pageLoadingService.closeLoading();
    });
  }

  callServiceV2(transaction: Transaction): void {
    this.createEapplicationService.createEapplicationV2(transaction).then(res => {
      this.getDataBase64Eapp = 'data:image/jpeg;base64,' + res.data;
    }).then(() => {
      this.pageLoadingService.closeLoading();
    });
  }

  onBack(): void {
    if (this.transaction.data.action === TransactionAction.KEY_IN) {
      this.router.navigate([ROUTE_OMNI_NEW_REGISTER_AGREEMENT_SIGN_KEY_IN_PAGE]);
    } else {
      this.router.navigate([ROUTE_OMNI_NEW_REGISTER_AGREEMENT_SIGN_PAGE]);
    }
  }

  onNext(): void {
    if (this.transaction.data.cusMobileNo) {
      this.router.navigate([ROUTE_OMNI_NEW_REGISTER_PERSO_SIM_PAGE]);
    }
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
  }
}

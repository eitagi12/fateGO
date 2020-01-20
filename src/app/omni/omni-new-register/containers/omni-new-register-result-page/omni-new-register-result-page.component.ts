import { Component, OnInit } from '@angular/core';
import { WIZARD_OMNI_NEW_REGISTER } from 'src/app/omni/constants/wizard.constant';
import { HomeService, PageLoadingService } from 'mychannel-shared-libs';
import { Transaction } from 'src/app/omni/omni-shared/models/transaction.model';
import { TransactionService } from 'src/app/omni/omni-shared/services/transaction.service';
import { CreateNewRegisterService } from 'src/app/omni/omni-shared/services/create-new-register.service';

@Component({
  selector: 'app-omni-new-register-result-page',
  templateUrl: './omni-new-register-result-page.component.html',
  styleUrls: ['./omni-new-register-result-page.component.scss']
})
export class OmniNewRegisterResultPageComponent implements OnInit {

  wizards: string[] = WIZARD_OMNI_NEW_REGISTER;
  transaction: Transaction;
  isSuccess: boolean;
  createTransactionService: Promise<any>;
  constructor(
    private homeService: HomeService,
    private transactionService: TransactionService,
    private createNewRegisterService: CreateNewRegisterService,
    private pageLoadingService: PageLoadingService
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    // this.pageLoadingService.openLoading();
    this.createTransactionService = this.createNewRegisterService.createNewRegister(this.transaction)
      .then((resp: any) => {
        this.pageLoadingService.closeLoading();
      }).catch(() => {
        this.isSuccess = true;
        this.pageLoadingService.closeLoading();
      });
  }

  onMainMenu(): void {
    // bug gotohome จะ unlock เบอร์ ทำให้ออก orderไม่สำเร็จ
    window.location.href = `/sales-portal/reserve-stock/receive-confirm-online`;
    // this.homeService.goToHome();
  }
}

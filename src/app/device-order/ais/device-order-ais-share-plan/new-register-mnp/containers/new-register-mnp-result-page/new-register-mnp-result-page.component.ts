import { Component, OnInit } from '@angular/core';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-new-register-mnp-result-page',
  templateUrl: './new-register-mnp-result-page.component.html',
  styleUrls: ['./new-register-mnp-result-page.component.scss']
})
export class NewRegisterMnpResultPageComponent implements OnInit {
  transaction: Transaction;
  isSuccess: boolean;
  mobileNo: string;
  mainSimSerail: string;
  memberMobileNo: string;
  memberSimSerail: string;

  constructor(
    private transactionService: TransactionService
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.isSuccess = true;
    this.mobileNo = this.transaction.data.simCard.mobileNo;
    this.mainSimSerail = this.transaction.data.simCard.simSerial;
    this.memberMobileNo = '0910045268';
    this.memberSimSerail = this.transaction.data.simCard.simSerial;
  }

  onMainMenu(): void {
    if (environment.name === 'LOCAL') {
      window.location.href = '/main-menu';
    } else {
      window.location.href = '/smart-digital/main-menu';
    }
  }

}

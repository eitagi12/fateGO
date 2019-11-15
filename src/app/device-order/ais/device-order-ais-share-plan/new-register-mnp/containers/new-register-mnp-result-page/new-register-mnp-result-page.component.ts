import { Component, OnInit } from '@angular/core';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { environment } from 'src/environments/environment';
import { Transaction } from 'src/app/device-order/ais/device-order-ais-mnp/models/transaction.model';

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
    const mainSim = this.transaction.data.sim_card;
    const memberSim = this.transaction.data.sim_card.memberSimCard[0];

    this.isSuccess = true;
    this.mobileNo = mainSim.mobileNo;
    this.mainSimSerail = mainSim.simSerial;
    this.memberMobileNo = memberSim.mobileNo;
    this.memberSimSerail = memberSim.simSerial;
  }

  onMainMenu(): void {
    if (environment.name === 'LOCAL') {
      window.location.href = '/main-menu';
    } else {
      window.location.href = '/smart-digital/main-menu';
    }
  }

}

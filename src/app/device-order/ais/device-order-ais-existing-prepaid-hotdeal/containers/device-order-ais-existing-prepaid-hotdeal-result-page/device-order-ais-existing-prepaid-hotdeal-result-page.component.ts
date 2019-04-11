import { Component, OnInit } from '@angular/core';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-device-order-ais-existing-prepaid-hotdeal-result-page',
  templateUrl: './device-order-ais-existing-prepaid-hotdeal-result-page.component.html',
  styleUrls: ['./device-order-ais-existing-prepaid-hotdeal-result-page.component.scss']
})
export class DeviceOrderAisExistingPrepaidHotdealResultPageComponent implements OnInit {

  transaction: Transaction;

  constructor(
    private transactionService: TransactionService,
  ) {
    this.transaction = this.transactionService.load();
   }

  ngOnInit(): void {
  }

  onHome(): void {
    if (environment.name === 'LOCAL') {
      window.location.href = '/main-menu';
    } else {
      window.location.href = '/smart-digital/main-menu';
    }
  }
}

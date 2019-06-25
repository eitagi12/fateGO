import { Component, OnInit } from '@angular/core';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-device-order-ais-device-result-page',
  templateUrl: './device-order-ais-device-result-page.component.html',
  styleUrls: ['./device-order-ais-device-result-page.component.scss']
})
export class DeviceOrderAisDeviceResultPageComponent implements OnInit {
  transaction: Transaction;
  isSuccess: boolean;

  constructor(
    private transactionService: TransactionService
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.isSuccess = true;
  }

  onMainMenu(): void {
    if (environment.name === 'LOCAL') {
      window.location.href = '/main-menu';
    } else {
      window.location.href = '/smart-digital/main-menu';
    }
  }

}

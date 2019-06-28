import { Component, OnInit } from '@angular/core';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';

@Component({
  selector: 'app-device-order-ais-existing-gadget-result-page',
  templateUrl: './device-order-ais-existing-gadget-result-page.component.html',
  styleUrls: ['./device-order-ais-existing-gadget-result-page.component.scss']
})
export class DeviceOrderAisExistingGadgetResultPageComponent implements OnInit {

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
    this.transactionService.remove();
    window.location.href = '/';
  }

}

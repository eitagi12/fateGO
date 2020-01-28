import { Component, OnInit } from '@angular/core';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';

@Component({
  selector: 'app-device-only-shop-premium-result-page',
  templateUrl: './device-only-shop-premium-result-page.component.html',
  styleUrls: ['./device-only-shop-premium-result-page.component.scss']
})
export class DeviceOnlyShopPremiumResultPageComponent implements OnInit {
  transaction: Transaction;
  constructor(private transactionService: TransactionService) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
  }

  onMainMenu(): void {
    this.transactionService.remove();
    window.location.href = '/';
  }
}

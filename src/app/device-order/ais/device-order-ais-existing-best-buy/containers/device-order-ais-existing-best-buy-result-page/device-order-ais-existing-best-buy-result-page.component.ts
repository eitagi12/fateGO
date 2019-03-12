import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { ApiRequestService, PageLoadingService, HomeService } from 'mychannel-shared-libs';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';

@Component({
  selector: 'app-device-order-ais-existing-best-buy-result-page',
  templateUrl: './device-order-ais-existing-best-buy-result-page.component.html',
  styleUrls: ['./device-order-ais-existing-best-buy-result-page.component.scss']
})
export class DeviceOrderAisExistingBestBuyResultPageComponent implements OnInit {

  transaction: Transaction;
  isSuccess: boolean;

  constructor(
    private homeService: HomeService,
    private transactionService: TransactionService
  ) {
    this.transaction = this.transactionService.load();
   }

  ngOnInit(): void {
    this.isSuccess = true;
  }

  onMainMenu(): void {
    this.homeService.goToHome();
  }

}

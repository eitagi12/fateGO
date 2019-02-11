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

  identityValid = true;
  transaction: Transaction;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private apiRequestService: ApiRequestService,
    private http: HttpClient
  ) {
    this.transaction = this.transactionService.load();
   }

  ngOnInit() {
  }

  onMainMenu() {
    this.homeService.goToHome();
  }

}

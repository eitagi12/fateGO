import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { ApiRequestService, PageLoadingService, HomeService } from 'mychannel-shared-libs';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';

@Component({
  selector: 'app-deposit-result',
  templateUrl: './deposit-result.component.html',
  styleUrls: ['./deposit-result.component.scss']
})
export class DepositResultComponent implements OnInit {

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
    this.transactionService.remove();
    window.location.href = '/';
  }

}

import { Component, OnInit } from '@angular/core';
import { Transaction, Customer, RomTransaction } from 'src/app/shared/models/transaction.model';
import { CustomerInfo, HomeService, PageLoadingService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import {ROUTE_ROM_TRANSACTION_SHOW_INFORMATION_PAGE } from 'src/app/rom-transaction/constants/route-path.constant';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-rom-transaction-result-page',
  templateUrl: './rom-transaction-result-page.component.html',
  styleUrls: ['./rom-transaction-result-page.component.scss']
})
export class RomTransactionResultPageComponent implements OnInit {

  success: boolean = false;
  transaction: Transaction;
  romTransaction: RomTransaction;
  createRomTransaction: Promise<any>;
  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private pageLoadingService: PageLoadingService,
    private http: HttpClient,
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.romTransaction = this.transaction.data.romTransaction;
    this.callService();
  }

  callService(): void {
    this.pageLoadingService.openLoading();
    this.createRomTransaction = this.http.post('/api/customerportal/update-rom-transaction' , {
      username: this.romTransaction.username,
      transaction: this.romTransaction.romTransaction.transactionId,
      status: 'Complete',
      transactionStatus: 'Mandatory'
    }).toPromise()
    .then(() => {
      this.success = true;
      this.pageLoadingService.closeLoading();
    });
  }

  onHome(): void {
    this.homeService.goToHome();
  }
}

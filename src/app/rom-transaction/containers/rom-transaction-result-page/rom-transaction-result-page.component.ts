import { Component, OnInit } from '@angular/core';
import { Transaction, Customer } from 'src/app/shared/models/transaction.model';
import { CustomerInfo, HomeService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import {ROUTE_ROM_TRANSACTION_SHOW_INFORMATION_PAGE } from 'src/app/rom-transaction/constants/route-path.constant';

@Component({
  selector: 'app-rom-transaction-result-page',
  templateUrl: './rom-transaction-result-page.component.html',
  styleUrls: ['./rom-transaction-result-page.component.scss']
})
export class RomTransactionResultPageComponent implements OnInit {

  success: boolean = true;
  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
  ) {
  }

  ngOnInit(): void {

  }

  onBack(): void {
    this.router.navigate([ROUTE_ROM_TRANSACTION_SHOW_INFORMATION_PAGE]);
  }

  onNext(): void {
    // this.router.navigate([ROUTE_ROM_TRANSACTION_RESULT_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }
}

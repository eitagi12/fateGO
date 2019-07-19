import { Component, OnInit } from '@angular/core';
import { Transaction, Customer } from 'src/app/shared/models/transaction.model';
import { CustomerInfo, HomeService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ROUTE_ROM_TRANSACTION_RESULT_PAGE } from 'src/app/rom-transaction/constants/route-path.constant';

@Component({
  selector: 'app-rom-transaction-show-information-page',
  templateUrl: './rom-transaction-show-information-page.component.html',
  styleUrls: ['./rom-transaction-show-information-page.component.scss']
})
export class RomTransactionShowInformationPageComponent implements OnInit {

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
  ) {
  }

  ngOnInit(): void {

  }

  onBack(): void {
    // this.router.navigate([ROUTE_ORDER_NEW_REGISTER_VALIDATE_CUSTOMER_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_ROM_TRANSACTION_RESULT_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }
}

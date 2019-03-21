import { Component, OnInit } from '@angular/core';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';

@Component({
  selector: 'app-summary-seller-code',
  templateUrl: './summary-seller-code.component.html',
  styleUrls: ['./summary-seller-code.component.scss']
})
export class SummarySellerCodeComponent implements OnInit {

  transaction: Transaction;
  locationCode: string;

  constructor(
    private transacService: TransactionService
  ) {
    this.transaction = this.transacService.load();
  }

  ngOnInit(): void {
    this.locationCode = this.transaction.data.seller.locationCode ? this.transaction.data.seller.locationCode : '';
  }

}

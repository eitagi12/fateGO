import { Component, OnInit } from '@angular/core';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';

@Component({
  selector: 'app-summary-order-detail',
  templateUrl: './summary-order-detail.component.html',
  styleUrls: ['./summary-order-detail.component.scss']
})
export class SummaryOrderDetailComponent implements OnInit {

  priceOption: PriceOption;
  transaction: Transaction;
  price: any;

  constructor(
    private priceOptionService: PriceOptionService,
    private transactionService: TransactionService
  ) {
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.price = this.priceOption.trade.priceType === 'NORMAL' ? this.priceOption.trade.normalPrice : this.priceOption.trade.promotionPrice;
  }

  summary(amount: number[]): number {
    return amount.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
  }

}

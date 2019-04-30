import { Component, OnInit } from '@angular/core';
import { TradeInTranscation } from 'src/app/trade-in/services/models/trade-in-transcation.model';
import { TradeInTransactionService } from 'src/app/trade-in/services/trade-in-transaction.service';

@Component({
  selector: 'app-header-trade-in-page',
  templateUrl: './header-trade-in-page.component.html',
  styleUrls: ['./header-trade-in-page.component.scss']
})
export class HeaderTradeInPageComponent implements OnInit {
  tradeInTransaction: TradeInTranscation;

    constructor(private tradeInTransactionService: TradeInTransactionService) {
      this.tradeInTransaction = this.tradeInTransactionService.load();
     }
  ngOnInit(): void {
  }

}

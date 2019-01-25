import { Component, OnInit } from '@angular/core';
import { TradeInTransactionService } from '../../services/trade-in-transaction.service';
import { TradeInTranscation } from '../../services/models/trade-in-transcation.model';

@Component({
  selector: 'app-header-trade-in',
  templateUrl: './header-trade-in.component.html',
  styleUrls: ['./header-trade-in.component.scss']
})
export class HeaderTradeInComponent implements OnInit {
  tradeInTransaction: TradeInTranscation;

  constructor(private tradeInTransactionService: TradeInTransactionService) {
    this.tradeInTransaction = this.tradeInTransactionService.load();
   }

  ngOnInit() {
  }

}

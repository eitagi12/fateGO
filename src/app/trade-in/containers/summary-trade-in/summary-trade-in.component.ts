import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TradeInTranscation } from '../../services/models/trade-in-transcation.model';
import { TradeInTransactionService } from '../../services/trade-in-transaction.service';

@Component({
  selector: 'app-summary-trade-in',
  templateUrl: './summary-trade-in.component.html',
  styleUrls: ['./summary-trade-in.component.scss']
})

export class SummaryTradeInComponent implements OnInit {
  tradeInTransaction: TradeInTranscation;
  tradeinNo: string;
  brand: string;
  modelTradein: string;
  imeiTradein: string;
  tradeinPrice: string;
  tradeinGrade: string;

  constructor(private router: Router,
    private tradeInTransactionService: TradeInTransactionService) {
    this.tradeInTransaction = this.tradeInTransactionService.load();
  }

  ngOnInit() {
    this.summaryTradein();
  }

  summaryTradein() {
    this.tradeinNo = this.tradeInTransaction.data.tradeIn.tradeInNo;
    this.brand = this.tradeInTransaction.data.tradeIn.brand;
    this.modelTradein = this.tradeInTransaction.data.tradeIn.model;
    this.tradeinGrade = this.tradeInTransaction.data.tradeIn.tradeInGrade;
    this.imeiTradein = this.tradeInTransaction.data.tradeIn.serialNo;
    this.tradeinPrice = this.tradeInTransaction.data.tradeIn.tradeInPrice;
  }

  gotoMainMenu() {
    window.location.href = '/sales-portal/dashboard';
  }

  gotoPrintSummary() {
    this.router.navigate(['trade-in/receipt-trade-in']);
  }
}

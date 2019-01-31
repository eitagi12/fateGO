import { Component, OnInit } from '@angular/core';
import { HomeService } from 'mychannel-shared-libs';
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
    const tradeInTransaction = this.tradeInTransaction.data.tradeIn;
    this.tradeinNo = tradeInTransaction.tradeInNo;
    this.brand = tradeInTransaction.brand;
    this.modelTradein = tradeInTransaction.model;
    this.tradeinGrade = tradeInTransaction.tradeInGrade;
    this.imeiTradein = tradeInTransaction.serialNo;
    this.tradeinPrice = tradeInTransaction.tradeInPrice;
  }

  gotoMainMenu() {
    window.location.href = '/sales-portal/dashboard';
  }

  gotoPrintSummary() {
    this.router.navigate(['trade-in/receipt-trade-in']);
  }
}

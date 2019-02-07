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
  // aisNative: any = window.aisNative;
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
    // this.router.navigate(['trade-in/receipt-trade-in']);
    let aisNative = 'Mockup';
    let tradePrint = {
      tradeinNo : this.tradeinNo,
      brand : this.brand,
      modelTradein : this.modelTradein,
      tradeinGrade : this.tradeinGrade,
      imeiTradein : this.imeiTradein,
      tradeinPrice : this.tradeinPrice
    }

    // if (typeof this.aisNative !== "undefined") {
    if (aisNative !== "undefined") {
      console.log('Hello one');
      this.callPrint(tradePrint);
    } else {
      console.log('Hello two');
    }
  }

  callPrint (tradeRep : any) {
    console.log('Hello Print Show !');
  }
}

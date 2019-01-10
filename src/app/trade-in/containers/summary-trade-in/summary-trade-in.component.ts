import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-summary-trade-in',
  templateUrl: './summary-trade-in.component.html',
  styleUrls: ['./summary-trade-in.component.scss']
})
export class SummaryTradeInComponent implements OnInit {

  tradeinNo: string;
  modelTradein: string;
  imeiTradein: string;
  tradeinPrice: string;
  tradeinGrade: string;

  tradeInService: any;

  constructor() { }

  ngOnInit() {
    this.summaryTradein();
  }

  summaryTradein() {
    const criteriaTradein: any = JSON.parse(localStorage.getItem('criteriaTradein'));

    this.tradeinNo = criteriaTradein.tradeinNo;
    this.modelTradein = criteriaTradein.modelTradein;
    this.imeiTradein = criteriaTradein.imeiTradein;
    this.tradeinPrice = criteriaTradein.tradeinPrice;
    this.tradeinGrade = criteriaTradein.tradeinGrade;
  }

}

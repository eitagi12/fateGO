import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-summary-trade-in',
  templateUrl: './summary-trade-in.component.html',
  styleUrls: ['./summary-trade-in.component.scss']
})
export class SummaryTradeInComponent implements OnInit {

  tradeinNo : string;
  modelTradein : string;
  imeiTradein : string;
  estimatePrice : string;

  constructor() { }

  ngOnInit() {
    this.tradeinNo = 'TIxxxxxxxx';
    this.modelTradein = 'Samsung Galaxy S6';
    this.imeiTradein = 'xxxxxxxxxx';
    this.estimatePrice = 'B5,xxx';
    
  }

}

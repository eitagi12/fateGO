import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header-trade-in',
  templateUrl: './header-trade-in.component.html',
  styleUrls: ['./header-trade-in.component.scss']
})
export class HeaderTradeInComponent implements OnInit {

  tradeinNo: string;
  modelTradein: string;
  imeiTradein: string;
  estimatePrice: string;

  constructor() { }

  ngOnInit() {
    this.tradeinNo = 'TIxxxxxxxx';
    this.modelTradein = 'Samsung Galaxy S6';
    this.imeiTradein = 'xxxxxxxxxx';
    this.estimatePrice = 'B5,xxx';
  }

}

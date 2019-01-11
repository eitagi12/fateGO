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
    const criteriaTradein: any = JSON.parse(localStorage.getItem('Criteriatradein'));
    this.modelTradein = criteriaTradein.brand + ' ' + criteriaTradein.model;
    this.imeiTradein = criteriaTradein.serialNo;
  }

}

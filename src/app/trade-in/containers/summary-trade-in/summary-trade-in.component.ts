import { Component, OnInit } from '@angular/core';
import { HomeService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';

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

  constructor(private homeService: HomeService,
              private router: Router) { }

  ngOnInit() {
    this.summaryTradein();
  }

  summaryTradein() {
    const criteriaTradein: any = JSON.parse(localStorage.getItem('Criteriatradein'));
    console.log(criteriaTradein);
    this.tradeinNo = criteriaTradein.tradeinNo;
    this.modelTradein = criteriaTradein.model;
    this.imeiTradein = criteriaTradein.serialNo;
    this.tradeinPrice = criteriaTradein.tradeinPrice;
    this.tradeinGrade = criteriaTradein.tradeinGrade;
  }
  gotoMainMenu () {
    window.location.href = '/sale-portal/dashboard';
  }

  gotoPrintSummary() {
    this.router.navigate(['trade-in/receipt-trade-in']);
  }
}

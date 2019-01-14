import { Component, OnInit, Input } from '@angular/core';
import { TradeInService } from '../../services/trade-in.service';

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
  objTradein: any;
  constructor(private tradeInService: TradeInService) {
    this.objTradein = this.tradeInService.getTradein();
   }

  ngOnInit() {
    this.modelTradein = this.objTradein.brand + ' ' + this.objTradein.model;
    this.imeiTradein = this.objTradein.serialNo;
  }

}

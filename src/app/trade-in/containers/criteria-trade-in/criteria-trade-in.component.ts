import { Component, OnInit, Input } from '@angular/core';
import { HomeService, PageLoadingService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { TradeInService } from '../../services/trade-in.service';
import { Subscription } from 'rxjs';
import { Criteriatradein, Tradein } from '../../models/trade-in.models';

@Component({
  selector: 'app-criteria-trade-in',
  templateUrl: './criteria-trade-in.component.html',
  styleUrls: ['./criteria-trade-in.component.scss']
})
export class CriteriaTradeInComponent implements OnInit {

  valuationlists: any;
  objCriteriatradein: Criteriatradein;
  objTradein: any;
  constructor(private router: Router,
    private homeService: HomeService,
    private tradeInService: TradeInService,
    private pageLoadingService: PageLoadingService) { }

  ngOnInit() {
   this.ListValuationTradein();
   this.objTradein = this.tradeInService.getTradein();
  }

  ListValuationTradein() {
    this.pageLoadingService.openLoading();
    const tradeIn: any = JSON.parse(localStorage.getItem('Tradein'));
    const brand: any = tradeIn.brand;
    const model: any = tradeIn.model;


    this.tradeInService.getListValuationTradein(brand, model).subscribe(
      (res: any) => {
        this.valuationlists = res.data.listValuation;
        for (const item of this.valuationlists) {
            item.valChecked = 'N';
        }
        this.pageLoadingService.closeLoading();
      },
      (err: any) => {
        this.pageLoadingService.closeLoading();
        console.log(err);
      });
  }

  selectValuationlistFn(val: any, checked: any) {
    if (checked.target.checked === true) {
      val.valChecked = 'Y';
    } else if (checked.target.checked === false) {
      val.valChecked = 'N';
    }
  }

  OnDestroy () {
    this.tradeInService.removeTradein();
  }

  onHome() {
    window.location.href = '/sale-portal/dashboard';
  }

  onBack() {
    this.tradeInService.removeTradein();
    this.router.navigate(['trade-in/verify-trade-in']);
  }

  btnCancelFn() {
    this.router.navigate(['trade-in/verify-trade-in']);
  }

  onNext(brand: string, model: string) {
    this.objCriteriatradein = {
    brand: this.objTradein.brand,
    model: this.objTradein.model,
    matCode: this.objTradein.matCode,
    serialNo: this.objTradein.serialNo,
    listValuationTradein: this.valuationlists
    };
    this.tradeInService.setValuationlistTradein(this.objCriteriatradein);
    this.router.navigate(['trade-in/confirm-trade-in']);
  }
}

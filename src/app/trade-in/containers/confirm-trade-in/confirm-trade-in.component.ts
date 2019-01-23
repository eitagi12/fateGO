import { Component, OnInit } from '@angular/core';
import { HomeService, PageLoadingService, TokenService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { TradeInService } from '../../services/trade-in.service';
import { Subscription } from 'rxjs';
import { Criteriatradein } from 'src/app/shared/models/trade-in.model';

@Component({
  selector: 'app-confirm-trade-in',
  templateUrl: './confirm-trade-in.component.html',
  styleUrls: ['./confirm-trade-in.component.scss']
})
export class ConfirmTradeInComponent implements OnInit {

  listValuation: any;
  valuationlists: any;
  criteriaObj: Criteriatradein;
  aisFlg: string;
  objTest: any;
  tradeinPrice: any;
  tradeinGrade: string;
  tradeinNo: string;
  btnNextDisabled = true;
  constructor(private router: Router,
    private homeService: HomeService,
    private tradeInService: TradeInService,
    private pageLoadingService: PageLoadingService,
    private tokenService: TokenService) { }


  ngOnInit() {
    this.getValuationTradein();
    this.getEstimateTradein();
  }

  getValuationTradein() {
    this.listValuation = JSON.parse(localStorage.getItem('Criteriatradein'));
    this.valuationlists = this.listValuation.listValuationTradein;
  }

  getEstimateTradein() {
    this.pageLoadingService.openLoading();
    this.criteriaObj = JSON.parse(localStorage.getItem('Criteriatradein'));
    if (this.criteriaObj && this.criteriaObj.matCode) {
      this.aisFlg = 'Y';
    } else {
      this.aisFlg = 'N';
    }
    const objFilterValDesc = this.criteriaObj.listValuationTradein.filter(
      (obj) => {
        if (obj && obj.valDesc) {
          const key = 'valDesc';
          delete obj[key];
          return obj;
        } else {
          return obj;
        }
    });
    const objRequestEstimate = {
      brand: this.criteriaObj.brand,
      model: this.criteriaObj.model,
      matCode: this.criteriaObj.matCode,
      serialNo: this.criteriaObj.serialNo,
      listValuationTradein: objFilterValDesc
    };

    this.tradeInService.getEstimateTradein(objRequestEstimate , this.aisFlg).then(
      (response) => {
        if (response.data.resultCode === 'S') {
          this.tradeinGrade = response.data.tradeinGrade;
          this.tradeinPrice = response.data.tradeinPrice;
          this.tradeinNo = response.data.tradeinNo;
          this.nextDisabled();
        }
        this.pageLoadingService.closeLoading();
      });
  }

  OnDestroy () {
    this.tradeInService.removeTradein();
  }

  onHome() {
    window.location.href = '/sales-portal/dashboard';
  }

  onBack() {
    this.router.navigate(['trade-in/criteria-trade-in']);
  }

  btnCancelFn() {
    this.router.navigate(['trade-in/criteria-trade-in']);
  }

  nextDisabled() {
    if (this.tradeinPrice > 0) {
      this.btnNextDisabled = false;
    } else if (this.tradeinPrice === 0) {
      this.btnNextDisabled = true;
    }
  }
  onNext () {
    const objEstimate = {
      tradeinNo: this.tradeinNo,
      tradeinPrice: this.tradeinPrice,
      tradeinGrade: this.tradeinGrade
    };
    this.tradeInService.setEstimateTradein(objEstimate);
    this.router.navigate(['trade-in/summary-trade-in']);
  }

}

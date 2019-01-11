import { Component, OnInit } from '@angular/core';
import { HomeService, PageLoadingService, TokenService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { TradeInService } from '../../services/trade-in.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-confirm-trade-in',
  templateUrl: './confirm-trade-in.component.html',
  styleUrls: ['./confirm-trade-in.component.scss']
})
export class ConfirmTradeInComponent implements OnInit {

  listValuationTradein: any;

  constructor(private router: Router,
    private homeService: HomeService,
    private formBuilder: FormBuilder,
    private tradeInService: TradeInService,
    private pageLoadingService: PageLoadingService,
    private tokenService: TokenService) { }


  ngOnInit() {
    this.getValuationTradein();
    console.log('getValuationTradein',this.getValuationTradein);
    
  }

  getValuationTradein() {
    this.listValuationTradein = JSON.parse(localStorage.getItem('Criteriatradein'));
    console.log('listValuationTradein' , this.listValuationTradein);
    
  }

  getEstimateTradein() {
    this.pageLoadingService.openLoading();
    const tradeIn: any = JSON.parse(localStorage.getItem('Criteriatradein'));
    const brand: any = tradeIn.brand;
    const model: any = tradeIn.model;
    const matCode: any = tradeIn.matCode;
    const serialNo: any = tradeIn.serialNo;
    const locationCode = this.tokenService.getUser().locationCode;
    const userId = this.tokenService.getUser().username;


    this.tradeInService.getEstimateTradein(brand, model, matCode).subscribe(
      (res: any) => {
        // console.log('valuationlists', this.valuationlists);
        this.pageLoadingService.closeLoading();
      },
      (err: any) => {
        this.pageLoadingService.closeLoading();
        console.log(err);
      });
  }

  OnDestroy () {
    this.tradeInService.removeTradein();
  }

  onHome() {
    this.homeService.goToHome();
  }

  onBack() {
    this.router.navigate(['trade-in/criteria-trade-in']);
  }

  btnCancelFn() {
    this.router.navigate(['trade-in/criteria-trade-in']);
  }

}

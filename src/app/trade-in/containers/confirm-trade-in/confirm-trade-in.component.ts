import { Component, OnInit } from '@angular/core';
import { HomeService, PageLoadingService } from 'mychannel-shared-libs';
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

  tradeinNo: string;
  modelTradein: string;
  imeiTradein: string;
  gradeTradein: string;
  estimatePrice: string;

  constructor(private router: Router,
    private homeService: HomeService,
    private formBuilder: FormBuilder,
    private tradeInService: TradeInService,
    private pageLoadingService: PageLoadingService) { }

  ngOnInit() {
    this.tradeinNo = 'TIxxxxxxxx';
    this.modelTradein = 'Samsung Galaxy S6';
    this.imeiTradein = 'xxxxxxxxxx';
    this.gradeTradein = 'A';
    this.estimatePrice = 'B5,xxx';
  }
  onHome() {
    this.homeService.goToHome();
  }

  onBack() {
    this.router.navigate(['dashboard']);
  }
}

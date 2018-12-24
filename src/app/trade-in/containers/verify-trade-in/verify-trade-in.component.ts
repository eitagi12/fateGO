import { Component, OnInit } from '@angular/core';
import { HomeService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { TradeInService } from '../../services/trade-in.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-verify-trade-in',
  templateUrl: './verify-trade-in.component.html',
  styleUrls: ['./verify-trade-in.component.scss']
})
export class VerifyTradeInComponent implements OnInit {
  imeiForm: FormGroup;
  submitted = false;
  listModelTradein = [];
  subscriptionListModelTradeIn: Subscription;
  constructor(private router: Router,
              private homeService: HomeService,
              private formBuilder: FormBuilder,
              private tradeInService: TradeInService) { }

  ngOnInit() {
    this.setFormImei();
    this.setListModelTradein();
  }

  onHome() {
    this.homeService.goToHome();
  }

  onBack() {
    this.router.navigate(['dashboard']);
  }
  setFormImei () {
    this.imeiForm = this.formBuilder.group({
      imei: ['', Validators.required]
    });
  }

  checkImei() {
    this.submitted = true;
    console.log(this.imeiForm.value.imei);
  }
  setListModelTradein() {
    this.subscriptionListModelTradeIn = this.tradeInService.getListModelTradeIn().subscribe(
      {
        next: (res) => {
          this.listModelTradein = res.data.listResult;
        }
      }
    );
  }
  OnDestroy() {
    this.subscriptionListModelTradeIn.unsubscribe();
  }
  selectModelTradeinFn() {
    console.log('selected  ', this.listModelTradein.indexOf);
  }

}

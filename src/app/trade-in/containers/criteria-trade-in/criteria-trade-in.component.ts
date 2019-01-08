import { Component, OnInit } from '@angular/core';
import { HomeService, PageLoadingService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { TradeInService } from '../../services/trade-in.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-criteria-trade-in',
  templateUrl: './criteria-trade-in.component.html',
  styleUrls: ['./criteria-trade-in.component.scss']
})
export class CriteriaTradeInComponent implements OnInit {
  listValuationTradein = [];
  subscriptionListModelTradeIn: Subscription;
  subscriptionModel: Subscription;

  public brand: string;
  public queryOption: string;
  public model: string;

  constructor(private router: Router,
    private homeService: HomeService,
    private formBuilder: FormBuilder,
    private tradeInService: TradeInService,
    private pageLoadingService: PageLoadingService) { }

  ngOnInit() {
  }

  OnDestroy() {
  }

  onHome() {
    this.homeService.goToHome();
  }

  onBack() {
    this.router.navigate(['trade-in/verify-trade-in']);
  }

  btnCancelFn() {
    this.router.navigate(['trade-in/verify-trade-in']);
  }

  onNext(brand: string, model: string) {
    this.brand = "APPLE";
    this.model = "IPHONE7P256";

    this.tradeInService.getListValuationTradein(this.brand , this.model).subscribe(
      (res) => {
        console.log('fffff', res);
      }
    );
    console.log("LLLJJH");
  }
}

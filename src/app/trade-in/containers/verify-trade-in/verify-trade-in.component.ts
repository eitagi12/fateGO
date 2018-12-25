import { Component, OnInit } from '@angular/core';
import { HomeService, PageLoadingService } from 'mychannel-shared-libs';
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
  subscriptionModel: Subscription;
  selectOp = null;
  butDisabled = false;
  constructor(private router: Router,
              private homeService: HomeService,
              private formBuilder: FormBuilder,
              private tradeInService: TradeInService,
              private pageLoadingService: PageLoadingService) { }

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
    this.pageLoadingService.openLoading();
    this.submitted = true;
    console.log(this.imeiForm.value.imei);
    this.subscriptionModel = this.tradeInService.checkSerialTradein(this.imeiForm.value.imei).subscribe({
      next: (response) => {
        this.pageLoadingService.closeLoading();
        const brandTradein  = response.data.brand;
        const modelTradein  = response.data.model;
        this.setModelImeiToModelList(brandTradein , modelTradein);
      },
      error: (err) => {
        this.pageLoadingService.closeLoading();
      }
    });
  }
  setListModelTradein() {
    this.subscriptionListModelTradeIn = this.tradeInService.getListModelTradeIn().subscribe(
      {
        next: (res) => {
          this.listModelTradein = res.data.listResult;
        },
        error: (err) => {
          console.log(err);
        }
      }
    );
  }
  OnDestroy() {
    this.subscriptionListModelTradeIn.unsubscribe();
    this.subscriptionModel.unsubscribe();
  }
  selectModelTradeinFn(val) {
    const index = val.target['selectedIndex'] - 1;
    const brandSelected = this.listModelTradein[index].brand;
    const modelSelected = this.listModelTradein[index].model;
    const matCodeSelected = this.listModelTradein[index].matCode;
    this.tradeInService.setSelectedGlobalServiceTradein(brandSelected, modelSelected, matCodeSelected);
  }
  setModelImeiToModelList (brandImei , modelImei) {
    if (modelImei && brandImei) {
      const indexSelect = this.listModelTradein.findIndex(
        obj => obj.brand === brandImei && obj.model === modelImei
      );
      if (indexSelect) {
        this.selectOp = this.listModelTradein[indexSelect];
        this.butDisabled = true;
      } else {
        this.butDisabled = false;
      }
    }
  }
}

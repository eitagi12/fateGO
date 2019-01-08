import { Component, OnInit } from '@angular/core';
import { HomeService, PageLoadingService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TradeInService } from '../../services/trade-in.service';
import { Subscription } from 'rxjs';
import { Tradein } from '../../models/trade-in.models';


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
  activeNext = false;
  constructor(private router: Router,
              private homeService: HomeService,
              private tradeInService: TradeInService,
              private pageLoadingService: PageLoadingService) { }

  ngOnInit () {
    this.setFormImei();
    this.setListModelTradein();
  }

  onHome () {
    this.homeService.goToHome();
  }

  onBack () {
    this.router.navigate(['dashboard']);
  }
  setFormImei () {
    this.imeiForm = new FormGroup({
      imei: new FormControl('', [Validators.required, Validators.minLength(15)])
    });
  }

  checkImei () {
    this.pageLoadingService.openLoading();
    this.submitted = true;
    this.subscriptionModel = this.tradeInService.checkSerialTradein(this.imeiForm.value.imei).subscribe({
      next: (response) => {
        const brandTradein  = response.data.brand;
        const modelTradein  = response.data.model;
        this.setModelImeiToModelList(brandTradein , modelTradein);
      },
      complete: () => {
        this.pageLoadingService.closeLoading();
      },
      error: (err) => {
        this.pageLoadingService.closeLoading();
        console.log('err  ', err);
      }
    });
  }
  setListModelTradein () {
    this.pageLoadingService.openLoading();
    this.subscriptionListModelTradeIn = this.tradeInService.getListModelTradeIn().subscribe(
      {
        next: (res) => {
          this.listModelTradein = res.data.listResult;
        },
        complete: () => {
          this.pageLoadingService.closeLoading();
        },
        error: (err) => {
          this.pageLoadingService.closeLoading();
          console.log(err);
        }
      }
    );
  }
  OnDestroy() {
    this.subscriptionListModelTradeIn.unsubscribe();
    this.subscriptionModel.unsubscribe();
  }
  selectModelTradeinFn (val: any) {
    if (val.target['selectedIndex'] === 0) {
      return;
    } else {
      const index = val.target['selectedIndex'] - 1;
      const objTradein: Tradein = {
        brand: this.listModelTradein[index].brand,
        model: this.listModelTradein[index].model,
        matCode: this.listModelTradein[index].matCode ? this.listModelTradein[index].matCode : '',
        serialNo: this.imeiForm.value.imei ? this.imeiForm.value.imei : ''
      };
      this.tradeInService.setSelectedTradein(objTradein);
    }

  }
  setModelImeiToModelList (brandImei: string, modelImei: string) {
    if (modelImei && brandImei) {
      const indexSelect = this.listModelTradein.findIndex(
        obj => obj.brand === brandImei && obj.model === modelImei
      );
      console.log(indexSelect);
      if (indexSelect && indexSelect >= 0) {
        this.selectOp = this.listModelTradein[indexSelect];
        this.butDisabled = true;
      } else {
        this.butDisabled = false;
      }
    } else {
      this.butDisabled = false;
    }
  }
  cancelSelected () {
    this.imeiForm.reset();
    this.selectOp = null;
    this.tradeInService.clearTradein();
  }
}

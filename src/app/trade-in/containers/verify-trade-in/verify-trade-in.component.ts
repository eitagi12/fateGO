import { Component, OnInit } from '@angular/core';
import { HomeService, PageLoadingService, AlertService } from 'mychannel-shared-libs';
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
  objTradein: Tradein;
  constructor(private router: Router,
              private homeService: HomeService,
              private tradeInService: TradeInService,
              private pageLoadingService: PageLoadingService,
              private alertService: AlertService) { }

  ngOnInit () {
    this.setFormImei();
    this.setListModelTradein();
    console.log(this.tradeInService.getTradein());
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
        this.pageLoadingService.closeLoading();
        if (response.data.status === 'S') {
          this.setModelImeiToModelList(response.data.brand , response.data.model);
        } else {
          this.alertService.warning('ไม่พบหมายเลข imei ในระบบ กรุณา เลือก รุ่นโทรศัพท์');
          this.butDisabled = false;
          this.selectOp = null;
        }
      },
      complete: () => {
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
  OnDestroy () {
    this.subscriptionListModelTradeIn.unsubscribe();
    this.subscriptionModel.unsubscribe();
    this.tradeInService.removeTradein();
  }
  selectModelTradeinFn (val: any) {
    if (val.target['selectedIndex'] === 0) {
      return;
    } else {
      const index = val.target['selectedIndex'] - 1;
      this.objTradein = {
        brand: this.listModelTradein[index].brand,
        model: this.listModelTradein[index].model,
        matCode: this.listModelTradein[index].matCode ? this.listModelTradein[index].matCode : '',
        serialNo: this.imeiForm.value.imei ? this.imeiForm.value.imei : ''
      };
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
        this.alertService.warning('ไม่พบ model ที่ตรงกับ รายการ Tradein');
      }
    } else {
      this.butDisabled = false;
    }
  }
  cancelSelected () {
    this.imeiForm.reset();
    this.selectOp = null;
    this.tradeInService.removeTradein();
  }
  btnNextFn () {
    this.tradeInService.setSelectedTradein(this.objTradein);
    this.router.navigate(['trade-in/criteria-trade-in']);
  }
}

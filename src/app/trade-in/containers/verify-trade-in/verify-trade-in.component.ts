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
  objTradein: Tradein;
  isNextPage = false;
  serialMatCode: string;
  isCheckImei = false;
  btnNextDisabled = true;
  constructor(private router: Router,
              private homeService: HomeService,
              private tradeInService: TradeInService,
              private pageLoadingService: PageLoadingService,
              private alertService: AlertService) { }

  ngOnInit () {
    this.setFormImei();
    this.setListModelTradein();
  }

  onHome () {
    window.location.href = '/sale-portal/dashboard';
  }

  onBack () {
    window.location.href = '/sale-portal/dashboard';
  }
  setFormImei () {
    this.imeiForm = new FormGroup({
      imei: new FormControl('', [Validators.required, Validators.minLength(15)])
    });
  }

  checkImei () {
    this.pageLoadingService.openLoading();
    this.submitted = true;
    this.isCheckImei = true;
    this.subscriptionModel = this.tradeInService.checkSerialTradein(this.imeiForm.value.imei).subscribe({
      next: (response) => {
        this.pageLoadingService.closeLoading();
        if (response.data.status === 'S') {
          this.serialMatCode = response.data.matcode;
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
    this.isCheckImei = false;
  }
  selectModelTradeinFn (val: any) {
    if (this.imeiForm.value.imei) {
      if (val.target['selectedIndex'] === 0) {
        this.alertService.warning('กรุณาเลือก brand โทรศัพท์');
        this.btnNextDisabled = true;
        return;
      } else {
        if (this.isCheckImei) {
          this.btnNextDisabled = false;
        }
        const index = val.target['selectedIndex'] - 1;
        this.objTradein = {
          brand: this.listModelTradein[index].brand,
          model: this.listModelTradein[index].model,
          matCode: this.serialMatCode ? this.serialMatCode : ' ',
          serialNo: this.imeiForm.value.imei ? this.imeiForm.value.imei : ''
        };
        return this.objTradein;
      }
    } else {
      if (val.target['selectedIndex'] === 0) {
        this.alertService.warning('กรุณากรอก เลข imei');
        return;
      } else {
        const index = val.target['selectedIndex'] - 1;
        this.objTradein = {
          brand: this.listModelTradein[index].brand,
          model: this.listModelTradein[index].model,
          matCode: this.serialMatCode ? this.serialMatCode : '',
          serialNo: this.imeiForm.value.imei ? this.imeiForm.value.imei : ''
        };
        return this.objTradein;
      }
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
        this.objTradein = {
          brand: this.listModelTradein[indexSelect].brand,
          model: this.listModelTradein[indexSelect].model,
          matCode: this.serialMatCode ? this.serialMatCode : '',
          serialNo: this.imeiForm.value.imei ? this.imeiForm.value.imei : ''
        };
        this.btnNextDisabled = false;
      } else {
        this.btnNextDisabled = true;
        this.butDisabled = false;
        this.alertService.warning('ไม่พบ model ที่ตรงกับ รายการ Tradein');
      }
    } else {
      this.butDisabled = false;
      this.btnNextDisabled = true;
    }
  }
  cancelSelected () {
    this.imeiForm.reset();
    this.selectOp = null;
    this.tradeInService.removeTradein();
    this.isCheckImei = false;
    this.butDisabled = false;
  }
  checkValueTradein () {
    if (!this.imeiForm.invalid && this.objTradein.brand && this.objTradein.model && this.isCheckImei) {
      this.isNextPage = true;
      this.btnNextDisabled = false;
      return this.isNextPage;
    } else {
      this.isNextPage = false;
      this.btnNextDisabled = true;
      return this.isNextPage;
    }
  }

  btnNextFn () {
    this.checkValueTradein();
    if (this.isNextPage) {
      this.tradeInService.setSelectedTradein(this.objTradein);
      this.router.navigate(['trade-in/criteria-trade-in']);
    } else {
      this.alertService.error('กรุณา กรอกข้อมูล ให้ครบ');
    }
  }
}

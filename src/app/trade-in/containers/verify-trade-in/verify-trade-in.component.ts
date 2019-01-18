import { Component, OnInit, ElementRef, Renderer, Output, EventEmitter } from '@angular/core';
import { HomeService, PageLoadingService, AlertService, SalesService, TokenService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { TradeInService } from '../../services/trade-in.service';
import { Tradein } from 'src/app/shared/models/trade-in.model';
import { BrandsOfProduct } from 'mychannel-shared-libs/lib/service/models/brands-of-product';

@Component({
  selector: 'app-verify-trade-in',
  templateUrl: './verify-trade-in.component.html',
  styleUrls: ['./verify-trade-in.component.scss']
})
export class VerifyTradeInComponent implements OnInit {

  brands: BrandsOfProduct[];
  imeiForm: FormGroup;
  submitted = false;
  listModelTradein = [];
  defualtListModel = [];
  selectOp = null;
  butDisabled = false;
  objTradein: Tradein;
  isNextPage = false;
  serialMatCode: string;
  isCheckImei = false;
  btnNextDisabled = true;
  isSelectImg = false;
  isLockImg = false;
  constructor(private router: Router,
              private homeService: HomeService,
              private tradeInService: TradeInService,
              private pageLoadingService: PageLoadingService,
              private alertService: AlertService,
              private salesService: SalesService,
              private tokenService: TokenService,
              private elementRef: ElementRef,
              private renderer: Renderer) { }

  ngOnInit () {
    this.setFormImei();
    this.callService();
  }

  private callService () {
    this.pageLoadingService.openLoading();
    const locationCode = this.tokenService.getUser().locationCode;
    Promise.all([this.tradeInService.getListModelTradeIn(), this.salesService.brandsOfProduct(locationCode)]).then(
      (values: any[]) => {
        this.pageLoadingService.closeLoading();
        this.defualtListModel = values[0].data.listResult;
        this.listModelTradein = this.defualtListModel;
        const brandTradein = values[0].data.listResult.map(item => item.brand).filter(
          (value, index, self) => self.indexOf(value) === index);
        const objFilterBrand = values[1].data.filter(
          (data) => {
              if (brandTradein.includes(data.name)) {
                return data;
              }
          }
        );
        this.brands = objFilterBrand;
      }
    );
  }



  checkImei () {
    this.pageLoadingService.openLoading();
    this.submitted = true;
    this.isCheckImei = true;
    this.tradeInService.checkSerialTradein(this.imeiForm.value.imei).then(
        (response) => {
          this.pageLoadingService.closeLoading();
          if (response.data.status === 'S') {
            this.serialMatCode = response.data.matcode;
            this.setModelImeiToModelList(response.data.brand , response.data.model);
          } else {
            this.alertService.warning('ไม่พบหมายเลข imei ในระบบ กรุณา เลือก รุ่นโทรศัพท์');
            this.butDisabled = false;
            this.selectOp = null;
        }
      });
  }
  OnDestroy () {
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
        this.isLockImg = true;
        this.setBorderImgOnselect(this.listModelTradein[indexSelect].brand);
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
    this.listModelTradein = this.defualtListModel;
    this.setBorderImgOnselect('');
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

  onHome () {
    window.location.href = '/sales-portal/dashboard';
  }

  onBack () {
    window.location.href = '/sales-portal/dashboard';
  }
  setFormImei () {
    this.imeiForm = new FormGroup({
      imei: new FormControl('', [Validators.required, Validators.minLength(15)])
    }, this.checkValueImei);
  }
  checkValueImei (control: FormGroup): ValidationErrors {
    const valImei = control.get('imei');
    const regex  = /([0-9]{15})+$/;
    if (regex.test(valImei.value)) {
      return null;
    }
    return {valid: true};
  }
  selectImg($event) {
    this.listModelTradein = this.defualtListModel;
    this.selectOp = null;
    const srcSelect = $event.target.src;
    const nameSelect = this.brands.filter(
      (data) => {
        if (data.imageUrl === srcSelect) {
          return data;
        }
      }
    );
    const objFilterListBySelectImg = this.listModelTradein.filter(
      (data) => {
        if (data.brand === nameSelect[0].name) {
          return data;
        } else {
          return;
        }
      }
    );
    this.listModelTradein = objFilterListBySelectImg;
    const nameBrandSelect = nameSelect[0].name;
    this.setBorderImgOnselect(nameBrandSelect);

  }


  private getBrandElementById(brandId: string) {
    return this.elementRef.nativeElement.querySelector(brandId);
  }

  setBorderImgOnselect (nameBrandSelect) {
    const imagesContainerList = this.elementRef.nativeElement.querySelectorAll('.image-container');

    for (const imagesContainer of imagesContainerList) {
      if (imagesContainer.id === nameBrandSelect) {
        this.renderer.setElementClass(this.getBrandElementById('#' + imagesContainer.id), 'active', true);
      } else {
          this.renderer.setElementClass(this.getBrandElementById('#' + imagesContainer.id), 'active', false);
      }
    }
  }
}

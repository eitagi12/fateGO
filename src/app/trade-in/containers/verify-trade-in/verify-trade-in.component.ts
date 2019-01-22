import { Component, OnInit, ElementRef, Renderer, Output, EventEmitter } from '@angular/core';
import { HomeService, PageLoadingService, AlertService, SalesService, TokenService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { TradeInService } from '../../services/trade-in.service';
import { Tradein } from 'src/app/shared/models/trade-in.model';
import { BrandsOfProduct } from 'mychannel-shared-libs/lib/service/models/brands-of-product';
import { Observable } from 'rxjs';
import { mergeMap, filter } from 'rxjs/operators';

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
  butDisabledModel = false;
  isNextPage = false;
  serialMatCode: string;
  isCheckImei = false;
  btnNextDisabled = true;
  isSelectImg = false;
  isLockImg = false;
  keyword: string;
  datasource: Observable<any>;
  modelTradein: any;
  productSearch: any;
  defualtBrand = [];
  brand: string;
  checkSerial: any;
  objSerival: any;
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
    this.createDataSource();
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
        this.defualtBrand = objFilterBrand;
        this.brands = objFilterBrand;
      }
    );
  }

  checkImei () {
    this.pageLoadingService.openLoading();
    this.submitted = true;
    const imei = this.imeiForm.value.imei;
    this.checkSerial = this.tradeInService.checkSerialTradein(imei);
    this.checkSerial.then(
      (response) => {
        this.pageLoadingService.closeLoading();
        if (response.data.status === 'S') {
          this.tradeInService.setSerialNo(imei);
          this.tradeInService.setMatCode(response.data.matcode);
          if (this.checkBrandAndModelFromListModelTradein(response.data.brand , response.data.model)) {
            this.setAutoSelect(response.data);
          } else {
            this.alertService.warning('ไม่พบ model ที่ตรงกับ รายการ Tradein');
            this.cancelSelected();
          }
        } else {
          this.tradeInService.setSerialNo(imei);
          const options = {
            text: 'ไม่พบหมายเลข imei ในระบบ กรุณาเลือก ยี่ห้อ,รุ่นโทรศัพท์',
            confirmButtonText: 'ตกลง'
          };
          this.alertService.notify(options);
          this.checkValueTradein();
        }
      }
    );
  }

  setAutoSelect (objSerival) {
    this.setBrandImg(objSerival);
    const serialNo = this.tradeInService.getObjTradein().serialNo;
      this.setBorderImgOnSelect(objSerival.brand);
      const objSelectTradein = {
        item : {
          brand : objSerival.brand,
          model : objSerival.model,
          commercialName : objSerival.commercialName,
          serialNo : serialNo
        }
      };
      this.isSelectImg = true;
      this.onProductSearch(objSelectTradein);
      this.keyword = objSerival.model;
      this.butDisabledModel = true;
  }
  setBrandImg (objSerival) {
    const filterBrand = this.brands.filter(
      (data) => {
        if (data.name === objSerival.brand) {
          return data;
          }
        });
      this.brands = filterBrand;
  }

  checkBrandAndModelFromListModelTradein (brand: string, model: string) {
    const indexBrandModelList = this.listModelTradein.findIndex(
      obj => obj.brand === brand && obj.model === model
    );
    if (indexBrandModelList >= 0) {
      const objSelectTradein = this.listModelTradein[indexBrandModelList];
      return objSelectTradein;
    } else {
      return;
    }
  }

  OnDestroy () {
    this.tradeInService.removeTradein();
  }

  cancelSelected () {
    this.imeiForm.reset();
    this.tradeInService.removeTradein();
    this.butDisabledModel = false;
    this.setBorderImgOnSelect('');
    this.isSelectImg = false;
    this.keyword = null;
    this.brands = this.defualtBrand;
    this.btnNextDisabled = true;
  }
  checkValueTradein () {
    const objTradein = this.tradeInService.getObjTradein();
    if (objTradein.serialNo && objTradein.model && this.isSelectImg) {
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
      const objTradein = this.tradeInService.getObjTradein();
      this.tradeInService.setSelectedTradein(objTradein);
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
    const srcSelect = $event.target.src;
    const nameSelect = this.brands.filter(
      (data) => {
        if (data.imageUrl === srcSelect) {
          return data;
        }
      }
    );
    this.brand = nameSelect[0].name;
    const nameBrandSelect = nameSelect[0].name;
    this.setBorderImgOnSelect(nameBrandSelect);
    this.isSelectImg = true;
  }


  private getBrandElementById(brandId: string) {
    return this.elementRef.nativeElement.querySelector(brandId);
  }

  setBorderImgOnSelect (nameBrandSelect) {
    const imagesContainerList = this.elementRef.nativeElement.querySelectorAll('.image-container');

    for (const imagesContainer of imagesContainerList) {
      if (imagesContainer.id === nameBrandSelect) {
        this.renderer.setElementClass(this.getBrandElementById('#' + imagesContainer.id), 'active', true);
      } else {
          this.renderer.setElementClass(this.getBrandElementById('#' + imagesContainer.id), 'active', false);
      }
    }
  }
  private createDataSource() {
    this.datasource = Observable.create((observer: any) => {
      observer.next(this.keyword);
    }).pipe(
      mergeMap((keyword: string) => this.queryProducCatalogSearch(keyword))
    );
  }

  private queryProducCatalogSearch(keyword: string): Promise<any> {
    const model = this.defualtListModel.map(item => item.model).filter(
      (value, index, self) => self.indexOf(value) === index);
    const regex = /(TRADE IN)/;
    return this.salesService.producCatalogSearch(keyword).then((resp) => {
      const objFilterModel = resp.data.filter(
        (data) => {
          if (model.includes(data.model) && data.brand === this.brand && !regex.test(data.commercialName)) {
            return data;
          }
        }
      );
      return objFilterModel;
    });
  }
  onProductSearch (event) {
    this.tradeInService.setBrand(event.item.brand);
    this.tradeInService.setModel(event.item.model);
    this.checkValueTradein();
  }
}

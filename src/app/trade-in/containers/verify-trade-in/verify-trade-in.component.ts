import { Component, OnInit, ElementRef, Renderer, OnDestroy } from '@angular/core';
import { PageLoadingService, AlertService, SalesService, TokenService, AisNativeService, ApiRequestService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { TradeInService } from '../../services/trade-in.service';
import { BrandsOfProduct } from 'mychannel-shared-libs/lib/service/models/brands-of-product';
import { Observable, Subscription } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { TradeInTransactionService } from '../../services/trade-in-transaction.service';
import { TradeInTranscation } from '../../services/models/trade-in-transcation.model';

@Component({
  selector: 'app-verify-trade-in',
  templateUrl: './verify-trade-in.component.html',
  styleUrls: ['./verify-trade-in.component.scss']
})
export class VerifyTradeInComponent implements OnInit , OnDestroy {

  tradeInTransaction: TradeInTranscation;
  brands: BrandsOfProduct[];
  imeiForm: FormGroup;
  datasource: Observable<any>;
  listModelTradein = [];
  defualtListModel = [];
  defualtBrand = [];
  butNextDisabled = true;
  submitted = false;
  isCheckImei = false;
  isSelectImg = false;
  isLockImg = false;
  isNextPage = false;
  butDisabledModel = false;
  keyword: string;
  serialMatCode: string;
  modelTradein: any;
  productSearch: any;
  checkSerial: any;
  objSerival: any;
  barcodeSubscription: Subscription;
  constructor(private router: Router,
              private tradeInService: TradeInService,
              private pageLoadingService: PageLoadingService,
              private alertService: AlertService,
              private salesService: SalesService,
              private tokenService: TokenService,
              private elementRef: ElementRef,
              private renderer: Renderer,
              private tradeInTransactionService: TradeInTransactionService,
              private aisNativeService: AisNativeService,
              private apiRequestService: ApiRequestService) { }

  ngOnInit () {
    this.setFormImei();
    this.callService();
    this.createDataSource();
    this.subscribeBarcode();
    this.apiRequestService.createRequestId();
  }
  onHome () {
    window.location.href = '/sales-portal/dashboard';
  }

  onBack () {
    window.location.href = '/sales-portal/dashboard';
  }
  btnNextFn () {
    const objTradein = this.tradeInService.getObjTradein();
    this.tradeInTransaction = {
      data : {
        tradeIn : objTradein
      }
    };
    this.router.navigate(['trade-in/criteria-trade-in']);
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
          });
        this.defualtBrand = objFilterBrand;
        this.brands = objFilterBrand;
      });
  }
  scanBarcode () {
    this.aisNativeService.scanBarcode();
  }
  subscribeBarcode() {
      this.barcodeSubscription = this.aisNativeService.getBarcode().subscribe(
          (barcode: string) => {
            this.alertService.info(barcode);
            if (barcode.length === 15) {
              this.imeiForm.setValue({imei: barcode});
              this.checkImei();
            } else {
              this.alertService.error('Barcode ไม่ตรงตามเงื่อนไข');
            }
        });
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
          this.tradeInService.setMatCode(' ');
          const options = {
            text: 'ไม่พบหมายเลข imei ในระบบ กรุณาเลือก ยี่ห้อ,รุ่นโทรศัพท์',
            confirmButtonText: 'ตกลง'
          };
          this.alertService.notify(options);
          this.checkValueTradein();
        }
      });
  }

  setAutoSelect (objSerial) {
    this.setBrandImg(objSerial);
    const serialNo = this.tradeInService.getObjTradein().serialNo;
    this.setBorderImgOnSelect(objSerial.brand);
    const objSelectTradein = {
      item : {
        brand : objSerial.brand,
        model : objSerial.model,
        commercialName : objSerial.commercialName,
        serialNo : serialNo
      }
    };
    this.isSelectImg = true;
    this.onProductSearch(objSelectTradein);
    this.keyword = objSerial.model;
    this.butDisabledModel = true;
  }
  setBrandImg (objSerial) {
    const filterBrand = this.brands.filter(
      (data) => {
        if (data.name === objSerial.brand) {
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
  selectImg($event: any) {
    this.listModelTradein = this.defualtListModel;
    const srcSelect = $event.target.src;
    const nameSelect = this.brands.filter(
      (data) => {
        if (data.imageUrl === srcSelect) {
          return data;
        }
      });
    this.tradeInService.setBrand(nameSelect[0].name);
    const nameBrandSelect = nameSelect[0].name;
    this.setBorderImgOnSelect(nameBrandSelect);
    this.isSelectImg = true;
  }


  private getBrandElementById(brandId: string) {
    return this.elementRef.nativeElement.querySelector(brandId);
  }

  setBorderImgOnSelect (nameBrandSelect: string) {
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
    const brand = this.tradeInService.getObjTradein().brand;
    const regex = /(TRADE IN)/;
    return this.salesService.producCatalogSearch(keyword).then((resp) => {
      const objFilterModel = resp.data.filter(
        (data) => {
          if (model.includes(data.model) && data.brand === brand && !regex.test(data.commercialName)) {
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
  checkValueTradein () {
    const objTradein = this.tradeInService.getObjTradein();
    if (objTradein.serialNo && objTradein.model && this.isSelectImg) {
      this.butNextDisabled = false;
    } else {
      this.butNextDisabled = true;
    }
  }

  cancelSelected () {
    this.imeiForm.reset();
    this.tradeInService.removeTradein();
    this.setBorderImgOnSelect('');
    this.isSelectImg = false;
    this.butDisabledModel = false;
    this.keyword = null;
    this.brands = this.defualtBrand;
    this.butNextDisabled = true;
    this.submitted = false;
  }

  ngOnDestroy(): void {
    this.barcodeSubscription.unsubscribe();
    this.tradeInTransactionService.save(this.tradeInTransaction);
  }
}

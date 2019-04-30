import { Component, OnInit, OnDestroy, ElementRef, Renderer } from '@angular/core';
import { FormGroup, Validators, FormControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import * as Promise from 'promise';

import { BrandsOfProduct } from 'mychannel-shared-libs/lib/service/models/brands-of-product';
import { PageLoadingService, AlertService, SalesService, TokenService, AisNativeService, ApiRequestService } from 'mychannel-shared-libs';
import { TradeInService } from 'src/app/trade-in/services/trade-in.service';
import { TradeInTranscation, TransactionType } from 'src/app/trade-in/services/models/trade-in-transcation.model';
import { TradeInTransactionService } from 'src/app/trade-in/services/trade-in-transaction.service';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-verify-trade-in-page',
  templateUrl: './verify-trade-in-page.component.html',
  styleUrls: ['./verify-trade-in-page.component.scss']
})
export class VerifyTradeInPageComponent implements OnInit , OnDestroy {

  tradeInTransaction: TradeInTranscation;
  brands: BrandsOfProduct[];
  imeiForm: FormGroup;
  datasource: Observable<any>;
  listModelTradein: any = [];
  defualtListModel: any = [];
  defualtBrand: any = [];
  isSelectImg: boolean = false;
  keyword: string;
  checkSerial: any;
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

    ngOnInit(): void {
      this.setFormImei();
      this.callService();
      this.createDataSource();
      this.subscribeBarcode();
      this.apiRequestService.createRequestId();
      this.createTransactionTradeIn();
    }

    createTransactionTradeIn(): void {
      this.tradeInTransaction = {
        data : {
          transactionType: TransactionType.TRADE_IN,
          tradeIn : {
            brand: '',
            model: '',
            matCode: '',
            serialNo: '',
            company: ''
          }
        }
      };
    }
    onHome(): void {
      window.location.href = '/sales-portal/dashboard';
    }

    onBack(): void {
      window.location.href = '/sales-portal/dashboard';
    }
    btnNextFn(): void {
      this.router.navigate(['trade-in/criteria-trade-in']);
    }

    private callService(): void {
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
    scanBarcode(): void {
      this.aisNativeService.scanBarcode();
    }
    subscribeBarcode(): void {
        this.barcodeSubscription = this.aisNativeService.getBarcode().subscribe(
            (barcode: any) => {
              const regex: any  = /([0-9]{15})+$/;
              if (barcode.length === 15 && regex.test(barcode)) {
                this.cancelSelected();
                this.imeiForm.setValue({imei: barcode});
                this.checkImei();
              } else {
                this.alertService.error(`กรุณาสแกน IMEI ให้ถูกต้อง`);
              }
          });
    }
    setFormImei(): void {
      this.imeiForm = new FormGroup({
        imei: new FormControl('', [Validators.required, Validators.minLength(15)])
      }, this.checkValueImei);
    }
    checkValueImei(control: FormGroup): ValidationErrors {
      const valImei = control.get('imei');
      const regex: any  = /([0-9]{15})+$/;
      if (regex.test(valImei.value)) {
        return null;
      }
      return {valid: true};
    }

    checkImei(): void {
      this.pageLoadingService.openLoading();
      const imei = this.imeiForm.value.imei;
      this.tradeInTransaction.data.tradeIn.serialNo = imei;
      this.checkSerial = this.tradeInService.checkSerialTradein(imei);
      this.checkSerial.then(
        (response) => {
          this.pageLoadingService.closeLoading();
          if (response.data.status === 'S') {
            this.tradeInTransaction.data.tradeIn.matCode = response.data.matcode ? response.data.matcode : ' ';
            this.tradeInTransaction.data.tradeIn.company = response.data.company;
            if (this.checkBrandAndModelFromListModelTradein(response.data.brand , response.data.model)) {
              this.setAutoSelect(response.data);
            } else {
              this.alertService.warning('ไม่พบ model ที่ตรงกับ รายการ Tradein');
              this.cancelSelected();
            }
          } else {
            const options = {
              text: 'ไม่พบหมายเลข IMEI ในระบบ กรุณาเลือก ยี่ห้อ,รุ่นโทรศัพท์',
              confirmButtonText: 'ตกลง'
            };
            this.cancelSelected();
            this.tradeInTransaction.data.tradeIn.serialNo = imei;
            this.tradeInTransaction.data.tradeIn.matCode = ' ';
            this.alertService.notify(options);
            this.isCheckBtnNext();
          }
        });
    }

    setAutoSelect(objSerial: any): void {
      this.setBrandImg(objSerial);
      this.setBorderImgOnSelect(objSerial.brand);
      const objSelectTradein = {
        item : {
          brand : objSerial.brand,
          model : objSerial.model,
          commercialName : objSerial.commercialName,
          serialNo : this.tradeInTransaction.data.tradeIn.serialNo
        }
      };
      this.isSelectImg = true;
      this.onProductSearch(objSelectTradein);
      this.keyword = objSerial.model;
      this.isCheckAutoSelect();
    }
    setBrandImg(objSerial: any): void {
      const filterBrand = this.brands.filter(
        (data) => {
          if (data.name === objSerial.brand) {
            return data;
            }
          });
        this.brands = filterBrand;
    }

    checkBrandAndModelFromListModelTradein(brand: string, model: string): any {
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
    selectImg($event: any): void {
      this.listModelTradein = this.defualtListModel;
      const srcSelect = $event.target.src;
      const nameSelect = this.brands.filter(
        (data) => {
          if (data.imageUrl === srcSelect) {
            return data;
          }
        });
      if (this.tradeInTransaction.data.tradeIn.brand) {
        this.keyword = null;
        this.tradeInTransaction.data.tradeIn.model = null;
        this.isCheckBtnNext();
      }
      this.tradeInTransaction.data.tradeIn.brand = nameSelect[0].name;
      const nameBrandSelect = nameSelect[0].name;
      this.setBorderImgOnSelect(nameBrandSelect);
      this.isSelectImg = true;
    }

    private getBrandElementById(brandId: string): any {
      return this.elementRef.nativeElement.querySelector(brandId);
    }

    setBorderImgOnSelect(nameBrandSelect: string): void {
      const imagesContainerList = this.elementRef.nativeElement.querySelectorAll('.image-container');
      for (const imagesContainer of imagesContainerList) {
        if (imagesContainer.id === nameBrandSelect) {
          this.renderer.setElementClass(this.getBrandElementById('#' + imagesContainer.id), 'active', true);
        } else {
            this.renderer.setElementClass(this.getBrandElementById('#' + imagesContainer.id), 'active', false);
        }
      }
    }
    private createDataSource(): void {
      this.datasource = Observable.create((observer: any) => {
        observer.next(this.keyword);
      }).pipe(
        mergeMap((keyword: string) => this.queryProducCatalogSearch(keyword))
      );
    }

    private queryProducCatalogSearch(keyword: string): any {
      const model = this.defualtListModel.map(item => item.model).filter(
        (value, index, self) => self.indexOf(value) === index);
      const brand = this.tradeInTransaction.data.tradeIn.brand;
      const regex: any = /(TRADE IN)/;
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
    onProductSearch(event: any): void {
      this.tradeInTransaction.data.tradeIn.brand = event.item.brand;
      this.tradeInTransaction.data.tradeIn.model = event.item.model;
      this.isCheckBtnNext();
    }

    isCheckBtnNext(): boolean {
      const data = this.tradeInTransaction.data.tradeIn;
      if (data.brand && data.model && data.serialNo) {
        return false;
      }
      return true;
    }
    isCheckAutoSelect(): boolean {
      const data = this.tradeInTransaction.data.tradeIn;
      if (this.isSelectImg && this.keyword && data.serialNo && data.model && data.company) {
        return true;
      }
      return false;
    }

    cancelSelected(): void {
      if (!this.imeiForm.value) {
        this.imeiForm.reset();
      }
      this.setBorderImgOnSelect('');
      this.isSelectImg = false;
      this.keyword = null;
      this.brands = this.defualtBrand;
      this.createTransactionTradeIn();
    }

    ngOnDestroy(): void {
      this.barcodeSubscription.unsubscribe();
      this.tradeInTransactionService.save(this.tradeInTransaction);
    }

}

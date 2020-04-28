import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, CustomerAddress } from 'mychannel-shared-libs';
import { HttpClient } from '@angular/common/http';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime } from 'rxjs/operators';
import { WIZARD_DEVICE_ONLY_AIS } from 'src/app/device-only/constants/wizard.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { ROUTE_DEVICE_ONLY_AIS_SUMMARY_PAGE } from '../../constants/route-path.constant';
@Component({
  selector: 'app-device-only-ais-edit-billing-address-page',
  templateUrl: './device-only-ais-edit-billing-address-page.component.html',
  styleUrls: ['./device-only-ais-edit-billing-address-page.component.scss']
})
export class DeviceOnlyAisEditBillingAddressPageComponent implements OnInit, OnDestroy {

   wizards: string[] = WIZARD_DEVICE_ONLY_AIS;
   transaction: Transaction;
   priceOption: PriceOption;
   customerAddress: CustomerAddress;
   allZipCodes: string[];
   provinces: any[];
   amphurs: string[];
   tumbols: string[];
   zipCodes: string[];

   customerAddressTemp: CustomerAddress;
   billDeliveryAddress: CustomerAddress;
   translationSubscribe: Subscription;
   ebillingAddressValid: boolean;
   constructor(
     private router: Router,
     private homeService: HomeService,
     private transactionService: TransactionService,
     private http: HttpClient,
     private translation: TranslateService,
     private priceOptionService: PriceOptionService
   ) {
     this.transaction = this.transactionService.load();
     this.priceOption = this.priceOptionService.load();
   }

   ngOnInit(): void {
     this.callService();
     this.translationSubscribe = this.translation.onLangChange.pipe(debounceTime(750)).subscribe(() => {
       this.callService();
       this.amphurs = [];
       this.tumbols = [];
       this.zipCodes = [];
       this.customerAddress.amphur = null;
       this.customerAddress.tumbol = null;
       this.customerAddress.province = null;
     });
   }

   callService(): void {
     const billingInformation = this.transaction.data.billingInformation || {};
     let customer;
     if (this.transaction.data.shippingInfo && this.transaction.data.shippingInfo.firstName) {
      customer = this.transaction.data.shippingInfo;
     } else {
      customer = billingInformation.billDeliveryAddress || this.transaction.data.customer;
     }

     this.http.get('/api/customerportal/newRegister/getAllZipcodes').subscribe((resp: any) => {
       this.allZipCodes = resp.data.zipcodes || [];
     });
     customer.province = customer.province.replace(/มหานคร$/, '');
     this.http.get('/api/customerportal/newRegister/getAllProvinces'
       , {
         params: {
           provinceSubType: this.translation.currentLang === 'TH' ? 'THA' : 'ENG'
         }
       }).subscribe((resp: any) => {
         const mooBan = this.transaction.data.customer.mooBan;
         this.provinces = (resp.data.provinces || []);
         this.customerAddress = {
           homeNo: customer.homeNo || '',
           moo: customer.moo || '',
           mooBan: mooBan || '',
           room: customer.room || '',
           floor: customer.floor || '',
           buildingName: customer.buildingName || '',
           soi: customer.soi || '',
           street: customer.street || '',
           province: customer.province || '',
           amphur: customer.amphur || '',
           tumbol: customer.tumbol || '',
           zipCode: customer.zipCode || ''
         };
       });
   }

   getProvinces(): string[] {
     return (this.provinces || []).map((province: any) => {
       return province.name;
     });
   }

   getProvinceByName(provinceName: string): any {
     return (this.provinces || []).find((prov: any) => prov.name === provinceName) || {};
   }

   onProvinceSelected(params: any): void {
     const province = this.getProvinceByName(params.provinceName);
     const req = {
       provinceId: province.id,
       zipcode: params.zipCode
     };
     if (!params.zipCode) {
       delete req.zipcode;
     }

     this.http.get('/api/customerportal/newRegister/queryAmphur', {
       params: req
     }).subscribe((resp: any) => {
       this.amphurs = (resp.data.amphurs || []).map((amphur: any) => {
         return amphur;
       });
     });
   }

   onAmphurSelected(params: any): void {
     const province = this.getProvinceByName(params.provinceName);
     const req = {
       provinceId: province.id,
       amphurName: params.amphurName,
       zipcode: params.zipCode
     };
     if (!params.zipCode) {
       delete req.zipcode;
     }

     this.http.get('/api/customerportal/newRegister/queryTumbol', {
       params: req
     }).subscribe((resp: any) => {
       this.tumbols = (resp.data.tumbols || []).map((tumbol: any) => {
         return tumbol;
       });
     });
   }

   onTumbolSelected(params: any): void {
     const province = this.getProvinceByName(params.provinceName);
     this.http.get('/api/customerportal/newRegister/queryZipcode', {
       params: {
         provinceId: province.id,
         amphurName: params.amphurName,
         tumbolName: params.tumbolName
       }
     }).subscribe((resp: any) => {
       this.zipCodes = resp.data.zipcodes || [];
     });
   }

   onZipCodeSelected(zipCode: string): void {
     this.http.get('/api/customerportal/newRegister/getProvinceIdByZipcode', {
       params: { zipcode: zipCode }
     }).toPromise()
       .then((resp: any) => {
         const province = this.provinces.find((prov: any) => prov.id === resp.data.provinceId);
         if (!province) {
           return;
         }
         this.customerAddress = Object.assign(
           Object.assign({}, this.customerAddress),
           {
             province: province.name,
             zipCode: zipCode
           }
         );
       });
   }

   onCompleted(value: any): void {
     this.customerAddressTemp = value;
   }

   mapCustomerAddress(customer: any): void {
     const shippingInfo = this.transaction.data.shippingInfo;
     const $customer = this.transaction.data.customer;
     this.transaction.data = {
       ...this.transaction.data,
       shippingInfo: {
         titleName: 'คุณ',
         firstName: shippingInfo ? shippingInfo.firstName : $customer.firstName,
         lastName: shippingInfo ? shippingInfo.lastName : $customer.lastName,
         homeNo: customer.homeNo || '',
         moo: customer.moo || '',
         mooBan: customer.mooBan || '',
         buildingName: customer.buildingName || '',
         floor: customer.floor || '',
         room: customer.room || '',
         street: customer.street || '',
         soi: customer.soi || '',
         tumbol: customer.tumbol || '',
         amphur: customer.amphur,
         province: customer.province || customer.provinceName || '',
         zipCode: customer.zipCode || '',
       }
     };
   }

   onError(valid: boolean): void {
     this.ebillingAddressValid = valid;
   }

   onBack(): void {
     this.router.navigate([ROUTE_DEVICE_ONLY_AIS_SUMMARY_PAGE]);
   }

   onNext(): void {
    //  if (!this.transaction.data.customer.caNumber) {
       this.mapCustomerAddress(this.customerAddressTemp);
    //  }
    //  const billingInformation = this.transaction.data.billingInformation || {};
    //  const customer = billingInformation.billDeliveryAddress || this.transaction.data.customer;
    //  this.transactionService.update(this.transaction);
    //  this.transaction.data.billingInformation.billDeliveryAddress = Object.assign(
    //    Object.assign({}, customer),
    //    this.customerAddressTemp
    //  );
     this.router.navigate([ROUTE_DEVICE_ONLY_AIS_SUMMARY_PAGE]);
   }

   onHome(): void {
    this.homeService.goToHome();
   }

   ngOnDestroy(): void {
     if (this.translationSubscribe) {
       this.translationSubscribe.unsubscribe();
     }
     this.transactionService.update(this.transaction);
   }

}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_OMNI_NEW_REGISTER } from 'src/app/omni/constants/wizard.constant';
import { Router } from '@angular/router';
import { HomeService, CustomerAddress, Utils } from 'mychannel-shared-libs';
import {
  ROUTE_OMNI_NEW_REGISTER_CONFIRM_USER_INFORMATION_PAGE, ROUTE_OMNI_NEW_REGISTER_SUMMARY_PAGE
} from 'src/app/omni/omni-new-register/constants/route-path.constant';
import { HttpClient } from '@angular/common/http';
import { NgxResource, LocalStorageService } from 'ngx-store';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { TransactionService } from 'src/app/omni/omni-shared/services/transaction.service';
import { Transaction } from 'src/app/omni/omni-shared/models/transaction.model';

@Component({
  selector: 'app-omni-new-register-ebilling-address-page',
  templateUrl: './omni-new-register-ebilling-address-page.component.html',
  styleUrls: ['./omni-new-register-ebilling-address-page.component.scss']
})
export class OmniNewRegisterEbillingAddressPageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_OMNI_NEW_REGISTER;

  transaction: Transaction;
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
    private localStorageService: LocalStorageService,
    private translation: TranslateService,
    private utils: Utils,
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.callService();
  }

  callService(): void {
    const customer = this.transaction.data.customer;
    this.http.get('/api/customerportal/newRegister/getAllZipcodes').subscribe((resp: any) => {
      this.allZipCodes = resp.data.zipcodes || [];
    });

    this.http.get('/api/customerportal/newRegister/getAllProvinces',
      {
        params: {
          provinceSubType: this.translation.currentLang === 'TH' ? 'THA' : 'ENG'
        }
      }).subscribe((resp: any) => {
        this.provinces = (resp.data.provinces || []);
        this.customerAddress = {
          homeNo: customer.homeNo,
          moo: customer.moo,
          mooBan: customer.mooBan,
          room: customer.room,
          floor: customer.floor,
          buildingName: customer.buildingName,
          soi: customer.soi,
          street: customer.street,
          province: customer.province,
          amphur: customer.amphur,
          tumbol: customer.tumbol,
          zipCode: customer.zipCode,
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

  onError(valid: boolean): void {
    this.ebillingAddressValid = valid;
  }

  onBack(): void {
    this.router.navigate([ROUTE_OMNI_NEW_REGISTER_SUMMARY_PAGE]);
  }
  getFullAddress(customerAddressTemp: any): any {
    const customerAddress = this.utils.getCurrentAddress({
      homeNo: this.customerAddressTemp.homeNo,
      moo: this.customerAddressTemp.moo,
      mooBan: this.customerAddressTemp.mooBan,
      room: this.customerAddressTemp.room,
      floor: this.customerAddressTemp.floor,
      buildingName: this.customerAddressTemp.buildingName,
      soi: this.customerAddressTemp.soi,
      street: this.customerAddressTemp.street,
      tumbol: this.customerAddressTemp.tumbol,
      amphur: this.customerAddressTemp.amphur,
      province: this.customerAddressTemp.province,
      zipCode: this.customerAddressTemp.zipCode
    }
    );
    return customerAddress;
  }

  onNext(): void {
    const customer = this.transaction.data.customer;
    const shipaddress = this.getFullAddress(this.transaction.data.customer);
    this.transactionService.update(this.transaction);
    this.transaction.data.billingInformation.billCycleData[0] = Object.assign(
      this.customerAddressTemp
    );
    this.transaction.data.billingInformation.billCycleData[0].customer = this.customerAddressTemp;
    this.transaction.data.billingInformation.billCycleData[0].billAddressText = shipaddress;

    this.router.navigate([ROUTE_OMNI_NEW_REGISTER_SUMMARY_PAGE]);

  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}

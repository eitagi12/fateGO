import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { HomeService, CustomerAddress } from 'mychannel-shared-libs';

import { WIZARD_ORDER_NEW_REGISTER } from 'src/app/order/constants/wizard.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ROUTE_ORDER_PRE_TO_POST_CONFIRM_USER_INFORMATION_PAGE } from 'src/app/order/order-pre-to-post/constants/route-path.constant';

@Component({
  selector: 'app-order-pre-to-post-ebilling-address-page',
  templateUrl: './order-pre-to-post-ebilling-address-page.component.html',
  styleUrls: ['./order-pre-to-post-ebilling-address-page.component.scss']
})
export class OrderPreToPostEbillingAddressPageComponent implements OnInit, OnDestroy {

  wizards = WIZARD_ORDER_NEW_REGISTER;

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
    private translation: TranslateService
  ) {
    this.transaction = this.transactionService.load();
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

  callService() {
    this.transaction.data.customer.engFlag = (this.translation.currentLang === 'EN') ? 'Y' : 'N';
    const billingInformation = this.transaction.data.billingInformation || {};
    const customer = billingInformation.billDeliveryAddress || this.transaction.data.customer;
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

  onProvinceSelected(params: any) {
    const province = this.getProvinceByName(params.provinceName);
    const req = {
      provinceId: province.id
      // zipcode: params.zipCode
    };
    // if (!params.zipCode) {
    //   delete req.zipcode;
    // }

    this.http.get('/api/customerportal/newRegister/queryAmphur', {
      params: req
    }).subscribe((resp: any) => {
      this.amphurs = (resp.data.amphurs || []).map((amphur: any) => {
        return amphur;
      });
    });
  }

  onAmphurSelected(params: any) {
    const province = this.getProvinceByName(params.provinceName);
    const req = {
      provinceId: province.id,
      amphurName: params.amphurName
      // zipcode: params.zipCode
    };
    // if (!params.zipCode) {
    //   delete req.zipcode;
    // }

    this.http.get('/api/customerportal/newRegister/queryTumbol', {
      params: req
    }).subscribe((resp: any) => {
      this.tumbols = (resp.data.tumbols || []).map((tumbol: any) => {
        return tumbol;
      });
    });
  }

  onTumbolSelected(params: any) {
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

  onZipCodeSelected(zipCode: string) {
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

  onCompleted(value: any) {
    this.customerAddressTemp = value;
  }

  onError(valid: boolean) {
    this.ebillingAddressValid = valid;
  }

  onBack() {
    this.router.navigate([ROUTE_ORDER_PRE_TO_POST_CONFIRM_USER_INFORMATION_PAGE]);
  }

  onNext() {
    const billingInformation = this.transaction.data.billingInformation || {};
    const customer = billingInformation.billDeliveryAddress || this.transaction.data.customer;

    this.transaction.data.billingInformation.billDeliveryAddress = Object.assign(
      Object.assign({}, customer),
      this.customerAddressTemp
    );
    this.router.navigate([ROUTE_ORDER_PRE_TO_POST_CONFIRM_USER_INFORMATION_PAGE]);
  }

  onHome() {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.translationSubscribe.unsubscribe();
    this.transactionService.update(this.transaction);
  }
}


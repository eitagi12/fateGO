import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_ORDER_NEW_REGISTER } from 'src/app/order/constants/wizard.constant';
import { Router } from '@angular/router';
import { HomeService, CustomerAddress } from 'mychannel-shared-libs';
import {
  ROUTE_ORDER_NEW_REGISTER_CONFIRM_USER_INFORMATION_PAGE
} from 'src/app/order/order-new-register/constants/route-path.constant';
import { HttpClient } from '@angular/common/http';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';

@Component({
  selector: 'app-order-new-register-ebilling-address-page',
  templateUrl: './order-new-register-ebilling-address-page.component.html',
  styleUrls: ['./order-new-register-ebilling-address-page.component.scss']
})
export class OrderNewRegisterEbillingAddressPageComponent implements OnInit, OnDestroy {

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

  ebillingAddressValid: boolean;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private http: HttpClient
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit() {
    const billingInformation = this.transaction.data.billingInformation || {};
    const customer = billingInformation.billDeliveryAddress || this.transaction.data.customer;

    this.http.get('/api/customerportal/newRegister/getAllZipcodes').subscribe((resp: any) => {
      this.allZipCodes = resp.data.zipcodes || [];
    });

    this.http.get('/api/customerportal/newRegister/getAllProvinces').subscribe((resp: any) => {
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

  onAmphurSelected(params: any) {
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
    this.router.navigate([ROUTE_ORDER_NEW_REGISTER_CONFIRM_USER_INFORMATION_PAGE]);
  }

  onNext() {
    const billingInformation = this.transaction.data.billingInformation || {};
    const customer = billingInformation.billDeliveryAddress || this.transaction.data.customer;
    const customerAddress = Object.assign(customer, this.customerAddressTemp);

    this.transaction.data.billingInformation.billDeliveryAddress = Object.assign(customerAddress);

    this.router.navigate([ROUTE_ORDER_NEW_REGISTER_CONFIRM_USER_INFORMATION_PAGE]);
  }

  onHome() {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}

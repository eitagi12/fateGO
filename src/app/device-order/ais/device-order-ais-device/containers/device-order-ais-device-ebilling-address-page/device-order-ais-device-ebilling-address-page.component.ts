import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, CustomerAddress, CustomerService } from 'mychannel-shared-libs';
import {
  ROUTE_ORDER_NEW_REGISTER_CONFIRM_USER_INFORMATION_PAGE
} from 'src/app/order/order-new-register/constants/route-path.constant';
import { HttpClient } from '@angular/common/http';
import { Transaction, TransactionAction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { NgxResource, LocalStorageService } from 'ngx-store';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { WIZARD_DEVICE_ODER_AIS_DEVICE } from 'src/app/device-order/constants/wizard.constant';
import { ROUTE_DEVICE_AIS_DEVICE_PAYMENT_PAGE } from 'src/app/device-order/ais/device-order-ais-device/constants/route-path.constant';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-device-order-ais-device-ebilling-address-page',
  templateUrl: './device-order-ais-device-ebilling-address-page.component.html',
  styleUrls: ['./device-order-ais-device-ebilling-address-page.component.scss']
})
export class DeviceOrderAisDeviceEbillingAddressPageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_DEVICE_ODER_AIS_DEVICE;

  transaction: Transaction;
  customerAddress: CustomerAddress;
  allZipCodes: string[];
  provinces: any[];
  amphurs: string[];
  tumbols: string[];
  zipCodes: string[];
  prefixes: string[] = [];

  customerAddressTemp: CustomerAddress;
  billDeliveryAddress: CustomerAddress;
  translationSubscribe: Subscription;

  ebillingAddressValid: boolean;
  validateCustomerKeyInForm: FormGroup;
  customerInfo: any;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private translation: TranslateService,
    private customerService: CustomerService,
    public fb: FormBuilder,
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.callService();
    this.createForm();
    const customer: any = this.transaction.data && this.transaction.data.customer ? this.transaction.data.customer : {};
    this.translationSubscribe = this.translation.onLangChange.pipe(debounceTime(750)).subscribe(() => {
      this.callService();
      this.amphurs = [];
      this.tumbols = [];
      this.zipCodes = [];
      this.customerAddress.amphur = null;
      this.customerAddress.tumbol = null;
      this.customerAddress.province = null;
    });
    this.customerInfo = {
      firstName: customer.firstName,
      lastName: customer.lastName,
      idCardNo: customer.idCardNo,
      prefix: customer.titleName,
    };
  }
  callService(): void {
    const billingInformation = this.transaction.data &&
      this.transaction.data.billingInformation ? this.transaction.data.billingInformation : {};
    const customerProfile: any = this.transaction.data && this.transaction.data.customer ? this.transaction.data.customer : {};
    const customer = billingInformation.billDeliveryAddress || customerProfile;
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
    this.customerService.queryTitleName().then((resp: any) => {
      this.prefixes = (resp.data.titleNames || []).map((prefix: any) => prefix);
    });
    console.log('address', this.customerAddress);
  }

  createForm(): void {
    // tslint:disable-next-line:max-line-length
    const billingInformation: any = this.transaction.data && this.transaction.data.billingInformation ? this.transaction.data.billingInformation : {};
    const customerProfile: any = this.transaction.data && this.transaction.data.customer ? this.transaction.data.customer : {};
    const customer: any = billingInformation.billDeliveryAddress || customerProfile;
    console.log('cus add', customer);
    const customValidate = this.defaultValidate;
    this.validateCustomerKeyInForm = this.fb.group({
      idCardNo: [{ value: '', disabled: this.checkIdCardNo() }, customValidate.bind(this)],
      prefix: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
    });
    this.validateCustomerKeyInForm.patchValue({
      idCardNo: customer.idCardNo || '',
      prefix: customer.titleName || '',
      firstName: customer.firstName || '',
      lastName: customer.lastName || '',
    });
    console.log(' this.validateCustomerKeyInForm', this.validateCustomerKeyInForm.value);
  }
  checkIdCardNo(): boolean {
    const customer = this.transaction.data
      && this.transaction.data.customer
      && this.transaction.data.customer.idCardNo ? this.transaction.data.customer.idCardNo : {};
    console.log('checkIdCardNo', !!customer);
    if (customer) {
      console.log('true');
      return true;
    } else {
      return false;
    }
  }
  defaultValidate(): ValidationErrors | null {
    const customer = this.transaction.data
      && this.transaction.data.customer
      && this.transaction.data.customer.idCardNo ? this.transaction.data.customer.idCardNo : {};
    console.log('defaultValidate', !customer);
    if (!customer) {
      return {
        message: 'กรุณากรอกรูปแบบให้ถูกต้อง'
      };
    }
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

  onAmphurSelected(params: any): void {
    const province = this.getProvinceByName(params.provinceName);
    const req = {
      provinceId: province.id,
      amphurName: params.amphurName,
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
    this.router.navigate([ROUTE_DEVICE_AIS_DEVICE_PAYMENT_PAGE], { queryParams: { ebilling : true} });
  }

  onNext(): void {
    this.transaction.data.billingInformation = this.transaction.data.billingInformation || {};
    console.log('billingInformation', JSON.stringify(this.transaction.data.billingInformation));
    const customer = this.transaction.data.billingInformation.billDeliveryAddress || this.transaction.data.customer;
    console.log('customer', customer);
    this.transactionService.update(this.transaction);
    this.transaction.data.billingInformation.billDeliveryAddress = Object.assign(
      Object.assign({}, customer),
      this.customerAddressTemp
    );
    this.transaction.data.billingInformation.billDeliveryAddress.titleName = this.validateCustomerKeyInForm.value.prefix;
    this.transaction.data.billingInformation.billDeliveryAddress.firstName = this.validateCustomerKeyInForm.value.firstName;
    this.transaction.data.billingInformation.billDeliveryAddress.lastName = this.validateCustomerKeyInForm.value.lastName;
    // tslint:disable-next-line:max-line-length
    this.transaction.data.billingInformation.billDeliveryAddress.idCardNo = this.validateCustomerKeyInForm.value.idCardNo || customer.idCardNo;
    this.router.navigate([ROUTE_DEVICE_AIS_DEVICE_PAYMENT_PAGE], { queryParams: { ebilling : true} });
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.translationSubscribe.unsubscribe();
    this.transactionService.update(this.transaction);
  }
}

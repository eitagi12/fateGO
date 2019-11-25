import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, CustomerAddress, PageLoadingService } from 'mychannel-shared-libs';
import { HttpClient } from '@angular/common/http';
import { TransactionService } from 'src/app/shared/services/transaction.service';
// import { ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_CONFIRM_USER_INFORMATION_PAGE } from '../../constants/route-path.constant';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime } from 'rxjs/operators';
import { ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_CONFIRM_USER_INFORMATION_PAGE } from '../../constants/route-path.constant';
import { WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN } from 'src/app/device-order/constants/wizard.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
@Component({
  selector: 'app-new-register-mnp-ebilling-address-page',
  templateUrl: './new-register-mnp-ebilling-address-page.component.html',
  styleUrls: ['./new-register-mnp-ebilling-address-page.component.scss']
})
export class NewRegisterMnpEbillingAddressPageComponent implements OnInit, OnDestroy {
  wizards: string[] = WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN;

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
    private translation: TranslateService,
    private pageLoadingService: PageLoadingService
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

  callService(): void {
    const billingInformation = this.transaction.data.billingInformation || {};
    const customer = billingInformation.billDeliveryAddress || this.transaction.data.customer;

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
        console.log(resp);
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
    console.log('complete eb adr', value);
    this.customerAddressTemp = value;
    if (this.transaction.data.action === 'KEY_IN') {
      this.mapCustomerAddress(value);
    }
  }

  mapCustomerAddress(customer: any): void {
    const birthdate = this.transaction.data.customer.birthdate;
    const idCardNo = this.transaction.data.customer.idCardNo;
    const titleName = this.transaction.data.customer.titleName;
    const idCardType = this.transaction.data.customer.idCardType;
    const firstName = this.transaction.data.customer.firstName;
    const lastName = this.transaction.data.customer.lastName;
    const mobileNo = this.transaction.data.customer.mobileNo;
    const imageSignature = this.transaction.data.customer.imageSignature;
    const imageSmartCard = this.transaction.data.customer.imageSmartCard;
    const imageReadSmartCard = this.transaction.data.customer.imageReadSmartCard;
    const gender = this.transaction.data.customer.gender;
    const expireDate = this.transaction.data.customer.expireDate;
    this.transaction.data = {
      ...this.transaction.data,
      customer: {
        idCardNo: idCardNo,
        idCardType: idCardType || '',
        titleName: titleName || '',
        firstName: firstName || '',
        lastName: lastName || '',
        birthdate: birthdate || '',
        gender: gender || '',
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
        firstNameEn: '',
        lastNameEn: '',
        issueDate: birthdate || '',
        expireDate: expireDate || '',
        zipCode: customer.zipCode || '',
        mainMobile: customer.mainMobile || '',
        mainPhone: customer.mainPhone || '',
        billCycle: customer.billCycle || '',
        caNumber: customer.caNumber || '',
        mobileNo: mobileNo || '',
        imageSignature: imageSignature || '',
        imageSmartCard: imageSmartCard || '',
        imageReadSmartCard: imageReadSmartCard || '',
      }
    };
  }

  onError(valid: boolean): void {
    this.ebillingAddressValid = valid;
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_CONFIRM_USER_INFORMATION_PAGE]);
  }

  onNext(): void {
    const billingInformation = this.transaction.data.billingInformation || {};
    const customer = billingInformation.billDeliveryAddress || this.transaction.data.customer;
    this.transactionService.update(this.transaction);
    this.transaction.data.billingInformation.billDeliveryAddress = Object.assign(
      Object.assign({}, customer),
      this.customerAddressTemp
    );
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_CONFIRM_USER_INFORMATION_PAGE]);
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

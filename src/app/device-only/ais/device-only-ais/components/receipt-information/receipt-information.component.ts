import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors  } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { BillingAddressService } from '../../services/billing-address.service';
import { HttpClient } from '@angular/common/http';
import { AlertService, REGEX_MOBILE, AuthenService } from 'mychannel-shared-libs';
import { TokenService } from 'mychannel-shared-libs';
import { TransactionAction, Customer, BillDeliveryAddress, Receipt } from 'src/app/shared/models/transaction.model';
import { CustomerInformationService } from '../../services/customer-information.service';
import { StringifyOptions } from 'querystring';
import { forEach } from '@angular/router/src/utils/collection';

export interface ReceiptInfo {
  taxId: string;
  branch: string;
  buyer: string;
  buyerAddress: string;
  telNo: string;
  locationName: string;
}

@Component({
  selector: 'app-receipt-information',
  templateUrl: './receipt-information.component.html',
  styleUrls: ['./receipt-information.component.scss']
})
export class ReceiptInformationComponent implements OnInit {
  [x: string]: any;

  @Input()
  receiptInfo: ReceiptInfo;

  @Input()
  branch: any;

  @Input()
  locationName: string;

  @Output()
  completed: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  error: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  action: EventEmitter<string> = new EventEmitter<string>();

  public customerInfoMock: any = {
    taxId: '',
    name: '',
    mobileNo: '',
    billingAddress: '',
    status: '',
    branch: '',
    locationName: ''
  };

  searchByMobileNoForm: FormGroup;
  receiptInfoForm: FormGroup;
  billingAddressForm: FormGroup;
  customerAddress: any;
  inputBillingAddress: boolean;
  titleName: any;
  provinces: any;
  allZipCodes: any;
  amphurs: any;
  tumbols: any;
  zipCode: any;
  customerAddressTemp: any;
  ebillingAddressValid: boolean;
  nameText: string;
  billingAddressText: string;
  constructor(
    private fb: FormBuilder,
    private billingAddress: BillingAddressService,
    private customerInformationService: CustomerInformationService,
    private authHttpService: AuthenService,
    private alertService: AlertService) {
    this.billingAddress.getTitleName().then(this.responseTitleNames());
    this.billingAddress.getProvinces().then(this.responseProvinces());
    this.billingAddress.getZipCodes().then(this.responseZipCodes());
   }

  ngOnInit(): void {
    this.customerAddress = {
      idCardNo: '',
      titleName: '',
      firstName: '',
      lastName: '',
      homeNo: '',
      moo: '',
      mooBan: '',
      room: '',
      floor: '',
      buildingName: '',
      soi: '',
      street: '',
      province: '',
      amphur: '',
      tumbol: '',
      zipCode: '',
    };
    this.createForm();
    this.createSearchByMobileNoForm();
    this.billingAddress.getLocationName()
    .subscribe((resp) => this.receiptInfoForm.controls['branch'].setValue(resp.data.displayName));
    // this.receiptInfoForm.controls['locationName'].setValue(this.locationName = this.tokenService.getUser().locationCode);
    // console.log(this.locationName);
  }

  private createForm(): void {
    this.receiptInfoForm = this.fb.group({
      taxId: ['', []],
      branch: ['', []],
      buyer: ['', []],
      buyerAddress: ['', []],
      telNo: ['', [Validators.pattern(/^0[6-9]\d{8}$/), Validators.required]],
      locationName: ['', []]
    });
    this.receiptInfoForm.controls['taxId'].disable();
    this.receiptInfoForm.controls['branch'].disable();
    this.receiptInfoForm.valueChanges.pipe(debounceTime(750)).subscribe(event => {
      this.error.emit(this.receiptInfoForm.valid);
      if (this.receiptInfoForm.valid) {
        this.completed.emit(this.receiptInfoForm.value);
      }
    });
  }
  private createSearchByMobileNoForm(): void {
    this.searchByMobileNoForm = this.fb.group({
      mobileNo: ['', Validators.compose([Validators.required, Validators.pattern(REGEX_MOBILE)])]
    });
  }
  setReceiptInfo(data: any): void {
    const  receipt: Receipt = {
      taxId: data.receipt.taxId,
      branch: data.receipt.branch,
      buyer: data.receipt.buyer,
      buyerAddress: data.receipt.buyerAddress,
      telNo: data.receipt.telNo,
      locationName: data.receipt.locationName
    };
  }
  setCustomerInfo(data: any): void {
    const customer: Customer = {
      idCardNo: data.customer.idCardNo,
      idCardType: data.customer.idCardType || 'บัตรประชาชน',
      titleName: data.customer.titleName,
      firstName: data.customer.firstName,
      lastName: data.customer.lastName,
      birthdate: data.customer.birthdate || '',
      gender: data.customer.gender || '',
      expireDate: data.customer.expireDate || ''
    };
    const billDeliveryAddress: BillDeliveryAddress = {
      homeNo: data.customer.homeNo,
      moo: data.customer.moo || '',
      mooBan: data.customer.mooBan || '',
      room: data.customer.room || '',
      floor: data.customer.floor || '',
      buildingName: data.customer.buildingName || '',
      soi: data.customer.soi || '',
      street: data.customer.street || '',
      province: data.customer.province,
      amphur: data.customer.amphur,
      tumbol: data.customer.tumbol,
      zipCode: data.customer.zipCode
    };
    this.action.emit(data.action);
    this.completed.emit({ customer, billDeliveryAddress });
    this.receiptInfoForm.controls['taxId'].setValue(data.customer.idCardNo);
    this.nameText = data.customer.titleName + ' ' + data.customer.firstName + ' ' + data.customer.lastName;
    this.billingAddressText = this.convertBillingAddressToString(billDeliveryAddress);
  }
  searchCustomerInfo(): void {
    if (this.searchByMobileNoForm.valid) {
      const mobileNo = this.searchByMobileNoForm.value.mobileNo;
      this.customerInformationService.getBillingByMobileNo(mobileNo)
        .then((res) => {
          if (res && res.data && res.data.billingAddress) {
            this.setCustomerInfo({
              customer: this.customerInformationService.mapAttributeFromGetBill(res.data.billingAddress),
          action: TransactionAction.KEY_IN
        });
      } else {
        this.alertService.notify({
          type: 'error',
          confirmButtonText: 'OK',
          showConfirmButton: true,
          text: 'เบอร์นี้ไม่ใช่ระบบ AIS กรุณาเปลี่ยนเบอร์ใหม่'
        });
      }
    })
      .catch((err) => {
        this.alertService.notify({
          type: 'error',
          confirmButtonText: 'OK',
          showConfirmButton: true,
          text: 'เบอร์นี้ไม่ใช่ระบบ AIS กรุณาเปลี่ยนเบอร์ใหม่'
        });
      });
    } else {
      this.alertService.notify({
        type: 'warning',
        confirmButtonText: 'OK',
        showConfirmButton: true,
        text: 'กรุณาระบุเบอร์ให้ครบ 10 หลัก'
      });
    }
  }

  convertBillingAddressToString(billDeliveryAddress: BillDeliveryAddress): string {
    let str: string = '';
    for (const item in billDeliveryAddress) {
      if (billDeliveryAddress.hasOwnProperty(item)) {
          str += ' ' + billDeliveryAddress[item];
      }
    }
    return str;
  }

  switchKeyInBillingAddress(): void {
    this.inputBillingAddress = !this.inputBillingAddress;
    if (this.inputBillingAddress) {
      this.receiptInfoForm.controls['taxId'].enable();
      this.receiptInfoForm.controls['branch'].disable();
    } else {
      this.receiptInfoForm.controls['taxId'].disable();
      this.receiptInfoForm.controls['branch'].disable();
    }
  }

  onProvinceSelected(params: any): void {
    const province = this.findProvinceByName(params.provinceName);
    const req = {
      provinceId: province.id,
      zipcode: params.zipCode
    };
    if (!params.zipCode) {
      delete req.zipcode;
    }
    this.billingAddress.getAmphurs(req).then(this.responseAmphur());
  }

  onAmphurSelected(params: any): void {
    const province = this.findProvinceByName(params.provinceName);
    const req = {
      provinceId: province.id,
      amphurName: params.amphurName,
      zipcode: params.zipCode
    };
    if (!params.zipCode) {
      delete req.zipcode;
    }
    this.billingAddress.getTumbols(req).then(this.responseTumbols());
  }

  onTumbolSelected(params: any): void {
    const province = this.findProvinceByName(params.provinceName);
    const req  = {
      provinceId: province.id,
      amphurName: params.amphurName,
      tumbolName: params.tumbolName
    };
    this.billingAddress.queryZipCode(req).then(this.responseZipCode());
  }

  onZipCodeSelected(zipCode: string): void {
    this.billingAddress.getProvinceIdByZipCode(zipCode).then(provinceId => {
      const province = this.findProvinceByProvinceID(provinceId);
      if (!province) { return; }
      this.assignProvinceAndZipCode(province, zipCode);
    });
  }

  onCompleted(value: any): void {
    this.customerAddressTemp = value;
    this.setCustomerInfo({
      customer: value,
      action: TransactionAction.KEY_IN
    });
    if (this.customerAddressTemp.idCardNo) {
      this.receiptInfoForm.controls['taxId'].setValue(this.customerAddressTemp.idCardNo);
    }
  }

  onError(valid: boolean): void {
    this.ebillingAddressValid = valid;
  }

  private assignProvinceAndZipCode(province: any, zipCode: string): void {
    this.customerAddress = Object.assign(Object.assign({}, this.customerAddress), {
      province: province.name,
      zipCode: zipCode
    });
  }

  private findProvinceByName(provinceName: string): any {
    return (this.provinces || []).find((prov: any) => prov.name === provinceName) || {};
  }

  private findProvinceByProvinceID(provinceId: string): any {
    return this.provinces.find((prov: any) => prov.id === provinceId);
  }

  private getProvinces(): string[] {
    return (this.provinces || []).map((province: any) => province.name);
  }

  private responseTitleNames(): (value: any) => any {
    return (resp: string[]) => this.titleName = resp;
  }

  private responseZipCode(): (value: any) => any {
    return (resp: any) => this.zipCode = resp;
  }

  private responseTumbols(): (value: any) => any {
    return (resp: string[]) => this.tumbols = resp;
  }

  private responseAmphur(): (value: any) => any {
    return (resp: string[] ) => this.amphurs = resp;
  }

  private responseZipCodes(): (value: any) => any {
    return (resp: string[]) => this.allZipCodes = resp;
  }

  private responseProvinces(): (value: any) => any {
    return (resp: string[]) => this.provinces = resp;
  }
  private responseTelNo(): AbstractControl {
    return this.receiptInfoForm.controls['telNo'];
    // return this.customerAddressForm.controls['amphur'];
  }
}

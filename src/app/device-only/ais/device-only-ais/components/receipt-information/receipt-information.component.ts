import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors  } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { BillingAddressService } from '../../services/billing-address.service';
import { HttpClient } from '@angular/common/http';

export interface ReceiptInfo {
  taxId: string;
  branch: string;
  buyer: string;
  buyerAddress: string;
  telNo: string;
}

@Component({
  selector: 'app-receipt-information',
  templateUrl: './receipt-information.component.html',
  styleUrls: ['./receipt-information.component.scss']
})
export class ReceiptInformationComponent implements OnInit {

  @Input()
  receiptInfo: ReceiptInfo;

  @Output()
  completed: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  error: EventEmitter<boolean> = new EventEmitter<boolean>();

  receiptInfoForm: FormGroup;
  billingAddressForm: FormGroup;
  customerAddress: any;
  inputBillingAddress: boolean;
  provinces: any;
  allZipCodes: any;
  amphurs: any;
  tumbols: any;
  zipCode: any;

  customerAddressTemp: any;
  ebillingAddressValid: boolean;

  constructor(
    private fb: FormBuilder,
    private billingAddress: BillingAddressService) {
    this.billingAddress.getProvinces().then(this.responseProvinces());
    this.billingAddress.getZipCodes().then(this.responseZipCodes());
   }

  ngOnInit(): void {
    this.customerAddress = {
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
  }

  private createForm(): void {
    this.receiptInfoForm = this.fb.group({
      taxId: ['', []],
      branch: ['', []],
      buyer: ['', []],
      buyerAddress: ['', []],
      telNo: ['', [Validators.pattern(/^0[6-9]\d{8}$/)]]
    });
    // this.receiptInfoForm.patchValue(this.receiptInfo);
    this.receiptInfoForm.valueChanges.pipe(debounceTime(750)).subscribe(event => {
      this.error.emit(this.receiptInfoForm.valid);
      if (this.receiptInfoForm.valid) {
        this.completed.emit(this.receiptInfoForm.value);
      }
    });
  }

  onClickInputBillingAddress(): void {
    this.inputBillingAddress = true;
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
    return (this.provinces || []).map((province: any) => {
      return province.name;
    });
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

}

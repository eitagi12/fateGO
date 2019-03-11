import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors  } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { BillingAddressService } from '../../services/billing-address.service';

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
  inputBillingAddress: boolean;
  provinces: any;
  allZipCodes: any;
  districts: any;
  subDistricts: any;
  zipCode: any;

  constructor(private fb: FormBuilder, private billingAddress: BillingAddressService) {
    this.billingAddress.getProvinces().then(this.getDataProvinces());
    this.billingAddress.getZipCodes().then(this.getDataZipCodes());
   }

  ngOnInit(): void {
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

  getProvinceByName(provinceName: string): any {
    return (this.provinces || []).find((prov: any) => prov.name === provinceName) || {};
  }

  onProvinceSelected(params: any): void {
    const province = this.getProvinceByName(params.provinceName);
    const req = {
      provinceId: province.id,
      zipCode: params.zipCode
    };
    if (!params.zipCode) {
      delete req.zipCode;
    }
    this.billingAddress.getDistrict(req).then(this.getdataDistrict());
  }

  onDistrictSelected(params: any): void {
    const province = this.getProvinceByName(params.provinceName);
    const req = {
      provinceId: province.id,
      amphurName: params.districtName,
      zipCode: params.zipCode
    };
    if (!params.zipCode) {
      delete req.zipCode;
    }
    this.billingAddress.getSubDistrict(req).then(this.getDataSubDistrict());
  }

  onSubDistrictSelected(params: any): void {
    const province = this.getProvinceByName(params.provinceName);
    const req  = {
      provinceId: province.id,
      amphurName: params.districtName,
      tumbolName: params.subDistrictName
    };
    this.billingAddress.queryZipCode(req).then(this.getDataZipCode());
  }

  private getDataZipCode(): (value: any) => any {
    return (resp: any) => this.zipCode = resp;
  }

  private getDataSubDistrict(): (value: any) => any {
    return (resp: string[]) => this.subDistricts = resp;
  }

  private getdataDistrict(): (value: any) => any {
    return (resp: string[] ) => this.districts = resp;
  }

  private getDataZipCodes(): (value: any) => any {
    return (resp: string[]) => this.allZipCodes = resp;
  }

  private getDataProvinces(): (value: any) => any {
    return (resp: string[]) => this.provinces = resp;
  }

  getProvinces(): string[] {
    return (this.provinces || []).map((province: any) => {
      return province.name;
    });
  }

}

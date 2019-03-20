import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors  } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { BillingAddressService } from '../../services/billing-address.service';
import { HttpClient } from '@angular/common/http';
import { AlertService, REGEX_MOBILE } from 'mychannel-shared-libs';
import { TransactionAction } from 'src/app/shared/models/transaction.model';

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
    status: ''
  };

  searchByMobileNoForm: FormGroup;
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
    private billingAddress: BillingAddressService,
    private alertService: AlertService) {
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
    this.createSearchByMobileNoForm();
    this.receiptInfoForm.controls['locationName'].setValue(this.locationName);
  }

  private createForm(): void {
    this.receiptInfoForm = this.fb.group({
      taxId: ['', []],
      branch: ['', []],
      buyer: ['', []],
      buyerAddress: ['', []],
      telNo: ['', [Validators.pattern(/^0[6-9]\d{8}$/)]],
      locationName: ''
    });
    this.receiptInfoForm.controls['taxId'].disable();
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

  setCustomerInfo(data: any): void {
    this.action.emit(data.action);
    this.completed.emit(data.customer);
    this.receiptInfoForm.controls['taxId'].setValue(data.customer.idCardNo);
    // mock for review
    this.customerInfoMock = data.customer;
  }

  searchCustomerInfo(): void {
    if (this.searchByMobileNoForm.valid) {
      if (this.searchByMobileNoForm.value.mobileNo === '0889540584') {
        this.setCustomerInfo({
          customer: {
            idCardNo: '1234500678910',
            idCardType: 'บัตรประชาชน',
            titleName: 'นาย',
            firstName: 'ธีระยุทธ',
            lastName: 'เจโตวิมุติพงศ์',
            birthdate: '2019-12-10',
            gender: 'M',
            taxId: '1234500678910',
            name: 'นาย ธีระยุทธ เจโตวิมุติพงศ์',
            mobileNo: '0889540584',
            billingAddress: 'ซ.พหลโยธิน 9 ตึก ESV ชั้น 22 แขวงสามเสนใน เขตพญาไท กรุงเทพฯ 10400',
            status: 'Active'
          },
          action: TransactionAction.KEY_IN
        });
      } else {
        this.alertService.notify({
          type: 'error',
          confirmButtonText: 'OK',
          showConfirmButton: true,
          text: 'ไม่พบหมายเลขนี้ในระบบ AIS'
        });
      }
    } else {
      this.alertService.notify({
        type: 'warning',
        confirmButtonText: 'OK',
        showConfirmButton: true,
        text: 'กรุณาระบุหมายเลขโทรศัพท์ให้ถูกต้อง'
      });
    }
  }

  switchKeyInBillingAddress(): void {
    this.inputBillingAddress = !this.inputBillingAddress;
    if (this.inputBillingAddress) {
      this.receiptInfoForm.controls['taxId'].enable();
    } else {
      this.receiptInfoForm.controls['taxId'].disable();
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

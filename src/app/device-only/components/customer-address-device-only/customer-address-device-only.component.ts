import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Utils } from 'mychannel-shared-libs';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-customer-address-device-only',
  templateUrl: './customer-address-device-only.component.html',
  styleUrls: ['./customer-address-device-only.component.scss']
})
export class CustomerAddressDeviceOnlyComponent implements OnInit {

  customerAddressForm: FormGroup;
  translationSubscribe: Subscription;
  idCardMaxLength: number = 13;
  titleNames: string[];
  allZipCodes: string[];
  provinces: any[];
  amphurs: string[];
  tumbols: string[];
  zipCodes: string[];

  constructor(
    public fb: FormBuilder,
    private utils: Utils,
    private http: HttpClient,
    private translation: TranslateService
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.callServiceTitleNames();
    // this.callServiceProvinces();
  }

  createForm(): void {
    this.customerAddressForm = this.fb.group({
      idCardNo: ['', [Validators.required, Validators.pattern(/^[1-8]\d{12}$/), this.validateIdCard.bind(this)]],
      titleName: ['', [Validators.required]],
      firstName: ['', [Validators.required, this.validateCharacter()]],
      lastName: ['', [Validators.required, this.validateCharacter()]],
      homeNo: ['', [Validators.required, Validators.pattern(/^[0-9^/]*$/)]],
      moo: [''],
      mooBan: [''],
      room: [''],
      floor: [''],
      buildingName: [''],
      soi: [''],
      street: [''],
      province: ['', [Validators.required]],
      amphur: ['', [Validators.required]],
      tumbol: ['', [Validators.required]],
      zipCode: ['', [Validators.required, Validators.maxLength(5), this.validateZipCode.bind(this)]],
    });
  }

  callServiceTitleNames(): void {
    this.http.get('/api/customerportal/newRegister/queryTitleName', {
    }).subscribe((resp: any) => {
      this.titleNames = (resp.data.titleNames || []);
      console.log('titleName : ',  this.titleNames);
    });
  }

  callServiceProvinces(): void {
    this.http.get('/api/customerportal/newRegister/getAllProvinces', {
      params: {
        provinceSubType: this.translation.currentLang === 'TH' ? 'THA' : 'ENG'
      }}).subscribe((resp: any) => {
        this.provinces = (resp.data.provinces || []);
        console.log('resp.data.provinces  :', resp.data.provinces);
        console.log('provinces            :', this.provinces);
    });
  }

  validateCharacter(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const reg = /[!$%^&*()_+|~=`{}\[\]:";'<>?,\/@#./1-9]/;
      const stringValue = control.value;
      const no = reg.test(stringValue);
      return no ? { 'validateCharacter': { stringValue } } : null;
    };
  }

  validateIdCard(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const inputLength = value ? value.length : 0;
    if (inputLength === 13) {
      if (this.utils.isThaiIdCard(value)) {
        return null;
      } else {
        return {
          message: 'กรุณากรอกเลขบัตรประชาชนให้ถูกต้อง',
        };
      }
    }
  }

  validateZipCode(control: AbstractControl): ValidationErrors | null {
    const isZipCode = (this.zipCodes || []).find(zipCode => zipCode === control.value);
    if (isZipCode) {
      return null;
    }
    return {
      field: 'zipCode'
    };
  }

}

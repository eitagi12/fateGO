import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { debounceTime, distinct } from 'rxjs/operators';

@Component({
  selector: 'app-billing-address',
  templateUrl: './billing-address.component.html',
  styleUrls: ['./billing-address.component.scss']
})
export class BillingAddressComponent implements OnInit {
  @Input()
  allZipCodes: string[];

  @Input()
  provinces: string[];

  @Input()
  districts: string[];

  @Input()
  subDistricts: string[];

  @Input()
  zipCode: string[];

  @Output()
  provinceSelected: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  distinctSelected: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  subDistinctSelected: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  zipCodeSelected: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  completed: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  error: EventEmitter<boolean> = new EventEmitter<boolean>();

  billingAddressForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.createForm();
  }

   private createForm(): void {
    this.billingAddressForm = this.fb.group({
      customerName: ['', []],
      addressNo: ['', []],
      road: ['', []],
      subDistrict: ['', []],
      district: ['', []],
      province: ['', []],
      zipCode: ['', [Validators.required, Validators.maxLength(5), this.validateZipCode.bind(this)]],
    });
    this.billingAddressForm.valueChanges.pipe(debounceTime(750)).subscribe(event => {
      this.error.emit(this.billingAddressForm.valid);
      if (this.billingAddressForm.valid) {
        this.completed.emit(this.billingAddressForm.value);
      }
    });
    this.provincesForm().valueChanges.subscribe((provinceName: any) => {
      this.billingAddressForm.patchValue({
        district: '',
        subDistrict: '',
      });
      this.districtsForm().enable();
      this.subDistrictsForm().disable();
      if (provinceName) {
        const controlsZipCode = this.zipCodesForm();
        this.provinceSelected.emit({
          provinceName: provinceName,
          zipCode: controlsZipCode.invalid ? controlsZipCode.value : null
        });
      }
    });

    this.districtsForm().valueChanges.subscribe((districtName: any) => {
      this.billingAddressForm.patchValue({
        subDistrict: '',
      });
      this.subDistrictsForm().enable();
      if (districtName) {
        const controlsZipCode = this.zipCodesForm();
        this.distinctSelected.emit({
          provinceName: this.billingAddressForm.value.province || '',
          districtName: districtName,
          zipCode: controlsZipCode.invalid ? controlsZipCode.value : null
        });
      }
    });

    this.subDistrictsForm().valueChanges.subscribe((subDistrictName: any) => {
      if (subDistrictName) {
        const controlsZipCode = this.zipCodesForm();
        console.log('this.billingAddressForm.value', this.billingAddressForm.value);
        this.subDistinctSelected.emit({
          provinceName: this.billingAddressForm.value.province || '',
          districtName: this.billingAddressForm.value.district || '',
          subDistrictName: subDistrictName,
          zipCode: controlsZipCode.invalid ? controlsZipCode.value : null
        });
      }
    });
  }

  validateZipCode(control: AbstractControl): ValidationErrors | null {
    const isZipCode = (this.zipCode || []).find(zipCode => zipCode === control.value);
    if (isZipCode) {
      return null;
    }
    return {
      field: 'zipCode'
    };
  }

  private provincesForm(): AbstractControl {
    return this.billingAddressForm.controls['province'];
  }

  private districtsForm(): AbstractControl {
    return this.billingAddressForm.controls['district'];
  }

  private zipCodesForm(): AbstractControl {
    return this.billingAddressForm.controls['zipCode'];
  }

  private subDistrictsForm(): AbstractControl {
    return this.billingAddressForm.controls['subDistrict'];
  }
}

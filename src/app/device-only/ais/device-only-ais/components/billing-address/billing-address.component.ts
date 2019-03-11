import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { debounceTime, distinct } from 'rxjs/operators';

export interface CustomerAddress {
  homeNo: string;
  moo?: string;
  mooBan?: string;
  room?: string;
  floor?: string;
  buildingName?: string;
  soi?: string;
  street?: string;
  province: string;
  amphur: string;
  tumbol: string;
  zipCode: string;
}

@Component({
  selector: 'app-billing-address',
  templateUrl: './billing-address.component.html',
  styleUrls: ['./billing-address.component.scss']
})
export class BillingAddressComponent implements OnInit, OnChanges {

  @Input()
  customerAddress: CustomerAddress;

  @Input()
  allZipCodes: string[];

  @Input()
  provinces: string[];

  @Input()
  amphurs: string[];

  @Input()
  tumbols: string[];

  @Input()
  zipCodes: string[];

  @Output()
  provinceSelected: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  amphurSelected: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  tumbolSelected: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  zipCodeSelected: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  completed: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  error: EventEmitter<boolean> = new EventEmitter<boolean>();

  customerAddressForm: FormGroup;

  constructor(
    public fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.createForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.customerAddressForm) {
      return;
    }

    if (changes.customerAddress) {
      const currentValue: any = changes.customerAddress.currentValue;
      const previousValue: any = changes.customerAddress.previousValue;
      if (previousValue && currentValue.province === previousValue.province) {
        this.customerAddressForm.patchValue({
          province: currentValue.province,
          zipCode: currentValue.zipCode
        });
      } else {
        this.customerAddressForm.patchValue(currentValue || {});
      }
    }

    if (changes.amphurs
      && changes.amphurs.currentValue
      && changes.amphurs.currentValue.length === 1) {
      this.customerAddressForm.patchValue({
        amphur: changes.amphurs.currentValue[0]
      });
    }

    if (changes.tumbols
      && changes.tumbols.currentValue
      && changes.tumbols.currentValue.length === 1) {
      this.customerAddressForm.patchValue({
        tumbol: changes.tumbols.currentValue[0]
      });
    }

    if (changes.zipCodes
      && changes.zipCodes.currentValue
      && changes.zipCodes.currentValue.length === 1) {
      this.customerAddressForm.patchValue({
        zipCode: changes.zipCodes.currentValue[0]
      });
    }
  }

  clearCustomerAddressForm(event: any): void {
    event.preventDefault();
    this.customerAddressForm.reset();
    this.customerAddressForm.patchValue({
      amphur: '',
    });
    this.disableFormAmphurAndTumbol();
  }

  createForm(): void {
    this.customerAddressForm = this.fb.group({
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
    this.disableFormAmphurAndTumbol();
    this.customerAddressForm.valueChanges.pipe(debounceTime(750)).subscribe((value: any) => {
      this.error.emit(this.customerAddressForm.valid);
      if (this.customerAddressForm.valid) {
        this.completed.emit(value);
      }
    });
    this.customerAddressForm.patchValue(this.customerAddress || {});
    this.provinceFormControl();
    this.amphurFormControl();
    this.tumbolFormControl();
    this.zipCodeFormControl();
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

  private provinceFormControl(): void {
    this.provinceForm().valueChanges.subscribe((provinceName: any) => {
      this.customerAddressForm.patchValue({
        amphur: '',
        tumbol: '',
      });
      this.amphurForm().enable();
      this.tumbolForm().disable();
      if (provinceName) {
        const controlsZipCode = this.zipCodeForm();
        this.provinceSelected.emit({
          provinceName: provinceName,
          zipCode: controlsZipCode.invalid ? controlsZipCode.value : null
        });
      }
    });
  }

  private amphurFormControl(): void {
    this.amphurForm().valueChanges.subscribe((amphurName: any) => {
      this.customerAddressForm.patchValue({
        tumbol: '',
      });
      this.tumbolForm().enable();
      if (amphurName) {
        const controlsZipCode = this.zipCodeForm();
        this.amphurSelected.emit({
          provinceName: this.customerAddressForm.value.province || '',
          amphurName: amphurName,
          zipCode: controlsZipCode.invalid ? controlsZipCode.value : null
        });
      }
    });
  }

  private tumbolFormControl(): void {
    this.tumbolForm().valueChanges.subscribe((tumbolName: any) => {
      if (tumbolName) {
        const controlsZipCode = this.zipCodeForm();
        this.tumbolSelected.emit({
          provinceName: this.customerAddressForm.value.province || '',
          amphurName: this.customerAddressForm.value.amphur || '',
          tumbolName: tumbolName,
          zipCode: controlsZipCode.invalid ? controlsZipCode.value : null
        });
      }
    });
  }

  private zipCodeFormControl(): void {
    this.zipCodeForm().valueChanges.pipe(debounceTime(750))
      .subscribe((zipCode: string) => {
        const controls = this.zipCodeForm();
        if (controls.invalid
          && zipCode
          && zipCode.length === 5
          && this.customerAddress
          && this.customerAddress.zipCode !== zipCode) {
          this.zipCodeSelected.emit(controls.value);
        }
      });
  }

  private disableFormAmphurAndTumbol(): void {
    this.amphurForm().disable();
    this.tumbolForm().disable();
  }

  private provinceForm(): AbstractControl {
    return this.customerAddressForm.controls['province'];
  }

  private zipCodeForm(): AbstractControl {
    return this.customerAddressForm.controls['zipCode'];
  }

  private tumbolForm(): AbstractControl {
    return this.customerAddressForm.controls['tumbol'];
  }

  private amphurForm(): AbstractControl {
    return this.customerAddressForm.controls['amphur'];
  }

}

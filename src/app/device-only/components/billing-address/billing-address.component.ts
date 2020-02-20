import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinct, delay } from 'rxjs/operators';
import { Utils, CustomerAddress, User, TokenService } from 'mychannel-shared-libs';
import { CustomerInformationService } from 'src/app/device-only/services/customer-information.service';
import { TransactionAction, Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';

export interface CustomerAddress {
  titleName: string;
  firstName: string;
  lastName: string;
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

  @Input() keyInCustomerAddressTemp: any;

  @Input() actionType: string;

  @Input() titleNames: string[];

  @Input() firstName: string[];

  @Input() lastName: string[];

  @Input() customerAddress: CustomerAddress;

  @Input() idCardNo: string[];

  @Input() allZipCodes: string[];

  @Input() provinces: string[];

  @Input() amphurs: string[];

  @Input() tumbols: string[];

  @Input() zipCodes: string[];

  @Input() titleNameSelected: EventEmitter<any> = new EventEmitter<any>();

  @Output() provinceSelected: EventEmitter<any> = new EventEmitter<any>();

  @Output() amphurSelected: EventEmitter<any> = new EventEmitter<any>();

  @Output() tumbolSelected: EventEmitter<any> = new EventEmitter<any>();

  @Output() zipCodeSelected: EventEmitter<any> = new EventEmitter<any>();

  @Output() completed: EventEmitter<any> = new EventEmitter<any>();

  @Output() error: EventEmitter<boolean> = new EventEmitter<boolean>();

  customerAddressForm: FormGroup;
  private valueFn: any = Validators.nullValidator;
  private formErrors: { idCardNo: string; } = {
    idCardNo: ''
  };

  idCardMaxLength: number = 13;
  debounceTimeInMS: number = 500;
  identityValue: string;
  disableIdCard: boolean;
  transaction: Transaction;
  isDeviceOnlyASP: boolean;
  user: User;

  constructor(
    public fb: FormBuilder,
    private utils: Utils,
    private customerInformationService: CustomerInformationService,
    private transactionService: TransactionService,
    private tokenService: TokenService,
  ) {
    this.transaction = this.transactionService.load();
    this.user = this.tokenService.getUser();
  }

  ngOnInit(): void {
    this.createForm();
    this.checkProvinceAndAmphur();
    this.checkAction();
    this.isDeviceOnlyASP = this.user.userType === 'ASP' ? true : false;
  }

  checkAction(): void {
    if (this.actionType === TransactionAction.READ_CARD) {
      this.customerAddressForm.controls['idCardNo'].disable();
    } else {
      this.customerAddressForm.controls['idCardNo'].enable();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.zipCodes
      && changes.zipCodes.currentValue
      && changes.zipCodes.currentValue.length === 1) {
        if (this.customerAddressForm) {
          this.customerAddressForm.patchValue({
            zipCode: changes.zipCodes.currentValue[0]
          });
        }
    }
  }

  checkProvinceAndAmphur(): void {
    if (this.provinceForm().invalid) {
      this.amphurForm().disable();
      this.amphurForm().setValue('');
    }
    if (this.amphurForm().value === '') {
      this.tumbolForm().disable();
      this.tumbolForm().setValue('');
    }
  }

  clearCustomerAddressForm(event: any): void {
    event.preventDefault();
    this.customerAddressForm.reset();
    this.customerAddressForm.patchValue({
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
      zipCode: ''
    });
    this.disableFormAmphurAndTumbol();
    this.customerAddressForm.markAsTouched();
    this.completed.emit({
      ...this.customerAddressForm.value,
      dirty: this.customerAddressForm.dirty,
      touched: this.customerAddressForm.touched,
    });
    this.customerInformationService.unSetDisableReadCard();
    this.customerAddressForm.controls['idCardNo'].enable();
    if (this.zipCodes) {
      this.zipCodes.splice(0, 1);
    }
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
    this.disableFormAmphurAndTumbol();
    this.customerAddressForm.patchValue(this.customerAddress || {});
    this.titleFormControl();
    this.provinceFormControl();
    this.amphurFormControl();
    this.tumbolFormControl();
    this.zipCodeFormControl();
    if (this.keyInCustomerAddressTemp) {
      if (this.keyInCustomerAddressTemp.titleName === 'น.ส.') {
        this.keyInCustomerAddressTemp.titleName = 'นางสาว';
      }
      for (const item in this.keyInCustomerAddressTemp) {
        if (this.keyInCustomerAddressTemp.hasOwnProperty(item) && this.customerAddressForm.value.hasOwnProperty(item)) {
          this.customerAddressForm.controls[item].setValue(this.keyInCustomerAddressTemp[item]);
        }
      }
    }
    this.customerAddressForm.valueChanges.pipe(debounceTime(750)).subscribe((value: any) => {
      this.error.emit(this.customerAddressForm.valid);
      if (this.customerAddressForm.valid && this.customerAddressForm.controls.idCardNo.value) {
        const idCardNo = this.customerAddressForm.controls.idCardNo.value;
        this.completed.emit({...value, idCardNo, dirty: this.customerAddressForm.dirty, touched: this.customerAddressForm.touched });
      }
    });
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

  private titleFormControl(): void {
    this.titleNameForm().valueChanges.subscribe((titleName: any) => {
      if (titleName) {
        this.titleNameSelected.emit({
          titleName: titleName
        });
      }
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

  private titleNameForm(): AbstractControl {
    return this.customerAddressForm.controls['titleName'];
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

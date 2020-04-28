import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinct, delay } from 'rxjs/operators';
import { Utils, User, TokenService } from 'mychannel-shared-libs';
import { CustomerInformationService } from 'src/app/device-only/services/customer-information.service';
import { TransactionAction, Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient } from '@angular/common/http';
import { API } from 'src/app/device-only/constants/api.constant';
import { longStackSupport } from 'q';

export interface CustomerAddress {
  idCardNo?: string;
  titleName?: string;
  firstName?: string;
  lastName?: string;
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

  @Input() readCardCustomerAddressTemp: any;

  @Input() actionType: string;

  @Input() titleNames: string[];

  @Input() firstName: string[];

  @Input() lastName: string[];

  @Input() customerAddress: any;

  @Input() idCardNo: string[];

  @Input() zipCodesAllProvince: string[];

  @Input() provinces: string[];

  @Input() amphurs: string[];

  @Input() tumbols: string[];

  @Input() zipCodes: string[];

  @Input() allProvinces: string[];

  @Input() titleNameSelected: EventEmitter<any> = new EventEmitter<any>();

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

  provinceSelected: any;
  amphurSelected: any;
  tumbolSelected: any;
  zipCodeSelected: any;

  customerChanges: any;
  addessValidate: boolean = true;

  constructor(
    public fb: FormBuilder,
    private utils: Utils,
    private customerInformationService: CustomerInformationService,
    private transactionService: TransactionService,
    private tokenService: TokenService,
    private http: HttpClient
  ) {
    this.transaction = this.transactionService.load();
    this.user = this.tokenService.getUser();
  }

  ngOnInit(): void {
    this.createCustomerAddressForm();
    this.checkProvinceAndAmphur();
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
    //  This's refactor
    if (changes.readCardCustomerAddressTemp && changes.readCardCustomerAddressTemp.currentValue) {
      this.checkAction();
      this.customerAddressForm.patchValue({
        idCardNo: this.readCardCustomerAddressTemp.idCardNo,
        titleName: this.readCardCustomerAddressTemp.titleName === 'น.ส.' ? 'นางสาว' : this.readCardCustomerAddressTemp.titleName,
        firstName: this.readCardCustomerAddressTemp.firstName,
        lastName: this.readCardCustomerAddressTemp.lastName,
        homeNo: this.readCardCustomerAddressTemp.homeNo,
        moo: this.readCardCustomerAddressTemp.moo,
        mooBan: this.readCardCustomerAddressTemp.mooBan,
        room: this.readCardCustomerAddressTemp.room,
        floor: this.readCardCustomerAddressTemp.floor,
        buildingName: this.readCardCustomerAddressTemp.buildingName,
        soi: this.readCardCustomerAddressTemp.soi,
        street: this.readCardCustomerAddressTemp.street,
        province: this.readCardCustomerAddressTemp.province,
        amphur: this.readCardCustomerAddressTemp.amphur,
        tumbol: this.readCardCustomerAddressTemp.tumbol,
        zipCode: this.readCardCustomerAddressTemp.zipCode
      });
    } else if (changes.keyInCustomerAddressTemp && changes.keyInCustomerAddressTemp.currentValue) {
      this.checkAction();
      this.customerAddressForm.patchValue({
        idCardNo: this.keyInCustomerAddressTemp.idCardNo,
        titleName: this.keyInCustomerAddressTemp.titleName === 'น.ส.' ? 'นางสาว' : this.keyInCustomerAddressTemp.titleName,
        firstName: this.keyInCustomerAddressTemp.firstName,
        lastName: this.keyInCustomerAddressTemp.lastName,
        homeNo: this.keyInCustomerAddressTemp.homeNo,
        moo: this.keyInCustomerAddressTemp.moo,
        mooBan: this.keyInCustomerAddressTemp.mooBan,
        room: this.keyInCustomerAddressTemp.room,
        floor: this.keyInCustomerAddressTemp.floor,
        buildingName: this.keyInCustomerAddressTemp.buildingName,
        soi: this.keyInCustomerAddressTemp.soi,
        street: this.keyInCustomerAddressTemp.street,
        province: this.keyInCustomerAddressTemp.province,
        amphur: this.keyInCustomerAddressTemp.amphur,
        tumbol: this.keyInCustomerAddressTemp.tumbol,
        zipCode: this.keyInCustomerAddressTemp.zipCode
      });
    }

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

  createCustomerAddressForm(): void {
    this.customerAddressForm = this.fb.group({
      idCardNo: ['', [Validators.required, Validators.pattern(/^[1-8]\d{12}$/), this.validateIdCard.bind(this)]],
      titleName: ['', [Validators.required]],
      firstName: ['', [Validators.required, this.validateCharacter(), this.validateSpace()]],
      lastName: ['', [Validators.required, this.validateCharacter(), this.validateSpace()]],
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
      zipCode: ['', [Validators.required, Validators.maxLength(5), Validators.minLength(5), this.validateZipCode.bind(this)]],
    });

    // CHECK SELECT VALUE
    this.onSelectedTitleName();
    this.onSelectedProvince();
    this.onSelectedAmphur();
    this.onSelectedTumbol();

    this.customerAddressForm.valueChanges.pipe(debounceTime(750)).subscribe((value: any) => {
      if (this.keyInCustomerAddressTemp || this.readCardCustomerAddressTemp) {
        this.error.emit(this.customerAddressForm.valid);
      } else {
        if (this.addessValidate) {
          this.error.emit(true);
          this.addessValidate = !this.addessValidate;
        } else {
          this.error.emit(this.customerAddressForm.valid);
        }
      }
      if (this.customerAddressForm.valid && this.customerAddressForm.controls.idCardNo.value) {
        const idCardNo = this.customerAddressForm.controls.idCardNo.value;
        const firstName = this.customerAddressForm.controls.firstName.value.trim();
        const lastName = this.customerAddressForm.controls.lastName.value.trim();
        value.firstName = firstName;
        value.lastName = lastName;
        this.completed.emit({ ...value, idCardNo, dirty: this.customerAddressForm.dirty, touched: this.customerAddressForm.touched });
      }
    });
  }

  onSelectedTumbol(): void {
    this.customerAddressForm.controls['tumbol'].valueChanges.subscribe((tumbolName: any) => {
      if (tumbolName) {
        const controlsZipCode = this.customerAddressForm.controls['zipCode'];
        this.tumbolSelected = {
          provinceName: this.customerAddressForm.value.province || '',
          amphurName: this.customerAddressForm.value.amphur || '',
          tumbolName: tumbolName,
          zipCode: controlsZipCode.invalid ? controlsZipCode.value : null
        };
        this.customerAddress = {
          tumbol: tumbolName
        };
        this.queryZipCode(this.tumbolSelected);
      }
    });
  }

  onSelectedAmphur(): void {
    this.customerAddressForm.controls['amphur'].valueChanges.subscribe((amphurName: any) => {
      this.customerAddressForm.patchValue({
        tumbol: '',
      });
      this.customerAddressForm.controls['tumbol'].enable();
      if (amphurName) {
        const controlsZipCode = this.customerAddressForm.controls['zipCode'];
        this.amphurSelected = {
          provinceName: this.customerAddressForm.value.province || '',
          amphurName: amphurName,
          zipCode: controlsZipCode.invalid ? controlsZipCode.value : null
        };
        this.customerAddress = {
          amphur: amphurName
        };
        this.queryTumbol(this.amphurSelected);
      }
    });
  }

  onSelectedProvince(): void {
    this.customerAddressForm.controls['province'].valueChanges.subscribe((provinceName: any) => {
      this.customerAddressForm.patchValue({
        amphur: '',
        tumbol: '',
      });
      this.customerAddressForm.controls['amphur'].enable();
      this.customerAddressForm.controls['tumbol'].disable();
      if (provinceName) {
        if (this.customerAddressForm.controls['zipCode'].invalid) {
          this.customerAddressForm.controls['zipCode'].setValue(null);
        }
        const controlsZipCode = this.customerAddressForm.controls['zipCode'];
        this.provinceSelected = {
          provinceName: provinceName,
          zipCode: controlsZipCode.invalid ? controlsZipCode.value : null
        };
        this.customerAddress = {
          province: provinceName
        };
          this.queryAmphur(this.provinceSelected);
      }
    });
  }

  onSelectedTitleName(): void {
    this.customerAddressForm.controls['titleName'].valueChanges.subscribe((titleName: any) => {
      if (titleName) {
        this.customerAddress = {
          titleName: titleName
        };
      }
    });
  }

  validateZipCode(control: AbstractControl): ValidationErrors | null {
    if (!this.zipCodesAllProvince) {
      return null;
    }
    const isZipCode = (this.zipCodesAllProvince || []).find(zipCode => zipCode === control.value);
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
      const reg = /[!$%^&*()_+|~=`{}\[\]:";'<>?,\/@#./0-9]/;
      const stringValue = control.value;
      const no = reg.test(stringValue);
      return no ? { 'validateCharacter': { stringValue } } : null;
    };
  }

  validateSpace(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const stringValue = control.value;
      if (stringValue && stringValue.trim() === '') {
        return { 'validateSpace': { stringValue } };
      } else {
        return null;
      }
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

  // It's Refactor
  queryAmphur(params: any): void {
    const province = this.getProvinceByName(params.provinceName);
    const req = {
      provinceId: province.id,
      zipCode: params.zipcode
    };
    if (!params.zipCode) {
      delete req.zipCode;
    }
    this.http.get(API.QUERY_AMPHURS, { params: req }).subscribe((resp: any) => {
      this.amphurs = (resp.data.amphurs || []).map((amphur: any) => {
        return amphur;
      });
    });
  }

  queryTumbol(params: any): void {
    const province = this.getProvinceByName(params.provinceName);
    const req = {
      provinceId: province.id,
      amphurName: params.amphurName,
      zipCode: params.zipcode
    };
    if (!params.zipCode) {
      delete req.zipCode;
    }
    this.http.get(API.QUERY_TUMBOLS, { params: req }).subscribe((resp: any) => {
      this.tumbols = (resp.data.tumbols || []).map((tumbol: any) => {
        return tumbol;
      });
    });
  }

  queryZipCode(params: any): void {
    const province = this.getProvinceByName(params.provinceName);
    this.http.get(API.QUERY_ZIPCODE, {
      params: {
        provinceId: province.id,
        amphurName: params.amphurName,
        tumbolName: params.tumbolName
      }
    }).subscribe((resp: any) => {
      const zipCode = resp.data.zipcodes || [];
      if (zipCode && zipCode.length > 0) {
        const controlZipCode = this.customerAddressForm.controls['zipCode'];
        controlZipCode.setValue(zipCode[0]);
        this.zipCodeSelected = {
          zipCode: controlZipCode.value
        };
      }
    });
  }

  getProvinceByName(provinceName: string): any {
    return (this.allProvinces || []).find((prov: any) => prov.name === provinceName) || {};
  }

}

import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { debounceTime, distinct, delay } from 'rxjs/operators';
import { Utils, CustomerAddress, TokenService, ApiRequestService, ReceiptInfo } from 'mychannel-shared-libs';
import { CustomerInformationService } from '../../services/customer-information.service';
import { LocalStorageService } from 'ngx-store';
import { CreateDeviceOrderService } from '../../services/create-device-order.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction, TransactionType, TransactionAction } from 'src/app/shared/models/transaction.model';
import { DEPOSIT_PAYMENT_DETAIL_RECEIPT, DEPOSIT_PAYMENT_SUMMARY_PAGE } from '../../constants/route-path.constant';
import { Router } from '@angular/router';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { BillingAddressService } from '../../services/billing-address.service';

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
  selector: 'app-receipt-information',
  templateUrl: './receipt-information.component.html',
  styleUrls: ['./receipt-information.component.scss']
})
export class ReceiptInformationComponent implements OnInit {

  @Input() keyInCustomerAddressTemp: any;
  // @Input() titleNames: string[]; @Input() firstName: string[];
  // @Input() lastName: string[];
  @Input() customerAddress: CustomerAddress;
  // @Input() idCardNo: string[];
  // @Input() allZipCodes: string[];
  // @Input() provinces: string[];
  // @Input() amphurs: string[];
  // @Input() tumbols: string[];
  @Input() zipCodes: string[];
  @Input() titleNameSelected: EventEmitter<any> = new EventEmitter<any>();
  @Output() provinceSelected: EventEmitter<any> = new EventEmitter<any>();
  @Output() amphurSelected: EventEmitter<any> = new EventEmitter<any>();
  @Output() tumbolSelected: EventEmitter<any> = new EventEmitter<any>();
  @Output() zipCodeSelected: EventEmitter<any> = new EventEmitter<any>();
  @Output() completed: EventEmitter<any> = new EventEmitter<any>();
  @Output() error: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input()
  payment: any;

  @Input()
  paymentDetail: any;

  @Input()
  priceOption: any;

  customerAddressForm: FormGroup;
  idCardMaxLength: number = 13;
  debounceTimeInMS: number = 500;
  identityValue: string;
  disableIdCard: boolean;
  transaction: Transaction;
  receiptInfoForm: FormGroup;
  customerInfo: any;
  isShowInputForKeyIn: boolean;
  titleName: any;
  zipCode: any;
  nameText: string;
  billingAddressText: string;
  provinces: any;
  allZipCodes: any;
  amphurs: any;
  tumbols: any;
  billingAddressForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    private utils: Utils,
    private customerInformationService: CustomerInformationService,
    private localStorageService: LocalStorageService,
    private tokenService: TokenService,
    private createDeviceOrderService: CreateDeviceOrderService,
    private transactionService: TransactionService,
    private router: Router,
    private priceOptionService: PriceOptionService,
    private apiRequestService: ApiRequestService,
    private billingAddress: BillingAddressService,
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.createForm();
    console.log('เจ้าคืออะไร1', this.provinces);
  }

  OnChanges(changes: SimpleChanges): void {
    if (changes.zipCodes
      && changes.zipCodes.currentValue
      && changes.zipCodes.currentValue.length === 1) {
      this.customerAddressForm.patchValue({
        zipCode: changes.zipCodes.currentValue[0]
      });
    }
  }

  createForm(): void {
    const customerProfile = JSON.parse(localStorage.getItem('CustomerProfile'));
    // console.log('data >>>> :', customerProfile.province);
    // this.provinces = customerProfile.province;
    this.customerAddressForm = this.fb.group({
      idCardNo: [customerProfile.idCardNo, [Validators.required, Validators.pattern(/^[1-8]\d{12}$/), this.validateIdCard.bind(this)]],
      titleName: [customerProfile.titleName, [Validators.required]],
      firstName: [customerProfile.firstName, [Validators.required, this.validateCharacter()]],
      lastName: [customerProfile.lastName, [Validators.required, this.validateCharacter()]],
      homeNo: [customerProfile.homeNo, [Validators.required, Validators.pattern(/^[0-9^/]*$/)]],
      moo: [customerProfile.moo, [Validators.required]],
      mooBan: [customerProfile.mooBan, [Validators.required]],
      room: [customerProfile.room, [Validators.required]],
      floor: [customerProfile.floor, [Validators.required]],
      buildingName: [customerProfile.buildingName, [Validators.required]],
      soi: [customerProfile.soi, [Validators.required]],
      street: [customerProfile.street, [Validators.required]],
      province: [customerProfile.province, [Validators.required]],
      amphur: [customerProfile.amphur, [Validators.required]],
      tumbol: [customerProfile.tumbol, [Validators.required]],
      zipCode: [customerProfile.zipCode, [Validators.required, Validators.maxLength(5), this.validateZipCode.bind(this)]],
      // telNo: [customerProfile.selectedMobile, [Validators.required]]
    });
    console.log('LOGGGGGGGG', this.customerAddressForm.value.province);

    this.disabledForm();
    this.disableFormAmphurAndTumbol();
    this.customerAddressForm.patchValue(this.customerAddress || {});
    this.provinceFormControl();
    // this.titleFormControl();
    this.amphurFormControl();
    this.tumbolFormControl();
    this.zipCodeFormControl();
    if (this.keyInCustomerAddressTemp) {
      for (const item in this.keyInCustomerAddressTemp) {
        if (this.keyInCustomerAddressTemp.hasOwnProperty(item) && this.customerAddressForm.value.hasOwnProperty(item)) {
          this.customerAddressForm.controls[item].setValue(this.keyInCustomerAddressTemp[item]);
        }
      }
    }
    this.customerAddressForm.valueChanges.pipe(debounceTime(750)).subscribe((value: any) => {
      this.error.emit(this.customerAddressForm.valid);
      if (this.customerAddressForm.valid && this.customerAddressForm.value.idCardNo) {
        this.completed.emit(value);
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

  // private titleFormControl(): void {
  //   this.titleNameForm().value.Changes.subscribe((titleName: any) => {
  //     if (titleName) {
  //       this.titleNameSelected.emit({
  //         titleName: titleName
  //       });
  //     }
  //   });
  // }

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

  private findProvinceByName(provinceName: string): any {
    return (this.provinces || []).find((prov: any) => prov.name === provinceName) || {};
  }

  private findProvinceByProvinceID(provinceId: string): any {
    return this.provinces.find((prov: any) => prov.id === provinceId);
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
  private responseAmphur(): (value: any) => any {
    return (resp: string[] ) => this.amphurs = resp;
  }

  private responseTumbols(): (value: any) => any {
    return (resp: string[]) => this.tumbols = resp;
  }

  private responseZipCode(): (value: any) => any {
    return (resp: any) => this.zipCode = resp;
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

  private assignProvinceAndZipCode(province: any, zipCode: string): void {
    this.customerAddress = Object.assign(Object.assign({}, this.customerAddress), {
      province: province.name,
      zipCode: zipCode
    });
  }

  onZipCodeSelected(zipCode: string): void {
    this.billingAddress.getProvinceIdByZipCode(zipCode).then(provinceId => {
      const province = this.findProvinceByProvinceID(provinceId);
      if (!province) { return; }
      this.assignProvinceAndZipCode(province, zipCode);
    });
  }

  private disabledForm(): void {
    this.customerAddressForm.controls['idCardNo'].disable();
    this.customerAddressForm.controls['titleName'].disable();
    this.customerAddressForm.controls['firstName'].disable();
    this.customerAddressForm.controls['lastName'].disable();
    // this.customerAddressForm.controls['telNo'].disable();
  }
  onNext(): void {
    this.getCustomerProfile();
    this.saveTransaction();
    this.router.navigate([DEPOSIT_PAYMENT_SUMMARY_PAGE]);
  }

  private getCustomerProfile(): void {
    const customerProfile = JSON.parse(localStorage.getItem('CustomerProfile'));
    customerProfile.homeNo = this.customerAddressForm.controls['homeNo'].value;
    customerProfile.buildingName = this.customerAddressForm.controls['buildingName'].value;
    customerProfile.floor = this.customerAddressForm.controls['floor'].value;
    customerProfile.room = this.customerAddressForm.controls['room'].value;
    customerProfile.moo = this.customerAddressForm.controls['moo'].value;
    customerProfile.mooban = this.customerAddressForm.controls['mooBan'].value;
    customerProfile.street = this.customerAddressForm.controls['street'].value;
    customerProfile.soi = this.customerAddressForm.controls['soi'].value;
    customerProfile.tumbol = this.customerAddressForm.controls['tumbol'].value;
    customerProfile.amphur = this.customerAddressForm.controls['amphur'].value;
    customerProfile.province = this.customerAddressForm.controls['province'].value;
    customerProfile.zipCode = this.customerAddressForm.controls['zipCode'].value;
    customerProfile.country = 'Thailand';

    localStorage.setItem('CustomerProfile', JSON.stringify(customerProfile));
  }

  private saveTransaction(): void {

    this.transaction = {
      transactionId: this.apiRequestService.getCurrentRequestId(),
      data: {
        transactionType: TransactionType.RESERVE_WITH_DEPOSIT,
        customer: this.localStorageService.load('CustomerProfile').value,
        action: TransactionAction.KEY_IN
      }
    };

    this.transaction.data.payment = {
      paymentMethod: this.payment,
      selectPaymentDetail: this.paymentDetail
    };

    this.transaction.data.customer.shipaddress = {
      shipCusAddr: this.getFullAddress(this.transaction.data.customer),
      shipCusName: this.transaction.data.customer.titleName + ' ' + this.transaction.data.customer.firstName +
        ' ' + this.transaction.data.customer.lastName
    };
    console.log('transaction', this.transaction);
    this.transactionService.save(this.transaction);
    this.priceOptionService.save(this.priceOption);
  }

  getFullAddress(customer: any): string {
    if (!customer) {
      return '-';
    }
    const fullAddress =
      (customer.homeNo ? customer.homeNo + ' ' : '') +
      (customer.moo ? 'หมู่ที่ ' + customer.moo + ' ' : '') +
      (customer.mooBan ? 'หมู่บ้าน ' + customer.mooBan + ' ' : '') +
      (customer.room ? 'ห้อง ' + customer.room + ' ' : '') +
      (customer.floor ? 'ชั้น ' + customer.floor + ' ' : '') +
      (customer.buildingName ? 'อาคาร ' + customer.buildingName + ' ' : '') +
      (customer.soi ? 'ซอย ' + customer.soi + ' ' : '') +
      (customer.street ? 'ถนน ' + customer.street + ' ' : '') +
      (customer.tumbol ? 'ตำบล/แขวง ' + customer.tumbol + ' ' : '') +
      (customer.amphur ? 'อำเภอ/เขต ' + customer.amphur + ' ' : '') +
      (customer.province ? 'จังหวัด ' + customer.province + ' ' : '') +
      (customer.zipCode || '');
    return fullAddress || '-';
  }

  onBack(): void {
    // const url = '/sales-portal/reserve-stock/reserve-deposit-non-ais';
    this.router.navigate([DEPOSIT_PAYMENT_DETAIL_RECEIPT]);
    //  this.removeItem(url);
  }

}

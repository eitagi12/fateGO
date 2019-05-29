import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Utils, CustomerAddress, TokenService, ApiRequestService, AlertService } from 'mychannel-shared-libs';
import { LocalStorageService } from 'ngx-store';
import { CreateDeviceOrderService } from '../../services/create-device-order.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction, TransactionType, TransactionAction } from 'src/app/shared/models/transaction.model';
import { DEPOSIT_PAYMENT_DETAIL_RECEIPT } from '../../constants/route-path.constant';
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
  selector: 'app-billing-address',
  templateUrl: './billing-address.component.html',
  styleUrls: ['./billing-address.component.scss']
})
export class BillingAddressComponent implements OnInit {

  @Input() keyInCustomerAddressTemp: any;
  @Input() titleNames: string[];
  @Input() firstName: string[];
  @Input() lastName: string[];
  @Input() customerAddress: CustomerAddress;
  @Input() idCardNo: string[];
  @Input() allZipCodes: string[];
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
  customerReceiptAddress: string;
  isSummit: boolean = false;
  activateButton: boolean;
  customerProfile: string;
  provinces: any;
  amphurs: any;
  tumbols: any;
  zipCodeNo: any = '';

  constructor(
    public fb: FormBuilder,
    private utils: Utils,
    private localStorageService: LocalStorageService,
    private tokenService: TokenService,
    private createDeviceOrderService: CreateDeviceOrderService,
    private transactionService: TransactionService,
    private router: Router,
    private alertService: AlertService,
    private priceOptionService: PriceOptionService,
    private apiRequestService: ApiRequestService,
    private billingAddress: BillingAddressService
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.activateButton = false;
    this.createForm();
    this.billingAddress.getProvinces().then((res: any) => {
      this.provinces = res;
      // tslint:disable-next-line: no-unused-expression
      this.provinces.sort((a: { name: number; }, b: { name: number; }) =>
        (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0) || [];
      this.setBackValue();
    });
  }

  createForm(): void {
    const customerProfile = JSON.parse(localStorage.getItem('CustomerProfile'));

    this.customerAddressForm = this.fb.group({
      idCardNo: [customerProfile.idCardNo, [Validators.required, Validators.pattern(/^[1-8]\d{12}$/), this.validateIdCard.bind(this)]],
      titleName: [customerProfile.titleName, [Validators.required]],
      firstName: [customerProfile.firstName, [Validators.required, this.validateCharacter()]],
      lastName: [customerProfile.lastName, [Validators.required, this.validateCharacter()]],
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
      zipCode: ['', [Validators.required]],
      telNo: [customerProfile.selectedMobile]
    });
    this.customerAddressForm.valueChanges.pipe(debounceTime(750)).subscribe(event => {
      this.error.emit(this.customerAddressForm.valid);

      if (this.customerAddressForm.value.homeNo !== '' && this.customerAddressForm.valid) {
        this.activateButton = true;
      } else {
        this.activateButton = false;
      }
    });
    this.disabledForm();
    this.disableFormAmphurAndTumbol();
    this.customerAddressForm.patchValue(this.customerAddress || {});
    this.provinceFormControl();
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
        this.onProvinceSelected(provinceName, null);
        this.customerAddressForm.controls['zipCode'].setValue('');
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
        const provinceName = this.customerAddressForm.value.province || '';
        this.onAmphurSelected(provinceName, amphurName, null);
        this.customerAddressForm.controls['zipCode'].setValue('');
      }
    });
  }

  private tumbolFormControl(): void {
    this.tumbolForm().valueChanges.subscribe((tumbolName: any) => {
      if (tumbolName) {
        const provinceName: string = this.customerAddressForm.value.province;
        const amphurName: string = this.customerAddressForm.value.amphur;
        this.onTumbolSelected(provinceName, amphurName, tumbolName);
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
        if (this.customerAddressForm.value.zipCode !== '') {
          this.activateButton = true;
        } else {
          this.activateButton = false;
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

  private disabledForm(): void {
    this.customerAddressForm.controls['idCardNo'].disable();
    this.customerAddressForm.controls['titleName'].disable();
    this.customerAddressForm.controls['firstName'].disable();
    this.customerAddressForm.controls['lastName'].disable();
    this.customerAddressForm.controls['telNo'].disable();
  }
  onNext(): void {
    this.onSummitKeyin();
    this.getCustomerProfile();
    this.saveTransaction();
    localStorage.setItem('backKeyInPage', JSON.stringify(''));
    localStorage.setItem('backSummaryPage', JSON.stringify(''));
    this.router.navigate([DEPOSIT_PAYMENT_DETAIL_RECEIPT]);
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
    this.transactionService.save(this.transaction);
    this.priceOptionService.save(this.priceOption);
  }

  getFullAddress(customer: any): string {
    const fullAddress =
      (this.customerAddressForm.value.homeNo.length > 0 ? this.customerAddressForm.value.homeNo + ' ' : '') +
      (this.customerAddressForm.value.moo.length > 0 ? 'หมู่ที่ ' + this.customerAddressForm.value.moo + ' ' : '') +
      (this.customerAddressForm.value.mooBan.length > 0 ? 'หมู่บ้าน ' + this.customerAddressForm.value.mooBan + ' ' : '') +
      (this.customerAddressForm.value.room.length > 0 ? 'ห้อง ' + this.customerAddressForm.value.room + ' ' : '') +
      (this.customerAddressForm.value.floor.length > 0 ? 'ชั้น ' + this.customerAddressForm.value.floor + ' ' : '') +
      (this.customerAddressForm.value.buildingName.length > 0 ? 'อาคาร ' + this.customerAddressForm.value.buildingName + ' ' : '') +
      (this.customerAddressForm.value.soi.length > 0 ? 'ซอย ' + this.customerAddressForm.value.soi + ' ' : '') +
      (this.customerAddressForm.value.street.length > 0 ? 'ถนน ' + this.customerAddressForm.value.street + ' ' : '') +
      (this.customerAddressForm.value.tumbol.length > 0 ? 'ตำบล/แขวง ' + this.customerAddressForm.value.tumbol + ' ' : '') +
      (this.customerAddressForm.value.amphur.length > 0 ? 'อำเภอ/เขต ' + this.customerAddressForm.value.amphur + ' ' : '') +
      (this.customerAddressForm.value.province.length > 0 ? 'จังหวัด ' + this.customerAddressForm.value.province + ' ' : '') +
      (this.customerAddressForm.value.zipCode.length > 0 ? 'รหัสไปรษณีย์ ' + this.customerAddressForm.value.zipCode + ' ' : '');
    return fullAddress || '-';
  }

  onHome(): void {
    const url = '/';
    this.alertRemoveAddCart(url);
  }

  onBack(): void {
    const url = '/sales-portal/reserve-stock/reserve-deposit-non-ais';
    this.alertRemoveAddCart(url);
  }

  alertRemoveAddCart(url: string): void {
    this.alertService.notify({
      type: 'question',
      showConfirmButton: true,
      confirmButtonText: 'CONFIRM',
      cancelButtonText: 'CANCEL',
      showCancelButton: true,
      reverseButtons: true,
      allowEscapeKey: false,
      html: 'ต้องการยกเลิกรายการจองหรือไม่ <br> การยกเลิก ระบบจะคืนสินค้าเข้าสต๊อคทันที'
    }).then((data) => {
      if (data.value) {
        const userId = this.tokenService.getUser().username;
        const soId = this.localStorageService.load('reserveSoId').value;
        this.createDeviceOrderService.removeAddCart(soId, userId).then((res) => {
          window.location.href = url;
        });
      }
    });
  }

  onSummitKeyin(): void {
    if (this.customerAddressForm.valid) {
      this.isSummit = false;

    } else {
      this.isSummit = true;
    }
  }

  onProvinceSelected(provinceName: string, zipcode: any): void {
    const province = this.findProvinceByName(provinceName);
    const req = {
      provinceId: province.id,
      zipcode: zipcode
    };
    if (!zipcode) {
      delete req.zipcode;
    }
    this.billingAddress.getAmphurs(req).then(this.responseAmphur());
  }

  private findProvinceByName(provinceName: string): any {
    return (this.provinces || []).find((prov: any) => prov.name === provinceName) || {};
  }

  private responseAmphur(): (value: any) => any {
    return (resp: string[]) => this.amphurs = resp;
  }

  onAmphurSelected(provinceName: string, aumphur: string, zipcode: any): void {
    const province = this.findProvinceByName(provinceName);
    const req = {
      provinceId: province.id,
      amphurName: aumphur,
      zipcode: zipcode
    };
    if (!zipcode) {
      delete req.zipcode;
    }
    this.billingAddress.getTumbols(req).then(this.responseTumbols());
  }

  private responseTumbols(): (value: any) => any {
    return (resp: string[]) => this.tumbols = resp;
  }

  onTumbolSelected(provinceName: string, amphurName: string, tumbolName: string): void {
    const province = this.findProvinceByName(provinceName);
    const req = {
      provinceId: province.id,
      amphurName: amphurName,
      tumbolName: tumbolName
    };

    this.billingAddress.queryZipCode(req).then(this.responseZipCode());
  }

  private autoSelectedZipcode(resp: any): void {
    if (resp.length === 1) {
      this.zipCodeForm().setValue(resp[0]);
    }
  }

  private responseZipCode(): (value: any) => any {
    return (resp: any) => {
      this.autoSelectedZipcode(resp);
      this.zipCodes = resp;
    };
  }

  private setBackValue(): void {
    const backKeyInPage = JSON.parse(localStorage.getItem('backKeyInPage'));

    if (backKeyInPage === 'true') {
      const customerProfile = JSON.parse(localStorage.getItem('CustomerProfile'));
      this.customerAddressForm.controls['homeNo'].setValue(customerProfile.homeNo);
      this.customerAddressForm.controls['buildingName'].setValue(customerProfile.buildingName);
      this.customerAddressForm.controls['floor'].setValue(customerProfile.floor);
      this.customerAddressForm.controls['room'].setValue(customerProfile.room);
      this.customerAddressForm.controls['moo'].setValue(customerProfile.moo);
      this.customerAddressForm.controls['mooBan'].setValue(customerProfile.mooban);
      this.customerAddressForm.controls['street'].setValue(customerProfile.street);
      this.customerAddressForm.controls['soi'].setValue(customerProfile.soi);
      this.customerAddressForm.controls['province'].setValue(customerProfile.province);
      this.customerAddressForm.controls['amphur'].setValue(customerProfile.amphur);
      this.customerAddressForm.controls['tumbol'].setValue(customerProfile.tumbol);
      this.customerAddressForm.controls['zipCode'].setValue(customerProfile.zipCode);
    }
  }
}

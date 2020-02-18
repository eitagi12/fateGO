import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { Params, Router, ActivatedRoute } from '@angular/router';
import { HomeService, CustomerService, AlertService, Utils, ValidateCustomerKeyIn } from 'mychannel-shared-libs';
import { ROUTE_OMNI_NEW_REGISTER_ID_CARD_CAPTURE_PAGE, ROUTE_OMNI_NEW_REGISTER_VALIDATE_CUSTOMER_KEY_IN_PAGE, ROUTE_OMNI_NEW_REGISTER_CUSTOMER_INFO_PAGE, ROUTE_OMNI_NEW_REGISTER_FACE_CAPTURE_PAGE } from 'src/app/omni/omni-new-register/constants/route-path.constant';
import { TranslateService } from '@ngx-translate/core';
import { TransactionService } from 'src/app/omni/omni-shared/services/transaction.service';
import { Transaction, TransactionAction } from 'src/app/omni/omni-shared/models/transaction.model';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ValidateCustomerService } from 'src/app/shared/services/validate-customer.service';
import * as moment from 'moment';
const Moment = moment;
@Component({
  selector: 'app-omni-new-register-validate-customer-key-in-page',
  templateUrl: './omni-new-register-validate-customer-key-in-page.component.html',
  styleUrls: ['./omni-new-register-validate-customer-key-in-page.component.scss']
})
export class OmniNewRegisterValidateCustomerKeyInPageComponent implements OnInit, OnDestroy {
  params: Params;
  transaction: Transaction;
  prefixes: string[] = [];
  cardTypes: string[] = [];
  keyInValid: boolean;
  identity: string;
  customerKeyinInfo: any;
  imageReadSmartCard: any;
  idCardNo: string;

  days: string[] = [];
  months: string[] = [];
  expireYears: number[] = [];
  birthYears: number[] = [];

  expireDateValid: boolean;
  birthDateValid: boolean;
  idCardNoValid: boolean;
  gender: string;

  validateCustomerKeyInForm: FormGroup;

  completed: EventEmitter<ValidateCustomerKeyIn> = new EventEmitter<ValidateCustomerKeyIn>();

  error: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private customerService: CustomerService,
    private alertService: AlertService,
    private utils: Utils,
    public fb: FormBuilder,
    private validateCustomerService: ValidateCustomerService,
    private translation: TranslateService
  ) {
    this.transaction = this.transactionService.load();
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.params = params;
      this.idCardNo = this.params.idCardNo;
      this.cardTypes = this.params.cardType;
    });
  }

  ngOnInit(): void {
    this.callService();
    const customer = this.transaction.data.customer;
    this.createForm(customer);
    if (this.transaction.data.customer.caNumber && this.transaction.data.customer.caNumber !== '') { // Old CA
      this.router.navigate([ROUTE_OMNI_NEW_REGISTER_CUSTOMER_INFO_PAGE]);
    } else if (this.transaction.data.customer.caNumber === '' && this.transaction.data.action === TransactionAction.READ_CARD) {
      this.router.navigate([ROUTE_OMNI_NEW_REGISTER_FACE_CAPTURE_PAGE]);
    }
  }

  onError(valid: boolean): void {
    this.keyInValid = valid;
  }

  onCompleted(value: any): void {
    this.customerKeyinInfo = value;
    this.mapCustomerInfo(value);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onBack(): any {
    window.location.href = `/sales-portal/reserve-stock/verify-omni-new-register`;
  }

  onNext(): void {
    if (this.checkBusinessLogic()) {
      if (this.transaction.data.action === TransactionAction.KEY_IN) {
        this.router.navigate([ROUTE_OMNI_NEW_REGISTER_ID_CARD_CAPTURE_PAGE]);
      } else {
        this.router.navigate([ROUTE_OMNI_NEW_REGISTER_FACE_CAPTURE_PAGE]);
      }
    }
  }

  callService(): void {
    this.customerService.queryCardType().then((resp: any) => {
      this.cardTypes = (resp.data.cardTypes || []).map((cardType: any) => cardType.name);
    });

    this.customerService.queryTitleName().then((resp: any) => {
      this.prefixes = (resp.data.titleNames || []).map((prefix: any) => prefix);
    });
  }

  createForm(customer: any): void {
    this.expireDateValid = true;
    this.birthDateValid = true;
    this.idCardNoValid = true;

    this.validateCustomerKeyInForm = this.fb.group({
      idCardType: ['บัตรประชาชน', [Validators.required]],
      idCardNo: ['', [Validators.required]],
      expireDay: ['', [Validators.required]],
      expireMonth: ['', [Validators.required]],
      expireYear: ['', [Validators.required]],
      prefix: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      birthDay: ['', [Validators.required]],
      birthMonth: ['', [Validators.required]],
      birthYear: ['', [Validators.required]],
      gender: ['M', [Validators.required]]
    });

    this.validateCustomerKeyInForm.valueChanges.subscribe((value: any) => {
      const isFormValid: boolean = this.isIDCardValid() && this.isDateValid() && this.validateCustomerKeyInForm.valid;
      this.onError(isFormValid);
      if (isFormValid) {
        this.onCompleted(this.validateCustomerKeyInForm.value);
      }
    });
    this.setFormDefaultData(customer);
  }

  setFormDefaultData(customer: any): void {
    this.validateCustomerKeyInForm.patchValue({
      idCardNo: customer.idCardNo || '',
      idCardType: 'บัตรประชาชน',
      prefix: customer.titleName || '',
      firstName: customer.firstName || '',
      lastName: customer.lastName || '',
      gender: customer.gender || 'M',
      birthDay: customer.birthdate.substring(0, 2) || '',
      birthMonth: customer.birthdate.substring(3, 5) || '',
      birthYear: customer.birthdate.substring(6, 10) || '',
      expireDay: customer.expireDate.substring(0, 2) || '',
      expireMonth: customer.expireDate.substring(3, 5) || '',
      expireYear: customer.expireDate.substring(6, 10) || '',
    });

    const today: Date = new Date();
    const todatFormatted: Date = this.dateBuddhistEraFormat(today);
    const days: number = 31;
    const months: number = 12;
    const expYears: number = -1;
    const birthYears: number = -101;
    const ten: number = 10;
    for (let i: number = 1; i <= days; i++) {
      this.days.push(i < ten ? '0' + i : '' + i);
    }
    for (let i: number = 1; i <= months; i++) {
      this.months.push(i < ten ? '0' + i : '' + i);
    }
    for (let i: number = 10; i > expYears; i--) {
      this.expireYears.push(todatFormatted.getFullYear() + i);
    }
    for (let i: number = -5; i > birthYears; i--) {
      this.birthYears.push(todatFormatted.getFullYear() + i);
    }
  }

  dateBuddhistEraFormat(date: Date): Date {
    const diffValue: number = 543;
    date.setFullYear(date.getFullYear() + diffValue);
    return date;
  }
  private mapDateHHMMYYYY(): any {
    // tslint:disable-next-line: max-line-length
    const birthDayCustomer: string = this.validateCustomerKeyInForm.controls.birthDay.value + '/' + this.validateCustomerKeyInForm.controls.birthMonth.value + '/' + this.validateCustomerKeyInForm.controls.birthYear.value;
    // tslint:disable-next-line: max-line-length
    const expireDate: string = this.validateCustomerKeyInForm.controls.expireDay.value + '/' + this.validateCustomerKeyInForm.controls.expireMonth.value + '/' + this.validateCustomerKeyInForm.controls.expireYear.value;
    return { birthDayCustomer, expireDate };
  }

  isDateValid(): boolean {
    const formValue = this.validateCustomerKeyInForm.value;
    const radix: number = 10;
    const buddhistEra: number = 543;
    const expireDate: string = (parseInt(formValue.expireYear, radix) - buddhistEra) + ' ' +
      formValue.expireMonth + ' ' + formValue.expireDay;
    if (formValue.expireYear && formValue.expireMonth && formValue.expireDay) {
      this.expireDateValid = Moment(expireDate, 'YYYY MM DD').isValid();
    }
    const birthDate: string = (parseInt(formValue.birthYear, radix) - buddhistEra) + ' ' +
      formValue.birthMonth + ' ' + formValue.birthDay;
    if (formValue.birthYear && formValue.birthMonth && formValue.birthDay) {
      this.birthDateValid = Moment(birthDate, 'YYYY MM DD').isValid();
    }
    return this.expireDateValid && this.birthDateValid;
  }

  isIDCardValid(): any {
    const formValue = this.validateCustomerKeyInForm.value;

    if (formValue.idCardType === 'บัตรประชาชน' && formValue.idCardNo) {
      this.idCardNoValid = this.utils.isThaiIdCard(formValue.idCardNo);
    } else if (formValue.idCardType === 'หนังสือเดินทาง' && formValue.idCardNo) {
      this.idCardNoValid = this.utils.isPassportIdCard(formValue.idCardNo);
    } else if (formValue.idCardType === 'บัตรประจำตัวคนต่างด้าว' && formValue.idCardNo) {
      this.idCardNoValid = this.utils.isImmIdCard(formValue.idCardNo);
    } else {
      this.idCardNoValid = true;
    }
    return this.idCardNoValid;
  }

  mapCustomerInfo(customer: any): void {
    const { birthDayCustomer, expireDate }: { birthDayCustomer: string; expireDate: string; } = this.mapDateHHMMYYYY();
    const profile: any = {
      idCardNo: customer.idCardNo,
      idCardType: this.validateCustomerKeyInForm.controls.idCardType.value,
      titleName: this.validateCustomerKeyInForm.controls.titleName.value,
      firstName: this.validateCustomerKeyInForm.controls.firstName.value,
      lastName: this.validateCustomerKeyInForm.controls.lastName.value,
      birthdate: birthDayCustomer,
      expireDate: expireDate,
      gender: this.validateCustomerKeyInForm.controls.gender.value
    };
    this.transaction.data.customer = profile;
  }

  checkBusinessLogic(): boolean {

    const birthdate = this.transaction.data.customer.birthdate;
    const expireDate = this.transaction.data.customer.expireDate;
    const idCardType = this.transaction.data.customer.idCardType;

    if (this.utils.isLowerAge17Year(birthdate)) {
      this.alertService.error(this.translation.instant('ไม่สามารถทำรายการได้ เนื่องจากอายุของผู้ใช้บริการต่ำกว่า 17 ปี'));
      return false;
    }
    if (this.utils.isIdCardExpiredDate(expireDate)) {
      this.alertService.error(this.translation.instant('ไม่สามารถทำรายการได้ เนื่องจาก' + idCardType + 'หมดอายุ')).then(() => {
        this.onBack();
      });
      return false;
    }
    return true;
  }

  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
  }
}

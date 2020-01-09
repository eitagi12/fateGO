import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { ROUTE_NEW_SHARE_PLAN_MNP_CUSTOMER_INFO_PAGE, ROUTE_NEW_SHARE_PLAN_MNP_ID_CARD_CAPTURE_PAGE, ROUTE_NEW_SHARE_PLAN_MNP_VALIDATE_CUSTOMER_PAGE } from '../../constants/route-path.constant';
import { Transaction, Order } from 'src/app/shared/models/transaction.model';
import { CustomerService, AlertService, Utils, PageLoadingService, ValidateCustomerKeyIn, User } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ValidateCustomerService } from 'src/app/shared/services/validate-customer.service';
const Moment = moment;
@Component({
  selector: 'app-new-share-plan-mnp-validate-customer-key-in-page',
  templateUrl: './new-share-plan-mnp-validate-customer-key-in-page.component.html',
  styleUrls: ['./new-share-plan-mnp-validate-customer-key-in-page.component.scss']
})
export class NewSharePlanMnpValidateCustomerKeyInPageComponent implements OnInit, OnDestroy {
  params: Params;
  transaction: Transaction;
  prefixes: string[] = [];
  cardTypes: string[] = [];
  keyInValid: boolean;
  identity: string;
  customerKeyinInfo: any;
  user: User;
  order: Order;
  imageReadSmartCard: any;
  idCardNo: string;

  days: string[] = [];
  months: string[] = [];
  expireYears: number[] = [];
  birthYears: number[] = [];

  expireDateValid: boolean;
  birthDateValid: boolean;
  idCardNoValid: boolean;

  validateCustomerKeyInForm: FormGroup;

  completed: EventEmitter<ValidateCustomerKeyIn> = new EventEmitter<ValidateCustomerKeyIn>();

  error: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private transactionService: TransactionService,
    private customerService: CustomerService,
    private alertService: AlertService,
    private utils: Utils,
    private translation: TranslateService,
    public fb: FormBuilder,
    private pageLoadingService: PageLoadingService,
    private validateCustomerService: ValidateCustomerService

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
    this.createForm();

  }

  callService(): void {
    if (this.transaction.data && this.transaction.data.order && this.transaction.data.order.soId) {
      this.order = this.transaction.data.order;
    }
    this.customerService.queryCardType().then((resp: any) => {
      this.cardTypes = (resp.data.cardTypes || []).map((cardType: any) => cardType.name);
    });

    this.customerService.queryTitleName().then((resp: any) => {
      this.prefixes = (resp.data.titleNames || []).map((prefix: any) => prefix);
    });
  }

  createForm(): void {
    this.expireDateValid = true;
    this.birthDateValid = true;
    this.idCardNoValid = true;

    this.validateCustomerKeyInForm = this.fb.group({
      idCardType: ['', [Validators.required]],
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
    this.setFormDefaultData();
  }
  setFormDefaultData(): void {
    this.validateCustomerKeyInForm.patchValue({ idCardNo: this.idCardNo });
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

  onError(valid: boolean): void {
    this.keyInValid = valid;
  }

  onCompleted(value: any): void {
    this.customerKeyinInfo = value;
    this.transaction.data.customer = this.validateCustomerService.mapCustomer(this.customerKeyinInfo, this.imageReadSmartCard);
  }

  onBack(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_VALIDATE_CUSTOMER_PAGE]);
  }

  onNext(): void {
    this.validateCustomerKeyin();
  }

  validateCustomerKeyin(): void {
    this.pageLoadingService.openLoading();
    const checkAgeAndExpire = this.validateCustomerService.checkAgeAndExpireCard(this.transaction);
    if (checkAgeAndExpire.true) {
      const cardType = this.transaction.data.customer.idCardType;
      const transactionType = 'New-Share-Plan-MNP';
      this.validateCustomerService.checkValidateCustomer(this.identity, cardType, transactionType)
        .then(() => {
                this.setTransaction();
                this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_CUSTOMER_INFO_PAGE]);
        }).catch((err: any) => {
          this.pageLoadingService.closeLoading();
            if (err.error.resultCode === 'MYCHN00150006') {
              if (err.error.errors.length === 2) {
                this.alertService.error('ขออภัย ท่านมียอดค้างชำระ รบกวนชำระยอดก่อนทำรายการ');
              } else {
                this.alertService.error('มีสัญญาใช้บริการในระบบ AIS ครบตามจำนวนที่กำหนดไว้');
              }
            } else {
              this.alertService.error(JSON.parse(JSON.stringify(err.error.errors[0])));
            }
        });
    } else {
      this.pageLoadingService.closeLoading();
      this.alertService.error(checkAgeAndExpire.false);
    }
  }

  setTransaction(): void {
      this.pageLoadingService.closeLoading();
      this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_CUSTOMER_INFO_PAGE]);
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

}

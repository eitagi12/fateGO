import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { Params, Router, ActivatedRoute } from '@angular/router';
import { CustomerService, AlertService, Utils, User, TokenService, PageLoadingService, ValidateCustomerKeyIn } from 'mychannel-shared-libs';
import {
  ROUTE_DEVICE_ORDER_ASP_SHARE_PLAN_NEW_REGISTER_MNP_VALIDATE_CUSTOMER_PAGE,
  ROUTE_DEVICE_ORDER_ASP_SHARE_PLAN_NEW_REGISTER_MNP_PAYMENT_DETAIL_PAGE
} from '../../constants/route-path.constant';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { ValidateCustomerService } from 'src/app/shared/services/validate-customer.service';
import { Transaction, Order, TransactionType } from 'src/app/shared/models/transaction.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { RemoveCartService } from '../../services/remove-cart.service';
const Moment = moment;
@Component({
  selector: 'app-new-register-mnp-validate-customer-key-in-page',
  templateUrl: './new-register-mnp-validate-customer-key-in-page.component.html',
  styleUrls: ['./new-register-mnp-validate-customer-key-in-page.component.scss']
})
export class NewRegisterMnpValidateCustomerKeyInPageComponent implements OnInit, OnDestroy {
  params: Params;
  transaction: Transaction;
  priceOption: PriceOption;
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
    private priceOptionService: PriceOptionService,
    private tokenService: TokenService,
    private pageLoadingService: PageLoadingService,
    private validateCustomerService: ValidateCustomerService,
    private utils: Utils,
    public fb: FormBuilder,
    private removeCartService: RemoveCartService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.user = this.tokenService.getUser();
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.params = params;
      this.idCardNo = this.params.idCardNo;
    });
  }

  ngOnInit(): void {
    this.callService();
    this.createForm();
    this.imageReadSmartCard = this.transaction.data.customer;
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

  onHome(): void {
    this.removeCartService.backToReturnStock('/', this.transaction);
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_ASP_SHARE_PLAN_NEW_REGISTER_MNP_VALIDATE_CUSTOMER_PAGE]);
  }

  onNext(): void {
    this.validateCustomerKeyin();
  }

  validateCustomerKeyin(): void {
    this.pageLoadingService.openLoading();
    const checkAgeAndExpire = this.validateCustomerService.checkAgeAndExpireCard(this.transaction);
    if (checkAgeAndExpire.true) {
      const cardType = this.transaction.data.customer.idCardType;
      const transactionType = TransactionType.DEVICE_ORDER_NEW_REGISTER_AIS; // New
      this.validateCustomerService.checkValidateCustomerHandleMessages(this.identity, cardType, transactionType)
        .then(() => {
          if (this.order) {
            this.setTransaction();
            this.router.navigate([ROUTE_DEVICE_ORDER_ASP_SHARE_PLAN_NEW_REGISTER_MNP_PAYMENT_DETAIL_PAGE]);
          } else {
            // tslint:disable-next-line: max-line-length
            const body: any = this.validateCustomerService.getRequestAddDeviceSellingCart(this.user, this.transaction, this.priceOption, { customer: this.transaction.data.customer });
            this.validateCustomerService.addDeviceSellingCartSharePlan(body).then((order: any) => {
              if (order.data && order.data.soId) {
                this.transaction.data = {
                  ...this.transaction.data,
                  order: { soId: order.data.soId },
                };
                this.setTransaction();
              } else {
                this.alertService.error('ระบบไม่สามารถแสดงข้อมูลได้ในขณะนี้');
              }
            }).catch((error: any) => {
              this.pageLoadingService.closeLoading();
              this.alertService.error(error);
            });
          }
        }).catch((err: any) => {
          this.pageLoadingService.closeLoading();
          const developerMessage = err.error.developerMessage;
          const messageError = err.error.errors;
          if (err.error.resultCode === 'MYCHN00150006') {
            this.alertService.error(developerMessage);
          } else {
            this.alertService.error(messageError[0]);
          }
        });
    } else {
      this.pageLoadingService.closeLoading();
      this.alertService.error(checkAgeAndExpire.false);
    }
  }

  setTransaction(): void {
    if (this.transaction.transactionId) {
      this.pageLoadingService.closeLoading();
      this.router.navigate([ROUTE_DEVICE_ORDER_ASP_SHARE_PLAN_NEW_REGISTER_MNP_PAYMENT_DETAIL_PAGE]);
    } else {
      const transactionObject: any = this.validateCustomerService.buildTransaction({
        transaction: this.transaction,
        transactionType: TransactionType.DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN
      });
      console.log('==>', transactionObject);
      this.validateCustomerService.createTransaction(transactionObject).then((resp: any) => {
        this.pageLoadingService.closeLoading();
        if (resp.data.isSuccess) {
          this.transaction = transactionObject;
          this.router.navigate([ROUTE_DEVICE_ORDER_ASP_SHARE_PLAN_NEW_REGISTER_MNP_PAYMENT_DETAIL_PAGE]);
        } else {
          this.alertService.error('ระบบไม่สามารถแสดงข้อมูลได้ในขณะนี้');
        }
      }).catch((error: any) => {
        this.pageLoadingService.closeLoading();
        this.alertService.error(error);
      });
    }
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}

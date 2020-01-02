import { Component, Input, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN_TELEWIZ } from 'src/app/device-order/constants/wizard.constant';
import { ValidateCustomerService } from 'src/app/shared/services/validate-customer.service';
import { PageLoadingService, AlertService, Utils, User, TokenService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_VALIDATE_CUSTOMER_KEY_IN_PAGE, ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_PAYMENT_DETAIL_PAGE } from '../../constants/route-path.constant';
import { Transaction, Order, TransactionType, TransactionAction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
// import { thaiIDValidator } from 'app/shared/custom-validator/thai-id.directive';
// import { ChannelType } from 'app/core/channel-type.constant';
// import { TokenService } from 'app/core/token.service';
// import { MessageValidateCustomer } from 'app/prepaid-hotdeal/constants/message-validate-customer.constant';
// import { ID_CARD, IMM_CARD, PASSPORT } from 'app/prepaid-hotdeal/constants/message.constant';
@Component({
  selector: 'app-new-register-mnp-validate-customer-page',
  templateUrl: './new-register-mnp-validate-customer-page.component.html',
  styleUrls: ['./new-register-mnp-validate-customer-page.component.scss']
})
export class NewRegisterMnpValidateCustomerPageComponent implements OnInit, OnDestroy {
  wizards: string[] = WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN_TELEWIZ;
  // @Input() onNextPress: Function;
  // @Input() onBackPress: Function;
  // @Input() onCardImgPress: Function;
  // @Input() placeholder: string;

  identityType: string;
  identityForm: FormGroup;
  activeNextBtn: boolean = false;
  identityValue: string;
  identity: string;
  placeholder: string;
  transaction: Transaction;
  order: Order;
  user: User;
  priceOption: any;
  transactionId: string;

  private formErrors: any = {
    identity: ''
  };

  idCardValidationMessages: any = {
    identity: {
      required: 'กรุณากรอกหมายเลขบัตรเพื่อยืนยันตัวตน',
      thaiIdDigit: 'กรุณากรอกหมายเลขบัตรประชาชนให้ถูกต้อง',
      minlength: 'กรุณากรอกหมายเลขบัตรประชาชนให้ครบทั้ง 13 หลัก',
      maxlength: 'กรุณากรอกหมายเลขบัตรประชาชนให้ครบทั้ง 13 หลัก',
      pattern: 'กรุณากรอกหมายเลขบัตรโดยไม่มีอักษระพิเศษ'
    }
  };

  idMMCardValidationMessages: any = {
    identity: {
      required: 'กรุณากรอกหมายเลขบัตรเพื่อยืนยันตัวตน',
      minlength: 'กรุณากรอกบัตรประจำตัวคนต่างด้าวให้ครบทั้ง 13 หลัก',
      maxlength: 'กรุณากรอกบัตรประจำตัวคนต่างด้าวให้ครบทั้ง 13 หลัก',
      pattern: 'กรุณากรอกหมายเลขบัตรโดยไม่มีอักษระพิเศษ'
    }
  };

  idPassportValidationMessages: any = {
    identity: {
      required: 'กรุณากรอกหมายเลขบัตรเพื่อยืนยันตัวตน',
      minlength: 'กรุณากรอกหนังสือเดินทางให้ครบทั้ง 9 หลัก',
      maxlength: 'กรุณากรอกหนังสือเดินทางให้ครบทั้ง 9 หลัก',
      pattern: 'กรุณากรอกหมายเลขบัตรโดยไม่มีอักษระพิเศษ'
    }
  };

  commonValidationMessages: any = {
    identity: {
      required: 'กรุณากรอกหมายเลขบัตรเพื่อยืนยันตัวตน',
      minlength: 'กรุณากรอก หมายเลขบัตรประชาชน',
      maxlength: 'กรุณากรอก หมายเลขบัตรประชาชน',
      pattern: 'กรุณากรอกหมายเลขบัตรโดยไม่มีอักษระพิเศษ'
    }
  };

  constructor(
    // private tokenService: TokenService,
    private formBuilder: FormBuilder,
    private validateCustomerService: ValidateCustomerService,
    private pageLoadingService: PageLoadingService,
    private router: Router,
    private alertService: AlertService,
    private transactionService: TransactionService,
    private utils: Utils,
    private priceOptionService: PriceOptionService,
    private tokenService: TokenService
  ) {
    // super();
    this.placeholder = this.placeholder || 'หมายเลขบัตรประชาชน';
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.user = this.tokenService.getUser();
  }

  ngOnInit(): void {
    if (this.identityType) {
      this.buildForm();
    } else {
      this.buildForm();
    }

    this.createTransaction();
  }

  buildForm(): void {
    this.identityForm = this.formBuilder.group({
      identity: ['', Validators.minLength(9)]
    });

    // this.identityForm.controls['identity'].valueChanges
    //   .debounceTime(500)
    //   .subscribe((identityValue: any) => {
    //     this.onValueChanged(identityValue);
    //   });
  }

  onValueChanged(data?: any): void {
    // let flow: boolean = JSON.parse(localStorage.getItem('flowLotus'));
    // if (data[0] === '0' && !(flow)) {
    //   this.identityType = IMM_CARD;
    //   this.identityForm.controls.identity.setValidators([
    //     Validators.required,
    //     Validators.maxLength(13),
    //     Validators.minLength(13),
    //     Validators.pattern('[0-9.]+')
    //   ]);
    // } else if (data.match(/^[a-z]/ig) && !(flow)) {
    //   this.identityType = PASSPORT;
    //   this.identityForm.controls.identity.setValidators([
    //     Validators.required,
    //     Validators.maxLength(9),
    //     Validators.minLength(9),
    //     Validators.pattern('^[A-Z]{2}[0-9]{7}')
    //   ]);
    //   this.identityForm.controls.identity.setValue(data.toUpperCase());
    // } else {
    //   this.identityType = ID_CARD;
    //   this.identityForm.controls.identity.setValidators([
    //     Validators.required,
    //     Validators.pattern('[0-9.]+'),
    //     Validators.maxLength(13),
    //     Validators.minLength(13),
    //     thaiIDValidator()
    //   ]);
    // }
    // if (!this.identityForm) { return; }
    // const form: any = this.identityForm;

    // // tslint:disable-next-line: forin
    // for (const field in this.formErrors) {
    //   this.formErrors[field] = '';
    //   const control = form.get(field);
    //   if (control && !control.valid) {
    //     this.activeNextBtn = false;
    //     const messages = this.getErrorMessages(this.identityType)[field];
    //     // tslint:disable-next-line: forin
    //     for (const key in control.errors) {
    //       this.formErrors[field] += messages[key] + ' ';
    //     }
    //   } else if (control && control.valid) {
    //     this.activeNextBtn = true;
    //   }
    // }
  }

  getErrorMessages(identityType: string): any {
    // switch (identityType) {
    //   case ID_CARD:
    //     return this.idCardValidationMessages;
    //   case IMM_CARD:
    //     return this.idMMCardValidationMessages;
    //   case PASSPORT:
    //     return this.idPassportValidationMessages;
    //   default:
    //     return this.commonValidationMessages;
    // }
  }

  onNextPressCaller(): void {
    // this.onNextPress($('#txtRegNumVerifyStartKeyInCard').val());
  }

  onBackPressCaller(): void {
    // this.onBackPress();
  }

  onCardImgPressCaller(): void {
    // this.onCardImgPress();
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    this.validateCustomer().catch((error: any) => {
      if (error.error.developerMessage === 'EB0001 : Data Not Found.') {
        this.pageLoadingService.closeLoading();
        this.router.navigate([ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_VALIDATE_CUSTOMER_KEY_IN_PAGE], {
          queryParams: {
            idCardNo: this.identity
          }
        });
      } else {
        this.pageLoadingService.closeLoading();
        this.alertService.error(error);
      }
    });
  }

  validateCustomer(): any {
    this.identity = this.identityForm.value.identity;
    return this.validateCustomerService.queryCustomerInfo(this.identity)
      .then((customerInfo: any) => {
        const transactionType = TransactionType.DEVICE_ORDER_NEW_REGISTER_AIS; // New
        const cardType = this.mapCardType(customerInfo.data.idCardType);
        return this.validateCustomerService.checkValidateCustomerHandleErrorMessages(this.identity, cardType, transactionType)
          .then((customer: any) => {
            return this.validateCustomerService.queryBillingAccount(this.identity)
              .then((resp: any) => {
                const data: any = resp.data || {};
                this.toBillingInformation(data).then((billingInfo: any) => {
                  this.transaction.data.billingInformation = billingInfo;
                });
                const birthdate = customer.data.birthdate;
                if (this.utils.isLowerAge17Year(birthdate)) {
                  this.pageLoadingService.closeLoading();
                  this.alertService.error('ไม่สามารถทำรายการได้ เนื่องจากอายุของผู้ใช้บริการต่ำกว่า 17 ปี');
                } else {
                  if (this.order) {
                    this.setTransaction(customer);
                  } else {
                    const body: any = this.validateCustomerService.getRequestAddDeviceSellingCart(
                      this.user,
                      this.transaction,
                      this.priceOption,
                      { customer: customer }
                    );
                    return this.validateCustomerService.addDeviceSellingCartSharePlan(body).then((order: any) => {
                      if (order.data && order.data.soId) {
                        this.transaction.data = {
                          ...this.transaction.data,
                          order: { soId: order.data.soId },
                        };
                        this.setTransaction(customer);
                      } else {
                        this.alertService.error('ระบบไม่สามารถแสดงข้อมูลได้ในขณะนี้');
                      }
                    });
                  }
                }
              });
          }).catch((err) => {
            this.pageLoadingService.closeLoading();
            const developerMessage = err.error.developerMessage;
            const messageError = err.error.errors;
            if (err.error.resultCode === 'MYCHN00150006') {
              this.alertService.error(developerMessage);
            } else {
              this.alertService.error(messageError[0]);
            }
          });
      });
  }

  mapCardType(idCardType: string): string {
    idCardType = idCardType ? idCardType : 'ID_CARD';
    const mapCardType: any = {
      CERT_FOUND: 'หนังสือจัดตั้งสมาคม / มูลนิธิ',
      EMB_LET: 'หนังสือออกจากสถานทูต',
      GOV_LET: 'หนังสือออกจากหน่วยราชการ',
      HILL_CARD: 'บัตรประจำตัวคนบนที่ราบสูง',
      ID_CARD: 'บัตรประชาชน',
      IMM_CARD: 'บัตรประจำตัวคนต่างด้าว',
      MONK_CERT: 'ใบสุทธิพระ',
      PASSPORT: 'หนังสือเดินทาง',
      ROY_LET: 'หนังสือออกจากสำนักพระราชวัง',
      STA_LET: 'หนังสือออกจากรัฐวิสาหกิจ',
      TAX_ID: 'เลขที่ประจำตัวผู้เสียภาษีอากร'
    };
    return mapCardType[idCardType];
  }

  toBillingInformation(data: any): any {
    return this.validateCustomerService.billingNetExtreme(data).then((respBillingNetExtreme: any) => {
      return {
        billCycles: data.billingAccountList,
        billCyclesNetExtreme: respBillingNetExtreme.data
      };
    }).catch(() => {
      return { billCycles: data.billingAccountList };
    });
  }

  setTransaction(customer: any): void {
    this.transaction.data.customer = this.mapCustomer(customer.data);
    if (this.transaction.transactionId) {
      this.pageLoadingService.closeLoading();
      this.router.navigate([ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_PAYMENT_DETAIL_PAGE]);
    } else {
      const transactionObject: any = this.validateCustomerService.buildTransaction({
        transaction: this.transaction,
        transactionType: TransactionType.DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN // Share
      });
      this.validateCustomerService.createTransaction(transactionObject).then((response: any) => {
        this.pageLoadingService.closeLoading();
        if (response.data.isSuccess) {
          this.transaction = transactionObject;
          this.router.navigate([ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_PAYMENT_DETAIL_PAGE]);
        } else {
          this.alertService.error('ระบบไม่สามารถแสดงข้อมูลได้ในขณะนี้');
        }
      }).catch((error: any) => {
        this.pageLoadingService.closeLoading();
        this.alertService.error(error);
      });
    }
  }

  mapCustomer(customer: any, transaction?: any): any {
    return {
      idCardNo: customer.idCardNo,
      idCardType: (customer.idCardType === 'บัตรประชาชน') ? 'บัตรประชาชน' : this.mapCardType(customer.idCardType) || '',
      titleName: customer.prefix || customer.titleName || '',
      firstName: customer.firstName || '',
      lastName: customer.lastName || '',
      birthdate: customer.birthdate || customer.birthDay + '/' + customer.birthMonth + '/' + customer.birthYear || '',
      gender: customer.gender || '',
      homeNo: customer.homeNo || '',
      moo: customer.moo || '',
      mooBan: customer.mooban || '',
      buildingName: customer.buildingName || '',
      floor: customer.floor || '',
      room: customer.room || '',
      street: customer.street || '',
      soi: customer.soi || '',
      tumbol: customer.tumbol || '',
      amphur: customer.amphur,
      province: customer.province || customer.provinceName || '',
      firstNameEn: '',
      lastNameEn: '',
      issueDate: customer.birthdate || customer.issueDate || '',
      expireDate:
        customer.expireDate || customer.expireDay ? customer.expireDay + '/' + customer.expireMonth + '/' + customer.expireYear : '',
      zipCode: customer.zipCode || '',
      mainMobile: customer.mainMobile || '',
      mainPhone: customer.mainPhone || '',
      billCycle: customer.billCycle || '',
      caNumber: customer.caNumber || '',
      mobileNo: '',
      imageSignature: '',
      imageSmartCard: '',
      imageReadSmartCard: customer.imageReadSmartCard ? customer.imageReadSmartCard : transaction ? transaction.imageReadSmartCard : '',
      imageSignatureWidthCard: ''
    };
  }

  createTransaction(): void {
    if (this.transaction.data && this.transaction.data.order && this.transaction.data.order.soId) {
      this.transactionId = this.transaction.transactionId;
      this.order = this.transaction.data.order;
      this.transaction.data.action = TransactionAction.KEY_IN;
    } else {
      this.transaction = {
        data: {
          transactionType: TransactionType.DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN, // Share
          action: TransactionAction.KEY_IN,
          order: this.order
        },
        transactionId: this.transaction.transactionId
      };
    }
    delete this.transaction.data.customer;
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}

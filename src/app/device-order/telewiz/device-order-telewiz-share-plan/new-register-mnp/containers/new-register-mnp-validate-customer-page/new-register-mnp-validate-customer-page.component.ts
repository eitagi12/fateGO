import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, ValidatorFn, AbstractControl, FormControl } from '@angular/forms';
import { WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN_TELEWIZ } from 'src/app/device-order/constants/wizard.constant';
import { ValidateCustomerService } from 'src/app/shared/services/validate-customer.service';
import { PageLoadingService, AlertService, Utils, User, TokenService } from 'mychannel-shared-libs';
import { Router, ActivatedRoute } from '@angular/router';
import { ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_VALIDATE_CUSTOMER_KEY_IN_PAGE, ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_PAYMENT_DETAIL_PAGE, ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_VALIDATE_CUSTOMER_ID_CARD_PAGE, ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_CUSTOMER_INFO_PAGE,  } from '../../constants/route-path.constant';
import { Transaction, Order, TransactionType, TransactionAction, SimCard } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { Subscription } from 'rxjs';
import { RemoveCartService } from '../../services/remove-cart.service';

@Component({
  selector: 'app-new-register-mnp-validate-customer-page',
  templateUrl: './new-register-mnp-validate-customer-page.component.html',
  styleUrls: ['./new-register-mnp-validate-customer-page.component.scss']
})
export class NewRegisterMnpValidateCustomerPageComponent implements OnInit, OnDestroy {
  wizards: string[] = WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN_TELEWIZ;
  // priceOptionMock: any = require('../new-register-mnp-validate-customer-page/priceOption-Mock.json');
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
  channelFlow: string;

  ID_CARD: string = 'ID_CARD';
  IMM_CARD: string = 'IMM_CARD';
  imei: string;
  simCard: SimCard;

  identityFormSubscripe: Subscription;

  public formErrors: any = {
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

  commonValidationMessages: any = {
    identity: {
      required: 'กรุณากรอกหมายเลขบัตรเพื่อยืนยันตัวตน',
      minlength: 'กรุณากรอก หมายเลขบัตรประชาชน',
      maxlength: 'กรุณากรอก หมายเลขบัตรประชาชน',
      pattern: 'กรุณากรอกหมายเลขบัตรโดยไม่มีอักษระพิเศษ'
    }
  };

  constructor(
    private validateCustomerService: ValidateCustomerService,
    private pageLoadingService: PageLoadingService,
    private router: Router,
    private alertService: AlertService,
    private transactionService: TransactionService,
    private utils: Utils,
    private priceOptionService: PriceOptionService,
    private tokenService: TokenService,
    private removeCartService: RemoveCartService,
    private route: ActivatedRoute
  ) {
    this.placeholder = this.placeholder || 'เลขบัตรประชาชน';
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.user = this.tokenService.getUser();
    this.createTransaction();
  }

  ngOnInit(): void {
    this.buildForm();
    // localStorage.setItem('priceOption', JSON.stringify(this.priceOptionMock));
    // this.route.paramMap.subscribe(params => {
    //   this.imei = params.get('imei');
    //   this.priceOption.productDetail.imei = this.imei;
    // });
    const MOCK_IMEI_TELEWIZ = '701171051200026';
    if (this.priceOption.productDetail && this.priceOption.productDetail.imei) {
      this.priceOption.productDetail.imei = this.priceOption.productDetail.imei;
    } else {
      this.priceOption.productDetail.imei = MOCK_IMEI_TELEWIZ ? MOCK_IMEI_TELEWIZ : '';
    }
    this.checkJaymart();
  }

  buildForm(): void {
    this.identityForm = new FormGroup({
      'identity': new FormControl('', [Validators.required, Validators.minLength(13)])
    });

    this.identityFormSubscripe = this.identityForm.controls['identity'].valueChanges
      .subscribe((identityValue: any) => {
        this.onValueChanged(identityValue);
      });
  }

  onValueChanged(data?: any): void {
    if (data[0] === '0') {
      this.identityType = this.IMM_CARD;
    } else {
      this.identityType = this.ID_CARD;
      this.identityForm.controls.identity.setValidators([
        Validators.required,
        Validators.pattern('[0-9.]+'),
        Validators.maxLength(13),
        Validators.minLength(13),
        this.thaiIDValidator()
      ]);
    }
    if (!this.identityForm) { return; }
    const form: any = this.identityForm;

    // tslint:disable-next-line: forin
    for (const field in this.formErrors) {
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && !control.valid && this.identityType !== this.IMM_CARD) {
        this.activeNextBtn = false;
        const messages = this.getErrorMessages(this.identityType)[field];
        // tslint:disable-next-line: forin
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      } else if (control && control.valid && this.identityType !== this.IMM_CARD) {
        this.activeNextBtn = true;
      } else if (this.identityType === this.IMM_CARD) {
        const messages = 'ระบบไม่อนุญาตให้กรอกเลขบัตรประจำตัวคนต่างด้าว';
        this.formErrors[field] += messages;
        this.activeNextBtn = false;
      }
    }
  }

  thaiIDValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {

      const thaiID = control.value;
      const no = this.checkInvalidThaiID(thaiID);
      return no ? { 'thaiIdDigit': { thaiID } } : null;
    };
  }

  checkInvalidThaiID(id: any): boolean {
    let sum = 0;
    let i = 0;
    if (id !== null && id.length === 13) {
      for (; i < 12; i++) {
        sum += parseFloat(id.charAt(i)) * (13 - i);
      }
      if ((11 - sum % 11) % 10 !== parseFloat(id.charAt(12))) {
        return true;
      }
    }
    return false;
  }

  getErrorMessages(identityType: string): any {
    switch (identityType) {
      case this.ID_CARD:
        return this.idCardValidationMessages;
      default:
        return this.commonValidationMessages;
    }
  }

  onCardImgPressCaller(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_VALIDATE_CUSTOMER_ID_CARD_PAGE]);
  }

  checkJaymart(): void {
    const retailChain = this.priceOption.queryParams.isRole;
    if (retailChain && retailChain === 'Retail Chain') {
      this.channelFlow = 'isJaymart';
    }
  }

  isJaymartRouteNextPage(): void {
    if (this.channelFlow && this.channelFlow === 'isJaymart') {
      this.router.navigate([ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_CUSTOMER_INFO_PAGE]);
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_PAYMENT_DETAIL_PAGE]);
    }
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

  onBack(): void {
    const queryParam = this.priceOption.queryParams;
    const productStock = this.priceOption.productStock;
    const productDetail = this.priceOption.productDetail;
    const customerGroup = this.priceOption.customerGroup;
    // tslint:disable-next-line: max-line-length
    const url = `/sales-portal/buy-product/brand/${queryParam.brand}/${queryParam.model}?modelColor=${productStock.colorName}&imei=${productDetail.imei}&customerGroup=${customerGroup.code}`;
    this.removeCartService.backToReturnStock(url, this.transaction);
  }

  validateCustomer(): any {
    this.identity = this.identityForm.value.identity;
    return this.validateCustomerService.queryCustomerInfo(this.identity)
      .then((customerInfo: any) => {
        const transactionType = TransactionType.DEVICE_ORDER_TELEWIZ_DEVICE_SHARE_PLAN; // New
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
                    const body: any = this.validateCustomerService.getRequestAddDeviceSellingCartSharePlanASP(
                      this.user,
                      this.transaction,
                      this.priceOption,
                      { customer: customer }
                    );
                    return this.validateCustomerService.addDeviceSellingCartSharePlanASP(body).then((order: any) => {
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
            // console.log('err', err);
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
    this.transaction.data.action = TransactionAction.KEY_IN;
    if (this.transaction.transactionId) {
      this.pageLoadingService.closeLoading();
      this.isJaymartRouteNextPage();
    } else {
      const transactionObject: any = this.validateCustomerService.buildTransaction({
        transaction: this.transaction,
        transactionType: TransactionType.DEVICE_ORDER_TELEWIZ_DEVICE_SHARE_PLAN // Share
      });

      this.validateCustomerService.createTransaction(transactionObject).then((response: any) => {
        this.pageLoadingService.closeLoading();
        if (response.data.isSuccess) {
          this.transaction = transactionObject;
          this.transaction.data.action = TransactionAction.KEY_IN;
          this.isJaymartRouteNextPage();
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
          transactionType: TransactionType.DEVICE_ORDER_TELEWIZ_DEVICE_SHARE_PLAN, // Share
          action: TransactionAction.KEY_IN,
          order: this.order
        },
        transactionId: this.transaction.transactionId,
      };
    }
    delete this.transaction.data.customer;
  }

  ngOnDestroy(): void {
    this.identityFormSubscripe.unsubscribe();
    this.priceOptionService.update(this.priceOption);
    this.transactionService.update(this.transaction);
  }
}

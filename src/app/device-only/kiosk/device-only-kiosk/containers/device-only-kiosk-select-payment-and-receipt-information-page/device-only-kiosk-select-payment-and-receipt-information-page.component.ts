import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_DEVICE_ONLY_KIOSK_SELECT_MOBILE_CARE_PAGE, ROUTE_DEVICE_ONLY_KIOSK_SELECT_PAYMENT_AND_RECEIPT_INFORMATION_PAGE } from '../../constants/route-path.constant';
import { Transaction, TransactionAction, TransactionType } from 'src/app/shared/models/transaction.model';
import { WIZARD_DEVICE_ONLY_AIS } from 'src/app/device-only/constants/wizard.constant';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Product } from 'src/app/device-only/models/product.model';
import { PaymentDetail, User, HomeService, ApiRequestService, AlertService, TokenService, PaymentDetailBank, Utils, REGEX_MOBILE, PageLoadingService } from 'mychannel-shared-libs';
import { HttpClient } from '@angular/common/http';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOptionUtils } from 'src/app/shared/utils/price-option-utils';
import { CreateOrderService } from 'src/app/device-only/services/create-order.service';
import { HomeButtonService } from 'src/app/device-only/services/home-button.service';
import { ROUTE_BUY_PRODUCT_CAMPAIGN_PAGE } from 'src/app/buy-product/constants/route-path.constant';
// Test
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
import { CustomerInformationService } from 'src/app/device-only/services/customer-information.service';
import { BillingAddressService } from 'src/app/device-only/services/billing-address.service';

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
  selector: 'app-device-only-kiosk-select-payment-and-receipt-information-page',
  templateUrl: './device-only-kiosk-select-payment-and-receipt-information-page.component.html',
  styleUrls: ['./device-only-kiosk-select-payment-and-receipt-information-page.component.scss']
})
export class DeviceOnlyKioskSelectPaymentAndReceiptInformationPageComponent implements OnInit, OnDestroy {
  wizards: string[] = WIZARD_DEVICE_ONLY_AIS;
  transaction: Transaction;
  public priceOption: PriceOption;
  isReceiptInformationValid: boolean;
  public product: Product;
  isSelectBank: any;
  fullPayment: boolean;
  banks: any[];
  paymentDetail: PaymentDetail;
  paymentDetailTemp: any;
  paymentDetailValid: boolean;
  customerInfoTemp: any;
  user: User;
  localtion: any;
  addessValid: boolean;
  omiseBanks: PaymentDetailBank[];

  // Test
  translationSubscribe: Subscription;
  customerAddressForm: FormGroup;
  provinces: string[];
  amphurs: string[];
  tumbols: string[];
  zipCodes: string[];
  allProvinces: string[];
  allZipCodes: string[];
  titleNames: string[];
  customerAddress: CustomerAddress;
  provinceSelected: any;
  amphurSelected: any;
  tumbolSelected: any;
  zipCodeSelected: any;
  customerInfo: any;
  idCardMaxLength: number = 13;
  isShowInputForKeyIn: boolean = false;
  receiptInfoForm: FormGroup;
  searchByMobileNoForm: FormGroup;

  constructor(
    private router: Router,
    private http: HttpClient,
    private homeService: HomeService,
    private apiRequestService: ApiRequestService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private createOrderService: CreateOrderService,
    private alertService: AlertService,
    private homeButtonService: HomeButtonService,
    private tokenService: TokenService,
    private translation: TranslateService,
    public fb: FormBuilder,
    private utils: Utils,
    private pageLoadingService: PageLoadingService,
    private customerInfoService: CustomerInformationService,
    private billingAddress: BillingAddressService,
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.user = this.tokenService.getUser();
  }

  ngOnInit(): void {
    this.homeButtonService.initEventButtonHome();
    this.customerAddress = {
      idCardNo: '',
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
      zipCode: '',
    };
    this.getPaymentDetail();
    // this.createSearchByMobileNoForm();
    this.createCustomerAddressForm();
    // this.createReceiptInfoForm();
    // this.createTransaction();
    this.getAllTitleName();
    this.getAllZipcodes();
    this.getAllProvinces();
  }

  // create Function createTransaction
  // createTransaction(): void {
  //   this.apiRequestService.createRequestId();
  //   if (!this.transaction.data) {
  //     this.transaction = {
  //       data: {
  //         action: TransactionAction.KEY_IN,
  //         transactionType: TransactionType.DEVICE_ONLY_AIS
  //       },
  //       transactionId: this.createOrderService.generateTransactionId(this.apiRequestService.getCurrentRequestId())
  //     };
  //   } else if (this.transaction.data.customer && this.transaction.data.billingInformation) {
  //     this.customerInfoTemp = {
  //       customer: this.transaction.data.customer,
  //       billDeliveryAddress: this.transaction.data.billingInformation.billDeliveryAddress,
  //       receiptInfo: this.transaction.data.receiptInfo,
  //       action: this.transaction.data.action
  //     };
  //   }
  // }

  // create Function getPaymentDetail
  getPaymentDetail(): void {
    let commercialName = this.priceOption.productDetail.name;
    if (this.priceOption.productStock.color) {
      commercialName += ` สี ${this.priceOption.productStock.color}`;
    }
    this.paymentDetail = {
      commercialName: commercialName,
      promotionPrice: this.priceOption.trade.priceType === 'NORMAL' ? +(this.priceOption.trade.normalPrice)
        : +(this.priceOption.trade.promotionPrice),
      isFullPayment: this.isFullPayment(),
      installmentFlag: false,
      advancePay: 0,
      qrCode: true,
      omisePayment: this.isFullPayment() && this.priceOption.productStock.company !== 'WDS'
    };

    this.http.get('/api/salesportal/omise/get-bank').toPromise()
      .then((res: any) => {
        const data = res.data || [];
        this.omiseBanks = data;
      });

    if (this.priceOption.trade.banks && this.priceOption.trade.banks.length > 0) {
      // if (this.isFullPayment()) {
      //   this.banks = this.priceOption.trade.banks || [];
      // } else {
      this.banks = (this.priceOption.trade.banks || []);
      // .map((b: any) => {
      //     return b.installmentDatas.map((data: any) => {
      //       return {
      //         ...b,
      //         installment: `${data.installmentPercentage}% ${data.installmentMounth}`
      //       };
      //     });
      //   }).reduce((prev: any, curr: any) => {
      //     curr.forEach((element: any) => {
      //       prev.push(element);
      //     });
      //     return prev;
      // }, []);
      // }
    } else {
      this.localtion = this.tokenService.getUser();
      this.localtion = this.user.locationCode;
      this.http.post('/api/salesportal/banks-promotion', {
        localtion: this.localtion
      }).toPromise().then((response: any) => this.banks = response.data || '');
    }
  }

  // Test
  createCustomerAddressForm(): void {
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
      zipCode: ['', [Validators.required, Validators.maxLength(5)]]
    });

    // this.customerAddressForm.patchValue(this.customerAddress || {});

    this.customerAddressForm.valueChanges.pipe(debounceTime(750)).subscribe((value: any) => {
      // this.error.emit(this.customerAddressForm.valid);
      this.onError(value);
      if (this.customerAddressForm.valid) {
        // this.completed.emit(value);
        console.log('check Form ', this.customerAddressForm.value);
        this.onComplete(value);
      }
    });

    this.customerAddressForm.patchValue(this.customerAddress || {});

    this.customerAddressForm.controls['titleName'].valueChanges.subscribe((titleName: any) => {
      console.log('titleName -> ', titleName);
    });

    this.customerAddressForm.controls['province'].valueChanges.subscribe((provinceName: any) => {
      this.customerAddressForm.patchValue({
        amphur: '',
        tumbol: '',
      });
      this.customerAddressForm.controls['amphur'].enable();
      this.customerAddressForm.controls['tumbol'].disable();
      if (provinceName) {
        const controlsZipCode = this.customerAddressForm.controls['zipCode'];
        this.provinceSelected = {
          provinceName: provinceName,
          zipCode: controlsZipCode.invalid ? controlsZipCode.value : null
        };
        this.onProvinceSelected(this.provinceSelected);
      }
    });

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
        this.onAmphurSelected(this.amphurSelected);
      }
    });

    this.customerAddressForm.controls['tumbol'].valueChanges.subscribe((tumbolName: any) => {
      if (tumbolName) {
        const controlsZipCode = this.customerAddressForm.controls['zipCode'];
        this.tumbolSelected = {
          provinceName: this.customerAddressForm.value.province || '',
          amphurName: this.customerAddressForm.value.amphur || '',
          tumbolName: tumbolName,
          zipCode: controlsZipCode.invalid ? controlsZipCode.value : null
        };
        this.onTumbolSelected(this.tumbolSelected);
      }
    });
  }

  // Test
  // createSearchByMobileNoForm(): void {
  //   this.searchByMobileNoForm = new FormGroup({
  //     'mobileNo': new FormControl('', [
  //       Validators.maxLength(10),
  //       Validators.minLength(10),
  //       Validators.pattern('^(0)(6|8|9)[0-9]*$|^((88)(6|8|9)[0-9]*)$'),
  //       Validators.compose([Validators.required, Validators.pattern(REGEX_MOBILE)])
  //     ])
  //   });
  // }

  // Test
  // createReceiptInfoForm(): void {
  //   this.receiptInfoForm = this.fb.group({
  //     taxId: ['', [Validators.required]],
  //     branch: ['', [Validators.required]],
  //     telNo: ['', [Validators.pattern(/^0[6-9]\d{8}$/), Validators.required]],
  //   });
  //   // this.receiptInfoForm.valueChanges.pipe(debounceTime(750)).subscribe(event => {
  //   //   this.error.emit(this.receiptInfoForm.valid);
  //   //   if (this.receiptInfoForm.valid) {
  //   //     const receiptInfo: ReceiptInfo = this.receiptInfoForm.value;
  //   //     this.completed.emit({ ...this.customerInfo, receiptInfo });
  //   //   }
  //   // });
  // }

  // Test
  // searchCustomerInfo(): void {
  //   if (this.searchByMobileNoForm.valid) {
  //     this.pageLoadingService.openLoading();
  //     const mobileNo = this.searchByMobileNoForm.value.mobileNo;
  //     this.checkChargeType(mobileNo);
  //   } else {
  //     if (this.searchByMobileNoForm.controls.mobileNo.value.length === 10) {
  //       this.alertService.notify({
  //         type: 'warning',
  //         confirmButtonText: 'OK',
  //         showConfirmButton: true,
  //         text: 'กรุณาระบุเบอร์ให้ถูกต้อง'
  //       });
  //     } else {
  //       this.alertService.notify({
  //         type: 'warning',
  //         confirmButtonText: 'OK',
  //         showConfirmButton: true,
  //         text: 'กรุณาระบุเบอร์ให้ครบ 10 หลัก'
  //       });
  //     }
  //     // this.nameText = '';
  //     // this.billingAddressText = '';
  //     this.receiptInfoForm.controls['taxId'].setValue('');
  //     this.receiptInfoForm.controls['branch'].setValue('');
  //   }
  // }

  // checkChargeType(mobileNo: string): void {
  //   this.customerInfoService.getProfileByMobileNo(mobileNo)
  //     .then((resp: any) => {
  //       console.log('resp --> ', resp);
  //       this.pageLoadingService.closeLoading();
  //   //     const chargeType: string = resp.data.chargeType;
  //   //     switch (chargeType) {
  //   //       case 'Pre-paid':
  //   //         this.alertService.warning('กรุณาระบุเบอร์ AIS รายเดือนเท่านั้น');
  //   //         this.searchByMobileNoForm.controls['mobileNo'].setValue('');
  //   //         break;
  //   //       case 'Post-paid':
  //   //         this.customerInfoService.getBillingByMobileNo(mobileNo)
  //   //           .then((res: any) => {
  //   //             if (res && res.data && res.data.billingAddress) {
  //   //               this.setCustomerInfo({
  //   //                 customer: this.customerInfoService.mapAttributeFromGetBill(res.data.billingAddress),
  //   //                 action: TransactionAction.KEY_IN
  //   //               });
  //   //               this.errorAddessValid.emit(true);
  //   //               this.customerInfoService.setSelectedMobileNo(mobileNo);
  //   //               this.pageLoadingService.closeLoading();
  //   //             } else {
  //   //               this.errorNotAisMobileNo();
  //   //             }
  //   //           })
  //   //           .catch(() => {
  //   //             this.pageLoadingService.closeLoading();
  //   //             this.errorNotAisMobileNo();
  //   //             this.clearData();
  //   //           });
  //   //         break;
  //   //     }
  //     });
  //   //   .catch(() => {
  //   //     this.pageLoadingService.closeLoading();
  //   //     this.errorNotAisMobileNo();
  //   //     this.clearData();
  //   //   });
  // }

  // Test
  // keyPress(event: any): void {
  //   const charCode: number = (event.which) ? event.which : event.keyCode;
  //   if (charCode > 31 && (charCode < 48 || charCode > 57)) {
  //     event.preventDefault();
  //   }
  // }

  // setCustomerInfo(data: any): void {
  // }

  // Test
  // switchKeyInBillingAddress(): void {
  //   this.isShowInputForKeyIn = !this.isShowInputForKeyIn;
  //   this.billingAddress.setIsKeyInBillingAddress(this.isShowInputForKeyIn);
  //   // if (this.receiptInfoForm.valid) {
  //   //   this.onError(true);
  //   // }
  // }

  // Test
  getAllTitleName(): void {
    this.http.get('/api/customerportal/newRegister/queryTitleName').subscribe((resp: any) => {
      this.titleNames = resp.data.titleNames || [];
    });
  }

  // Test
  getAllZipcodes(): void {
    // const customer = this.transaction.data.customer;
    this.http.get('/api/customerportal/newRegister/getAllZipcodes').subscribe((resp: any) => {
      this.allZipCodes = resp.data.zipcodes || [];
    });
  }

  // Test
  getAllProvinces(): void {
    // customer.province = customer.province.replace(/มหานคร$/, '');
    this.http.get('/api/customerportal/newRegister/getAllProvinces', {
      params: {
        provinceSubType: this.translation.currentLang === 'TH' ? 'THA' : 'ENG'
      }
    }).subscribe((resp: any) => {
      this.allProvinces = (resp.data.provinces || []);
      this.provinces = (resp.data.provinces || []).map((province: any) => {
        return province.name;
      });
    });
  }

  // Test
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

  // Test
  validateCharacter(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const reg = /[!$%^&*()_+|~=`{}\[\]:";'<>?,\/@#./1-9]/;
      const stringValue = control.value;
      const no = reg.test(stringValue);
      return no ? { 'validateCharacter': { stringValue } } : null;
    };
  }

  // Test
  onProvinceSelected(params: any): void {
    const province = this.getProvinceByName(params.provinceName);
    const req = {
      provinceId: province.id,
      zipcode: params.zipCode
    };
    if (!params.zipCode) {
      delete req.zipcode;
    }

    this.http.get('/api/customerportal/newRegister/queryAmphur', {
      params: req
    }).subscribe((resp: any) => {
      this.amphurs = (resp.data.amphurs || []).map((amphur: any) => {
        return amphur;
      });
    });
  }

  // Test
  onAmphurSelected(params: any): void {
    const province = this.getProvinceByName(params.provinceName);
    const req = {
      provinceId: province.id,
      amphurName: params.amphurName,
      zipcode: params.zipCode
    };
    if (!params.zipCode) {
      delete req.zipcode;
    }

    this.http.get('/api/customerportal/newRegister/queryTumbol', {
      params: req
    }).subscribe((resp: any) => {
      this.tumbols = (resp.data.tumbols || []).map((tumbol: any) => {
        return tumbol;
      });
    });
  }

  // Test
  onTumbolSelected(params: any): void {
    const province = this.getProvinceByName(params.provinceName);
    this.http.get('/api/customerportal/newRegister/queryZipcode', {
      params: {
        provinceId: province.id,
        amphurName: params.amphurName,
        tumbolName: params.tumbolName
      }
    }).subscribe((resp: any) => {
      this.zipCodes = resp.data.zipcodes || [];

      if (this.zipCodes.length > 0) {
        const controlsZipCode = this.customerAddressForm.controls['zipCode'];
        controlsZipCode.setValue(this.zipCodes[0]);
        this.zipCodeSelected = {
          zipCode: controlsZipCode.valid ? controlsZipCode.value : null
        };
      }
    });
  }

  // Test
  onZipCodeSelected(zipCode: string): void {
    // this.http.get('/api/customerportal/newRegister/getProvinceIdByZipcode', {
    //   params: { zipcode: zipCode }
    // }).toPromise()
    //   .then((resp: any) => {
    //     const province = this.provinces.find((prov: any) => prov.id === resp.data.provinceId);
    //     if (!province) {
    //       return;
    //     }
    //     this.alertService.error('province4 onZipCodeSelected = ' + JSON.stringify(province));
    //     this.customerAddress = Object.assign(
    //       Object.assign({}, this.customerAddress),
    //       {
    //         province: province.name,
    //         zipCode: zipCode
    //       }
    //     );
    //   });
  }

  // Test
  getProvinceByName(provinceName: string): any {
    return (this.allProvinces || []).find((prov: any) => prov.name === provinceName) || {};
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  clearstock(): any {
    this.alertService.question('ต้องการยกเลิกรายการขายหรือไม่ การยกเลิก ระบบจะคืนสินค้าเข้าสต๊อคสาขาทันที', 'ตกลง', 'ยกเลิก')
      .then((response: any) => {
        if (response.value === true) {
          this.createOrderService.cancelOrderDT(this.transaction).then((isSuccess: any) => {
            this.transactionService.remove();
            this.router.navigate([ROUTE_BUY_PRODUCT_CAMPAIGN_PAGE], { queryParams: this.priceOption.queryParams });
          });
        }
      }).catch((err: any) => {
        this.transactionService.remove();
      });
  }

  // Test
  clearCustomerAddressForm(event: any): void {
    // this.amphurs = [];
    // this.tumbols = [];
    // this.zipCodes = [];
    // this.customerAddress.amphur = null;
    // this.customerAddress.tumbol = null;
    // this.customerAddress.province = null;
    // this.customerAddressForm.reset();

    // this.translationSubscribe = this.translation.onLangChange.pipe(debounceTime(750)).subscribe(() => {
    //   this.callService();
    //   this.amphurs = [];
    //   this.tumbols = [];
    //   this.zipCodes = [];
    //   this.customerAddress.amphur = null;
    //   this.customerAddress.tumbol = null;
    //   this.customerAddress.province = null;
    // });
  }

  onBack(): any {
    this.transactionService.remove();
    if (this.transaction.data && this.transaction.data.order && this.transaction.data.order.soId) {
      this.clearstock();
    } else {
      this.router.navigate([ROUTE_BUY_PRODUCT_CAMPAIGN_PAGE], { queryParams: this.priceOption.queryParams });
    }
  }

  onNext(): void {
    this.transaction.data.payment = this.paymentDetailTemp.payment;
    this.createAddToCartTrasaction();
  }

  onComplete(customerInfo: any): void {
    this.transaction.data.customer = customerInfo.customer;
    this.transaction.data.billingInformation = {
      billDeliveryAddress: customerInfo.billDeliveryAddress
    };
    this.transaction.data.receiptInfo = customerInfo.receiptInfo;
  }

  onError(error: boolean): void {
    this.isReceiptInformationValid = error;
  }

  onErrorAddessValid(err: boolean): void {
    this.addessValid = err;
  }

  checkAction(action: string): void {
    if (action === 'READ_CARD') {
      this.transaction.data.action = TransactionAction.READ_CARD;
    } else {
      this.transaction.data.action = TransactionAction.KEY_IN;
    }
  }

  createAddToCartTrasaction(): void {
    this.createOrderService.createAddToCartTrasaction(this.transaction, this.priceOption).then((transaction) => {
      this.transaction = { ...transaction };
      this.transaction.data.device = this.createOrderService.getDevice(this.priceOption);
      this.router.navigate([ROUTE_DEVICE_ONLY_KIOSK_SELECT_MOBILE_CARE_PAGE]);
    }).catch((e) => {
      this.alertService.error(e);
    });
  }

  onPaymentDetailCompleted(payment: any): void {
    this.paymentDetailTemp = payment;
  }

  onPaymentDetailError(valid: boolean): void {
    this.paymentDetailValid = valid;
  }

  isFullPayment(): boolean {
    const trade = this.priceOption.trade || {};
    const payment = (trade.payments || []).find(p => p.method !== 'PP') || {};
    switch (payment.method) {
      case 'CC':
        if (PriceOptionUtils.getInstallmentsFromTrades([trade])) {
          return false;
        } else {
          return true;
        }
      case 'CA':
      case 'CA/CC':
      default:
        return true;
    }
  }

  isNotFormValid(): boolean {
    return !(this.isReceiptInformationValid && this.paymentDetailValid && this.addessValid);
  }

  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
  }

}

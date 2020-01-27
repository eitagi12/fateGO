import { Component, OnInit, ViewChild, ElementRef, TemplateRef, OnDestroy } from '@angular/core';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { WIZARD_DEVICE_ONLY_AIS } from 'src/app/device-only/constants/wizard.constant';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { ReadCardService, PageLoadingService, AlertService, HomeService, ApiRequestService, ReceiptInfo, User, TokenService, PaymentDetail, Utils } from 'mychannel-shared-libs';
import { HttpClient } from '@angular/common/http';
import { TransactionAction, Transaction, Customer } from 'src/app/shared/models/transaction.model';
import { BillingAddressService } from 'src/app/device-only/services/billing-address.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { CustomerInformationService } from 'src/app/device-only/services/customer-information.service';
import { CreateOrderService } from 'src/app/device-only/services/create-order.service';
import { debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ROUTE_DEVICE_ONLY_ASP_SELECT_MOBILE_CARE_PAGE, ROUTE_DEVICE_ONLY_ASP_SUMMARY_PAGE } from '../../constants/route-path.constant';
import { TransactionType } from 'src/app/shared/models/transaction.model';
import { PriceOptionUtils } from 'src/app/shared/utils/price-option-utils';
import { HomeButtonService } from 'src/app/device-only/services/home-button.service';

declare let $: any;
const ADDRESS_BY_SMART_CARD = 'addressBySmartCard';
@Component({
  selector: 'app-device-only-asp-read-card-page',
  templateUrl: './device-only-asp-read-card-page.component.html',
  styleUrls: ['./device-only-asp-read-card-page.component.scss']
})
export class DeviceOnlyAspReadCardPageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_DEVICE_ONLY_AIS;
  priceOption: PriceOption;
  transaction: Transaction;
  selectBillingAddressForm: FormGroup;
  searchByMobileNoForm: FormGroup;
  receiptInfoForm: FormGroup;
  keyInCustomerForm: FormGroup;
  paymentDetail: PaymentDetail;
  customer: Customer;
  receiptInfo: ReceiptInfo;
  user: User;
  canReadSmartCard: boolean = true;
  isSelect: boolean;
  paymentDetailValid: boolean;
  receiptInfoValid: boolean;
  isShowCustomerInfo: boolean;
  isShowCustomerNonAIS: boolean;
  isShowStatusPrePaid: boolean;
  messages: string;
  nameTextBySmartCard: string;
  mobileNoStatus: string;
  paymentDetailTemp: any;
  titleNames: any;
  action: any;
  banks: any[];
  listBillingAccount: Array<any>;
  modalBillAddress: BsModalRef;
  onTouchScreen: boolean;
  currentScrollPosition: any = 0;
  scrollingPosition: any = 0;

  @ViewChild('progressBarArea') progressBarArea: ElementRef;
  @ViewChild('progressBarReadSmartCard') progressBarReadSmartCard: ElementRef;
  @ViewChild('listBillingAccountBox') listBillingAccountBox: ElementRef;
  @ViewChild('select_billing_address') selectBillingAddressTemplate: TemplateRef<any>;

  constructor(
    private router: Router,
    private bsModalService: BsModalService,
    private fb: FormBuilder,
    private readCardService: ReadCardService,
    private pageLoadingService: PageLoadingService,
    private alertService: AlertService,
    private billingAddress: BillingAddressService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private homeService: HomeService,
    private customerInfoService: CustomerInformationService,
    private createOrderService: CreateOrderService,
    private apiRequestService: ApiRequestService,
    private http: HttpClient,
    private tokenService: TokenService,
    private homeButtonService: HomeButtonService,
    private utils: Utils
  ) {
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();
    this.user = this.tokenService.getUser();
  }

  ngOnInit(): void {
    this.homeButtonService.initEventButtonHome();
    this.progressBarArea.nativeElement.style.display = 'none';
    this.createSelectBillingAddressForm();
    this.createSearchByMobileNoForm();
    this.craeteReceipInfoForm();
    this.createKeyInCustomerForm();
    this.getPaymentDetail();
    this.getLocationName();
    this.getTitleName();
    this.createTransaction();
    this.setCustomerInfo();
    this.checkShowCustomerInfo();
    this.checkShowStatusPrePaid();
  }

  createSelectBillingAddressForm(): void {
    this.selectBillingAddressForm = this.fb.group({
      'billingAddress': ['', [Validators.required]]
    });
    this.selectBillingAddressForm.valueChanges.pipe(debounceTime(350)).subscribe(() => {
      if (this.selectBillingAddressForm.valid) {
        this.isSelect = true;
      }
    });
  }

  createSearchByMobileNoForm(): void {
    this.searchByMobileNoForm = this.fb.group({
      mobileNo: ['', [
        Validators.maxLength(10),
        Validators.minLength(10),
        Validators.pattern('^(0)(6|8|9)[0-9]*$|^((88)(6|8|9)[0-9]*)$')]
      ]
    });
  }

  craeteReceipInfoForm(): void {
    this.receiptInfoForm = this.fb.group({
      taxId: ['', [Validators.required]],
      locationName: ['', [Validators.required]],
      telNo: ['']
    });
  }

  createKeyInCustomerForm(): void {
    this.keyInCustomerForm = this.fb.group({
      idCardNo: ['', [Validators.required, Validators.pattern(/^[1-8]\d{12}$/), this.validateIdCard.bind(this)]],
      titleName: ['', [Validators.required]],
      firstName: ['', [Validators.required, this.validateCharacter()]],
      lastName: ['', [Validators.required, this.validateCharacter()]],
    });
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

  validateCharacter(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const reg = /[!$%^&*()_+|~=`{}\[\]:";'<>?,\/@#./1-9]/;
      const stringValue = control.value;
      const no = reg.test(stringValue);
      return no ? { 'validateCharacter': { stringValue } } : null;
    };
  }

  getPaymentDetail(): void {
    let commercialName = this.priceOption.productDetail.name;
    if (this.priceOption.productStock.color) {
      commercialName += ` สี ${this.priceOption.productStock.color}`;
    }
    this.paymentDetail = {
      commercialName: commercialName,
      // tslint:disable-next-line:max-line-length
      promotionPrice: this.priceOption.trade.priceType === 'NORMAL' ? +(this.priceOption.trade.normalPrice) : +(this.priceOption.trade.promotionPrice),
      isFullPayment: this.isFullPayment(),
      installmentFlag: false,
      advancePay: 0,
      qrCode: false
    };

    if (this.priceOption.trade.banks && this.priceOption.trade.banks.length > 0) {
      if (this.isFullPayment()) {
        this.banks = this.priceOption.trade.banks || [];
      } else {
        this.banks = (this.priceOption.trade.banks || []).map((b: any) => {
          return b.installmentDatas.map((data: any) => {
            return {
              ...b,
              installment: `${data.installmentPercentage}% ${data.installmentMounth}`
            };
          });
        }).reduce((prev: any, curr: any) => {
          curr.forEach((element: any) => {
            prev.push(element);
          });
          return prev;
        }, []);
      }
    } else {
      this.http.post('/api/salesportal/banks-promotion', {
        localtion: this.user.locationCode
      }).toPromise().then((response: any) => this.banks = response.data || '');
    }
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

  getLocationName(): void {
    this.billingAddress.getLocationName().then((resp: any) => {
      this.receiptInfoForm.controls['locationName'].setValue(resp.data.displayName);
      this.transaction.data.seller = {
        ...this.transaction.data.seller,
        locationName: resp.data.displayName,
        locationCode: this.tokenService.getUser().locationCode,
        sharedUser: this.tokenService.getUser().sharedUser,
        sellerName: this.tokenService.getUser().firstname + ' ' + this.tokenService.getUser().lastname,
        sellerNo: this.tokenService.getUser().ascCode
      };
    });
  }

  getTitleName(): void {
    this.billingAddress.getTitleName().then((titleName: any) => {
      if (titleName) {
        this.titleNames = titleName;
      }
    });
    this.keyInCustomerForm.controls['titleName'].valueChanges.subscribe((titleName: any) => {
      if (titleName) {
        titleName = this.keyInCustomerForm.controls['titleName'].value;
      }
    });
  }

  createTransaction(): void {
    if (!this.transaction.data) {
      this.transaction = {
        data: {
          action: TransactionAction.KEY_IN,
          transactionType: TransactionType.DEVICE_ONLY_ASP
        },
        transactionId: this.createOrderService.generateTransactionId(this.apiRequestService.getCurrentRequestId())
      };
    }
  }

  setCustomerInfo(data?: any, action?: any): any {
    if (data) {
      this.transaction.data.action = action;
      this.transaction.data.customer = {
        ...this.transaction.data.customer,
        idCardNo: data.idCardNo || '',
        idCardType: data.idCardType || 'บัตรประชาชน',
        titleName: data.titleName || '',
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        birthdate: data.birthdate || '',
        gender: data.gender || '',
        expireDate: data.expireDate || '',
        issueDate: data.issueDate || '',
        mobileNo: data.mobileNo || '',
        homeNo: data.homeNo || data.houseNumber || '',
        moo: data.moo || '',
        mooBan: data.mooban || '',
        room: data.room || '',
        floor: data.floor || '',
        buildingName: data.buildingName || '',
        soi: data.soi || '',
        street: data.street || '',
        province: data.province || data.provinceName || '',
        amphur: data.amphur || '',
        tumbol: data.tumbol || '',
        zipCode: data.zipCode || data.portalCode || ''
      };
    } else {
      this.customer = this.transaction.data.customer;
      this.action = this.transaction.data.action;
      if (this.customer) {
        this.receiptInfoForm.controls['taxId'].setValue((`XXXXXXXXX${(this.customer.idCardNo.substring(9))}`));
        if (this.customerInfoService.isNonAis === 'Non-AIS') {
          this.keyInCustomerForm.controls['idCardNo'].setValue(this.customer.idCardNo);
          this.keyInCustomerForm.controls['titleName'].setValue(this.customer.titleName);
          this.keyInCustomerForm.controls['firstName'].setValue(this.customer.firstName);
          this.keyInCustomerForm.controls['lastName'].setValue(this.customer.lastName);
        }
      } else {
        this.receiptInfoForm.controls['taxId'].setValue('');
      }
    }
  }

  checkShowCustomerInfo(): void {
    if (this.transaction.data.customer) {
      this.receiptInfoValid = true;
      if (this.customerInfoService.isNonAis === 'Non-AIS') {
        this.isShowCustomerInfo = false;
        this.isShowCustomerNonAIS = true;
      } else {
        this.isShowCustomerInfo = true;
        this.isShowCustomerNonAIS = false;
      }
    } else {
      this.receiptInfoValid = false;
      this.isShowCustomerInfo = false;
      this.isShowCustomerNonAIS = false;
    }
  }

  checkShowStatusPrePaid(): void {
    const mobileNo = this.customerInfoService.getSelectedMobileNo();
    if (mobileNo) {
      this.http.get(`/api/customerportal/asset/${mobileNo}/profile`).toPromise()
        .then((res: any) => {
          const mobileNoStatus = res.data.mobileStatus;
          const chargeType = res.data.chargeType;
          this.mobileNoStatus = mobileNoStatus === 'Active' || mobileNoStatus === '000' ? 'Active' : 'Suspend';
          this.isShowStatusPrePaid = chargeType === 'Pre-paid' ? true : false;
        });
    } else {
      this.isShowStatusPrePaid = false;
    }
  }

  searchCustomerInfo(): void {
    if (this.searchByMobileNoForm.valid) {
      const mobileNo = this.searchByMobileNoForm.value.mobileNo;
      this.checkChargeType(mobileNo);
      this.transaction.data.simCard = {
        ...this.transaction.data.simCard,
        mobileNo: mobileNo
      };
      this.clearKeyInCustomer();
    } else {
      this.clearData();
      this.receiptInfoValid = false;
      this.alertService.notify({
        type: 'warning',
        confirmButtonText: 'OK',
        showConfirmButton: true,
        text: 'เบอร์ไม่ถูกต้อง กรุณาเปลี่ยนเบอร์ใหม่'
      });
    }
  }

  checkChargeType(mobileNo: string): void {
    this.pageLoadingService.openLoading();
    this.http.get(`/api/customerportal/asset/${mobileNo}/profile`).toPromise()
      .then((profile: any) => {
        this.pageLoadingService.closeLoading();
        const chargeType: string = profile.data.chargeType;
        const mobileNoStatus: string = profile.data.mobileStatus;
        if ((chargeType === 'Post-paid' && (mobileNoStatus === 'Active' || mobileNoStatus === '000')) ||
          (chargeType === 'Pre-paid' && (mobileNoStatus === '000' || mobileNoStatus === '378'))) {
          this.customerAccount(mobileNo);
          this.customerInfoService.setSelectedMobileNo(mobileNo);
          this.isShowStatusPrePaid = chargeType === 'Pre-paid' ? true : false;
          this.mobileNoStatus = mobileNoStatus === '000' || mobileNoStatus === 'Active' ? 'Active' : 'Suspend';
          this.customerInfoService.isNonAis = '';
        } else {
          this.clearData();
          this.isShowCustomerInfo = false;
          this.alertService.notify({
            type: 'error',
            confirmButtonText: 'OK',
            showConfirmButton: true,
            text: 'เบอร์ไม่ถูกต้อง กรุณาเปลี่ยนเบอร์ใหม่'
          });
        }
      }).catch((err: any) => {
        this.pageLoadingService.closeLoading();
        if (err.error.developerMessage === 'Subscriber not found' || err.error.developerMessage === 'Unsupported businessType' ||
          err.error.developerMessage === 'Ntype Match Fail.' || err.error.resultDescription === 'MobileNo not found') {
          this.isShowCustomerNonAIS = true;
          this.isShowCustomerInfo = false;
          this.customerInfoService.isNonAis = 'Non-AIS';
          this.receiptInfoForm.controls['taxId'].setValue('');
          // Set Customer For Non-AIS
          this.keyInCustomerForm.valueChanges.pipe(debounceTime(750)).subscribe((value: any) => {
            if (this.keyInCustomerForm.valid) {
              this.setCustomerInfo(value, TransactionAction.KEY_IN);
              this.setReceiptInfo(value.idCardNo);
              this.receiptInfoValid = true;
            } else {
              this.receiptInfoValid = false;
              this.receiptInfoForm.controls['taxId'].setValue('');
            }
          });
        } else {
          this.clearData();
          this.isShowCustomerNonAIS = false;
          this.receiptInfoValid = false;
          this.alertService.notify({
            type: 'error',
            confirmButtonText: 'OK',
            showConfirmButton: true,
            text: 'เบอร์ไม่ถูกต้อง กรุณาเปลี่ยนเบอร์ใหม่'
          });
        }
      });
  }

  customerAccount(mobileNo: string): void {
    this.http.get(`/api/customerportal/${mobileNo}/query-customer-account`).toPromise()
      .then((res: any) => {
        this.setCustomerInfo(res.data, TransactionAction.KEY_IN);
        this.setReceiptInfo(res.data.idCardNo);
        this.receiptInfoValid = true;
        this.isShowCustomerInfo = true;
        this.isShowCustomerNonAIS = false;
      });
  }

  clearData(): void {
    this.receiptInfoForm.controls['taxId'].setValue('');
    this.searchByMobileNoForm.controls['mobileNo'].setValue('');
  }

  clearKeyInCustomer(): void {
    this.receiptInfoValid = false;
    this.receiptInfoForm.controls['taxId'].setValue('');
    this.keyInCustomerForm.reset();
    this.keyInCustomerForm.patchValue({
      idCardNo: '',
      titleName: '',
      firstName: '',
      lastName: ''
    });
  }

  async readCard(): Promise<any> {
    const data = await this.readCardFromWebSocket();
    this.customer = await data; // data from IdCard
    this.nameTextBySmartCard = this.customer.titleName + ' ' + this.customer.firstName + ' ' + this.customer.lastName;
    await this.zipcode(this.customer);
    await this.getBillingByIdCard();
    this.messages = '';
  }

  getBillingByIdCard(): void {
    this.customerInfoService.getBillingByIdCard(this.customer.idCardNo)
      .then((res: any) => {
        if (res && res.data && res.data.billingAccountList) {
          this.listBillingAccount = res.data.billingAccountList.filter(item => (item.mobileNo && item.mobileNo[0].length > 0));
          this.modalBillAddress = this.bsModalService.show(this.selectBillingAddressTemplate,
            { backdrop: 'static', });
        } else {
          this.progressBarArea.nativeElement.style.display = 'none';
          this.alertService.notify({
            type: 'warning',
            confirmButtonText: 'OK',
            showConfirmButton: true,
            text: 'ไม่แสดงเลขระบบรายเดือนแสดงตนตาม ID No. ที่ระบุ'
          });
          this.clearData();
          this.receiptInfoValid = false;
        }
      })
      .catch(() => {
        this.listBillingAccountBox.nativeElement.style.display = 'none';
      });
  }

  zipcode(customer: any): any {
    return this.customerInfoService.getZipCode(customer.province, customer.amphur, customer.tumbol)
      .then((res: any) => {
        this.customer.zipCode = res.data.zipcodes[0];
      })
      .catch((error) => {
        this.pageLoadingService.closeLoading();
      });
  }

  readCardFromWebSocket(): any {
    let width: number = 1;
    this.messages = '';
    this.messages = 'โปรดเสียบบัตรประชาชน';
    $('#button-read-smart-card').addClass('disabledbutton');
    const readCardEvent: any = {
      EVENT_CARD_INITIALIZED: 'OnInitialized',
      EVENT_CARD_INSERTED: 'OnCardInserted',
      EVENT_CARD_LOAD_PROGRESS: 'OnCardLoadProgress',
      EVENT_CARD_LOAD_COMPLETED: 'OnCardLoadCompleted',
      EVENT_CARD_LOAD_ERROR: 'OnCardLoadError',
      EVENT_CARD_REMOVED: 'OnCardRemoved',
    };
    this.progressBarArea.nativeElement.style.display = 'none';
    this.progressBarReadSmartCard.nativeElement.style.width = '0%';
    const promises: any = new Promise((resolve, reject) => {
      this.readCardService.onReadCard().subscribe((readCard: any) => {
        if (readCard.eventName === readCardEvent.EVENT_CARD_REMOVED) {
          this.messages = '';
          width = 0;
          this.progressBarArea.nativeElement.style.display = 'block';
          this.progressBarReadSmartCard.nativeElement.style.width = '0%';
        }
        if (readCard.eventName === readCardEvent.EVENT_CARD_LOAD_ERROR) {
          this.progressBarArea.nativeElement.style.display = 'none';
          this.progressBarReadSmartCard.nativeElement.style.width = '0%';
        }
        if (readCard.eventName === readCardEvent.EVENT_CARD_INITIALIZED) {
          setTimeout(() => {
            if (readCard.eventName !== readCardEvent.EVENT_CARD_INSERTED) {
              this.messages = 'โปรดเสียบบัตรประชาชน';
              this.progressBarArea.nativeElement.style.display = 'none';
            }
          }, 10);
        }
        if (readCard.eventName === readCardEvent.EVENT_CARD_INSERTED) {
          width = 0;
          this.messages = '';
        }
        if (readCard.eventName === readCardEvent.EVENT_CARD_LOAD_PROGRESS) {
          this.progressBarArea.nativeElement.style.display = 'block';
          width = +readCard.progress;
          this.progressBarReadSmartCard.nativeElement.style.width = width + '%';
        }
        if (readCard.eventName === readCardEvent.EVENT_CARD_LOAD_COMPLETED) {
          this.canReadSmartCard = true;
          const customer: string = readCard.profile;
          if (customer) {
            $('#button-read-smart-card').removeClass('disabledbutton');
            this.progressBarReadSmartCard.nativeElement.style.width = '100%';
            this.messages = 'ตรวจสอบสำเร็จ โปรดดึงบัตรออก';
            resolve(customer);
          }
          this.progressBarArea.nativeElement.style.display = 'none';
        }
      });

    }).catch(() => {
      this.pageLoadingService.closeLoading();
      this.alertService.error('ไม่สามารถอ่านบัตรประชาชนได้ กรุณาเสียบบัตรใหม่อีกครั้ง');
    });
    return promises;
  }

  closeModalBillingAddress(): void {
    this.selectBillingAddressForm.controls['billingAddress'].setValue('');
    this.canReadSmartCard = true;
    this.isSelect = false;
    this.modalBillAddress.hide();
  }

  selectBillingAddress(): void {
    const billingAddressSelected = this.selectBillingAddressForm.controls.billingAddress.value;
    this.isShowCustomerInfo = true;
    this.isShowCustomerNonAIS = false;
    this.isShowStatusPrePaid = false;
    this.modalBillAddress.hide();
    this.customerInfoService.isNonAis = '';
    this.searchByMobileNoForm.controls['mobileNo'].setValue('');
    if (billingAddressSelected === ADDRESS_BY_SMART_CARD) {
      this.setCustomerInfo(this.customer, TransactionAction.READ_CARD);
      this.setReceiptInfo(this.customer.idCardNo);
      this.isSelect = true;
      this.receiptInfoValid = true;
      this.customerInfoService.setSelectedMobileNo('');
    } else {
      this.pageLoadingService.openLoading();
      const mobileNo = this.listBillingAccount[billingAddressSelected].mobileNo[0];
      this.customerInfoService.getBillingByMobileNo(mobileNo)
        .then((bill: any) => {
          this.pageLoadingService.closeLoading();
          this.setCustomerInfo(bill.data.billingAddress, TransactionAction.READ_CARD);
          this.setReceiptInfo(bill.data.billingAddress.idCardNo);
          this.customerInfoService.setSelectedMobileNo(mobileNo);
          this.receiptInfoValid = true;
          this.transaction.data.simCard = {
            ...this.transaction.data.simCard,
            mobileNo : mobileNo
          };
        })
        .catch(() => {
          this.pageLoadingService.closeLoading();
        });
    }
  }

  setReceiptInfo(idCardNo: any): void {
    this.receiptInfoForm.controls['taxId'].setValue((`XXXXXXXXX${(idCardNo.substring(9))}`));
    if (this.receiptInfoForm.valid) {
      this.receiptInfo = this.receiptInfoForm.value;
      this.transaction.data.receiptInfo = this.receiptInfo;
    }
  }

  clearstock(): any {
    this.alertService.question('ต้องการยกเลิกรายการขายหรือไม่ การยกเลิก ระบบจะคืนสินค้าเข้าสต๊อคสาขาทันที', 'ตกลง', 'ยกเลิก')
      .then((response: any) => {
        if (response.value === true) {
          this.createOrderService.cancelOrder(this.transaction).then((isSuccess: any) => {
            this.transactionService.remove();
            const product = this.priceOption.queryParams;
            const brand: string = encodeURIComponent(product.brand ? product.brand : '').replace(/\(/g, '%28').replace(/\)/g, '%29');
            const model: string = encodeURIComponent(product.model ? product.model : '').replace(/\(/g, '%28').replace(/\)/g, '%29');
            const imei: any = JSON.parse(localStorage.getItem('device'));
            const url: string = `/sales-portal/buy-product/brand/${brand}/${model}`;
            const queryParams: string =
              '?modelColor=' + product.color +
              '&productType=' + product.productType +
              '&productSubtype=' + product.productSubtype +
              '&imei=' + imei.imei +
              '&customerGroup=' + this.priceOption.customerGroup.code;
            window.location.href = url + queryParams;
          });
        }
      }).catch(() => {
        this.transactionService.remove();
      });
  }

  onBack(): void {
    if (this.transaction.data && this.transaction.data.order && this.transaction.data.order.soId) {
      this.clearstock();
      return;
    }
    this.transactionService.remove();
    const product = this.priceOption.queryParams;
    const brand: string = encodeURIComponent(product.brand ? product.brand : '').replace(/\(/g, '%28').replace(/\)/g, '%29');
    const model: string = encodeURIComponent(product.model ? product.model : '').replace(/\(/g, '%28').replace(/\)/g, '%29');
    const imei: any = JSON.parse(localStorage.getItem('device'));
    const url: string = `/sales-portal/buy-product/brand/${brand}/${model}`;
    const queryParams: string =
      '?modelColor=' + product.color +
      '&productType=' + product.productType +
      '&productSubtype=' + product.productSubtype +
      '&imei=' + imei.imei +
      '&customerGroup=' + this.priceOption.customerGroup.code;
    window.location.href = url + queryParams;
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onNext(): void {
    this.transaction.data.payment = this.paymentDetailTemp.payment;
    this.createOrderService.createAddToCartTrasaction(this.transaction, this.priceOption)
      .then((transaction) => {
        this.transaction = { ...transaction };
        this.transaction.data.device = this.createOrderService.getDevice(this.priceOption);
        if (this.customerInfoService.isNonAis === 'Non-AIS') {
          this.router.navigate([ROUTE_DEVICE_ONLY_ASP_SUMMARY_PAGE]);
        } else {
          this.router.navigate([ROUTE_DEVICE_ONLY_ASP_SELECT_MOBILE_CARE_PAGE]);
        }
      }).catch((err) => {
        console.log('check err dv-only-asp onNext ---> ', err);
    });
  }

  isNotFormValid(): boolean {
    return !(this.paymentDetailValid && this.receiptInfoValid);
  }

  onPaymentDetailCompleted(payment: any): void {
    this.paymentDetailTemp = payment;
  }

  onPaymentDetailError(valid: boolean): void {
    this.paymentDetailValid = valid;
  }

  onCancelMove(event: any): void {
    event.preventDefault();
    this.onTouchScreen = false;
  }

  onScrolling(event: any): void {
    const id = document.getElementById('myModal');
    if (this.onTouchScreen) {
      this.scrollingPosition = (this.currentScrollPosition - (event.clientY + id.scrollTop));
      id.scrollTop += this.scrollingPosition;
    }
  }

  onTouchModal(event: any): void {
    const id = document.getElementById('myModal');
    window.scrollTo(0, 0);
    this.currentScrollPosition = event.clientY + id.scrollTop;
    this.onTouchScreen = true;
  }

  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
  }

}

import { Component, OnInit, ViewChild, ElementRef, TemplateRef, Output, EventEmitter, OnDestroy } from '@angular/core';
import { WIZARD_DEVICE_ONLY_AIS } from 'src/app/device-only/constants/wizard.constant';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReadCardService, PageLoadingService, AlertService, HomeService, ApiRequestService, ReceiptInfo, User, TokenService, PaymentDetail } from 'mychannel-shared-libs';
import { HttpClient } from '@angular/common/http';
import { TransactionAction, Transaction, Customer } from 'src/app/shared/models/transaction.model';
import { BillingAddressService } from 'src/app/device-only/services/billing-address.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { CustomerInformationService } from 'src/app/device-only/services/customer-information.service';
import { CreateOrderService } from 'src/app/device-only/services/create-order.service';
import { debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ROUTE_DEVICE_ONLY_ASP_SELECT_MOBILE_CARE_PAGE } from '../../constants/route-path.constant';
import { TransactionType } from 'src/app/shared/models/transaction.model';
import { PriceOptionUtils } from 'src/app/shared/utils/price-option-utils';

declare let $: any;
@Component({
  selector: 'app-device-only-asp-read-card-page',
  templateUrl: './device-only-asp-read-card-page.component.html',
  styleUrls: ['./device-only-asp-read-card-page.component.scss']
})
export class DeviceOnlyAspReadCardPageComponent implements OnInit, OnDestroy {
  public wizards: string[] = WIZARD_DEVICE_ONLY_AIS;
  public searchByMobileNoForm: FormGroup;
  public receiptInfoForm: FormGroup;
  public messages: string;
  public canReadSmartCard: boolean = true;
  private customer: Customer;
  public listBillingAccount: Array<any>;
  private priceOption: PriceOption;
  private transaction: Transaction;
  public selectBillingAddressForm: FormGroup;
  public isSelect: boolean;
  public canNext: boolean = false;
  public customerInfoTemp: any;
  public receiptInfo: ReceiptInfo;
  public user: User;
  public ADDRESS_BY_SMART_CARD: string = 'addressBySmartCard';
  public paymentDetail: PaymentDetail;
  public banks: any[];
  private localtion: any;
  public nameTextBySmartCard: string;
  public nameTextBySearchMobileNo: string;
  public billingAddressText: string;
  public addressTextBySmartCard: string;
  public paymentDetailTemp: any;
  public paymentDetailValid: boolean;

  @ViewChild('progressBarArea')
  progressBarArea: ElementRef;
  @ViewChild('progressBarReadSmartCard')
  progressBarReadSmartCard: ElementRef;
  @ViewChild('listBillingAccountBox')
  listBillingAccountBox: ElementRef;
  @ViewChild('select_billing_address')
  selectBillingAddressTemplate: TemplateRef<any>;
  modalBillAddress: BsModalRef;

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
    private tokenService: TokenService
  ) {
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();
    this.user = this.tokenService.getUser();
  }

  ngOnInit(): void {
    this.getPaymentDetail();
    this.createTransaction();
    this.progressBarArea.nativeElement.style.display = 'none';
    this.createFormMobile();
    this.craeteFormCus();
    this.createSelectBillingAddressForm();
    this.varidationNext(false);
    this.getLocationName();
    this.setCustomerInfoFromTransaction();
  }

  getLocationName(): void {
    this.billingAddress.getLocationName().then((resp: any) => {
      this.receiptInfoForm.controls['branch'].setValue(resp.data.displayName);
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

  private getPaymentDetail(): void {
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
      this.localtion = this.user.locationCode;
      this.http.post('/api/salesportal/banks-promotion', {
        localtion: this.localtion
      }).toPromise().then((response: any) => this.banks = response.data || '');
    }
  }

  private isFullPayment(): boolean {
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

  private createTransaction(): void {
    if (!this.transaction.data) {
      this.transaction = {
        data: {
          action: TransactionAction.KEY_IN,
          transactionType: TransactionType.DEVICE_ONLY_ASP
        },
        transactionId: this.createOrderService.generateTransactionId(this.apiRequestService.getCurrentRequestId())
      };
    } else if (this.transaction.data.customer && this.transaction.data.billingInformation) {
      this.customerInfoTemp = {
        customer: this.transaction.data.customer,
        billDeliveryAddress: this.transaction.data.billingInformation.billDeliveryAddress,
        receiptInfo: this.transaction.data.receiptInfo,
        action: this.transaction.data.action
      };
    }
  }

  private setCustomerInfoFromTransaction(): void {
    const customer = this.transaction.data.customer;
    if (customer) {
      this.receiptInfoForm.controls['taxId'].setValue((`XXXXXXXXX${(customer.idCardNo.substring(9))}`));
      this.varidationNext(true);
    }
  }

  private createFormMobile = () => {
    this.searchByMobileNoForm = this.fb.group({
      mobileNo: ['', []]
    });
  }

  private craeteFormCus = () => {
    this.receiptInfoForm = this.fb.group({
      taxId: ['', [Validators.required]],
      branch: ['', []],
      telNo: ['', [Validators.pattern(/^0[6-9]\d{8}$/)]]
    });
    this.receiptInfoForm.valueChanges.pipe(debounceTime(750)).subscribe(event => {
      if (this.receiptInfoForm.valid) {
        this.receiptInfo = this.receiptInfoForm.value;
      }
      this.transaction.data.receiptInfo = this.receiptInfo;
    });
  }

  public createSelectBillingAddressForm(): void {
    this.selectBillingAddressForm = this.fb.group({
      'billingAddress': '',
    });
    this.selectBillingAddressForm.valueChanges.pipe(debounceTime(350)).subscribe(() => {
      if (this.selectBillingAddressForm.valid) {
        this.isSelect = true;
      }
    });
  }

  searchCustomerInfo = () => {
    if (this.searchByMobileNoForm.getRawValue().mobileNo) {
      this.pageLoadingService.openLoading();
      const mobileNo = this.searchByMobileNoForm.value.mobileNo;
      this.checkChargeType(mobileNo);
    } else {
      this.alertService.notify({
        type: 'warning',
        confirmButtonText: 'OK',
        showConfirmButton: true,
        text: 'กรุณาระบุเบอร์ให้ครบ 10 หลัก'
      });
      this.clearData();
    }
  }

  private checkChargeType = (mobileNo: string) => {
    this.http.get(`/api/customerportal/asset/${mobileNo}/profile`).toPromise()
      .then((response: any) => {
        const chargeType: string = response.data.chargeType;
        switch (chargeType) {
          case 'Pre-paid':
            this.http.get(`/api/customerportal/mobile-detail/${mobileNo}`).toPromise()
              .then((res: any) => {
                if (res && res.data && res.data.mobileStatus === 'Active') {
                  this.setCustomerInfo({
                    customer: '',
                    action: TransactionAction.KEY_IN
                  });
                  this.nameTextBySearchMobileNo = res.data.title + ' ' + res.data.name;
                  this.billingAddressText = '';
                  this.receiptInfoForm.controls['taxId'].setValue((`XXXXXXXXX${(response.data.idCardNo.substring(9))}`));
                  this.customerInfoService.setSelectedMobileNo(mobileNo);
                  this.varidationNext(true);
                  this.pageLoadingService.closeLoading();
                }
              });
            break;
          case 'Post-paid':
            this.http.get(`/api/customerportal/billing/${mobileNo}`).toPromise()
              .then((res: any) => {
                if (res && res.data && res.data.billingAddress) {
                  this.customer = res.data.billingAddress;
                  this.setCustomerInfo({
                    customer: res.data.billingAddress,
                    action: TransactionAction.KEY_IN
                  });
                  this.nameTextBySearchMobileNo = this.customer.titleName + ' ' + this.customer.firstName + ' ' + this.customer.lastName;
                  this.billingAddressText = '';
                  this.customerInfoService.setSelectedMobileNo(mobileNo);
                  this.receiptInfoForm.controls['taxId'].setValue((`XXXXXXXXX${(res.data.billingAddress.idCardNo.substring(9))}`));
                  this.pageLoadingService.closeLoading();
                }
              });
            break;
        }
      })
      .catch(() => {
        this.setCustomerInfo({
          customer: '',
          action: TransactionAction.KEY_IN
        });
        this.nameTextBySearchMobileNo = '';
        this.billingAddressText = '';
        this.receiptInfoForm.controls['taxId'].setValue('');
        this.transaction.data.simCard = {
          mobileNo: mobileNo
        };
        this.varidationNext(true);
        this.pageLoadingService.closeLoading();
      });
  }

  private errorNotAisMobileNo(): void {
    this.alertService.notify({
      type: 'error',
      confirmButtonText: 'OK',
      showConfirmButton: true,
      text: 'เบอร์นี้ไม่ใช่ระบบ AIS กรุณาเปลี่ยนเบอร์ใหม่'
    });
  }

  private clearData(): void {
    this.searchByMobileNoForm.controls['mobileNo'].setValue('');
    this.nameTextBySearchMobileNo = '';
    this.billingAddressText = '';
    this.receiptInfoForm.controls['taxId'].setValue('');
  }

  setCustomerInfo = (data: any) => {
    const customer = {
      idCardNo: data.customer.idCardNo,
      idCardType: data.customer.idCardType || 'บัตรประชาชน',
      titleName: data.customer.titleName,
      firstName: data.customer.firstName,
      lastName: data.customer.lastName,
      birthdate: data.customer.birthdate || '',
      gender: data.customer.gender || '',
      expireDate: data.customer.expireDate || '',
      homeNo: data.customer.homeNo || data.customer.houseNumber || '',
      moo: data.customer.moo || '',
      mooBan: data.customer.mooBan || '',
      room: data.customer.room || '',
      floor: data.customer.floor || '',
      buildingName: data.customer.buildingName || '',
      soi: data.customer.soi || '',
      street: data.customer.street || '',
      province: data.customer.province || data.customer.provinceName || '',
      amphur: data.customer.amphur,
      tumbol: data.customer.tumbol,
      zipCode: data.customer.zipCode || data.customer.portalCode || '',
      mobileNo: data.mobileNo,
    };
    this.transaction.data.customer = customer;
    this.transaction.data.action = data.action;
    this.varidationNext(true);
  }

  varidationNext = (flag: boolean) => {
    this.canNext = flag;
  }

  async readCard(): Promise<any> {
    const data = await this.readCardFromWebSocket();
    this.customer = await data;
    this.nameTextBySmartCard = this.customer.titleName + ' ' + this.customer.firstName + ' ' + this.customer.lastName;
    await this.zipcode(this.customer);
    this.addressTextBySmartCard = await this.customerInfoService.convertBillingAddressToString(this.customer);
    await this.getBillingByIdCard();
    this.messages = '';
  }

  private getBillingByIdCard(): void {
    this.customerInfoService.getBillingByIdCard(this.customer.idCardNo)
      .then((res: any) => {
        if (res && res.data && res.data.billingAccountList) {
          this.listBillingAccount = res.data.billingAccountList.filter(item => (item.mobileNo && item.mobileNo[0].length > 0));
          this.modalBillAddress = this.bsModalService.show(this.selectBillingAddressTemplate);
        } else {
          this.progressBarArea.nativeElement.style.display = 'none';
        }
        this.pageLoadingService.closeLoading();
      })
      .catch(() => {
        this.listBillingAccountBox.nativeElement.style.display = 'none';
      });
  }

  public zipcode(customer: any): any {
    // tslint:disable-next-line: max-line-length
    return this.customerInfoService.getZipCode(customer.province, customer.amphur, customer.tumbol)
      .then((res: any) => {
        this.customer.zipCode = res.data.zipcodes[0];
      })
      .catch((error) => {
        this.pageLoadingService.closeLoading();
      });
  }

  readCardFromWebSocket = () => {
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

  public closeModalBillingAddress(): void {
    this.modalBillAddress.hide();
    this.canReadSmartCard = true;
  }

  public selectBillingAddress(): void {
    const billingAddressSelected = this.selectBillingAddressForm.controls.billingAddress.value;
    if (billingAddressSelected === this.ADDRESS_BY_SMART_CARD) {
      this.isSelect = true;
      this.billingAddressText = this.addressTextBySmartCard;
      this.receiptInfoForm.controls['taxId'].setValue((`XXXXXXXXX${(this.customer.idCardNo.substring(9))}`));
      this.closeModalBillingAddress();
      this.setCustomerInfo({
        customer: this.customer,
        action: TransactionAction.READ_CARD
      });
    } else {
      this.pageLoadingService.openLoading();
      const mobileNo = this.listBillingAccount[billingAddressSelected].mobileNo[0];
      this.customerInfoService.getBillingByMobileNo(mobileNo)
        .then((res: any) => {
          this.billingAddressText = '';
          this.customerInfoService.setSelectedMobileNo(mobileNo);
          this.receiptInfoForm.controls['taxId'].setValue((`XXXXXXXXX${(res.data.billingAddress.idCardNo.substring(9))}`));
          this.closeModalBillingAddress();
          this.customer = res.data.billingAddress;
          this.setCustomerInfo({
            customer: this.customer,
            action: TransactionAction.READ_CARD
          });
          this.pageLoadingService.closeLoading();
        }).catch((err) => {
          this.alertService.error(err.error.resultDescription);
        });
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
      }).catch((err: any) => {
        this.transactionService.remove();
      });
  }

  onBack = () => {
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

  onHome = () => {
    this.homeService.goToHome();
  }

  onNext(): void {
    this.transaction.data.payment = this.paymentDetailTemp.payment;
    this.createOrderService.createAddToCartTrasaction(this.transaction, this.priceOption)
      .then((transaction) => {
        this.transaction = { ...transaction };
        this.transaction.data.device = this.createOrderService.getDevice(this.priceOption);
        this.router.navigate([ROUTE_DEVICE_ONLY_ASP_SELECT_MOBILE_CARE_PAGE]);
      }).catch((error) => {
        this.alertService.error(error);
      });
  }

  onPaymentDetailCompleted(payment: any): void {
    this.paymentDetailTemp = payment;
  }

  onPaymentDetailError(valid: boolean): void {
    this.paymentDetailValid = valid;
  }

  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
  }

}

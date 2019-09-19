import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HomeService, ShoppingCart, PaymentDetail, PaymentDetailBank, ReceiptInfo, Utils, TokenService, PageLoadingService, AlertService, ReadCard, ReadCardService, ReadCardProfile, ReadCardEvent, User } from 'mychannel-shared-libs';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Transaction, Customer, TransactionType, TransactionAction } from 'src/app/shared/models/transaction.model';
import { PriceOptionUtils } from 'src/app/shared/utils/price-option-utils';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { HttpClient } from '@angular/common/http';
import { WIZARD_DEVICE_ODER_AIS_DEVICE } from 'src/app/device-order/constants/wizard.constant';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ROUTE_DEVICE_AIS_DEVICE_EDIT_BILLING_ADDRESS_PAGE, ROUTE_DEVICE_AIS_DEVICE_SUMMARY_PAGE } from 'src/app/device-order/ais/device-order-ais-device/constants/route-path.constant';
import { Subscription, zip } from 'rxjs';
import { BsModalService, BsModalRef, isArray } from 'ngx-bootstrap';
import { BillingAccount } from '../../../device-order-ais-mnp/containers/device-order-ais-mnp-effective-start-date-page/device-order-ais-mnp-effective-start-date-page.component';
import { SharedTransactionService } from 'src/app/shared/services/shared-transaction.service';
import { ROUTE_BUY_PRODUCT_CAMPAIGN_PAGE } from 'src/app/buy-product/constants/route-path.constant';
import { ROUTE_BUY_GADGET_CAMPAIGN_PAGE } from 'src/app/buy-gadget/constants/route-path.constant';
@Component({
  selector: 'app-device-order-ais-device-payment-page',
  templateUrl: './device-order-ais-device-payment-page.component.html',
  styleUrls: ['./device-order-ais-device-payment-page.component.scss']
})
export class DeviceOrderAisDevicePaymentPageComponent implements OnInit, OnDestroy {
  @ViewChild('selectBillAddTemplate')
  selectBillAddTemplate: any;
  modalRef: BsModalRef;

  selectBillingAddressForm: FormGroup;
  selectBillingAddrVal: string;

  shoppingCart: ShoppingCart;
  priceOption: PriceOption;
  transaction: Transaction;
  wizards: string[] = WIZARD_DEVICE_ODER_AIS_DEVICE;
  payementDetail: PaymentDetail;
  banks: PaymentDetailBank[];
  paymentDetailValid: boolean;

  paymentDetailTemp: any;
  receiptInfoTemp: any;
  receiptInfoForm: FormGroup;
  searchByMobileNoForm: FormGroup;
  receiptInfo: ReceiptInfo;
  receiptInfoValid: boolean;
  nameText: string;
  billingAddressText: string;
  idCardCustomerAddress: string;

  readCardSubscription: Subscription;
  readCard: ReadCard;
  customerProfile: ReadCardProfile;
  progressReadCard: number;
  dataReadIdCard: any;
  isReadCardError: boolean;
  billingAddress: string;
  location: string;
  billingAccountList: BillingAccount;
  mobileNo: any;
  cardStatus: string;
  user: User;
  zipCode: string;
  isReadCard: boolean = false;
  REGEX_MOBILE: RegExp = /^(88[0-9]\d{7})|(0[6-9]\d{8})$/;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private utils: Utils,
    private http: HttpClient,
    private tokenService: TokenService,
    private pageLoadingService: PageLoadingService,
    private fb: FormBuilder,
    private alertService: AlertService,
    private readCardService: ReadCardService,
    private modalService: BsModalService,
    private sharedTransactionService: SharedTransactionService,
    private route: ActivatedRoute
  ) {
    this.user = this.tokenService.getUser();
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();
    if (this.transaction && this.transaction.data && this.transaction.data.order && this.transaction.data.order.soId) {
      this.homeService.callback = () => {
        this.alertService.question('ต้องการยกเลิกรายการขายหรือไม่ การยกเลิก ระบบจะคืนสินค้าเข้าสต๊อคสาขาทันที', 'ตกลง', 'ยกเลิก')
          .then((response: any) => {
            if (response.value === true) {
              this.returnStock().then(() => {
                this.transaction.data.order = {};
                this.transactionService.remove();
                window.location.href = '/';
              });
            }
          });
      };
    }
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (!params.ebilling) {
        this.createTransaction();
      }
    });
    this.checkLocation();
    this.createForm();
    this.createSearchByMobileNoForm();
    this.createSelectBillAddForm();
    const productDetail = this.priceOption.productDetail || {};
    const productStock = this.priceOption.productStock || {};
    const customer: any = this.transaction.data && this.transaction.data.customer ? this.transaction.data.customer : {};
    const trade: any = this.priceOption.trade || {};
    const advancePay: any = trade.advancePay || {};
    let commercialName = productDetail.name;
    if (productStock.color) {
      commercialName += ` สี ${productStock.color}`;
    }

    this.payementDetail = {
      commercialName: commercialName,
      promotionPrice: +(trade.promotionPrice || 0),
      isFullPayment: this.isFullPayment(),
      advancePay: +(advancePay.amount || 0),
      qrCode: !!(productStock.company && productStock.company !== 'WDS')
    };

    this.banks = trade.banks || [];

    if (!this.banks.length) {
      // ถ้าไม่มี bank ให้ get bank จาก location ร้าน
      this.http.post(`/api/salesportal/banks-promotion`, {
        location: this.tokenService.getUser().locationCode
      }).toPromise()
        .then((resp: any) => {
          this.banks = resp.data;
          this.priceOption.trade.banks = resp.data;
        });
    }
    this.createReceiptInfo(customer);
    this.checkBillFormChanged();
  }

  createForm(): void {
    const customer: any = this.transaction.data && this.transaction.data.customer ? this.transaction.data.customer : {};
    const telNo = this.transaction.data && this.transaction.data.receiptInfo &&
      this.transaction.data.receiptInfo.telNo ? this.transaction.data.receiptInfo.telNo : '';
    const mobileNo = this.transaction.data && this.transaction.data.simCard &&
      this.transaction.data.simCard.mobileNo ? this.transaction.data.simCard.mobileNo : '';

    this.receiptInfoForm = this.fb.group({
      taxId: ['', []],
      branch: ['', []],
      buyer: ['', []],
      buyerAddress: ['', []],
      telNo: ['', [Validators.pattern(this.REGEX_MOBILE)]]
    });
    this.receiptInfoForm.patchValue({
      taxId: customer.idCardNo || '',
      telNo: telNo || mobileNo || '',
      buyer: `${customer.titleName} ${customer.firstName} ${customer.lastName}` || '',
      buyerAddress: this.utils.getCurrentAddress({
        homeNo: customer.homeNo,
        moo: customer.moo,
        mooBan: customer.mooBan,
        room: customer.room,
        floor: customer.floor,
        buildingName: customer.buildingName,
        soi: customer.soi,
        street: customer.street,
        tumbol: customer.tumbol,
        amphur: customer.amphur,
        province: customer.province,
        zipCode: customer.zipCode,
      }),
    });
  }

  keyPress(event: any): void {
    const charCode: number = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
    }
  }

  checkLocation(): void {
    const user = this.tokenService.getUser();
    this.http.get(`/api/salesportal/location-by-code?code=${user.locationCode}`).toPromise().then((code: any) => {
      const displayName: any = code && code.data && code.data.displayName ? code.data.displayName : {};
      this.receiptInfoForm.controls['branch'].setValue(displayName);
      this.transaction.data.seller = {
        locationCode: user.locationCode,
        locationName: displayName,
      };
    });
  }

  // component payment
  onPaymentCompleted(payment: any): void {
    this.paymentDetailTemp = payment;
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

  onPaymentError(valid: boolean): void {
    this.paymentDetailValid = valid;
  }

  isNext(): boolean {
    return this.paymentDetailValid;
  }

  createReceiptInfo(customer: Customer): void {
    const receiptInfo: any = this.transaction.data && this.transaction.data.receiptInfo ? this.transaction.data.receiptInfo : {};
    this.receiptInfo = {
      taxId: customer.idCardNo,
      branch: '',
      buyer: customer.titleName
        ? `${customer.titleName} ${customer.firstName} ${customer.lastName}` || ''
        : '-',
      buyerAddress: this.utils.getCurrentAddress({
        homeNo: customer.homeNo,
        moo: customer.moo,
        mooBan: customer.mooBan,
        room: customer.room,
        floor: customer.floor,
        buildingName: customer.buildingName,
        soi: customer.soi,
        street: customer.street,
        tumbol: customer.tumbol,
        amphur: customer.amphur,
        province: customer.province,
        zipCode: customer.zipCode,
      }),
      telNo: receiptInfo.telNo || ''
    };
  }

  checkBillFormChanged(): void {
    this.selectBillingAddressForm.valueChanges.subscribe((form: any) => {
      this.selectBillingAddrVal = form.billingAddress;
    });
  }

  createSelectBillAddForm(): void {
    this.selectBillingAddressForm = this.fb.group({
      billingAddress: ['', []]
    });
  }

  createSearchByMobileNoForm(): void {
    this.searchByMobileNoForm = this.fb.group({
      'mobileNo': ['', [Validators.pattern(this.REGEX_MOBILE)]],
    });

    if (this.transaction && this.transaction.data && this.transaction.data.simCard && this.transaction.data.simCard.mobileNo) {
      this.searchByMobileNoForm.patchValue({
        mobileNo: this.transaction.data.simCard.mobileNo,
      });
    }
  }

  searchCustomerInfo(): void {
    if (!this.searchByMobileNoForm.value.mobileNo) {
      this.alertService.warning('กรุณากรอกหมายเลขโทรศัพท์');
      return;
    }
    const mobileNo = this.searchByMobileNoForm.value.mobileNo;
    this.transaction.data.simCard = {
      mobileNo: mobileNo
    };
    this.receiptInfoForm.patchValue({
      telNo: mobileNo,
    });
    this.checkMobileStatus(mobileNo);
  }

  checkMobileStatus(mobileNo: string): Promise<any> {
    this.pageLoadingService.openLoading();
    return this.http.get(`/api/customerportal/${mobileNo}/query-customer-account`).toPromise()
      .then((bill: any) => {
        const billing = bill && bill.data ? bill.data : '';
        if (billing) {
          this.transaction.data.customer = {
            homeNo: billing.houseNumber || '',
            zipCode: billing.portalCode || '',
            province: billing.provinceName || '',
            street: billing.streetName || '',
            amphur: billing.amphur || '',
            buildingName: billing.buildingName || '',
            firstName: billing.firstName || '',
            floor: billing.floor || '',
            idCardNo: billing.idCardNo || '',
            idCardType: billing.idCardType || '',
            lastName: billing.lastName || '',
            moo: billing.moo || '',
            mooBan: billing.mooban || '',
            soi: billing.soi || '',
            titleName: billing.titleName || '',
            tumbol: billing.tumbol || '',
            birthdate: '',
            gender: ''
          };
          this.receiptInfo.buyer = `${billing.titleName} ${billing.firstName} ${billing.lastName}`;
          this.receiptInfo.taxId = billing.idCardNo;
          this.receiptInfo.buyerAddress = this.utils.getCurrentAddress({
            homeNo: billing.houseNumber || '',
            moo: billing.moo || '',
            mooBan: billing.mooban || '',
            room: billing.room,
            floor: billing.floor || '',
            buildingName: billing.buildingName || '',
            soi: billing.soi || '',
            street: billing.streetName || '',
            tumbol: billing.tumbol,
            amphur: billing.amphur || '',
            province: billing.provinceName || '',
            zipCode: billing.portalCode || '',
          });
          this.receiptInfoForm.controls['taxId'].setValue(this.receiptInfo.taxId);
          this.transaction.data.receiptInfo = this.receiptInfo;
          this.transaction.data.action = TransactionAction.SEARCH;
          this.pageLoadingService.closeLoading();
        } else {
          if (this.transaction.data && this.transaction.data.customer) {
            delete this.transaction.data.customer;
          }
          this.pageLoadingService.closeLoading();
          this.router.navigate([ROUTE_DEVICE_AIS_DEVICE_EDIT_BILLING_ADDRESS_PAGE]);
        }
      }).catch((error: any) => {
        if (this.transaction.data && this.transaction.data.customer) {
          delete this.transaction.data.customer;
        }
        this.pageLoadingService.closeLoading();
        this.router.navigate([ROUTE_DEVICE_AIS_DEVICE_EDIT_BILLING_ADDRESS_PAGE]);
      });
  }

  readCardProcess(): void {
    this.isReadCard = true;
    delete this.dataReadIdCard;
    this.readCardSubscription = this.readCardService.onReadCard().subscribe((readCard: ReadCard) => {
      this.readCard = readCard;
      this.progressReadCard = readCard.progress;
      const valid = !!(readCard.progress >= 100 && readCard.profile);
      if (readCard.error) {
        this.customerProfile = null;
      }

      if (readCard.eventName === ReadCardEvent.EVENT_CARD_LOAD_ERROR) {
        this.isReadCardError = valid;
      }

      if (valid && !this.dataReadIdCard) {
        this.customerProfile = readCard.profile;
        this.getAllProvince().then((resp: any) => {
          const data = resp.data;
          let provinces = [];
          provinces = provinces ? data.provinces : [];
          const provinceMap = provinces.find((province: any) => province.name === this.customerProfile.province);
          return this.http.get('/api/customerportal/newRegister/queryZipcode', {
            params: {
              provinceId: provinceMap ? provinceMap.id : '',
              amphurName: this.customerProfile.amphur,
              tumbolName: this.customerProfile.tumbol
            }
          }).toPromise().then((response: any) => {
            this.zipCode = response.data && response.data.zipcodes ? response.data.zipcodes[0] : '';
            this.idCardCustomerAddress = this.getCustomerAddressStr(this.customerProfile, this.zipCode);
            this.dataReadIdCard = this.customerProfile.idCardNo;
            this.http.get(`/api/customerportal/newRegister/${this.dataReadIdCard}/queryBillingAccount`).toPromise()
              .then((resps: any) => {
                const billList = resps.data && resps.data.billingAccountList || {};
                this.billingAccountList = billList.filter((bill: any) => {
                  return bill.mobileNo[0] && bill.mobileNo;
                });
                this.onOpenModal();
              });
          });
        });
      }
    });
  }

  selectBillingAddress(): void {
    if (this.selectBillingAddrVal) {
      const isnum: boolean = /^\d+$/.test(this.selectBillingAddrVal) || false;
      if (isnum) {
        const billingAccount: BillingAccount = this.billingAccountList[this.selectBillingAddrVal] || {};
        this.pageLoadingService.openLoading();
        const mobileNo = billingAccount.mobileNo[0] || '';
        this.http.get(`/api/customerportal/billing/${mobileNo}`).toPromise().then((resp: any) => {
          const data = resp.data;
          const billing = data.billingAddress || {};
          this.transaction.data.customer = {
            homeNo: billing.houseNumber || '',
            zipCode: billing.portalCode || '',
            province: billing.provinceName || '',
            street: billing.streetName || '',
            amphur: billing.amphur || '',
            buildingName: billing.buildingName || '',
            firstName: billing.firstName || '',
            floor: billing.floor || '',
            idCardNo: billing.idCardNo || '',
            idCardType: billing.idCardType || '',
            lastName: billing.lastName || '',
            moo: billing.moo || '',
            mooBan: billing.mooban || '',
            soi: billing.soi || '',
            titleName: billing.titleName || '',
            tumbol: billing.tumbol || '',
            birthdate: '',
            gender: '',
          };
          this.receiptInfo.taxId = billing.baNo || billing.idCardNo;
          this.receiptInfo.buyer = `${billing.titleName} ${billing.firstName} ${billing.lastName}`;
          this.receiptInfo.buyerAddress = this.utils.getCurrentAddress({
            homeNo: billing.houseNumber || '',
            moo: billing.moo || '',
            mooBan: billing.mooban || '',
            room: billing.room,
            floor: billing.floor || '',
            buildingName: billing.buildingName || '',
            soi: billing.soi || '',
            street: billing.streetName || '',
            tumbol: billing.tumbol,
            amphur: billing.amphur || '',
            province: billing.provinceName || '',
            zipCode: billing.portalCode || '',
          });
          this.mobileNo = mobileNo;
          this.transaction.data.action = TransactionAction.READ_CARD;
          this.pageLoadingService.closeLoading();
          this.modalRef.hide();
        }).catch(() => {
          this.modalRef.hide();
          this.alertService.error('ระบบไม่สามารถแสดงข้อมูลได้ในขณะนี้');
        });
      } else {
        this.transaction.data.action = TransactionAction.READ_CARD;
        this.transaction.data.customer = this.customerProfile;
        this.transaction.data.customer.zipCode = this.zipCode;
        this.receiptInfo.taxId = this.customerProfile.idCardNo;
        this.receiptInfo.buyer = `${this.customerProfile.titleName} ${this.customerProfile.firstName} ${this.customerProfile.lastName}`;
        this.receiptInfo.buyerAddress = this.selectBillingAddrVal || '';
        this.modalRef.hide();
      }
    }
  }

  get onReadCardProgress(): boolean {
    return this.readCard ? this.readCard.progress > 0 && this.readCard.progress < 100 : false;
  }

  getCustomerAddressStr(customer: any, zipcode?: string): string {
    return this.utils.getCurrentAddress({
      homeNo: customer.homeNo || '',
      moo: customer.moo || '',
      mooBan: customer.mooBan || '',
      room: customer.room || '',
      floor: customer.floor || '',
      buildingName: customer.buildingName || '',
      soi: customer.soi || '',
      street: customer.street || '',
      tumbol: customer.tumbol || '',
      amphur: customer.amphur || '',
      province: customer.province || '',
      zipCode: customer.zipCode ? customer.zipCode : zipcode
    });
  }

  getAllProvince(): Promise<any> {
    return this.http.get('/api/customerportal/newRegister/getAllProvinces').toPromise();
  }

  editAddress(): void {
    this.router.navigate([ROUTE_DEVICE_AIS_DEVICE_EDIT_BILLING_ADDRESS_PAGE]);
  }

  onNext(): void {
    if (!this.receiptInfoForm.value.telNo) {
      this.alertService.warning('กรุณากรอกหมายเลขโทรศัพท์ติดต่อ');
      return;
    }

    if (!this.transaction.data.simCard) {
      this.transaction.data = {
        ...this.transaction.data,
        simCard: {
          mobileNo: this.receiptInfoForm.value.telNo
        }
      };
    }
    if (!this.transaction.data.action) {
    }
    this.pageLoadingService.openLoading();
    this.transaction.data.payment = this.paymentDetailTemp.payment;
    this.transaction.data.advancePayment = this.paymentDetailTemp.advancePayment;
    this.transaction.data.receiptInfo = this.receiptInfo;
    this.transaction.data.receiptInfo.telNo = this.receiptInfoForm.value.telNo;
    this.returnStock().then(() => {
      this.addDeviceSellingCart(this.transaction);
    });
  }

  addDeviceSellingCart(transaction: Transaction): void {
    this.http.post('/api/salesportal/add-device-selling-cart',
      this.getRequestAddDeviceSellingCart()
    ).toPromise()
      .then((resp: any) => {
        this.transaction.data.order = { soId: resp.data.soId };
        return this.sharedTransactionService.createSharedTransaction(this.transaction, this.priceOption);
      }).then(() => {
        this.router.navigate([ROUTE_DEVICE_AIS_DEVICE_SUMMARY_PAGE]);
      }).catch((error) => this.alertService.error(error));
  }

  getRequestAddDeviceSellingCart(): any {
    const productStock = this.priceOption.productStock;
    const productDetail = this.priceOption.productDetail;
    const customer = this.transaction.data.customer;
    return {
      soCompany: productStock.company || 'AWN',
      locationSource: this.user.locationCode,
      locationReceipt: this.user.locationCode,
      productType: productStock.productType || 'N/A',
      productSubType: productStock.productSubType || 'GADGET/IOT',
      brand: productStock.brand || productDetail.brand,
      model: productStock.model || productDetail.model,
      color: productStock.color || productStock.colorName,
      priceIncAmt: '',
      priceDiscountAmt: '',
      grandTotalAmt: '',
      userId: this.user.username,
      cusNameOrder: `${customer.firstName || ''} ${customer.lastName || ''}`.trim(),
      preBookingNo: '',
      depositAmt: '',
      reserveNo: ''
    };
  }

  onBack(): void {
    if (this.transaction && this.transaction.data && this.transaction.data.order && this.transaction.data.order.soId) {
      this.alertService.question('ต้องการยกเลิกรายการขายหรือไม่ การยกเลิก ระบบจะคืนสินค้าเข้าสต๊อคสาขาทันที', 'ตกลง', 'ยกเลิก')
        .then((response: any) => {
          if (response.value === true) {
            this.returnStock().then(() => {
              this.transaction.data.order = {};
              this.transactionService.remove();
              this.router.navigate([ROUTE_BUY_GADGET_CAMPAIGN_PAGE], { queryParams: this.priceOption.queryParams });
            });
          }
        });
    } else {
      this.transactionService.remove();
      this.router.navigate([ROUTE_BUY_GADGET_CAMPAIGN_PAGE], { queryParams: this.priceOption.queryParams });
    }
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onOpenModal(): void {
    this.modalRef = this.modalService.show(this.selectBillAddTemplate, { class: 'pt-5 mt-5' });
  }

  closeModalSelectAddress(): void {
    this.modalRef.hide();
  }

  returnStock(): Promise<void> {
    return new Promise(resolve => {
      const transaction = this.transactionService.load();
      const promiseAll = [];
      if (transaction && transaction.data) {
        if (transaction.data.order && transaction.data.order.soId) {
          const order = this.http.post('/api/salesportal/device-sell/item/clear-temp-stock', {
            location: this.priceOption.productStock.location,
            soId: transaction.data.order.soId,
            transactionId: transaction.transactionId
          }).toPromise().catch(() => Promise.resolve());
          promiseAll.push(order);
        }
      }
      Promise.all(promiseAll).then(() => resolve());
    });
  }

  ngOnDestroy(): void {
    if (this.readCardSubscription) {
      this.readCardSubscription.unsubscribe();
    }
    this.priceOptionService.update(this.priceOption);
    this.transactionService.save(this.transaction);
  }

  createTransaction(): void {
    this.transaction = {
      data: {
        transactionType: TransactionType.DEVICE_ONLY_AIS,
        action: TransactionAction.KEY_IN
      }
    };
  }

}

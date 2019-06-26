import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, ShoppingCart, PaymentDetail, PaymentDetailBank, ReceiptInfo, Utils, TokenService, PageLoadingService, REGEX_MOBILE, AlertService, ReadCard, ReadCardService, ReadCardProfile, ReadCardEvent } from 'mychannel-shared-libs';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { PriceOptionUtils } from 'src/app/shared/utils/price-option-utils';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { HttpClient } from '@angular/common/http';
import { WIZARD_DEVICE_ODER_AIS_DEVICE } from 'src/app/device-order/constants/wizard.constant';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ROUTE_DEVICE_AIS_DEVICE_EDIT_BILLING_ADDRESS_PAGE, ROUTE_DEVICE_AIS_DEVICE_SUMMARY_PAGE } from 'src/app/device-order/ais/device-order-ais-device/constants/route-path.constant';
import { Subscription } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
@Component({
  selector: 'app-device-order-ais-device-payment-page',
  templateUrl: './device-order-ais-device-payment-page.component.html',
  styleUrls: ['./device-order-ais-device-payment-page.component.scss']
})
export class DeviceOrderAisDevicePaymentPageComponent implements OnInit, OnDestroy {
  @ViewChild('detailTemplate')
  detailTemplate: any;
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
  keyInCustomerAddressTemp: any;

  readCardSubscription: Subscription;
  readCard: ReadCard;
  profile: ReadCardProfile;
  progressReadCard: number;
  dataReadIdCard: any;
  isReadCardError: boolean;
  billingAddress: string;
  modalRef: BsModalRef;
  location: string;

  cardStatus: string;
  constructor(
    private router: Router,
    private homeService: HomeService,
    private shoppingCartService: ShoppingCartService,
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
  ) {
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    // this.shoppingCart = this.shoppingCartService.getShoppingCartData();

    const productDetail = this.priceOption.productDetail || {};
    const productStock = this.priceOption.productStock || {};
    const customer: any = this.transaction.data.customer || {};
    const receiptInfo: any = this.transaction.data.receiptInfo || {};
    this.createForm();
    this.createSearchByMobileNoForm();
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
    };

    this.banks = trade.banks || [];

    if (!this.banks.length) {
      // ถ้าไม่มี bank ให้ get bank จาก location ร้าน
      this.pageLoadingService.openLoading();
      this.http.post(`/api/salesportal/banks-promotion`, {
        location: this.tokenService.getUser().locationCode
      }).toPromise()
        .then((resp: any) => {
          this.pageLoadingService.closeLoading();
          this.banks = resp.data;
          this.priceOption.trade.banks = resp.data;
        })
        .catch(() => {
          this.pageLoadingService.closeLoading();
        })
        ;
    }
    this.receiptInfo = {
      taxId: customer.idCardNo,
      branch: '',
      buyer: `${customer.titleName} ${customer.firstName} ${customer.lastName}`,
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
      telNo: receiptInfo.telNo
    };
    console.log('this.receiptInfo', this.receiptInfo.buyerAddress);

  }
  createForm(): void {
    const customer: any = this.transaction.data.customer || {};
    this.receiptInfoForm = this.fb.group({
      taxId: ['', []],
      branch: ['', []],
      buyer: ['', []],
      buyerAddress: ['', []],
      telNo: ['', [Validators.pattern(REGEX_MOBILE)]]
    });
  }
  createSearchByMobileNoForm(): void {
    this.searchByMobileNoForm = this.fb.group({
      'mobileNo': ['', Validators.compose([Validators.required, Validators.maxLength(10)])],
    });
  }

  searchCustomerInfo(): void {
    console.log('this.searchByMobileNoForm.valid', this.searchByMobileNoForm.valid);
    if (this.searchByMobileNoForm.valid) {
      // this.pageLoadingService.openLoading();
      const mobileNo = this.searchByMobileNoForm.value.mobileNo;
      if (/88[0-9]{8}/.test(mobileNo)) {
        this.checkMobileFbb(mobileNo);
      }
      this.checkMobileStatus(mobileNo);
      this.checkLocation();
    } else {
      this.alertService.notify({
        type: 'warning',
        confirmButtonText: 'OK',
        showConfirmButton: true,
        text: 'กรุณาระบุเบอร์ให้ครบ 10 หลัก'
      });
      this.nameText = '';
      this.billingAddressText = '';
      this.receiptInfoForm.controls['taxId'].setValue('');
      this.receiptInfoForm.controls['branch'].setValue('');
    }
  }
  checkMobileFbb(mobileNo: string): void {
    this.http.post(`/api/newRegister/queryFBBinfo`, {
      inOption: '3',
      inMobileNo: mobileNo,
    }).toPromise()
      .then((response: any) => {
        console.log('response', response);
      });
  }
  checkMobileStatus(mobileNo: string): Promise<any> {
    this.pageLoadingService.openLoading();
    return this.http.get(`/api/customerportal/asset/${mobileNo}/profile`).toPromise()
      .then((res: any) => {
        const mobileStatus = res && res.data && res.data.mobileStatus ? res.data.mobileStatus : {};
        console.log('mobileStatus', mobileStatus);
        if (mobileStatus === 'Active') {
          return this.http.get(`/api/customerportal/billing/${mobileNo}`).toPromise().then((bill: any) => {
            const billing = bill && bill.data && bill.data.billingAddress ? bill.data.billingAddress : {};
            console.log('billing', billing);
            this.transaction.data.customer = billing;
            console.log('customer', this.transaction.data.customer);
          });
        }
      }).then(() => {
        this.transactionService.update(this.transaction);
        this.pageLoadingService.closeLoading();
      });
  }
  checkLocation(): void {
    const user = this.tokenService.getUser();
    this.http.get(`/api/salesportal/location-by-code?code=${user.locationCode}`).toPromise().then((code: any) => {
      const displayName: any = code && code.data && code.data.displayName ? code.data.displayName : {};
      this.receiptInfoForm.controls['branch'].setValue(displayName);
    });
  }
  readCardProcess(): void {
    delete this.dataReadIdCard;
    this.readCardSubscription = this.readCardService.onReadCard().subscribe((readCard: ReadCard) => {
      this.readCard = readCard;
      this.progressReadCard = readCard.progress;
      const valid = !!(readCard.progress >= 100 && readCard.profile);
      if (readCard.error) {
        this.profile = null;
      }

      if (readCard.eventName === ReadCardEvent.EVENT_CARD_LOAD_ERROR) {
        this.isReadCardError = valid;
      }

      if (valid && !this.dataReadIdCard) {
        this.profile = readCard.profile;
        this.dataReadIdCard = readCard.profile.idCardNo;
        this.http.get(`/api/customerportal/newRegister/${this.dataReadIdCard}/queryBillingAccount`).toPromise()
          .then((resp: any) => {
            const data = resp.data && resp.data.billingAccountList || {};
            const billingAccountList = data.filter((billing: any) => {
              return billing.mobileNo && billing.mobileNo[0];
            });
            console.log('billingAccountList', billingAccountList);
          });
      }

    });
  }

  onPaymentCompleted(payment: any): void {
    this.paymentDetailTemp = payment;
  }

  onPaymentError(valid: boolean): void {
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

  isNext(): boolean {
    return this.paymentDetailValid;
  }
  editAddress(): void {
    this.router.navigate([ROUTE_DEVICE_AIS_DEVICE_EDIT_BILLING_ADDRESS_PAGE]);
  }

  onNext(): void {
    this.transaction.data.payment = this.paymentDetailTemp.payment;
    this.transaction.data.advancePayment = this.paymentDetailTemp.advancePayment;
    this.transaction.data.receiptInfo = this.receiptInfoTemp;
    this.router.navigate([ROUTE_DEVICE_AIS_DEVICE_SUMMARY_PAGE]);
  }

  onBack(): void {
    // this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_CUSTOMER_INFO_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onOpenModal(detail: string): void {
    this.detailTemplate = detail || '';
    this.modalRef = this.modalService.show(this.detailTemplate, {
      class: 'pt-5 mt-5'
    });
  }
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy(): void {
    if (this.readCardSubscription) {
      this.readCardSubscription.unsubscribe();
    }
    this.priceOptionService.update(this.priceOption);
    this.transactionService.update(this.transaction);
  }
}

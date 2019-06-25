import { Component, OnInit, OnDestroy } from '@angular/core';
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
@Component({
  selector: 'app-device-order-ais-device-payment-page',
  templateUrl: './device-order-ais-device-payment-page.component.html',
  styleUrls: ['./device-order-ais-device-payment-page.component.scss']
})
export class DeviceOrderAisDevicePaymentPageComponent implements OnInit, OnDestroy {
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
    private readCardService: ReadCardService
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
    // const trade: any = this.priceOption.trade || {};
    // const advancePay: any = trade.advancePay || {};

    let commercialName = productDetail.name;
    if (productStock.color) {
      commercialName += ` สี ${productStock.color}`;
    }

    // this.payementDetail = {
    //   commercialName: commercialName,
    //   promotionPrice: +(trade.promotionPrice || 0),
    //   isFullPayment: this.isFullPayment(),
    //   installmentFlag: advancePay.installmentFlag === 'N' && +(advancePay.amount || 0) > 0,
    //   advancePay: +(advancePay.amount || 0),
    // };

    // this.banks = trade.banks || [];

    // if (!this.banks.length) {
    //   // ถ้าไม่มี bank ให้ get bank จาก location ร้าน
    //   this.pageLoadingService.openLoading();
    //   this.http.post(`/api/salesportal/banks-promotion`, {
    //     location: this.tokenService.getUser().locationCode
    //   }).toPromise()
    //     .then((resp: any) => {
    //       this.pageLoadingService.closeLoading();
    //       this.banks = resp.data;
    //       this.priceOption.trade.banks = resp.data;
    //     })
    //     .catch(() => {
    //       this.pageLoadingService.closeLoading();
    //     })
    //     ;
    // }
    // this.receiptInfo = {
    //   taxId: customer.idCardNo,
    //   branch: '',
    //   buyer: `${customer.titleName} ${customer.firstName} ${customer.lastName}`,
    //   buyerAddress: this.utils.getCurrentAddress({
    //     homeNo: customer.homeNo,
    //     moo: customer.moo,
    //     mooBan: customer.mooBan,
    //     room: customer.room,
    //     floor: customer.floor,
    //     buildingName: customer.buildingName,
    //     soi: customer.soi,
    //     street: customer.street,
    //     tumbol: customer.tumbol,
    //     amphur: customer.amphur,
    //     province: customer.province,
    //     zipCode: customer.zipCode,
    //   }),
    //   telNo: receiptInfo.telNo
    // };

  }
  createForm(): void {
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
      'mobileNo': ['', Validators.compose([Validators.required, Validators.pattern(REGEX_MOBILE)])],
    });
  }

  searchCustomerInfo(): void {
    console.log('this.searchByMobileNoForm.valid', this.searchByMobileNoForm.value.mobileNo);
    if (this.searchByMobileNoForm.valid) {
      // this.pageLoadingService.openLoading();
      const mobileNo = this.searchByMobileNoForm.value.mobileNo;
      this.checkChargeType(mobileNo);
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
  checkChargeType(mobileNo: string): void {
    this.http.get(`/api/customerportal/asset/${mobileNo}/profile`).toPromise()
      .then((resp: any) => {
        const chargeType: string = resp.data.chargeType;
        console.log('resp', chargeType);
      }).catch(() => {

      });

    // this.customerInfoService.getProfileByMobileNo(mobileNo)
    //   .then((resp) => {
    //     const chargeType: string = resp.data.chargeType;
    //     switch (chargeType) {
    //       case 'Pre-paid':
    //         this.alertService.warning('กรุณาระบุเบอร์ AIS รายเดือนเท่านั้น');
    //         this.searchByMobileNoForm.controls['mobileNo'].setValue('');
    //         this.action.emit(TransactionAction.KEY_IN);
    //         break;
    //       case 'Post-paid':
    //         this.customerInfoService.getBillingByMobileNo(mobileNo)
    //           .then((res: any) => {
    //             if (res && res.data && res.data.billingAddress) {
    //               this.setCustomerInfo({
    //                 customer: this.customerInfoService.mapAttributeFromGetBill(res.data.billingAddress),
    //                 action: TransactionAction.KEY_IN
    //               });
    //               this.customerInfoService.setSelectedMobileNo(mobileNo);
    //               this.pageLoadingService.closeLoading();
    //             } else {
    //               this.errorNotAisMobileNo();
    //             }
    //           })
    //           .catch(() => {
    //             this.pageLoadingService.closeLoading();
    //             this.errorNotAisMobileNo();
    //             this.clearData();
    //           });
    //         break;
    //     }
    //   })
    //   .catch(() => {
    //     this.pageLoadingService.closeLoading();
    //     this.errorNotAisMobileNo();
    //     this.clearData();
    //   });
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
        this.dataReadIdCard = readCard.profile;
        console.log('this.dataReadIdCard', this.dataReadIdCard);
        alert(JSON.stringify(this.dataReadIdCard));
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

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy(): void {
    if (this.readCardSubscription) {
      this.readCardSubscription.unsubscribe();
    }
    this.priceOptionService.update(this.priceOption);
    this.transactionService.update(this.transaction);
  }
}

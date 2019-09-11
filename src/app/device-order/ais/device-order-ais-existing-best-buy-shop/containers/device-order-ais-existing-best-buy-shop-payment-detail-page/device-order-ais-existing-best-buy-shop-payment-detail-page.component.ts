import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { ShoppingCart, PaymentDetail, PaymentDetailBank, ReceiptInfo, User, HomeService, Utils, TokenService, PageLoadingService } from 'mychannel-shared-libs';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Transaction, TransactionAction, ExistingMobileCare } from 'src/app/shared/models/transaction.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOptionUtils } from 'src/app/shared/utils/price-option-utils';
import { ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_VALIDATE_CUSTOMER_REPI_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_MOBILE_DETAIL_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_MOBILE_CARE_AVAILABLE_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_MOBILE_CARE_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-existing-best-buy-shop-payment-detail-page',
  templateUrl: './device-order-ais-existing-best-buy-shop-payment-detail-page.component.html',
  styleUrls: ['./device-order-ais-existing-best-buy-shop-payment-detail-page.component.scss']
})
export class DeviceOrderAisExistingBestBuyShopPaymentDetailPageComponent implements OnInit, OnDestroy {

  wizards: any = WIZARD_DEVICE_ORDER_AIS;

  shoppingCart: ShoppingCart;
  priceOption: PriceOption;
  transaction: Transaction;

  payementDetail: PaymentDetail;
  banks: PaymentDetailBank[];
  paymentDetailValid: boolean;

  receiptInfo: ReceiptInfo;
  receiptInfoValid: boolean;

  paymentDetailTemp: any;
  receiptInfoTemp: any;
  depositOrDiscount: boolean;
  user: User;

  discountForm: FormGroup;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private utils: Utils,
    private http: HttpClient,
    private tokenService: TokenService,
    private transactionService: TransactionService,
    private shoppingCartService: ShoppingCartService,
    private priceOptionService: PriceOptionService,
    private pageLoadingService: PageLoadingService,
    private fb: FormBuilder
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.user = this.tokenService.getUser();
  }

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    const paymentMethod = this.priceOption.trade.payment ? this.priceOption.trade.payment.method : '';

    this.depositOrDiscount = this.transaction.data.preBooking
      && this.transaction.data.preBooking.depositAmt
      && this.transaction.data.preBooking.preBookingNo ? true : false;

    const showQRCode: boolean = paymentMethod !== 'CC' && this.user.userType !== 'ASP'
      && this.user.channelType !== 'sff-web' && this.priceOption.productStock.company === 'AWN';

    const productDetail = this.priceOption.productDetail || {};
    const productStock = this.priceOption.productStock || {};
    const customer: any = this.transaction.data.customer || {};
    const receiptInfo: any = this.transaction.data.receiptInfo || {};

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
      installmentFlag: advancePay.installmentFlag === 'N' && +(advancePay.amount || 0) > 0,
      advancePay: +(advancePay.amount || 0),
      qrCode: showQRCode
    };

    if (trade.banks && trade.banks.length > 0) {
      if (!this.isFullPayment()) {
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
      } else {
        this.banks = trade.banks;
      }
    } else {
      this.http.post('/api/salesportal/banks-promotion', {
        location: this.tokenService.getUser().locationCode
      }).toPromise().then((resp: any) => {
        this.banks = resp.data || [];
      });
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

    if (this.depositOrDiscount) {
      this.createForm();
    }
  }

  onPaymentCompleted(payment: any): void {
    this.paymentDetailTemp = payment;
  }

  onPaymentError(valid: boolean): void {
    this.paymentDetailValid = valid;
  }

  onReceiptInfoCompleted(receiptInfo: ReceiptInfo): void {
    this.receiptInfoTemp = receiptInfo;
  }

  onReceiptInfoError(valid: boolean): void {
    this.receiptInfoValid = valid;
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

  onHome(): void {
    this.homeService.goToHome();
  }

  onBack(): void {
    const repi = this.transaction.data.customer.repi;
    if (repi) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_VALIDATE_CUSTOMER_REPI_PAGE]);
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_MOBILE_DETAIL_PAGE]);
    }
  }

  isNext(): boolean {
    return this.paymentDetailValid;
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    const action = this.transaction.data.action;
    this.transaction.data.payment = this.paymentDetailTemp.payment;
    this.transaction.data.advancePayment = this.paymentDetailTemp.advancePayment;
    this.transaction.data.receiptInfo = this.receiptInfoTemp;
    const mobileNo = this.transaction.data.simCard.mobileNo;
    if (TransactionAction.KEY_IN_REPI === action || TransactionAction.KEY_IN === action) {
      this.transaction.data.action = TransactionAction.KEY_IN;
    } else {
      this.transaction.data.action = TransactionAction.READ_CARD;
    }

    this.http.get(`/api/customerportal/get-existing-mobile-care/${mobileNo}`).toPromise().then((response: any) => {
      const exMobileCare = response.data;
      if (exMobileCare.hasExistingMobileCare) {
        const existingMobileCare: ExistingMobileCare = exMobileCare.existMobileCarePackage;
        existingMobileCare.handSet = exMobileCare.existHandSet;
        this.transaction.data.existingMobileCare = existingMobileCare;
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_MOBILE_CARE_AVAILABLE_PAGE]);
      } else {
        this.transaction.data.existingMobileCare = null;
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_MOBILE_CARE_PAGE]);
      }
    }).then(() => this.pageLoadingService.closeLoading());
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

  createForm(): void {
    this.discountForm = this.fb.group({
      discountType: [null, Validators.required]
    });

    if (this.transaction.data.preBooking && this.transaction.data.preBooking.depositAmt) {
      this.discountForm.controls['discountType'].setValue('preBooking');
    }

    this.discountForm.valueChanges.subscribe(observer => {
      this.transaction.data.discount = { type: observer.paymentType };
    });
  }

  summary(amount: number[]): number {
    return amount.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
  }

}

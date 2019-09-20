import { Component, OnInit, OnDestroy } from '@angular/core';
import { ShoppingCart, PaymentDetail, PaymentDetailBank, TokenService, Utils, HomeService, ReceiptInfo, CustomerService } from 'mychannel-shared-libs';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { TranslateService } from '@ngx-translate/core';
import { PriceOptionUtils } from 'src/app/shared/utils/price-option-utils';
import { HttpClient } from '@angular/common/http';
import { Transaction, TransactionAction, Customer } from 'src/app/shared/models/transaction.model';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import {
  ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_CUSTOMER_INFO_PAGE,
  ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_VALIDATE_CUSTOMER_ID_CARD_PAGE,
  ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_VALIDATE_CUSTOMER_PAGE
} from '../../constants/route-path.constant';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';

@Component({
  selector: 'app-new-register-mnp-payment-detail-page',
  templateUrl: './new-register-mnp-payment-detail-page.component.html',
  styleUrls: ['./new-register-mnp-payment-detail-page.component.scss']
})
export class NewRegisterMnpPaymentDetailPageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;
  shoppingCart: ShoppingCart;
  priceOption: PriceOption;
  paymentDetail: PaymentDetail;
  banks: PaymentDetailBank[];
  transaction: Transaction;
  receiptInfo: ReceiptInfo;
  receiptInfoValid: boolean;
  paymentDetailValid: boolean;
  paymentDetailTemp: any;
  receiptInfoTemp: any;
  customer: Customer;

  constructor(
    private http: HttpClient,
    private utils: Utils,
    private router: Router,
    private homeService: HomeService,
    private tokenService: TokenService,
    private transactionService: TransactionService,
    private shoppingCartService: ShoppingCartService,
    private priceOptionService: PriceOptionService,
    private translateService: TranslateService
  ) {
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();
  }
  ngOnInit(): void {

    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    const productDetail = this.priceOption.productDetail || {};
    const productStock = this.priceOption.productStock || {};
    const trade: any = this.priceOption.trade || {};
    const advancePay: any = trade.advancePay || {};
    const customer: any = this.transaction.data.customer || {};
    const receiptInfo: any = this.transaction.data.receiptInfo || {};

    let commercialName = productDetail.name;
    if (productStock.color) {
      commercialName += ` ${this.translateService.instant('สี')} ${productStock.color}`;
    }

    this.paymentDetail = {
      commercialName: commercialName,
      promotionPrice: +(trade.promotionPrice || 0),
      isFullPayment: this.isFullPayment(),
      installmentFlag: advancePay.installmentFlag === 'N' && +(advancePay.amount || 0) > 0,
      advancePay: +(advancePay.amount || 0),
      qrCode: !!(productStock.company && productStock.company !== 'WDS')
    };

    if (trade.banks && trade.banks.length > 0) {
      this.banks = trade.banks;
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

  onBack(): void {
    if (TransactionAction.KEY_IN === this.transaction.data.action) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_VALIDATE_CUSTOMER_PAGE]);
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_VALIDATE_CUSTOMER_ID_CARD_PAGE]);
    }
  }

  isNext(): boolean {
    return this.paymentDetailValid && this.receiptInfoValid;
  }

  onNext(): void {
    this.transaction.data.payment = this.paymentDetailTemp.payment;
    this.transaction.data.advancePayment = this.paymentDetailTemp.advancePayment;
    this.transaction.data.receiptInfo = this.receiptInfoTemp;

    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_CUSTOMER_INFO_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}

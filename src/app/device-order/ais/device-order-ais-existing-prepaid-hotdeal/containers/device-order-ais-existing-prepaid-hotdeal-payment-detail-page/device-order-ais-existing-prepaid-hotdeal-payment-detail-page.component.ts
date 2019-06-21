import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, ShoppingCart, PaymentDetail, PaymentDetailBank, ReceiptInfo, Utils, TokenService, PageLoadingService } from 'mychannel-shared-libs';
import { ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_SELECT_PACKAGE_PAGE, ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_CUSTOMER_INFO_PAGE } from '../../constants/route-path.constant';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { PriceOptionUtils } from 'src/app/shared/utils/price-option-utils';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-device-order-ais-existing-prepaid-hotdeal-payment-detail-page',
  templateUrl: './device-order-ais-existing-prepaid-hotdeal-payment-detail-page.component.html',
  styleUrls: ['./device-order-ais-existing-prepaid-hotdeal-payment-detail-page.component.scss']
})
export class DeviceOrderAisExistingPrepaidHotdealPaymentDetailPageComponent implements OnInit {

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;
  shoppingCart: ShoppingCart;
  priceOption: PriceOption;
  transaction: Transaction;

  paymentDetail: PaymentDetail;
  banks: PaymentDetailBank[];
  paymentDetailValid: boolean;

  paymentDetailTemp: any;
  receiptInfoTemp: any;
  translateSubscription: Subscription;

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
    private translateService: TranslateService
  ) {
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();

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

    this.paymentDetail = this.mappingPaymentDetail(productDetail, productStock, trade, advancePay);

    this.banks = trade.banks || [];

    if (!this.banks.length) {
      // ถ้าไม่มี bank ให้ get bank จาก location ร้าน
      this.pageLoadingService.openLoading();
      this.http.post(`/api/salesportal/banks-promotion`, {
        location:  this.tokenService.getUser().locationCode
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

    this.translateSubscription = this.translateService.onLangChange.subscribe(onChange => {
      this.paymentDetail.commercialName = this.changeCommercialName(onChange.lang, productDetail.name, productStock.color);
    });

  }

  mappingPaymentDetail(productDetail: any, productStock: any, trade: any, advancePay: any): PaymentDetail {
    return {
      commercialName:  this.changeCommercialName((this.translateService.currentLang || 'TH'), productDetail.name, productStock.color),
      promotionPrice: +(trade.promotionPrice || 0),
      isFullPayment: this.isFullPayment(),
      installmentFlag: advancePay.installmentFlag === 'N' && +(advancePay.amount || 0) > 0,
      advancePay: +(advancePay.amount || 0),
      qrCode: true
    };
  }

  changeCommercialName(language: string, name: string, color: string): string {
    return (!color) ? name : (language === 'TH') ? `${name} สี ${color}` : `${name} Color: ${color}`;
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

  onNext(): void {
    this.transaction.data.payment = this.paymentDetailTemp.payment;
    this.transaction.data.advancePayment = this.paymentDetailTemp.advancePayment;
    this.transaction.data.receiptInfo = this.receiptInfoTemp;
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_SELECT_PACKAGE_PAGE]);
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_CUSTOMER_INFO_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy(): void {
    if (this.translateSubscription) {
      this.translateSubscription.unsubscribe();
    }
    this.priceOptionService.update(this.priceOption);
    this.transactionService.update(this.transaction);
  }

}

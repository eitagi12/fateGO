import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, Utils, ShoppingCart, PaymentDetail, PaymentDetailBank } from 'mychannel-shared-libs';
import { ROUTE_DEVICE_ORDER_AIS_EXISTING_MOBILE_DETAIL_PAGE, ROUTE_DEVICE_ORDER_AIS_EXISTING_SELECT_PACKAGE_PAGE } from '../../constants/route-path.constant';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { ReceiptInfo } from 'mychannel-shared-libs/lib/component/receipt-info/receipt-info.component';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { PriceOptionUtils } from 'src/app/shared/utils/price-option-utils';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-device-order-ais-existing-payment-detail-page',
  templateUrl: './device-order-ais-existing-payment-detail-page.component.html',
  styleUrls: ['./device-order-ais-existing-payment-detail-page.component.scss']
})
export class DeviceOrderAisExistingPaymentDetailPageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;

  shoppingCart: ShoppingCart;
  priceOption: PriceOption;
  transaction: Transaction;

  paymentDetail: PaymentDetail;
  banks: PaymentDetailBank[];
  paymentDetailValid: boolean;

  receiptInfo: ReceiptInfo;
  receiptInfoValid: boolean;

  paymentDetailTemp: any;
  receiptInfoTemp: any;

  constructor(
    private utils: Utils,
    private router: Router,
    private homeService: HomeService,
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
    const customer: any = this.transaction.data.customer || {};
    const receiptInfo: any = this.transaction.data.receiptInfo || {};

    const trade: any = this.priceOption.trade || {};
    const advancePay: any = trade.advancePay || {};

    this.paymentDetail = this.mappingPaymentDetail(productDetail, productStock, trade, advancePay);
    this.banks = trade.banks || [];
    this.receiptInfo = this.mappingReceiptInfo(customer, receiptInfo);

    this.translateService.onLangChange.subscribe(onChange => {
      this.paymentDetail.commercialName = this.changeCommercialName(onChange.lang, productDetail.name, productStock.color);
    });

  }

  changeCommercialName(language: string, name: string, color: string): string {
    return (!color) ? name : (language === 'TH') ? `${name} สี ${color}` : `${name} Color: ${color}`;
  }

  mappingReceiptInfo(customer: any, receiptInfo: any): ReceiptInfo {
    return {
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

  mappingPaymentDetail(productDetail: any, productStock: any, trade: any, advancePay: any): PaymentDetail {
    return {
      commercialName: this.changeCommercialName((this.translateService.currentLang || 'TH'), productDetail.name, productStock.color),
      promotionPrice: +(trade.promotionPrice || 0),
      isFullPayment: this.isFullPayment(),
      installmentFlag: advancePay.installmentFlag === 'N' && +(advancePay.amount || 0) > 0,
      advancePay: +(advancePay.amount || 0),
      qrCode: true
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

  isNext(): boolean {
    return this.paymentDetailValid && this.receiptInfoValid;
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_MOBILE_DETAIL_PAGE]);
  }

  onNext(): void {
    this.transaction.data.payment = this.paymentDetailTemp.payment;
    this.transaction.data.advancePayment = this.paymentDetailTemp.advancePayment;
    this.transaction.data.receiptInfo = this.receiptInfoTemp;

    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_SELECT_PACKAGE_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

}

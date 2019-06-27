import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, Utils, TokenService, PageLoadingService, User, ShoppingCart, PaymentDetail, PaymentDetailBank, ReceiptInfo } from 'mychannel-shared-libs';
import { HttpClient } from '@angular/common/http';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { FormBuilder } from '@angular/forms';
import { Transaction, TransactionAction } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { PriceOptionUtils } from 'src/app/shared/utils/price-option-utils';
import { ROUTE_DEVICE_ORDER_AIS_GADGET_ELIGIBLE_MOBILE_PAGE, ROUTE_DEVICE_ORDER_AIS_GADGET_SUMMARY_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-existing-gadget-payment-detail-page',
  templateUrl: './device-order-ais-existing-gadget-payment-detail-page.component.html',
  styleUrls: ['./device-order-ais-existing-gadget-payment-detail-page.component.scss']
})

export class DeviceOrderAisExistingGadgetPaymentDetailPageComponent implements OnInit, OnDestroy {

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
      advancePay: +(advancePay.amount || 0)
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
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_GADGET_ELIGIBLE_MOBILE_PAGE]);
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

    if (TransactionAction.KEY_IN === action) {
      this.transaction.data.action = TransactionAction.KEY_IN;
    } else {
      this.transaction.data.action = TransactionAction.READ_CARD;
    }
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_GADGET_SUMMARY_PAGE]);
    this.pageLoadingService.closeLoading();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

  summary(amount: number[]): number {
    return amount.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
  }

}

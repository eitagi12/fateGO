import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

import { WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN } from 'src/app/device-order/constants/wizard.constant';
import { ShoppingCart, ReceiptInfo, Utils, HomeService, PaymentDetail, PaymentDetailBank, TokenService, User } from 'mychannel-shared-libs';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOptionUtils } from 'src/app/shared/utils/price-option-utils';
import {ROUTE_DEVICE_ORDER_ASP_SHARE_PLAN_NEW_REGISTER_MNP_CUSTOMER_INFO_PAGE, ROUTE_DEVICE_ORDER_ASP_SHARE_PLAN_NEW_REGISTER_MNP_VALIDATE_CUSTOMER_PAGE
} from '../../constants/route-path.constant';
import { BanksPromotionService } from 'src/app/device-order/services/banks-promotion.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { RemoveCartService } from '../../services/remove-cart.service';

@Component({
  selector: 'app-new-register-mnp-payment-detail-page',
  templateUrl: './new-register-mnp-payment-detail-page.component.html',
  styleUrls: ['./new-register-mnp-payment-detail-page.component.scss']
})
export class NewRegisterMnpPaymentDetailPageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN;

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
  user: User;

  constructor(
    private http: HttpClient,
    private utils: Utils,
    private router: Router,
    private homeService: HomeService,
    private tokenService: TokenService,
    private transactionService: TransactionService,
    private shoppingCartService: ShoppingCartService,
    private priceOptionService: PriceOptionService,
    private translateService: TranslateService,
    private banksPromotionService: BanksPromotionService,
    private removeCartService: RemoveCartService
  ) {
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();
    this.user = this.tokenService.getUser();
  }

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.getShoppingCartDataSuperKhum();
    const paymentMethod = this.priceOption.trade.payment ? this.priceOption.trade.payment.method : '';
    const productDetail = this.priceOption.productDetail || {};
    const productStock = this.priceOption.productStock || {};
    const customer: any = this.transaction.data.customer || {};
    const receiptInfo: any = this.transaction.data.receiptInfo || {};
    const showQRCode: boolean = paymentMethod !== 'CC' && this.user.userType !== 'ASP'
      && this.user.channelType !== 'sff-web' && this.priceOption.productStock.company !== 'AWN';

    const trade: any = this.priceOption.trade || {};
    const advancePay: any = trade.advancePay || {};

    let commercialName = productDetail.name;
    if (productStock.color) {
      commercialName += ` ${this.translateService.instant('สี')} ${productStock.color}`;
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
      this.banksPromotionService.getBanksPromotion(this.tokenService.getUser().locationCode)
        .then((resp: any) => {
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
    this.router.navigate([ROUTE_DEVICE_ORDER_ASP_SHARE_PLAN_NEW_REGISTER_MNP_VALIDATE_CUSTOMER_PAGE]);
  }

  isNext(): boolean {
    return this.paymentDetailValid && this.receiptInfoValid;
  }

  onNext(): void {
    this.transaction.data.payment = this.paymentDetailTemp.payment;
    this.transaction.data.advancePayment = this.paymentDetailTemp.advancePayment;
    this.transaction.data.receiptInfo = this.receiptInfoTemp;
    this.router.navigate([ROUTE_DEVICE_ORDER_ASP_SHARE_PLAN_NEW_REGISTER_MNP_CUSTOMER_INFO_PAGE]);
  }

  onHome(): void {
    this.removeCartService.backToReturnStock('/', this.transaction);
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

}

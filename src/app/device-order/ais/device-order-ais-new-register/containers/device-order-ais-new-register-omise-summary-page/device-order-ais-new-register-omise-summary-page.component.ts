import { Component, OnInit, OnDestroy } from '@angular/core';
import { Transaction, Payment } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import {
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_AGGREGATE_PAGE, ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_OMISE_GENERATOR_PAGE,
} from '../../constants/route-path.constant';
import { Router } from '@angular/router';
import { HomeService, REGEX_MOBILE, TokenService, PageLoadingService } from 'mychannel-shared-libs';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { SummaryPageService } from 'src/app/device-order/services/summary-page.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { QrCodeOmisePageService } from 'src/app/device-order/services/qr-code-omise-page.service';
@Component({
  selector: 'app-device-order-ais-new-register-omise-summary-page',
  templateUrl: './device-order-ais-new-register-omise-summary-page.component.html',
  styleUrls: ['./device-order-ais-new-register-omise-summary-page.component.scss']
})
export class DeviceOrderAisNewRegisterOmiseSummaryPageComponent implements OnInit, OnDestroy {
  transaction: Transaction;
  priceOption: PriceOption;
  orderList: any;

  constructor(
    private router: Router,
    private homeService: HomeService,
    public summaryPageService: SummaryPageService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private qrCodeOmisePageService: QrCodeOmisePageService,
    private tokenService: TokenService,
    private pageLoadingService: PageLoadingService,
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void {
    if (!this.transaction.data.omise) {
      this.createOmiseStatus();
    }
  }

  createOmiseStatus(): void {
    const company = this.priceOption.productStock.company;
    const trade = this.priceOption.trade;
    const payment: any = this.transaction.data.payment || {};
    const advancePayment: any = this.transaction.data.advancePayment || {};
    const advancePay = trade.advancePay || {};

    let amountDevice: string;
    let amountAirTime: string;

    if (payment.paymentOnlineCredit) {
      amountDevice = trade.promotionPrice;
    }
    if (payment.paymentOnlineCredit) {
      amountAirTime = advancePay.amount;
    }

    this.transaction.data.omise = {
      companyStock: company,
      omiseStatus: {
        amountDevice: amountDevice,
        amountAirTime: amountAirTime,
        amountTotal: String(this.getTotal()),
        statusDevice: amountDevice ? 'WAITING' : null,
        statusAirTime: amountAirTime ? 'WAITING' : null,
        installmentFlag: advancePay.installmentFlag
      }
    };

    console.log('mpayPayment', this.transaction.data.omise);
  }

  getStatusPay(): string {
    const company = this.priceOption.productStock.company;
    const omise = this.transaction.data.omise;
    const payment: any = this.transaction.data.payment || {};
    const advancePayment: any = this.transaction.data.advancePayment || {};
    if (company === 'AWN') {
      if (payment.paymentOnlineCredit) {
        return 'DEVICE&AIRTIME';
      } else {
        return omise.omiseStatus.statusDevice === 'WAITING' ? 'DEVICE' : 'AIRTIME';
      }
    } else {
      return omise.omiseStatus.statusDevice === 'WAITING' ? 'DEVICE' : 'AIRTIME';
    }
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_AGGREGATE_PAGE]);
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    const user = this.tokenService.getUser();
    const simCard = this.transaction.data && this.transaction.data.simCard;
    const customer = this.transaction.data && this.transaction.data.customer;
    const priceOption = this.priceOption.productDetail;
    const productStock = this.priceOption.productStock;
    const trade = this.priceOption && this.priceOption.trade;
    const description = trade && trade.advancePay && trade.advancePay.description;
    if (description) {
      this.orderList = [{
        name: priceOption.name + 'สี' + productStock.color,
        price: trade.promotionPrice
      }, {
        name: description,
        price: trade.advancePay.amount
      }];
    } else {
      this.orderList = [{
        name: priceOption.name + 'สี' + productStock.color,
        price: trade.promotionPrice
      }];
    }
    const params: any = {
      companyCode: 'AWN',
      companyName: 'บริษัท แอดวานซ์ ไวร์เลส เน็ทเวอร์ค จำกัด',
      locationCode: user.locationCode,
      locationName: 'สาขาเซ็นทรัลเฟสติวัลภูเก็ต',
      mobileNo: simCard.mobileNo,
      customer: customer.firstName + '' + customer.lastName,
      orderList: this.orderList,
    };
    if (!this.transaction.data.omise.qrCodeStr) {
      this.qrCodeOmisePageService.createOrder(params).then((res) => {
        const redirectUrl = res && res.data;
        this.transaction.data.omise.qrCodeStr = redirectUrl.redirectUrl;
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_OMISE_GENERATOR_PAGE]);

      }).catch((err) => {
        console.log('err', err);
      }).then(() => {
        this.pageLoadingService.closeLoading();
      });
    } else {
      this.pageLoadingService.closeLoading();
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_OMISE_GENERATOR_PAGE]);
    }
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  summary(amount: number[]): number {
    return amount.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

  getTotal(): number {
    const trade = this.priceOption.trade;
    const payment: any = this.transaction.data.payment || {};
    const advancePayment: any = this.transaction.data.advancePayment || {};
    let total: number = 0;
    const advancePay = trade.advancePay || {};

    if (trade.advancePay.installmentFlag === 'Y') {
      return this.summary([+trade.promotionPrice, +advancePay.amount]);
    }

    if (payment.paymentOnlineCredit) {
      total += +trade.promotionPrice;
    }
    if (advancePayment.paymentOnlineCredit) {
      total += +advancePay.amount;
    }
    return total;
  }

}

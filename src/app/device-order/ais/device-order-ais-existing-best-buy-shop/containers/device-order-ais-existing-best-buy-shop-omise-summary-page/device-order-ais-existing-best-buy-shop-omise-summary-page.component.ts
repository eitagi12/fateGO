import { Component, OnInit, OnDestroy } from '@angular/core';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Router } from '@angular/router';
import { HomeService, TokenService, PageLoadingService, AlertService } from 'mychannel-shared-libs';
import { SummaryPageService } from 'src/app/device-order/services/summary-page.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { QrCodeOmisePageService } from 'src/app/device-order/services/qr-code-omise-page.service';
import { ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_OMISE_GENERATOR_PAGE } from 'src/app/device-order/ais/device-order-ais-existing-best-buy-shop/constants/route-path.constant';
import { ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CHECK_OUT_PAGE } from 'src/app/device-order/ais/device-order-ais-existing-best-buy/constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-existing-best-buy-shop-omise-summary-page',
  templateUrl: './device-order-ais-existing-best-buy-shop-omise-summary-page.component.html',
  styleUrls: ['./device-order-ais-existing-best-buy-shop-omise-summary-page.component.scss']
})
export class DeviceOrderAisExistingBestBuyShopOmiseSummaryPageComponent implements OnInit, OnDestroy {
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
    private alertService: AlertService,
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
    const advancePay = trade.advancePay || {};

    let amountDevice: string;
    let amountAirTime: string;

    if (this.qrCodeOmisePageService.isPaymentOnlineCredit(this.transaction, 'payment')) {
      amountDevice = trade.promotionPrice;
    }
    if (this.qrCodeOmisePageService.isPaymentOnlineCredit(this.transaction, 'advancePayment')) {
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
  }

  getStatusPay(): string {
    const company = this.priceOption.productStock.company;
    const omise = this.transaction.data.omise;
    if (company === 'AWN') {
      if (this.qrCodeOmisePageService.isPaymentOnlineCredit(this.transaction, 'payment') &&
        this.qrCodeOmisePageService.isPaymentOnlineCredit(this.transaction, 'advancePayment')) {
        return 'DEVICE&AIRTIME';
      } else {
        return omise.omiseStatus.statusDevice === 'WAITING' ? 'DEVICE' : 'AIRTIME';
      }
    } else {
      return omise.omiseStatus.statusDevice === 'WAITING' ? 'DEVICE' : 'AIRTIME';
    }
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CHECK_OUT_PAGE]);
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
    const payment: any = this.transaction.data.payment || {};
    const advancePayment: any = this.transaction.data.advancePayment || {};
    if (this.qrCodeOmisePageService.isPaymentOnlineCredit(this.transaction, 'payment') &&
      this.qrCodeOmisePageService.isPaymentOnlineCredit(this.transaction, 'advancePayment')) {
      this.orderList = [{
        name: priceOption.name + 'สี' + productStock.color,
        price: +trade.promotionPrice
      }, {
        name: description,
        price: +trade.advancePay.amount
      }];
    } else if ((this.qrCodeOmisePageService.isPaymentOnlineCredit(this.transaction, 'payment')) ||
      (this.qrCodeOmisePageService.isPaymentOnlineCredit(this.transaction, 'advancePayment'))) {
      if (payment.paymentOnlineCredit) {
        this.orderList = [{
          name: priceOption.name + 'สี' + productStock.color,
          price: +trade.promotionPrice
        }];
      } else {
        this.orderList = [{
          name: description,
          price: +trade.advancePay.amount
        }];
      }
    }
    const params: any = {
      companyCode: 'AWN',
      companyName: 'บริษัท แอดวานซ์ ไวร์เลส เน็ทเวอร์ค จำกัด',
      locationCode: user.locationCode,
      locationName: 'สาขาเซ็นทรัลเฟสติวัลภูเก็ต',
      mobileNo: simCard.mobileNo,
      customer: customer.firstName + ' ' + customer.lastName,
      orderList: this.orderList,
    };
    this.qrCodeOmisePageService.createOrder(params).then((res) => {
      const data = res && res.data;
      this.transaction.data.omise.qrCodeStr = data.redirectUrl;
      this.transaction.data.omise.orderId = data.orderId;
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_OMISE_GENERATOR_PAGE]);

    }).catch((err) => {
      this.alertService.error('ระบบไม่สามารถทำรายการได้ขณะนี้ กรุณาทำรายการอีกครั้ง');
    }).then(() => {
      this.pageLoadingService.closeLoading();
    });

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
    let total: number = 0;
    const advancePay = trade.advancePay || {};

    if (trade.advancePay.installmentFlag === 'Y') {
      return this.summary([+trade.promotionPrice, +advancePay.amount]);
    }

    if (this.qrCodeOmisePageService.isPaymentOnlineCredit(this.transaction, 'payment')) {
      total += +trade.promotionPrice;
    }
    if (this.qrCodeOmisePageService.isPaymentOnlineCredit(this.transaction, 'advancePayment')) {
      total += +advancePay.amount;
    }
    return total;
  }

}

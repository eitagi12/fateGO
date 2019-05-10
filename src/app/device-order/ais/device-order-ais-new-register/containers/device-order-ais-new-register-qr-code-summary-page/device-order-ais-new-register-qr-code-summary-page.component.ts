import { Component, OnInit, OnDestroy } from '@angular/core';
import { Transaction, Payment } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import {
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_AGGREGATE_PAGE,
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_QR_CODE_GENERATOR_PAGE
} from '../../constants/route-path.constant';
import { Router } from '@angular/router';
import { HomeService } from 'mychannel-shared-libs';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';

@Component({
  selector: 'app-device-order-ais-new-register-qr-code-summary-page',
  templateUrl: './device-order-ais-new-register-qr-code-summary-page.component.html',
  styleUrls: ['./device-order-ais-new-register-qr-code-summary-page.component.scss']
})
export class DeviceOrderAisNewRegisterQrCodeSummaryPageComponent implements OnInit, OnDestroy {

  transaction: Transaction;
  priceOption: PriceOption;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void {
    delete this.transaction.data.mpayPayment;
    this.createMpayStatus();
    if (this.transaction.data.mpayPayment && !this.transaction.data.mpayPayment.mpayStatus) {
      // this.createMpayStatus();
    }
  }

  createMpayStatus(): void {
    const company = this.priceOption.productStock.company;
    const trade = this.priceOption.trade;
    const payment: any = this.transaction.data.payment || {};
    const advancePayment: any = this.transaction.data.advancePayment || {};
    const advancePay = trade.advancePay || {};

    let amountDevice: string;
    let amountAirTime: string;

    if (payment.paymentType === 'QR_CODE') {
      amountDevice = trade.promotionPrice;
    }
    if (advancePayment.paymentType === 'QR_CODE') {
      amountAirTime = advancePay.amount;
    }

    this.transaction.data.mpayPayment = {
      companyStock: company,
      mpayStatus: {
        amountDevice: amountDevice,
        amountAirTime: amountAirTime,
        amountTotal: String(this.getTotal()),
        statusDevice: amountDevice ? 'WAITING' : 'SUCCESS',
        statusAirTime: amountAirTime ? 'WAITING' : 'SUCCESS'
      }
    };
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_AGGREGATE_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_QR_CODE_GENERATOR_PAGE]);
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

    if (payment.paymentType === 'QR_CODE') {
      total += +trade.promotionPrice;
    }
    if (advancePayment.paymentType === 'QR_CODE') {
      total += +advancePay.amount;
    }
    return total;
  }

}

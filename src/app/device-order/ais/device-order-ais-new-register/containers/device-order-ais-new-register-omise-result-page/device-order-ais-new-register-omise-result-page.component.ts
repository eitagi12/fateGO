import { Component, OnInit } from '@angular/core';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { FormGroup } from '@angular/forms';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { environment } from 'src/environments/environment';
import { SummaryPageService } from 'src/app/device-order/services/summary-page.service';

@Component({
  selector: 'app-device-order-ais-new-register-omise-result-page',
  templateUrl: './device-order-ais-new-register-omise-result-page.component.html',
  styleUrls: ['./device-order-ais-new-register-omise-result-page.component.scss']
})
export class DeviceOrderAisNewRegisterOmiseResultPageComponent implements OnInit {
  transaction: Transaction;
  priceOption: PriceOption;
  queueFrom: FormGroup;

  constructor(
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    public summaryPageService: SummaryPageService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void {

  }

  isPaymentOnlineCredit(paymentType: string): boolean {
    const payment: any = this.transaction.data.payment || {};
    const advancePayment: any = this.transaction.data.advancePayment || {};

    if (paymentType === 'payment') {
      if (payment.paymentType === 'CREDIT' && payment.paymentOnlineCredit) {
        return true;
      } else {
        return false;
      }
    } else if (paymentType === 'advancePayment') {
      if (advancePayment.paymentType === 'CREDIT' && advancePayment.paymentOnlineCredit) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }

  getPaymentBalance(): number {
    const trade = this.priceOption.trade;
    let summary = 0;
    const advancePay = trade.advancePay || {};
    if (trade.advancePay.installmentFlag === 'Y') {
      return this.summary([+trade.promotionPrice, +advancePay.amount]);
    }

    if (this.isPaymentOnlineCredit('payment')) {
      summary += +trade.promotionPrice;
    }
    if (this.isPaymentOnlineCredit('advancePayment')) {
      summary += +advancePay.amount;
    }
    return summary;
  }

  getOutStandingBalance(): number {
    const trade = this.priceOption.trade;
    const payment: any = this.transaction.data.payment || {};
    const advancePayment: any = this.transaction.data.advancePayment || {};
    let summary = 0;
    const advancePay = trade.advancePay || {};

    if (trade.advancePay.installmentFlag === 'Y') {
      return this.summary([+trade.promotionPrice, +advancePay.amount]);
    }

    if (!this.isPaymentOnlineCredit('payment')) {
      summary += +trade.promotionPrice;
    }
    if (!this.isPaymentOnlineCredit('advancePayment')) {
      summary += +advancePay.amount;
    }
    return summary;
  }

  summary(amount: number[]): number {
    return amount.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
  }

  onMainMenu(): void {
    if (environment.name === 'LOCAL') {
      window.location.href = '/main-menu';
    } else {
      window.location.href = '/smart-digital/main-menu';
    }
  }
}

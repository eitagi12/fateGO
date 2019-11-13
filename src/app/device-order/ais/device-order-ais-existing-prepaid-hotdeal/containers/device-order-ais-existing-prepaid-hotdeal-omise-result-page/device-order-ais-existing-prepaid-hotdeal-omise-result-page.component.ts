import { Component, OnInit } from '@angular/core';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { FormGroup } from '@angular/forms';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { environment } from 'src/environments/environment';
import { SummaryPageService } from 'src/app/device-order/services/summary-page.service';
import { QrCodeOmisePageService } from 'src/app/device-order/services/qr-code-omise-page.service';

@Component({
  selector: 'app-device-order-ais-existing-prepaid-hotdeal-omise-result-page',
  templateUrl: './device-order-ais-existing-prepaid-hotdeal-omise-result-page.component.html',
  styleUrls: ['./device-order-ais-existing-prepaid-hotdeal-omise-result-page.component.scss']
})
export class DeviceOrderAisExistingPrepaidHotdealOmiseResultPageComponent implements OnInit {
  transaction: Transaction;
  priceOption: PriceOption;
  queueFrom: FormGroup;

  constructor(
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    public qrCodeOmisePageService: QrCodeOmisePageService,
    public summaryPageService: SummaryPageService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void {

  }

  getPaymentBalance(): number {
    const trade = this.priceOption.trade;
    let summary = 0;
    const advancePay = trade.advancePay || {};
    if (trade.advancePay.installmentFlag === 'Y') {
      return this.summary([+trade.promotionPrice, +advancePay.amount]);
    }

    if (this.qrCodeOmisePageService.isPaymentOnlineCredit(this.transaction, 'payment')) {
      summary += +trade.promotionPrice;
    }
    if (this.qrCodeOmisePageService.isPaymentOnlineCredit(this.transaction, 'advancePayment')) {
      summary += +advancePay.amount;
    }
    return summary;
  }

  getOutStandingBalance(): number {
    const trade = this.priceOption.trade;
    let summary = 0;
    const advancePay = trade.advancePay || {};

    if (trade.advancePay.installmentFlag === 'Y') {
      return this.summary([+trade.promotionPrice, +advancePay.amount]);
    }

    if (!this.qrCodeOmisePageService.isPaymentOnlineCredit(this.transaction, 'payment')) {
      summary += +trade.promotionPrice;
    }
    if (!this.qrCodeOmisePageService.isPaymentOnlineCredit(this.transaction, 'advancePayment')) {
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

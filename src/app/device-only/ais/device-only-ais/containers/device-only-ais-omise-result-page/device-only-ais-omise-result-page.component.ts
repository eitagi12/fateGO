import { Component, OnInit } from '@angular/core';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { FormGroup } from '@angular/forms';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { SummaryPageService } from 'src/app/device-order/services/summary-page.service';
import { environment } from 'src/environments/environment';
import { QrCodeOmiseService } from 'src/app/device-only/services/qr-code-omise.service';

@Component({
  selector: 'app-device-only-ais-omise-result-page',
  templateUrl: './device-only-ais-omise-result-page.component.html',
  styleUrls: ['./device-only-ais-omise-result-page.component.scss']
})
export class DeviceOnlyAisOmiseResultPageComponent implements OnInit {
  transaction: Transaction;
  priceOption: PriceOption;
  queueFrom: FormGroup;

  constructor(
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    public qrCodeOmiseService: QrCodeOmiseService,
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

    if (this.qrCodeOmiseService.isPaymentOnlineCredit(this.transaction, 'payment')) {
      summary += +trade.promotionPrice;
    }
    if (this.qrCodeOmiseService.isPaymentOnlineCredit(this.transaction, 'advancePayment')) {
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

    if (!this.qrCodeOmiseService.isPaymentOnlineCredit(this.transaction, 'payment')) {
      summary += +trade.promotionPrice;
    }
    if (!this.qrCodeOmiseService.isPaymentOnlineCredit(this.transaction, 'advancePayment')) {
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

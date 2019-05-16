import { Component, OnInit } from '@angular/core';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-device-order-ais-existing-qr-code-result-page',
  templateUrl: './device-order-ais-existing-qr-code-result-page.component.html',
  styleUrls: ['./device-order-ais-existing-qr-code-result-page.component.scss']
})
export class DeviceOrderAisExistingQrCodeResultPageComponent implements OnInit {

  transaction: Transaction;
  priceOption: PriceOption;

  constructor(
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void {
  }

  getPaymentBalance(): number {
    const trade = this.priceOption.trade;
    const payment: any = this.transaction.data.payment || {};
    const advancePayment: any = this.transaction.data.advancePayment || {};

    let summary = 0;
    if (payment.paymentType === 'QR_CODE') {
      summary += +trade.promotionPrice;
    }
    if (advancePayment.paymentType === 'QR_CODE') {
      const advancePay = trade.advancePay || {};
      summary += +advancePay.amount;
    }
    return summary;
  }

  getOutStandingBalance(): number {
    const trade = this.priceOption.trade;
    const payment: any = this.transaction.data.payment || {};
    const advancePayment: any = this.transaction.data.advancePayment || {};

    let summary = 0;
    if (payment.paymentType !== 'QR_CODE') {
      summary += +trade.promotionPrice;
    }
    if (advancePayment.paymentType !== 'QR_CODE') {
      const advancePay = trade.advancePay || {};
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

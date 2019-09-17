import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { SummaryPageService } from 'src/app/device-order/services/summary-page.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';

@Component({
  selector: 'app-device-order-ais-device-qr-code-result-page',
  templateUrl: './device-order-ais-device-qr-code-result-page.component.html',
  styleUrls: ['./device-order-ais-device-qr-code-result-page.component.scss']
})
export class DeviceOrderAisDeviceQrCodeResultPageComponent implements OnInit {

  transaction: Transaction;
  priceOption: PriceOption;

  constructor(
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    public summaryPageService: SummaryPageService,
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void {
  }

  getPaymentBalance(): number {
    const trade = this.priceOption.trade;
    const payment: any = this.transaction.data.payment || {};

    let summary = 0;
    if (payment.paymentType === 'QR_CODE') {
      summary += +trade.promotionPrice;
    }

    return summary;
  }

  getOutStandingBalance(): number {
    const trade = this.priceOption.trade;
    const payment: any = this.transaction.data.payment || {};

    let summary = 0;
    if (payment.paymentType !== 'QR_CODE') {
      summary += +trade.promotionPrice;
    }

    return summary;
  }

  summary(amount: number[]): number {
    return amount.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
  }

  onMainMenu(): void {
    this.transactionService.remove();
    window.location.href = '/';
  }

  get checkAppleTvWording(): boolean {
    const checkAppleTv: string = 'APTV';
    return this.priceOption.productDetail.model.slice(0, 4) === checkAppleTv;
  }
}

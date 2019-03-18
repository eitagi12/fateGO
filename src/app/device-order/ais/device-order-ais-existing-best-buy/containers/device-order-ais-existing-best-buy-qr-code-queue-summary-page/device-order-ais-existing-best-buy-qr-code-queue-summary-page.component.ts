import { Component, OnInit } from '@angular/core';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { HomeService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';

@Component({
  selector: 'app-device-order-ais-existing-best-buy-qr-code-queue-summary-page',
  templateUrl: './device-order-ais-existing-best-buy-qr-code-queue-summary-page.component.html',
  styleUrls: ['./device-order-ais-existing-best-buy-qr-code-queue-summary-page.component.scss']
})
export class DeviceOrderAisExistingBestBuyQrCodeQueueSummaryPageComponent implements OnInit {

  transaction: Transaction;
  priceOption: PriceOption;
  isSuccess: boolean;

  constructor(
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
   }

  ngOnInit(): void {
    this.isSuccess = true;
  }

  onMainMenu(): void {
    this.transactionService.remove();
    window.location.href = '/';
  }

  summary(amount: number[]): number {
    return amount.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
  }

}

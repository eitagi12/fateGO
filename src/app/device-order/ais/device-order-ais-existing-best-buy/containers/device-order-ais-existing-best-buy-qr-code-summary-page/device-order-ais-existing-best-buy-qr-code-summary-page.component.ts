import { Component, OnInit } from '@angular/core';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { HomeService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-device-order-ais-existing-best-buy-qr-code-summary-page',
  templateUrl: './device-order-ais-existing-best-buy-qr-code-summary-page.component.html',
  styleUrls: ['./device-order-ais-existing-best-buy-qr-code-summary-page.component.scss']
})
export class DeviceOrderAisExistingBestBuyQrCodeSummaryPageComponent implements OnInit {

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

  ngOnInit() {
  }

  onBack() {
    this.router.navigate(['']);
  }

  onNext() {
    this.router.navigate(['']);
  }

  onHome() {
    this.homeService.goToHome();
  }

  summary(amount: number[]) {
    return amount.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
  }

}

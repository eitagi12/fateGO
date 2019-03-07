import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { ROUTE_DEVICE_ONLY_AIS_QR_CODE_SUMMARY_PAGE, ROUTE_DEVICE_ONLY_AIS_QR_CODE_QUEUE_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-device-only-ais-qr-code-generate-page',
  templateUrl: './device-only-ais-qr-code-generate-page.component.html',
  styleUrls: ['./device-only-ais-qr-code-generate-page.component.scss']
})
export class DeviceOnlyAisQrCodeGeneratePageComponent implements OnInit {

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
    this.router.navigate([ROUTE_DEVICE_ONLY_AIS_QR_CODE_SUMMARY_PAGE]);
  }

  onNext() {
    this.router.navigate([ROUTE_DEVICE_ONLY_AIS_QR_CODE_QUEUE_PAGE]);
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

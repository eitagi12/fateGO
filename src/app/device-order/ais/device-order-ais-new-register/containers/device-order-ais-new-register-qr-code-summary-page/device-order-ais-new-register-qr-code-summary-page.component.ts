import { Component, OnInit } from '@angular/core';
import { Transaction } from 'src/app/shared/models/transaction.model';
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
export class DeviceOrderAisNewRegisterQrCodeSummaryPageComponent implements OnInit {

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
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_AGGREGATE_PAGE]);
  }

  onNext() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_QR_CODE_GENERATOR_PAGE]);
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

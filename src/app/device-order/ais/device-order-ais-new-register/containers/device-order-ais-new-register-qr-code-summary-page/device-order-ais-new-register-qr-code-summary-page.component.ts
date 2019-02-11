import { Component, OnInit } from '@angular/core';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import {
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_AGGREGATE_PAGE,
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_QR_CODE_GENERATOR_PAGE
} from '../../constants/route-path.constant';
import { Router } from '@angular/router';
import { HomeService } from 'mychannel-shared-libs';

@Component({
  selector: 'app-device-order-ais-new-register-qr-code-summary-page',
  templateUrl: './device-order-ais-new-register-qr-code-summary-page.component.html',
  styleUrls: ['./device-order-ais-new-register-qr-code-summary-page.component.scss']
})
export class DeviceOrderAisNewRegisterQrCodeSummaryPageComponent implements OnInit {

  transaction: Transaction;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService
  ) {
    this.transaction = this.transactionService.load();
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

}

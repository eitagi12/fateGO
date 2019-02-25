import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { ApiRequestService, PageLoadingService, HomeService } from 'mychannel-shared-libs';
import { ROUTE_DEVICE_ORDER_AIS_BEST_BUY_MOBILE_CARE_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CHECK_OUT_PAGE } from 'src/app/device-order/ais/device-order-ais-existing-best-buy/constants/route-path.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';

@Component({
  selector: 'app-device-order-ais-existing-best-buy-summary-page',
  templateUrl: './device-order-ais-existing-best-buy-summary-page.component.html',
  styleUrls: ['./device-order-ais-existing-best-buy-summary-page.component.scss']
})
export class DeviceOrderAisExistingBestBuySummaryPageComponent implements OnInit, OnDestroy {

  identityValid = true;
  transaction: Transaction;
  currentStep: number;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private apiRequestService: ApiRequestService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.currentStep = 4;
  }

  onHome() {
    this.homeService.goToHome();
  }

  onBack() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_MOBILE_CARE_PAGE]);
  }

  onNext() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CHECK_OUT_PAGE]);
  }

  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
  }



}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { ApiRequestService, PageLoadingService, HomeService, MobileCare } from 'mychannel-shared-libs';
import { ROUTE_DEVICE_ORDER_AIS_BEST_BUY_MOBILE_CARE_AVAILABLE_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SUMMARY_PAGE } from 'src/app/device-order/ais/device-order-ais-existing-best-buy/constants/route-path.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';

@Component({
  selector: 'app-device-order-ais-existing-best-buy-mobile-care-page',
  templateUrl: './device-order-ais-existing-best-buy-mobile-care-page.component.html',
  styleUrls: ['./device-order-ais-existing-best-buy-mobile-care-page.component.scss']
})
export class DeviceOrderAisExistingBestBuyMobileCarePageComponent implements OnInit, OnDestroy {

  identityValid = true;
  transaction: Transaction;
  wizards = WIZARD_DEVICE_ORDER_AIS;
  mobileCare: MobileCare;
  constructor(
    private router: Router,
    private homeService: HomeService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private apiRequestService: ApiRequestService,
    private http: HttpClient
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit() {
  }

  onCompleted(mobileCare: any) {
    this.transaction.data.mobileCarePackage = mobileCare;
  }

  onHome() {
    this.homeService.goToHome();
  }

  onBack() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_MOBILE_CARE_AVAILABLE_PAGE]);
  }

  onNext() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SUMMARY_PAGE]);
  }

  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
  }

}

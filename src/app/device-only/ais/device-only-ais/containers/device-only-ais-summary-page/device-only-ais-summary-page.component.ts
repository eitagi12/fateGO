import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_DEVICE_ONLY_AIS_SELECT_MOBILE_CARE_PAGE, ROUTE_DEVICE_ONLY_AIS_CHECKOUT_PAYMENT_PAGE } from 'src/app/device-only/ais/device-only-ais/constants/route-path.constant';
import { WIZARD_DEVICE_ONLY_AIS } from '../../constants/wizard.constant';
import { HomeService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { HomeButtonService } from '../../services/home-button.service';

@Component({
  selector: 'app-device-only-ais-summary-page',
  templateUrl: './device-only-ais-summary-page.component.html',
  styleUrls: ['./device-only-ais-summary-page.component.scss']
})
export class DeviceOnlyAisSummaryPageComponent implements OnInit {

  wizards: string[] = WIZARD_DEVICE_ONLY_AIS;
  transaction: Transaction;
  isReasonNotBuyMobileCare: string;
  // telNo: string;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private homeButtonService: HomeButtonService
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.homeButtonService.initEventButtonHome();
    // this.telNo = this.transaction.data.receiptInfo.telNo;
    this.isReasonNotBuyMobileCare = this.transaction.data.reasonCode;
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ONLY_AIS_SELECT_MOBILE_CARE_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ONLY_AIS_CHECKOUT_PAYMENT_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

}

import { Component, OnInit } from '@angular/core';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { Router } from '@angular/router';
import { HomeService } from 'mychannel-shared-libs';
import {
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_AGREEMENT_PAGE,
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_MOBILE_CARE_PAGE
} from 'src/app/device-order/ais/device-order-ais-new-register/constants/route-path.constant';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Transaction } from 'src/app/shared/models/transaction.model';

@Component({
  selector: 'app-device-order-ais-new-register-summary-page',
  templateUrl: './device-order-ais-new-register-summary-page.component.html',
  styleUrls: ['./device-order-ais-new-register-summary-page.component.scss']
})
export class DeviceOrderAisNewRegisterSummaryPageComponent implements OnInit {

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;

  priceOption: PriceOption;
  transaction: Transaction;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private priceOptionService: PriceOptionService,
    private transactionService: TransactionService,
  ) {
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_MOBILE_CARE_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_AGREEMENT_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

}

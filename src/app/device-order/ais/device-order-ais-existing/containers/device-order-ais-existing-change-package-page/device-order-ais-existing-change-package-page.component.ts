import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_DEVICE_ORDER_AIS_EXISTING_ELIGIBLE_MOBILE_PAGE, ROUTE_DEVICE_ORDER_AIS_EXISTING_MOBILE_DETAIL_PAGE } from '../../constants/route-path.constant';
import { HomeService } from 'mychannel-shared-libs';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';

@Component({
  selector: 'app-device-order-ais-existing-change-package-page',
  templateUrl: './device-order-ais-existing-change-package-page.component.html',
  styleUrls: ['./device-order-ais-existing-change-package-page.component.scss']
})
export class DeviceOrderAisExistingChangePackagePageComponent implements OnInit {

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;
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

  ngOnInit(): void {
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_ELIGIBLE_MOBILE_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_MOBILE_DETAIL_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

}

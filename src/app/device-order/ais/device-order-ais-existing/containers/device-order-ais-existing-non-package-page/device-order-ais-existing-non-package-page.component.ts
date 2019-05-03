import { Component, OnInit } from '@angular/core';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HomeService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { ROUTE_DEVICE_ORDER_AIS_EXISTING_ELIGIBLE_MOBILE_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-existing-non-package-page',
  templateUrl: './device-order-ais-existing-non-package-page.component.html',
  styleUrls: ['./device-order-ais-existing-non-package-page.component.scss']
})
export class DeviceOrderAisExistingNonPackagePageComponent implements OnInit {

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;
  transaction: Transaction;
  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_ELIGIBLE_MOBILE_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

}

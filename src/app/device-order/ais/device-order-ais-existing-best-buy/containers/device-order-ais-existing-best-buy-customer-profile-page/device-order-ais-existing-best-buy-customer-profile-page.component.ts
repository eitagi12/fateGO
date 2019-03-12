import { Component, OnInit, OnDestroy } from '@angular/core';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Router } from '@angular/router';
import { HomeService } from 'mychannel-shared-libs';
import { HttpClient } from '@angular/common/http';
import { Transaction, TransactionAction } from 'src/app/shared/models/transaction.model';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { ROUTE_DEVICE_ORDER_AIS_BEST_BUY_VALIDATE_CUSTOMER_REPI_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_OTP_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_VALIDATE_CUSTOMER_ID_CARD_RPI_PAGE } from 'src/app/device-order/ais/device-order-ais-existing-best-buy/constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-existing-best-buy-customer-profile-page',
  templateUrl: './device-order-ais-existing-best-buy-customer-profile-page.component.html',
  styleUrls: ['./device-order-ais-existing-best-buy-customer-profile-page.component.scss']
})
export class DeviceOrderAisExistingBestBuyCustomerProfilePageComponent implements OnInit, OnDestroy {

  wizards = WIZARD_DEVICE_ORDER_AIS;
  transaction: Transaction;
  titleName: string;
  firstName: string;
  lastName: string;
  customerInfoError: boolean;

  constructor(
    private transactionService: TransactionService,
    private router: Router,
    private homeService: HomeService,
    private http: HttpClient
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit() {
    const data = this.transaction.data.customer;
    this.customerInfoError = data && data.caNumber && data.firstName ? false : true;
    this.titleName = data.titleName;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
  }

  onNext() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_OTP_PAGE]);
  }
  onBack() {
    if (this.transaction.data.action === TransactionAction.KEY_IN_REPI) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_VALIDATE_CUSTOMER_REPI_PAGE]);
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_VALIDATE_CUSTOMER_ID_CARD_RPI_PAGE]);
    }
  }

  onHome() {
    this.homeService.goToHome();
  }
  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

}

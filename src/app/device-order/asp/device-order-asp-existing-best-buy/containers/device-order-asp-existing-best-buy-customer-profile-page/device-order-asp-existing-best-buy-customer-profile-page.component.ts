import { Component, OnInit, OnDestroy } from '@angular/core';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Router } from '@angular/router';
import { HomeService, TokenService } from 'mychannel-shared-libs';
import { HttpClient } from '@angular/common/http';
import { Transaction, TransactionAction } from 'src/app/shared/models/transaction.model';
import { WIZARD_DEVICE_ORDER_AIS, WIZARD_DEVICE_ORDER_ASP } from 'src/app/device-order/constants/wizard.constant';
import { ROUTE_DEVICE_ORDER_ASP_BEST_BUY_VALIDATE_CUSTOMER_REPI_PAGE, ROUTE_DEVICE_ORDER_ASP_BEST_BUY_OTP_PAGE, ROUTE_DEVICE_ORDER_ASP_BEST_BUY_VALIDATE_CUSTOMER_ID_CARD_RPI_PAGE } from 'src/app/device-order/asp/device-order-asp-existing-best-buy/constants/route-path.constant';

@Component({
  selector: 'app-device-order-asp-existing-best-buy-customer-profile-page',
  templateUrl: './device-order-asp-existing-best-buy-customer-profile-page.component.html',
  styleUrls: ['./device-order-asp-existing-best-buy-customer-profile-page.component.scss']
})
export class DeviceOrderAspExistingBestBuyCustomerProfilePageComponent implements OnInit, OnDestroy {

  wizards: any = this.tokenService.isTelewizUser() ? WIZARD_DEVICE_ORDER_ASP : WIZARD_DEVICE_ORDER_AIS;
  active: number = this.tokenService.isTelewizUser() ? 3 : 2;
  transaction: Transaction;
  titleName: string;
  firstName: string;
  lastName: string;
  customerInfoError: boolean;

  constructor(
    private transactionService: TransactionService,
    private router: Router,
    private homeService: HomeService,
    private tokenService: TokenService
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    const data = this.transaction.data.customer;
    this.customerInfoError = data && data.caNumber && data.firstName ? false : true;
    this.titleName = data.titleName;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_ASP_BEST_BUY_OTP_PAGE]);
  }
  onBack(): void {
    if (this.transaction.data.action === TransactionAction.KEY_IN_REPI) {
      this.router.navigate([ROUTE_DEVICE_ORDER_ASP_BEST_BUY_VALIDATE_CUSTOMER_REPI_PAGE]);
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_ASP_BEST_BUY_VALIDATE_CUSTOMER_ID_CARD_RPI_PAGE]);
    }
  }

  onHome(): void {
    this.homeService.goToHome();
  }
  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

}

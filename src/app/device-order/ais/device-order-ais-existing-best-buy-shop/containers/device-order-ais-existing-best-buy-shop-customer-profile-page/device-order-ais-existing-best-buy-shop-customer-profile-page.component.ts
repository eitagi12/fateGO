import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { Transaction, TransactionAction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Router } from '@angular/router';
import { HomeService } from 'mychannel-shared-libs';
import { HttpClient } from '@angular/common/http';
import { ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_OTP_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_VALIDATE_CUSTOMER_REPI_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_VALIDATE_CUSTOMER_ID_CARD_RPI_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-existing-best-buy-shop-customer-profile-page',
  templateUrl: './device-order-ais-existing-best-buy-shop-customer-profile-page.component.html',
  styleUrls: ['./device-order-ais-existing-best-buy-shop-customer-profile-page.component.scss']
})
export class DeviceOrderAisExistingBestBuyShopCustomerProfilePageComponent implements OnInit, OnDestroy {

  wizards: any = WIZARD_DEVICE_ORDER_AIS;
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

  ngOnInit(): void {
    const data = this.transaction.data.customer;
    this.customerInfoError = data && data.caNumber && data.firstName ? false : true;
    this.titleName = data.titleName;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_OTP_PAGE]);
  }
  onBack(): void {
    if (this.transaction.data.action === TransactionAction.KEY_IN_REPI) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_VALIDATE_CUSTOMER_REPI_PAGE]);
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_VALIDATE_CUSTOMER_ID_CARD_RPI_PAGE]);
    }
  }

  onHome(): void {
    this.homeService.goToHome();
  }
  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

}

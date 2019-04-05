import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, ShoppingCart, CustomerInfo, ChargeType, PageLoadingService } from 'mychannel-shared-libs';
import {
  ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_ELIGIBLE_MOBILE_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_PAYMENT_DETAIL_PAGE
 } from '../../constants/route-path.constant';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { Customer, Transaction, SimCard } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-device-order-ais-existing-prepaid-hotdeal-customer-info-page',
  templateUrl: './device-order-ais-existing-prepaid-hotdeal-customer-info-page.component.html',
  styleUrls: ['./device-order-ais-existing-prepaid-hotdeal-customer-info-page.component.scss']
})
export class DeviceOrderAisExistingPrepaidHotdealCustomerInfoPageComponent implements OnInit {

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;
  shoppingCart: ShoppingCart;
  transaction: Transaction;
  customerInfo: any;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private shoppingCartService: ShoppingCartService,
    private transactionService: TransactionService,
    private http: HttpClient,
    private pageLoadingService: PageLoadingService
  ) {
    this.transaction = this.transactionService.load();
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
  }

  ngOnInit(): void {
    const customer: Customer = this.transaction.data.customer;
    const simcard: SimCard = this.transaction.data.simCard;
    this.customerInfo = {
      mobileNo: simcard.mobileNo,
      chargeType: (simcard.chargeType === ChargeType.PRE_PAID) ? 'เติมเงิน' : 'รายเดือน',
      status: simcard.mobileNoStatus
    };
    this.getBalance(simcard.mobileNo);
  }

  // tslint:disable-next-line:typedef
  getBalance(mobileNo: string) {
    this.pageLoadingService.openLoading();
    this.http.get(`/api/customerportal/newRegister/${mobileNo}/queryBalance`).toPromise()
    .then((resp: any) => {
      this.pageLoadingService.closeLoading();
      this.customerInfo.balance = resp.data.transferBalance;
    })
    .catch(() => {
      this.pageLoadingService.closeLoading();
    });

  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_PAYMENT_DETAIL_PAGE]);
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_ELIGIBLE_MOBILE_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }
}

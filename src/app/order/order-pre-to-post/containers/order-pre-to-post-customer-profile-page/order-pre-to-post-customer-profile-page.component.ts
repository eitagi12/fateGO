import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_ORDER_PRE_TO_POST } from 'src/app/order/constants/wizard.constant';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Router } from '@angular/router';
import { HomeService, PageLoadingService, ApiRequestService } from 'mychannel-shared-libs';
import { HttpClient } from '@angular/common/http';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { ROUTE_ORDER_PRE_TO_POST_OTP_PAGE, ROUTE_ORDER_PRE_TO_POST_VALIDATE_CUSTOMER_REPI_PAGE, ROUTE_ORDER_PRE_TO_POST_VALIDATE_CUSTOMER_ID_CARD_PAGE, ROUTE_ORDER_PRE_TO_POST_VALIDATE_CUSTOMER_ID_CARD_REPI_PAGE } from 'src/app/order/order-pre-to-post/constants/route-path.constant';

@Component({
  selector: 'app-order-pre-to-post-customer-profile-page',
  templateUrl: './order-pre-to-post-customer-profile-page.component.html',
  styleUrls: ['./order-pre-to-post-customer-profile-page.component.scss']
})
export class OrderPreToPostCustomerProfilePageComponent implements OnInit, OnDestroy {
  wizards = WIZARD_ORDER_PRE_TO_POST;
  transaction: Transaction;
  titleName: string;
  firstName: string;
  lastName: string;
  customerInfoError: any;

  constructor(
    private transactionService: TransactionService,
    private router: Router,
    private homeService: HomeService,
    private http: HttpClient,
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit() {
    const data = this.transaction.data.customer;
    this.titleName = data.titleName;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
  }

  onNext() {
    this.router.navigate([ROUTE_ORDER_PRE_TO_POST_OTP_PAGE]);
  }
  onBack() {
    this.router.navigate([ROUTE_ORDER_PRE_TO_POST_VALIDATE_CUSTOMER_ID_CARD_REPI_PAGE]);
  }

  onHome() {

  }
  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
  }

}

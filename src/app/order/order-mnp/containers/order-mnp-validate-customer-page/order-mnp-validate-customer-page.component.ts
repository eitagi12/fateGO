import { Component, OnInit, OnDestroy } from '@angular/core';
import { Transaction, TransactionAction } from 'src/app/shared/models/transaction.model';
import { Router } from '@angular/router';
import { PageLoadingService, HomeService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient } from '@angular/common/http';
import {
  ROUTE_ORDER_MNP_CUSTOMER_INFO_PAGE,
  ROUTE_ORDER_MNP_VALIDATE_CUSTOMER_KEY_IN_PAGE,
  ROUTE_ORDER_MNP_SELECT_REASON_PAGE,
  ROUTE_ORDER_MNP_VALIDATE_CUSTOMER_ID_CARD_PAGE
} from 'src/app/order/order-mnp/constants/route-path.constant';

@Component({
  selector: 'app-order-mnp-validate-customer-page',
  templateUrl: './order-mnp-validate-customer-page.component.html',
  styleUrls: ['./order-mnp-validate-customer-page.component.scss']
})
export class OrderMnpValidateCustomerPageComponent implements OnInit, OnDestroy {

  transaction: Transaction;
  identityValid = false;
  identity: string;

  constructor(
    private router: Router,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private http: HttpClient,
    private homeService: HomeService,
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit() {
    this.transaction.data.action = TransactionAction.KEY_IN;
  }

  onError(valid: boolean) {
    this.identityValid = valid;
  }

  onCompleted(identity: string) {
    this.identity = identity;
  }

  onReadCard() {
    this.router.navigate([ROUTE_ORDER_MNP_VALIDATE_CUSTOMER_ID_CARD_PAGE]);
  }

  onBack() {
    this.router.navigate([ROUTE_ORDER_MNP_SELECT_REASON_PAGE]);
  }

  onHome() {
    this.homeService.goToHome();
  }

  onNext() {
    this.pageLoadingService.openLoading();
    this.http.get(`/api/customerportal/validate-customer-mnp`, {
      params: {
        identity: this.identity
      }
    })
      .toPromise()
      .then((resp: any) => {
        this.transaction.data.customer = Object.assign(this.transaction.data.customer, resp.data);
        this.router.navigate([ROUTE_ORDER_MNP_CUSTOMER_INFO_PAGE]);
      })
      .catch(() => {
        this.router.navigate([ROUTE_ORDER_MNP_VALIDATE_CUSTOMER_KEY_IN_PAGE], {
          queryParams: {
            idCardNo: this.identity
          }
        });
      })
      .then(() => {
        this.pageLoadingService.closeLoading();
      });
  }


  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

}

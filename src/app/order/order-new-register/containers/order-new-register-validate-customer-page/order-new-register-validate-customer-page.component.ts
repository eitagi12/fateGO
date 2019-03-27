import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  ROUTE_ORDER_NEW_REGISTER_VALIDATE_CUSTOMER_ID_CARD_PAGE,
  ROUTE_ORDER_NEW_REGISTER_CUSTOMER_INFO_PAGE,
  ROUTE_ORDER_NEW_REGISTER_VALIDATE_CUSTOMER_KEY_IN_PAGE
} from 'src/app/order/order-new-register/constants/route-path.constant';
import { Router } from '@angular/router';
import { HomeService, PageLoadingService, ApiRequestService } from 'mychannel-shared-libs';
import { Transaction, TransactionType, TransactionAction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-order-new-register-validate-customer-page',
  templateUrl: './order-new-register-validate-customer-page.component.html',
  styleUrls: ['./order-new-register-validate-customer-page.component.scss']
})
export class OrderNewRegisterValidateCustomerPageComponent implements OnInit, OnDestroy {

  transaction: Transaction;
  identityValid: boolean = false;
  identity: string;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private apiRequestService: ApiRequestService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.createTransaction();
  }

  onError(valid: boolean): void {
    this.identityValid = valid;
  }

  onCompleted(identity: string): void {
    this.identity = identity;
  }

  onReadCard(): void {
    this.router.navigate([ROUTE_ORDER_NEW_REGISTER_VALIDATE_CUSTOMER_ID_CARD_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onBack(): void {
    this.homeService.goToHome();
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    this.http.get('/api/customerportal/validate-customer-new-register', {
      params: {
        identity: this.identity
      }
    })
      .toPromise()
      .then((resp: any) => {
        const data = resp.data || {};
        return Promise.resolve(data);
      })
      .then((customer) => { // load bill cycle
        this.transaction.data.customer = customer;
        return this.http.get(`/api/customerportal/newRegister/${this.identity}/queryBillingAccount`).toPromise()
          .then((resp: any) => {
            const data = resp.data || {};
            return this.http.post('/api/customerportal/verify/billingNetExtreme', {
              businessType: '1',
              listBillingAccount: data.billingAccountList
            }).toPromise()
              .then((respBillingNetExtreme: any) => {
                return {
                  billCycles: data.billingAccountList,
                  billCyclesNetExtreme: respBillingNetExtreme.data
                };
              })
              .catch(() => {
                return {
                  billCycles: data.billingAccountList
                };
              });
          });
      })
      .then((billingInformation: any) => {
        this.transaction.data.billingInformation = billingInformation;
        this.router.navigate([ROUTE_ORDER_NEW_REGISTER_CUSTOMER_INFO_PAGE]);
      })
      .catch((e) => {
        this.router.navigate([ROUTE_ORDER_NEW_REGISTER_VALIDATE_CUSTOMER_KEY_IN_PAGE], {
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
    this.transactionService.save(this.transaction);
  }

  private createTransaction(): void {
    // New x-api-request-id
    this.apiRequestService.createRequestId();

    this.transaction = {
      data: {
        transactionType: TransactionType.ORDER_NEW_REGISTER,
        action: TransactionAction.KEY_IN,
      }
    };
  }
}

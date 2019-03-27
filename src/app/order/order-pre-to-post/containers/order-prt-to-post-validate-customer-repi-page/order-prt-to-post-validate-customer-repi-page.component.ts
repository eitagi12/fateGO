import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_ORDER_PRE_TO_POST } from 'src/app/order/constants/wizard.constant';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Router } from '@angular/router';
import { HomeService, PageLoadingService, ApiRequestService, AlertService } from 'mychannel-shared-libs';
import { HttpClient } from '@angular/common/http';
import { Transaction, TransactionType, TransactionAction } from 'src/app/shared/models/transaction.model';
import { ROUTE_ORDER_PRE_TO_POST_CUSTOMER_PROFILE_PAGE, ROUTE_ORDER_PRE_TO_POST_CUSTOMER_INFO_PAGE, ROUTE_ORDER_PRE_TO_POST_VALIDATE_CUSTOMER_ID_CARD_REPI_PAGE, ROUTE_ORDER_PRE_TO_POST_CURRENT_INFO_PAGE } from 'src/app/order/order-pre-to-post/constants/route-path.constant';

@Component({
  selector: 'app-order-prt-to-post-validate-customer-repi-page',
  templateUrl: './order-prt-to-post-validate-customer-repi-page.component.html',
  styleUrls: ['./order-prt-to-post-validate-customer-repi-page.component.scss']
})
export class OrderPrtToPostValidateCustomerRepiPageComponent implements OnInit, OnDestroy {
  wizards: string[] = WIZARD_ORDER_PRE_TO_POST;
  transaction: Transaction;
  identityValid: boolean = false;
  identity: string;
  idCardNo: string;
  mobileNo: string;
  constructor(
    private transactionService: TransactionService,
    private router: Router,
    private homeService: HomeService,
    private http: HttpClient,
    private pageLoadingService: PageLoadingService,
    private apiRequestService: ApiRequestService,
    private alertService: AlertService,
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    const mobileNo = this.transaction.data.simCard.mobileNo;
    this.http.get('/api/customerportal/validate-customer-pre-to-post', {
      params: {
        identity: this.identity
      }
    }).toPromise()
      .then((resp: any) => {
        const data = resp.data || [];
        this.transaction.data.customer = data;
        this.idCardNo = resp.data.idCardNo;
      })
      .then(() => { // load bill cycle
        return this.http.get(`/api/customerportal/newRegister/${this.identity}/queryBillingAccount`).toPromise()
          .then((resp: any) => {
            const data = resp.data || {};
            return this.http.post('/api/customerportal/verify/billingNetExtreme', {
              businessType: '1',
              listBillingAccount: data.billingAccountList
            }).toPromise()
              .then((respBillingNetExtreme: any) => {
                if (respBillingNetExtreme.data.length > 0) {
                  return {
                    billCycles: data.billingAccountList,
                    billCyclesNetExtreme: respBillingNetExtreme.data
                  };
                } else {
                  return {
                    billCycles: data.billingAccountList
                  };
                }
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
      })
      .then(() => {
        this.http.get(`/api/customerportal/newRegister/verifyPrepaidIdent?idCard=${this.idCardNo}&mobileNo=${mobileNo}`)
          .toPromise()
          .then((respPrepaidIdent: any) => {
            if (respPrepaidIdent.data && respPrepaidIdent.data.success) {
              this.transaction.data.action = TransactionAction.KEY_IN;
              this.router.navigate([ROUTE_ORDER_PRE_TO_POST_CUSTOMER_INFO_PAGE]);
            } else {
              this.transaction.data.action = TransactionAction.KEY_IN_REPI;
              this.router.navigate([ROUTE_ORDER_PRE_TO_POST_CUSTOMER_PROFILE_PAGE]);
            }
          });
      })
      .catch((resp: any) => {
        this.alertService.error(resp.resultDescription);
      })
      .then(() => {
        this.pageLoadingService.closeLoading();
      });
  }

  onError(valid: boolean): void {
    this.identityValid = valid;
  }

  onCompleted(identity: string): void {
    this.identity = identity;
  }

  onReadCard(): void {
    this.router.navigate([ROUTE_ORDER_PRE_TO_POST_VALIDATE_CUSTOMER_ID_CARD_REPI_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onBack(): void {
    this.router.navigate([ROUTE_ORDER_PRE_TO_POST_CURRENT_INFO_PAGE]);
  }
  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
  }

}

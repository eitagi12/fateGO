import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, PageLoadingService, ApiRequestService, Utils, AlertService } from 'mychannel-shared-libs';
import { Transaction, TransactionType, TransactionAction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient } from '@angular/common/http';
import {
  ROUTE_ORDER_PRE_TO_POST_VALIDATE_CUSTOMER_ID_CARD_PAGE,
  ROUTE_ORDER_PRE_TO_POST_CURRENT_INFO_PAGE,
  ROUTE_ORDER_PRE_TO_POST_ELIGIBLE_MOBILE_PAGE
} from 'src/app/order/order-pre-to-post/constants/route-path.constant';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-order-pre-to-post-validate-customer-page',
  templateUrl: './order-pre-to-post-validate-customer-page.component.html',
  styleUrls: ['./order-pre-to-post-validate-customer-page.component.scss']
})
export class OrderPreToPostValidateCustomerPageComponent implements OnInit, OnDestroy {

  transaction: Transaction;

  identityValid = false;
  identity: string;

  constructor(
    private utils: Utils,
    private router: Router,
    private http: HttpClient,
    private homeService: HomeService,
    private alertService: AlertService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private apiRequestService: ApiRequestService,
  ) { 
    this.homeService.callback = () => {
      window.location.href = '/smart-shop';
    };
  }

  ngOnInit() {
    this.createTransaction();
  }

  onError(valid: boolean) {
    this.identityValid = valid;
  }

  onCompleted(identity: string) {
    this.identity = identity;
  }

  onReadCard() {
    this.router.navigate([ROUTE_ORDER_PRE_TO_POST_VALIDATE_CUSTOMER_ID_CARD_PAGE]);
  }

  onBack() {
    this.homeService.goToHome();
  }

  onHome() {
    this.homeService.goToHome();
  }

  onNext() {

    this.pageLoadingService.openLoading();

    if (this.utils.isMobileNo(this.identity)) {
      this.http.get('/api/customerportal/validate-customer-mobile-no-pre-to-post', {
        params: {
          mobileNo: this.identity
        }
      }).toPromise()
        .then((resp: any) => {
          this.transaction.data.simCard = { mobileNo: this.identity, persoSim: false };
          this.transaction.data.action = TransactionAction.KEY_IN_REPI;
          this.pageLoadingService.closeLoading();
          this.router.navigate([ROUTE_ORDER_PRE_TO_POST_CURRENT_INFO_PAGE]);
        })
        .catch((resp: any) => {
          this.alertService.error(resp.error.developerMessage);
        });
      return;
    }

    this.http.get('/api/customerportal/validate-customer-pre-to-post', {
      params: {
        identity: this.identity
      }
    }).toPromise()
      .then((resp: any) => {
        const data = resp.data || [];
        this.transaction.data.customer = data;
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
        this.router.navigate([ROUTE_ORDER_PRE_TO_POST_ELIGIBLE_MOBILE_PAGE]);
      })
      .catch((resp: any) => {
        this.alertService.error(resp.error.developerMessage);
      })
      .then(() => {
        this.pageLoadingService.closeLoading();
      });
  }

  customerValidate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const length = control.value.length;

    if (this.utils.isMobileNo(value)) {
      return null;
    } else {
      return {
        message: 'กรุณากรอกหมายเลขโทรศัพท์ให้ถูกต้อง',
      };
    }
  }

  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
  }

  private createTransaction() {
    // New x-api-request-id
    this.apiRequestService.createRequestId();

    this.transaction = {
      data: {
        transactionType: TransactionType.ORDER_PRE_TO_POST,
        action: TransactionAction.KEY_IN,
      }
    };
  }
}

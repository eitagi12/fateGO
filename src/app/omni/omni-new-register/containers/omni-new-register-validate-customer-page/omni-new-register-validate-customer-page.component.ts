import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  ROUTE_OMNI_NEW_REGISTER_CUSTOMER_INFO_PAGE,
  ROUTE_OMNI_NEW_REGISTER_VALIDATE_CUSTOMER_KEY_IN_PAGE
} from 'src/app/omni/omni-new-register/constants/route-path.constant';
import { Router } from '@angular/router';
import { HomeService, PageLoadingService } from 'mychannel-shared-libs';
import { HttpClient } from '@angular/common/http';
import { TransactionType, TransactionAction, Transaction } from 'src/app/omni/omni-shared/models/transaction.model';
import { TransactionService } from 'src/app/omni/omni-shared/services/transaction.service';

@Component({
  selector: 'app-omni-new-register-validate-customer-page',
  templateUrl: './omni-new-register-validate-customer-page.component.html',
  styleUrls: ['./omni-new-register-validate-customer-page.component.scss']
})
export class OmniNewRegisterValidateCustomerPageComponent implements OnInit, OnDestroy {

  transaction: Transaction;
  identityValid: boolean = false;
  identity: string;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
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
        this.router.navigate([ROUTE_OMNI_NEW_REGISTER_CUSTOMER_INFO_PAGE]);
      })
      .catch((e) => {
        this.router.navigate([ROUTE_OMNI_NEW_REGISTER_VALIDATE_CUSTOMER_KEY_IN_PAGE], {
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
    this.transaction = {
      data: {
        transactionType: TransactionType.OMNI_NEW_REGISTER,
        action: TransactionAction.KEY_IN,
      }
    };
  }
}

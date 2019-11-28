import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_NEW_SHARE_PLAN_MNP_CUSTOMER_INFO_PAGE, ROUTE_NEW_SHARE_PLAN_MNP_VALIDATE_CUSTOMER_ID_CARD_PAGE, ROUTE_NEW_SHARE_PLAN_MNP_VALIDATE_CUSTOMER_KEY_IN_PAGE } from '../../constants/route-path.constant';
import { PageLoadingService, Utils } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient } from '@angular/common/http';
import { Transaction, TransactionType, TransactionAction } from 'src/app/shared/models/transaction.model';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-new-share-plan-mnp-validate-customer-page',
  templateUrl: './new-share-plan-mnp-validate-customer-page.component.html',
  styleUrls: ['./new-share-plan-mnp-validate-customer-page.component.scss']
})
export class NewSharePlanMnpValidateCustomerPageComponent implements OnInit, OnDestroy {

  identityValid: Boolean;
  identity: string;
  transaction: Transaction;

  constructor(
    private router: Router,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private http: HttpClient,
    private utils: Utils
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

  validateCustomerIdentity(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const length: number = control.value.length;
    if (length === 13) {
      if (this.utils.isThaiIdCard(value)) {
        return null;
      } else {
        return {
          message: 'กรุณากรอกเลขบัตรประชาชนให้ถูกต้อง',
        };
      }
    } else {
      return {
        message: 'กรุณากรอกรูปแบบให้ถูกต้อง',
      };
    }
  }

  onReadCard(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_VALIDATE_CUSTOMER_ID_CARD_PAGE]);
  }

  onBack(): void {
    window.location.href = '/sales-portal/dashboard';
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
        if (customer.caNumber) {

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
                })
                .then((billingInformation: any) => {
                  this.transaction.data.billingInformation = billingInformation;
                  this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_CUSTOMER_INFO_PAGE]);
                })
                .catch((e) => {
                  this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_VALIDATE_CUSTOMER_KEY_IN_PAGE], {
                    queryParams: {
                      idCardNo: this.identity
                    }
                  });
                })
                .then(() => {
                  this.pageLoadingService.closeLoading();
                });
            });
        } else {
          this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_VALIDATE_CUSTOMER_KEY_IN_PAGE], {
            queryParams: {
              idCardNo: this.identity
            }
          }).then(() => {
            this.pageLoadingService.closeLoading();
          });
        }
      });
  }

  private createTransaction(): void {
    this.transaction = {
      data: {
        transactionType: TransactionType.ORDER_NEW_SHARE_PLAN_MNP,
        action: TransactionAction.KEY_IN,
      }
    };
  }

  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
  }

}

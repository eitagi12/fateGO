import { Component, OnInit, OnDestroy } from '@angular/core';
import { Transaction, TransactionType, TransactionAction } from 'src/app/shared/models/transaction.model';
import { Router } from '@angular/router';
import { HomeService, PageLoadingService } from 'mychannel-shared-libs';
import { HttpClient } from '@angular/common/http';
import {
  ROUTE_DEVICE_ORDER_AIS_EXISTING_VALIDATE_CUSTOMER_ID_CARD_PAGE,
  ROUTE_DEVICE_ORDER_AIS_EXISTING_VALIDATE_CUSTOMER_KEY_IN_PAGE,
  ROUTE_DEVICE_ORDER_AIS_EXISTING_CUSTOMER_INFO_PAGE
} from '../../constants/route-path.constant';
import { TransactionService } from 'src/app/shared/services/transaction.service';

@Component({
  selector: 'app-device-order-ais-existing-validate-customer-page',
  templateUrl: './device-order-ais-existing-validate-customer-page.component.html',
  styleUrls: ['./device-order-ais-existing-validate-customer-page.component.scss']
})
export class DeviceOrderAisExistingValidateCustomerPageComponent implements OnInit, OnDestroy {

  transaction: Transaction;
  identityValid: boolean = false;
  identity: string;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private http: HttpClient,
  ) {
    this.homeService.callback = () => {
      window.location.href = '';
    };
  }

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
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_VALIDATE_CUSTOMER_ID_CARD_PAGE]);
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
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_CUSTOMER_INFO_PAGE]);
      })
      .catch(() => {
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_VALIDATE_CUSTOMER_KEY_IN_PAGE], {
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
        transactionType: TransactionType.ORDER_NEW_REGISTER,
        action: TransactionAction.KEY_IN,
      }
    };
  }
}

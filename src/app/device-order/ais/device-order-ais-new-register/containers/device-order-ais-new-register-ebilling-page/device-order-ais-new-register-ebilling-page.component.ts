import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_ORDER_NEW_REGISTER } from 'src/app/order/constants/wizard.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { Router } from '@angular/router';
import { HomeService, Ebilling } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient } from '@angular/common/http';
import { ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_CONFIRM_USER_INFORMATION_PAGE } from 'src/app/device-order/ais/device-order-ais-new-register/constants/route-path.constant';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';

@Component({
  selector: 'app-device-order-ais-new-register-ebilling-page',
  templateUrl: './device-order-ais-new-register-ebilling-page.component.html',
  styleUrls: ['./device-order-ais-new-register-ebilling-page.component.scss']
})
export class DeviceOrderAisNewRegisterEbillingPageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;

  transaction: Transaction;

  billCycleValid: boolean;
  billCycle: any;
  billCycles: Ebilling[];

  constructor(
    private router: Router,
    private homeService: HomeService,
    private http: HttpClient,
    private transactionService: TransactionService,
  ) {
    this.transaction = this.transactionService.load();

    if (!this.transaction.data.billingInformation) {
      this.transaction.data.billingInformation = {};
    }
  }

  ngOnInit(): void {

    const customer: any = this.transaction.data.customer || {};
    const billingInformation: any = this.transaction.data.billingInformation || {};
    const billCycle = billingInformation.billCycle || {};

    this.http.get('/api/customerportal/newRegister/queryBillCycle', {
      params: {
        coProject: 'ํY'
      }
    }).toPromise().then((resp: any) => {
      const data = resp.data || {};
      this.billCycles = data.billCycles || [];

      this.billCycle = this.billCycles.find(billing => {
        return billCycle.bill ? billCycle.bill === billing.bill : customer.billCycle === billing.bill;
      });

      if (!this.billCycle) {
        this.billCycle = this.billCycles.find(bill => {
          return bill.billDefault === 'Y';
        });
      }
    });
  }

  setBillingDefault(ebilling: Ebilling[]): void {
    for (const ebill of ebilling) {
      if (ebill.bill === this.transaction.data.customer.billCycle) {
        this.billCycle = ebill;
      }
    }
  }

  onCompleted(billCycle: any): void {
    this.billCycle = billCycle;
  }

  onError(valid: boolean): void {
    this.billCycleValid = valid;
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_CONFIRM_USER_INFORMATION_PAGE]);
  }

  onNext(): void {
    this.transaction.data.billingInformation.billCycle = this.billCycle;
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_CONFIRM_USER_INFORMATION_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}

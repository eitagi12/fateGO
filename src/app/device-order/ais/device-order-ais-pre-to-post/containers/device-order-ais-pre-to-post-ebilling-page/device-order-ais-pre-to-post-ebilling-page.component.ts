import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, Ebilling } from 'mychannel-shared-libs';
import { HttpClient } from '@angular/common/http';

import { WIZARD_DEVICE_ORDER_AIS } from '../../../../constants/wizard.constant';
import {
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_CONFIRM_USER_INFORMATION_PAGE
} from '../../constants/route-path.constant';

import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
@Component({
  selector: 'app-device-order-ais-pre-to-post-ebilling-page',
  templateUrl: './device-order-ais-pre-to-post-ebilling-page.component.html',
  styleUrls: ['./device-order-ais-pre-to-post-ebilling-page.component.scss']
})
export class DeviceOrderAisPreToPostEbillingPageComponent implements OnInit, OnDestroy {

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

  onCompleted(billCycle: any): void {
    this.billCycle = billCycle;
  }

  onError(valid: boolean): void {
    this.billCycleValid = valid;
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_CONFIRM_USER_INFORMATION_PAGE]);
  }

  onNext(): void {
    this.transaction.data.billingInformation.billCycle = this.billCycle;
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_CONFIRM_USER_INFORMATION_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}

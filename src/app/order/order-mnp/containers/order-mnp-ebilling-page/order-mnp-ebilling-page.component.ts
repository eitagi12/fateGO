import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_ORDER_MNP } from 'src/app/order/constants/wizard.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { Router } from '@angular/router';
import { HomeService, Ebilling } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient } from '@angular/common/http';
import {
  ROUTE_ORDER_MNP_CONFIRM_USER_INFORMATION_PAGE
} from 'src/app/order/order-mnp/constants/route-path.constant';

@Component({
  selector: 'app-order-mnp-ebilling-page',
  templateUrl: './order-mnp-ebilling-page.component.html',
  styleUrls: ['./order-mnp-ebilling-page.component.scss']
})
export class OrderMnpEbillingPageComponent implements OnInit, OnDestroy {

  wizards = WIZARD_ORDER_MNP;

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

  ngOnInit() {
    this.http.get('/api/customerportal/newRegister/queryBillCycle', {
      params: {
        coProject: 'N'
      }
    }).toPromise().then((resp: any) => {
      const data = resp.data || {};
      this.billCycles = data.billCycles || [];
      if (!this.transaction.data.billingInformation.billCycle) {
        this.setBillingDefault(data.billCycles || []);
      } else {
        this.billCycle = this.transaction.data.billingInformation.billCycle;
      }
    });
  }

  setBillingDefault(ebilling: Ebilling[]) {
    for (const ebill of ebilling) {
      if (ebill.bill === this.transaction.data.customer.billCycle) {
        this.billCycle = ebill;
        // this.transaction.data.billingInformation.billCycle = this.billCycle;
      }
    }
  }

  onCompleted(billCycle: any) {
    this.billCycle = billCycle;
  }

  onError(valid: boolean) {
    this.billCycleValid = valid;
  }

  onBack() {
    this.router.navigate([ROUTE_ORDER_MNP_CONFIRM_USER_INFORMATION_PAGE]);
  }

  onNext() {
    this.transaction.data.billingInformation.billCycle = this.billCycle;
    this.router.navigate([ROUTE_ORDER_MNP_CONFIRM_USER_INFORMATION_PAGE]);
  }

  onHome() {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}


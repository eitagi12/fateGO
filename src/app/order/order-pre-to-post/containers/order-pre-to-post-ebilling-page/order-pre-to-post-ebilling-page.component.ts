import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, Ebilling } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient } from '@angular/common/http';
import { WIZARD_ORDER_PRE_TO_POST } from '../../../constants/wizard.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { ROUTE_ORDER_PRE_TO_POST_CONFIRM_USER_INFORMATION_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-order-pre-to-post-ebilling-page',
  templateUrl: './order-pre-to-post-ebilling-page.component.html',
  styleUrls: ['./order-pre-to-post-ebilling-page.component.scss']
})
export class OrderPreToPostEbillingPageComponent implements OnInit, OnDestroy {

  wizards = WIZARD_ORDER_PRE_TO_POST;

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
    this.router.navigate([ROUTE_ORDER_PRE_TO_POST_CONFIRM_USER_INFORMATION_PAGE]);
  }

  onNext() {
    this.transaction.data.billingInformation.billCycle = this.billCycle;

    this.router.navigate([ROUTE_ORDER_PRE_TO_POST_CONFIRM_USER_INFORMATION_PAGE]);
  }

  onHome() {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

}

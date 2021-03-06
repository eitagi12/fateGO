import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_ORDER_NEW_REGISTER } from 'src/app/order/constants/wizard.constant';
import { Router } from '@angular/router';
import { HomeService, Ebilling } from 'mychannel-shared-libs';
import { } from 'src/app/order/order-new-register/constants/route-path.constant';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TransactionService } from 'src/app/omni/omni-shared/services/transaction.service';
import { Transaction } from 'src/app/omni/omni-shared/models/transaction.model';
import { ROUTE_OMNI_NEW_REGISTER_SUMMARY_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-omni-new-register-ebilling-page',
  templateUrl: './omni-new-register-ebilling-page.component.html',
  styleUrls: ['./omni-new-register-ebilling-page.component.scss']
})
export class OmniNewRegisterEbillingPageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_ORDER_NEW_REGISTER;

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

    this.http.get('/api/customerportal/newRegister/queryBillCycle', {
      params: {
        coProject: 'Y'
      }
    }).toPromise().then((resp: any) => {
      const data = resp.data || {};
      this.billCycles = data.billCycles || [];
      this.setBillingDefault(data.billCycles || []);
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
    this.router.navigate([ROUTE_OMNI_NEW_REGISTER_SUMMARY_PAGE]);
  }

  onNext(): void {
    this.transaction.data.billingInformation.billCycles[0] = this.billCycle;
    this.transaction.data.customer.billCycle = this.billCycle.bill;
    this.router.navigate([ROUTE_OMNI_NEW_REGISTER_SUMMARY_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}

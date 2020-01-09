import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_OMNI_NEW_REGISTER } from 'src/app/omni/constants/wizard.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { Router } from '@angular/router';
import { HomeService, Ebilling } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ROUTE_OMNI_NEW_REGISTER_CONFIRM_USER_INFORMATION_PAGE } from 'src/app/omni/omni-new-register/constants/route-path.constant';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-omni-new-register-ebilling-page',
  templateUrl: './omni-new-register-ebilling-page.component.html',
  styleUrls: ['./omni-new-register-ebilling-page.component.scss']
})
export class OmniNewRegisterEbillingPageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_OMNI_NEW_REGISTER;

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
    this.router.navigate([ROUTE_OMNI_NEW_REGISTER_CONFIRM_USER_INFORMATION_PAGE]);
  }

  onNext(): void {
    this.transaction.data.billingInformation.billCycle = this.billCycle;
    this.router.navigate([ROUTE_OMNI_NEW_REGISTER_CONFIRM_USER_INFORMATION_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}

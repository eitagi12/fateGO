import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_ORDER_MNP } from 'src/app/order/constants/wizard.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
  billCycles: any[];
  billCycle: any;
  ebillingForm: FormGroup;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private http: HttpClient,
    private fb: FormBuilder,
  ) {
    this.transaction = this.transactionService.load();

    if (!this.transaction.data.billingInformation) {
      this.transaction.data.billingInformation = {};
    }
  }

  ngOnInit() {
    this.createForm();

    this.http.get('/api/customerportal/newRegister/queryBillCycle').toPromise().then((resp: any) => {
      const data = resp.data || {};
      this.billCycles = data.billCycles || [];
      this.setBillingDefault(data.billCycles || []);
    });
  }

  createForm() {
    const billingInformation = this.transaction.data.billingInformation;
    this.ebillingForm = this.fb.group({
      billCycle: [billingInformation.billCycle, Validators.required]
    });
  }

  setBillingDefault(ebilling: Ebilling[]) {
    for (const ebill of ebilling) {
      if (ebill.bill === this.transaction.data.customer.billCycle ) {
        this.billCycle = ebill;
        this.transaction.data.billingInformation.billCycle = this.billCycle;
      }
    }
  }

  checked(billCycle: any): boolean {
    const billingInformation = this.transaction.data.billingInformation;
    return JSON.stringify(billCycle) === JSON.stringify(billingInformation.billCycle || {});
  }

  onBack() {
    this.router.navigate([ROUTE_ORDER_MNP_CONFIRM_USER_INFORMATION_PAGE]);
  }

  onNext() {
    this.transaction.data.billingInformation.billCycle = this.ebillingForm.value.billCycle;
    this.router.navigate([ROUTE_ORDER_MNP_CONFIRM_USER_INFORMATION_PAGE]);
  }

  onHome() {
    this.homeService.goToHome();
  }

  getBillCycleText(billCycle: any): string {
    const bills = (billCycle.billCycle || '').split(' ');
    return `วันที่ ${bills[1]} ถึงวันที่ ${bills[3]} ของทุกเดือน`;
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

}

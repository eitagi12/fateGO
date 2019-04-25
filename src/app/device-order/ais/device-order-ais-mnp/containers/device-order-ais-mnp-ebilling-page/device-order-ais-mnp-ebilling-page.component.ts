import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_ORDER_MNP } from 'src/app/order/constants/wizard.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { Ebilling, HomeService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient } from '@angular/common/http';
import { ROUTE_DEVICE_ORDER_AIS_MNP_CONFIRM_USER_INFORMATION_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-mnp-ebilling-page',
  templateUrl: './device-order-ais-mnp-ebilling-page.component.html',
  styleUrls: ['./device-order-ais-mnp-ebilling-page.component.scss']
})
export class DeviceOrderAisMnpEbillingPageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_ORDER_MNP;

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
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_CONFIRM_USER_INFORMATION_PAGE]);
  }

  onNext(): void {
    this.transaction.data.billingInformation.billCycle = this.billCycle;
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_CONFIRM_USER_INFORMATION_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}

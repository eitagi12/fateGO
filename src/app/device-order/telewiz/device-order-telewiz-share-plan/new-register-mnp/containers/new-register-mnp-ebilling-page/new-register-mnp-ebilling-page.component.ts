import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, Ebilling } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient } from '@angular/common/http';
import { ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_CONFIRM_USER_INFORMATION_PAGE } from '../../constants/route-path.constant';
import {
  WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN_TELEWIZ,
  WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN_JAYMART
} from 'src/app/device-order/constants/wizard.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { RemoveCartService } from '../../services/remove-cart.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';

@Component({
  selector: 'app-new-register-mnp-ebilling-page',
  templateUrl: './new-register-mnp-ebilling-page.component.html',
  styleUrls: ['./new-register-mnp-ebilling-page.component.scss']
})
export class NewRegisterMnpEbillingPageComponent implements OnInit, OnDestroy {
  wizards: string[];
  wizardTelewiz: string[] = WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN_TELEWIZ;
  wizardJaymart: string[] = WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN_JAYMART;

  transaction: Transaction;
  priceOption: PriceOption;
  billCycleValid: boolean;
  billCycle: any;
  billCycles: Ebilling[];

  constructor(
    private router: Router,
    private homeService: HomeService,
    private http: HttpClient,
    private transactionService: TransactionService,
    private removeCartService: RemoveCartService,
    private priceOptionService: PriceOptionService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    if (!this.transaction.data.billingInformation) {
      this.transaction.data.billingInformation = {};
    }
  }

  ngOnInit(): void {
    this.checkJaymart();
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

  checkJaymart(): void {
    const retailChain = this.priceOption.queryParams.isRole;
    if (retailChain && retailChain === 'Retail Chain') {
      this.wizards = this.wizardJaymart;
    } else {
      this.wizards = this.wizardTelewiz;
    }
  }

  setBillingDefault(ebilling: Ebilling[]): void {
    for (const ebill of ebilling) {
      if (ebill.bill === this.transaction.data.customer.billCycle) {
        this.billCycle = ebill;
      }
    }
  }

  onError(valid: boolean): void {
    this.billCycleValid = valid;
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_CONFIRM_USER_INFORMATION_PAGE]);
  }

  onNext(): void {
    this.transaction.data.billingInformation.billCycle = this.billCycle;
    this.router.navigate([ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_CONFIRM_USER_INFORMATION_PAGE]);
  }

  onHome(): void {
    this.removeCartService.backToReturnStock('/', this.transaction);
  }

  onCompleted(billCycle: any): void {
    this.billCycle = billCycle;
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

}

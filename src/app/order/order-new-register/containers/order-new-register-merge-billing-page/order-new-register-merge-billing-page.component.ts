import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_ORDER_NEW_REGISTER } from 'src/app/order/constants/wizard.constant';
import { Router } from '@angular/router';
import { HomeService } from 'mychannel-shared-libs';
import {
  ROUTE_ORDER_NEW_REGISTER_ON_TOP_PAGE,
  ROUTE_ORDER_NEW_REGISTER_CONFIRM_USER_INFORMATION_PAGE,
  ROUTE_ORDER_NEW_REGISTER_SELECT_PACKAGE_PAGE
} from 'src/app/order/order-new-register/constants/route-path.constant';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';

@Component({
  selector: 'app-order-new-register-merge-billing-page',
  templateUrl: './order-new-register-merge-billing-page.component.html',
  styleUrls: ['./order-new-register-merge-billing-page.component.scss']
})
export class OrderNewRegisterMergeBillingPageComponent implements OnInit, OnDestroy {

  readonly REGEX_NET_EXTREME = /[Nn]et[Ee]xtreme/;

  wizards = WIZARD_ORDER_NEW_REGISTER;

  transaction: Transaction;

  billingCyles: any[];
  mergeBilling: any;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private homeService: HomeService,
    private transactionService: TransactionService
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit() {
    this.billingCyles = this.getBillingCycles();
    this.mergeBilling = this.transaction.data.billingInformation.mergeBilling;
  }

  getBillingCycles(): any[] {
    const mainPackage = this.transaction.data.mainPackage;
    const billingInformation = this.transaction.data.billingInformation;
    let billCycles = [];
    if (this.isPackageNetExtreme()) {
      billCycles = billingInformation.billCyclesNetExtreme;
    } else {
      billCycles = billingInformation.billCycles;
    }

    return billCycles.filter((billCycle: any) => {
      return billCycle.mobileNo && billCycle.mobileNo.length > 0
        && mainPackage.billingSystem === billCycle.billingSystem
        && billCycle.productPkg.indexOf('Cash Back') === -1;
    }).reduce((previousValue: any[], currentValue: any) => {
      const billing = (currentValue.mobileNo || []).map((mobileNo: string) => {
        const billCycleExtract = Object.assign({}, currentValue);
        billCycleExtract.mobileNo = [mobileNo];
        return billCycleExtract;
      });
      return previousValue.concat(billing);
    }, []);
  }

  isPackageNetExtreme(): boolean {
    const mainPackage = this.transaction.data.mainPackage;
    return mainPackage && this.REGEX_NET_EXTREME.test(mainPackage.productPkg);
  }

  onBack() {
    if (this.isPackageNetExtreme()) {
      if (this.transaction.data.onTopPackage) {
        this.router.navigate([ROUTE_ORDER_NEW_REGISTER_ON_TOP_PAGE]);
      } else {
        this.router.navigate([ROUTE_ORDER_NEW_REGISTER_SELECT_PACKAGE_PAGE]);
      }
    } else {
      this.router.navigate([ROUTE_ORDER_NEW_REGISTER_CONFIRM_USER_INFORMATION_PAGE]);
    }
  }

  onNext() {
    this.router.navigate([ROUTE_ORDER_NEW_REGISTER_CONFIRM_USER_INFORMATION_PAGE]);
  }

  onCompleted(even: any) {
    this.transaction.data.billingInformation.mergeBilling = even;
  }

  onHome() {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}

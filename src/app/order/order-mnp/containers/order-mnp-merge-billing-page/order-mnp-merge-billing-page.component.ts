import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_ORDER_MNP } from 'src/app/order/constants/wizard.constant';
import { Router } from '@angular/router';
import { HomeService } from 'mychannel-shared-libs';
import { Transaction, BillingAccount } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import {
  ROUTE_ORDER_MNP_ON_TOP_PAGE,
  ROUTE_ORDER_MNP_CONFIRM_USER_INFORMATION_PAGE,
  ROUTE_ORDER_MNP_SELECT_PACKAGE_PAGE
} from 'src/app/order/order-mnp/constants/route-path.constant';

@Component({
  selector: 'app-order-mnp-merge-billing-page',
  templateUrl: './order-mnp-merge-billing-page.component.html',
  styleUrls: ['./order-mnp-merge-billing-page.component.scss']
})
export class OrderMnpMergeBillingPageComponent implements OnInit, OnDestroy {

  readonly REGEX_NET_EXTREME = /[Nn]et[Ee]xtreme/;
  wizards = WIZARD_ORDER_MNP;

  transaction: Transaction;

  billingCyles: any[];
  mergeBillingTmp: BillingAccount;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit() {
    this.billingCyles = this.getBillingCycles();
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
        this.router.navigate([ROUTE_ORDER_MNP_ON_TOP_PAGE]);
      } else {
        this.router.navigate([ROUTE_ORDER_MNP_SELECT_PACKAGE_PAGE]);
      }
    } else {
      this.router.navigate([ROUTE_ORDER_MNP_CONFIRM_USER_INFORMATION_PAGE]);
    }
  }

  onCompleted(mergeBilling: BillingAccount) {
    this.mergeBillingTmp = mergeBilling;
  }

  onNext() {
    this.transaction.data.billingInformation.mergeBilling = this.mergeBillingTmp;
    this.router.navigate([ROUTE_ORDER_MNP_CONFIRM_USER_INFORMATION_PAGE]);
  }

  onHome() {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

}

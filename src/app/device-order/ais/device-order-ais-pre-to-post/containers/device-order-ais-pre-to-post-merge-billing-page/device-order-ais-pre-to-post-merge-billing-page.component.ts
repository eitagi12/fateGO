import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { HomeService } from 'mychannel-shared-libs';

import { WIZARD_DEVICE_ORDER_AIS } from '../../../../constants/wizard.constant';
import {
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_ON_TOP_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_CONFIRM_USER_INFORMATION_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_SELECT_PACKAGE_PAGE
} from '../../constants/route-path.constant';

import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';

@Component({
  selector: 'app-device-order-ais-pre-to-post-merge-billing-page',
  templateUrl: './device-order-ais-pre-to-post-merge-billing-page.component.html',
  styleUrls: ['./device-order-ais-pre-to-post-merge-billing-page.component.scss']
})
export class DeviceOrderAisPreToPostMergeBillingPageComponent implements OnInit, OnDestroy {

  readonly REGEX_NET_EXTREME: RegExp = /[Nn]et[Ee]xtreme/;
  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;

  transaction: Transaction;

  billingCyles: any[];
  mergeBilling: any;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private homeService: HomeService,
    private transactionService: TransactionService,
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
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

  onBack(): void {
    if (this.isPackageNetExtreme()) {
      if (this.transaction.data.onTopPackage) {
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_ON_TOP_PAGE]);
      } else {
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_SELECT_PACKAGE_PAGE]);
      }
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_CONFIRM_USER_INFORMATION_PAGE]);
    }
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_CONFIRM_USER_INFORMATION_PAGE]);
  }

  onCompleted(even: any): void {
    this.transaction.data.billingInformation.mergeBilling = even;
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

}

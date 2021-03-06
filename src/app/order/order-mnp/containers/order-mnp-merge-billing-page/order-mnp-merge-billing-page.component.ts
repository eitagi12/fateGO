import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_ORDER_MNP } from 'src/app/order/constants/wizard.constant';
import { Router } from '@angular/router';
import { HomeService, PageLoadingService } from 'mychannel-shared-libs';
import { Transaction, BillingAccount } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import {
  ROUTE_ORDER_MNP_ON_TOP_PAGE,
  ROUTE_ORDER_MNP_CONFIRM_USER_INFORMATION_PAGE,
  ROUTE_ORDER_MNP_SELECT_PACKAGE_PAGE
} from 'src/app/order/order-mnp/constants/route-path.constant';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-order-mnp-merge-billing-page',
  templateUrl: './order-mnp-merge-billing-page.component.html',
  styleUrls: ['./order-mnp-merge-billing-page.component.scss']
})
export class OrderMnpMergeBillingPageComponent implements OnInit, OnDestroy {

  readonly REGEX_NET_EXTREME: RegExp = /[Nn]et[Ee]xtreme/;
  wizards: string[] = WIZARD_ORDER_MNP;

  transaction: Transaction;

  billingCyles: any[];
  mergeBilling: BillingAccount;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private pageLoadingService: PageLoadingService,
    private http: HttpClient,
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.getBillingCycles();
    this.mergeBilling = this.transaction.data.billingInformation.mergeBilling;
  }

  getBillingCycles(): void {
    const mainPackage = this.transaction.data.mainPackage;
    const billingInformation = this.transaction.data.billingInformation;
    const idCard = this.transaction.data.customer.idCardNo;
    this.pageLoadingService.openLoading();
    // ปรับ flow ใหม่ เวลา merge bill ให้เรียก serivce queryMergebillAccount
    this.http.get(`/api/customerportal/newRegister/${idCard}/queryMergebillAccount`)
      .toPromise()
      .then((res: any) => {
        const data = res.data || [];
        return this.isPackageNetExtreme() ? billingInformation.billCyclesNetExtreme : data.billingAccountList;
      })
      .then((billCycles: any) => {
        // old logic
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
        // end logic
      })
      .then((billCyclesData: any) => {
        this.pageLoadingService.closeLoading();
        this.billingCyles = billCyclesData;
      });
  }

  isPackageNetExtreme(): boolean {
    const mainPackage = this.transaction.data.mainPackage;
    return mainPackage && this.REGEX_NET_EXTREME.test(mainPackage.productPkg);
  }

  onBack(): void {
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

  onCompleted(mergeBilling: BillingAccount): void {
    this.mergeBilling = mergeBilling;
    // this.transaction.data.billingInformation.mergeBilling = even;
  }

  onNext(): void {
    this.transaction.data.billingInformation.mergeBilling = this.mergeBilling;
    this.router.navigate([ROUTE_ORDER_MNP_CONFIRM_USER_INFORMATION_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

}

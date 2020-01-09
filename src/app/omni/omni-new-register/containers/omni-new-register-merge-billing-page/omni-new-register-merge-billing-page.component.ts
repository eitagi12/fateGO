import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_OMNI_NEW_REGISTER } from 'src/app/omni/constants/wizard.constant';
import { Router } from '@angular/router';
import { HomeService, PageLoadingService } from 'mychannel-shared-libs';
import {
  ROUTE_OMNI_NEW_REGISTER_ON_TOP_PAGE,
  ROUTE_OMNI_NEW_REGISTER_CONFIRM_USER_INFORMATION_PAGE,
  ROUTE_OMNI_NEW_REGISTER_FACE_CONFIRM_PAGE,
} from 'src/app/omni/omni-new-register/constants/route-path.constant';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Transaction, BillingAccount } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-omni-new-register-merge-billing-page',
  templateUrl: './omni-new-register-merge-billing-page.component.html',
  styleUrls: ['./omni-new-register-merge-billing-page.component.scss']
})
export class OmniNewRegisterMergeBillingPageComponent implements OnInit, OnDestroy {

  readonly REGEX_NET_EXTREME: RegExp = /[Nn]et[Ee]xtreme/;

  wizards: string[] = WIZARD_OMNI_NEW_REGISTER;

  transaction: Transaction;

  billingCyles: any[];
  mergeBilling: BillingAccount;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private homeService: HomeService,
    private http: HttpClient,
    private transactionService: TransactionService,
    private pageLoadingService: PageLoadingService,
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
        this.router.navigate([ROUTE_OMNI_NEW_REGISTER_ON_TOP_PAGE]);
      } else {
        this.router.navigate([ROUTE_OMNI_NEW_REGISTER_FACE_CONFIRM_PAGE]);
      }
    } else {
      this.router.navigate([ROUTE_OMNI_NEW_REGISTER_CONFIRM_USER_INFORMATION_PAGE]);
    }
  }

  onNext(): void {
    this.transaction.data.billingInformation.mergeBilling = this.mergeBilling;
    this.router.navigate([ROUTE_OMNI_NEW_REGISTER_CONFIRM_USER_INFORMATION_PAGE]);
  }

  onCompleted(mergeBilling: BillingAccount): void {
    this.mergeBilling = mergeBilling;
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

  // เก็บไว้ก่อนเผื่อมีปัญหา
  // getBillingCycles(): any[] {
  //   const mainPackage = this.transaction.data.mainPackage;
  //   const billingInformation = this.transaction.data.billingInformation;
  //   let billCycles = [];
  //   if (this.isPackageNetExtreme()) {
  //     billCycles = billingInformation.billCyclesNetExtreme;
  //   } else {
  //     billCycles = billingInformation.billCycles;
  //   }

  //   return billCycles.filter((billCycle: any) => {
  //     return billCycle.mobileNo && billCycle.mobileNo.length > 0
  //       && mainPackage.billingSystem === billCycle.billingSystem
  //       && billCycle.productPkg.indexOf('Cash Back') === -1;
  //   }).reduce((previousValue: any[], currentValue: any) => {
  //     const billing = (currentValue.mobileNo || []).map((mobileNo: string) => {
  //       const billCycleExtract = Object.assign({}, currentValue);
  //       billCycleExtract.mobileNo = [mobileNo];
  //       return billCycleExtract;
  //     });
  //     return previousValue.concat(billing);
  //   }, []);
  // }
}

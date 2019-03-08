import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_ORDER_MNP } from 'src/app/order/constants/wizard.constant';
import { HomeService, PageLoadingService, AlertService, OneLove } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient } from '@angular/common/http';

import {
  ROUTE_ORDER_MNP_ON_TOP_PAGE,
  ROUTE_ORDER_MNP_SELECT_PACKAGE_PAGE
} from 'src/app/order/order-mnp/constants/route-path.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-order-mnp-one-love-page',
  templateUrl: './order-mnp-one-love-page.component.html',
  styleUrls: ['./order-mnp-one-love-page.component.scss']
})
export class OrderMnpOneLovePageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_ORDER_MNP;
  oneLove: OneLove;
  transaction: Transaction;
  mobileOneLove: string[];
  isError: boolean;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private alertService: AlertService,
    private http: HttpClient,
    private transactionService: TransactionService,
    private pageLoadingService: PageLoadingService
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    const mainPackage = this.transaction.data.mainPackage;
    const numberOfMobile = mainPackage ? +mainPackage.numberOfMobile : 0;
    this.oneLove = {
      numberOfMobile: numberOfMobile,
      mainPackageText: mainPackage.shortNameThai
    };
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onBack(): void {
    this.router.navigate([ROUTE_ORDER_MNP_SELECT_PACKAGE_PAGE]);
  }

  onNext(): void {
    const mainPackage = this.transaction.data.mainPackage;
    const parameters = mainPackage.parameters || [];

    this.transaction.data.mainPackageOneLove = this.mobileOneLove.map((mobileNo: string, index: number) => {
      const parameter: any[] = (parameters[index].Parameter || []).filter((param: any) => {
        return param.Name !== 'attributeValue';
      });
      return [{
        Name: 'attributeValue',
        Value: mobileNo
      }].concat(parameter);
    });
    this.router.navigate([ROUTE_ORDER_MNP_ON_TOP_PAGE]);
  }

  onCompleted(value: any): void {
    this.mobileOneLove = value;
  }

  onError(error: boolean): void {
    this.isError = error;
  }

  callService(mobileNo: string): Promise<void> {

    this.pageLoadingService.openLoading();

    return new Promise((resolve, reject) => {

      this.http.get(`/api/customerportal/customerprofile/${mobileNo}`).toPromise()
        .then((resp: any) => {
          const data = resp.data || {};

          const mobileStatus = (data.mobileStatus || '').toLowerCase();
          if (environment.MOBILE_STATUS.indexOf(mobileStatus) === -1) {
            this.alertService.error('หมายเลขดังกล่าวไม่สามารถใช้งานได้');
            return reject();
          }
          this.pageLoadingService.closeLoading();
          return resolve();
        })
        .catch(() => {
          this.pageLoadingService.closeLoading();
          this.alertService.error('หมายเลขดังกล่าวไม่ใช่เครือข่าย AIS');
          reject();
        });
    });
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}

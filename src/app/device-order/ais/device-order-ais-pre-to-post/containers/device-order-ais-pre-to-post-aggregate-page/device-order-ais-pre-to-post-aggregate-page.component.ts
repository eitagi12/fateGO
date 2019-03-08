import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, PageLoadingService } from 'mychannel-shared-libs';
import { HttpClient } from '@angular/common/http';

import { WIZARD_DEVICE_ORDER_AIS } from '../../../../constants/wizard.constant';
import {
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_RESULT_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_AGREEMENT_SIGN_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_EAPPLICATION_PAGE
} from '../../constants/route-path.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';

export interface Balance {
  remainingBalance: number;
  transferBalance: number;
  validityDate: string;
}
export interface CurrentServices {
  canTransfer: boolean;
  serviceCode: string;
  serviceName: string;
}

@Component({
  selector: 'app-device-order-ais-pre-to-post-aggregate-page',
  templateUrl: './device-order-ais-pre-to-post-aggregate-page.component.html',
  styleUrls: ['./device-order-ais-pre-to-post-aggregate-page.component.scss']
})
export class DeviceOrderAisPreToPostAggregatePageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;

  transaction: Transaction;
  mobileNo: string;

  balance: Balance;
  serviceChange: CurrentServices[];
  serviceAfterChanged: CurrentServices[];

  constructor(
    private router: Router,
    private http: HttpClient,
    private transactionService: TransactionService,
    private homeService: HomeService,
    private pageLoadingService: PageLoadingService
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.mobileNo = this.transaction.data.simCard.mobileNo;

    this.pageLoadingService.openLoading();

    this.http.get(`/api/customerportal/newRegister/${this.mobileNo}/queryBalance`).toPromise()
      .then((resp: any) => {

        this.balance = resp.data || [];
        return this.http.get(`/api/customerportal/newRegister/${this.mobileNo}/queryCurrentServices`).toPromise();

      }).then((resp: any) => {

        const currentServices = resp.data || [];
        this.serviceChange = currentServices.services.filter(service => service.canTransfer);
        this.pageLoadingService.closeLoading();

      }).catch((error: any) => {
        this.pageLoadingService.closeLoading();
      });
  }

  onTermConditions(event: any): void {}

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_AGREEMENT_SIGN_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_EAPPLICATION_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

}

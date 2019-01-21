import { Component, OnInit, OnDestroy } from '@angular/core';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { Router } from '@angular/router';
import { CreateEapplicationService } from 'src/app/shared/services/create-eapplication.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HomeService, PageLoadingService } from 'mychannel-shared-libs';
import {
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_RESULT_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_AGGREGATE_PAGE
} from '../../constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-pre-to-post-eapplication-page',
  templateUrl: './device-order-ais-pre-to-post-eapplication-page.component.html',
  styleUrls: ['./device-order-ais-pre-to-post-eapplication-page.component.scss']
})
export class DeviceOrderAisPreToPostEapplicationPageComponent implements OnInit, OnDestroy {

  transaction: Transaction;
  getDataBase64Eapp: string;

  constructor(
    private router: Router,
    private createEapplicationService: CreateEapplicationService,
    private transactionService: TransactionService,
    private homeService: HomeService,
    private pageLoadingService: PageLoadingService) { }

  ngOnInit() {
    this.pageLoadingService.openLoading();
    this.transaction = this.transactionService.load();
    this.createEapplicationService.createEapplication(this.transaction).then(res => {
      this.getDataBase64Eapp = 'data:image/jpeg;base64,' + res.data;
      this.pageLoadingService.closeLoading();
    }).catch(() => {
      this.pageLoadingService.closeLoading();
    });
  }

  onBack() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_AGGREGATE_PAGE]);
  }

  onNext() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_RESULT_PAGE]);
  }

  onHome() {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { Router } from '@angular/router';
import { CreateEapplicationService } from 'src/app/shared/services/create-eapplication.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { CreateNewRegisterService } from 'src/app/shared/services/create-new-register.service';
import { HomeService, PageLoadingService } from 'mychannel-shared-libs';
import {
  ROUTE_ORDER_MNP_AGREEMENT_SIGN_PAGE,
  ROUTE_ORDER_MNP_RESULT_PAGE,
  ROUTE_ORDER_MNP_PERSO_SIM_PAGE } from '../../constants/route-path.constant';
@Component({
  selector: 'app-order-mnp-eapplication-page',
  templateUrl: './order-mnp-eapplication-page.component.html',
  styleUrls: ['./order-mnp-eapplication-page.component.scss']
})
export class OrderMnpEapplicationPageComponent implements OnInit, OnDestroy {

  transaction: Transaction;
  getDataBase64Eapp: string;

  constructor(
    private router: Router,
    private createEapplicationService: CreateEapplicationService,
    private transactionService: TransactionService,
    private homeService: HomeService,
    private pageLoadingService: PageLoadingService) { }

  ngOnInit(): void {
    this.pageLoadingService.openLoading();
    this.transaction = this.transactionService.load();
    this.createEapplicationService.createEapplication(this.transaction).then(res => {
      this.getDataBase64Eapp = 'data:image/jpeg;base64,' + res.data;
      this.pageLoadingService.closeLoading();
    }).catch(() => {
      this.pageLoadingService.closeLoading();
    });
  }

  onBack(): void {
    this.router.navigate([ROUTE_ORDER_MNP_AGREEMENT_SIGN_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_ORDER_MNP_PERSO_SIM_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

}

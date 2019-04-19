import { Component, OnInit, OnDestroy } from '@angular/core';
import { CreateEapplicationService } from 'src/app/shared/services/create-eapplication.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Router } from '@angular/router';
import { HomeService, PageLoadingService } from 'mychannel-shared-libs';
import { ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_AGREEMENT_SIGN_PAGE, ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_PERSO_SIM_PAGE, ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_SUMMARY_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-new-register-agreement-page',
  templateUrl: './device-order-ais-new-register-agreement-page.component.html',
  styleUrls: ['./device-order-ais-new-register-agreement-page.component.scss']
})
export class DeviceOrderAisNewRegisterAgreementPageComponent implements OnInit, OnDestroy {
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
    }).then(() => {
      this.pageLoadingService.closeLoading();
    });
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_SUMMARY_PAGE]);
  }

  onNext(): void {
    if (this.transaction.data.simCard.simSerial) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_AGREEMENT_SIGN_PAGE]);
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_PERSO_SIM_PAGE]);
    }
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

}

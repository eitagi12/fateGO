import { Component, OnInit, OnDestroy } from '@angular/core';
import { CreateEapplicationService } from 'src/app/shared/services/create-eapplication.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Router } from '@angular/router';
import { HomeService, PageLoadingService } from 'mychannel-shared-libs';
import { ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_AGREEMENT_SIGN_PAGE, ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_ECONTACT_PAGE, ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_PERSO_SIM_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-new-register-eapplication-page',
  templateUrl: './device-order-ais-new-register-eapplication-page.component.html',
  styleUrls: ['./device-order-ais-new-register-eapplication-page.component.scss']
})
export class DeviceOrderAisNewRegisterEapplicationPageComponent implements OnInit, OnDestroy {
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
      console.log('res', this.transaction.data.transactionType);
      this.getDataBase64Eapp = 'data:image/jpeg;base64,' + res.data;
    }).then(() => {
      this.pageLoadingService.closeLoading();
    });
  }

  onBack() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_ECONTACT_PAGE]);
  }

  onNext() {
    // if (this.transaction.data.simCard.simSerial) {
    //   this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_AGREEMENT_SIGN_PAGE]);
    // } else {
    //   this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_PERSO_SIM_PAGE]);
    // }
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_AGREEMENT_SIGN_PAGE]);
  }

  onHome() {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}

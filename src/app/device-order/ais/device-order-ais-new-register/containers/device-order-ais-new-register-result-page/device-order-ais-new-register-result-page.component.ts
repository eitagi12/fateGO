import { Component, OnInit } from '@angular/core';
import { WIZARD_ORDER_NEW_REGISTER } from 'src/app/order/constants/wizard.constant';
import { HomeService, PageLoadingService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { CreateNewRegisterService } from 'src/app/shared/services/create-new-register.service';
import { ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_QUEUE_PAGE } from '../../constants/route-path.constant';
import { Router } from '@angular/router';

@Component({
  selector: 'app-device-order-ais-new-register-result-page',
  templateUrl: './device-order-ais-new-register-result-page.component.html',
  styleUrls: ['./device-order-ais-new-register-result-page.component.scss']
})
export class DeviceOrderAisNewRegisterResultPageComponent implements OnInit {

  wizards = WIZARD_ORDER_NEW_REGISTER;
  transaction: Transaction;
  isSuccess: boolean;

  constructor(
    private homeService: HomeService,
    private transactionService: TransactionService,
    private createNewRegisterService: CreateNewRegisterService,
    private pageLoadingService: PageLoadingService,
    private router: Router,
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit() {
    this.isSuccess = true;
  }

  onMainMenu() {
    this.homeService.goToHome();
  }

  onBack() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_QUEUE_PAGE]);
  }

}

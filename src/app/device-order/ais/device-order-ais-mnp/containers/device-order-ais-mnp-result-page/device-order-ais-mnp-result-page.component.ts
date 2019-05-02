import { Component, OnInit } from '@angular/core';
import { WIZARD_ORDER_MNP } from 'src/app/order/constants/wizard.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { HomeService, PageLoadingService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { CreateNewRegisterService } from 'src/app/shared/services/create-new-register.service';
import { Router } from '@angular/router';
import { ROUTE_DEVICE_ORDER_AIS_MNP_QUEUE_PAGE } from '../../constants/route-path.constant';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-device-order-ais-mnp-result-page',
  templateUrl: './device-order-ais-mnp-result-page.component.html',
  styleUrls: ['./device-order-ais-mnp-result-page.component.scss']
})
export class DeviceOrderAisMnpResultPageComponent implements OnInit {

  wizards: string[] = WIZARD_ORDER_MNP;
  transaction: Transaction;
  isSuccess: boolean;

  constructor(
    private transactionService: TransactionService,
    private createNewRegisterService: CreateNewRegisterService,
    private pageLoadingService: PageLoadingService,
    private router: Router,
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.isSuccess = true;
  }

  onMainMenu(): void {
    if (environment.name === 'LOCAL') {
      window.location.href = '/main-menu';
    } else {
      window.location.href = '/smart-digital/main-menu';
    }
  }

}

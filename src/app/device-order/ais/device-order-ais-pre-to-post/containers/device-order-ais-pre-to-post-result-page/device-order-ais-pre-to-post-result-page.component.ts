import { Component, OnInit } from '@angular/core';
import { WIZARD_ORDER_NEW_REGISTER } from 'src/app/order/constants/wizard.constant';
import { HomeService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_QUEUE_PAGE } from '../../constants/route-path.constant';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-device-order-ais-pre-to-post-result-page',
  templateUrl: './device-order-ais-pre-to-post-result-page.component.html',
  styleUrls: ['./device-order-ais-pre-to-post-result-page.component.scss']
})
export class DeviceOrderAisPreToPostResultPageComponent implements OnInit {

  wizards: string[] = WIZARD_ORDER_NEW_REGISTER;
  transaction: Transaction;
  isSuccess: boolean;

  constructor(
    private transactionService: TransactionService,
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

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_QUEUE_PAGE]);
  }

}

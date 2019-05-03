import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ROUTE_DEVICE_ORDER_AIS_EXISTING_RESULT_PAGE } from '../../constants/route-path.constant';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-device-order-ais-existing-result-page',
  templateUrl: './device-order-ais-existing-result-page.component.html',
  styleUrls: ['./device-order-ais-existing-result-page.component.scss']
})
export class DeviceOrderAisExistingResultPageComponent implements OnInit {

  transaction: Transaction;
  isSuccess: boolean;

  constructor(
    private transactionService: TransactionService

  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.isSuccess = true;
  }

  onHome(): void {
    if (environment.name === 'LOCAL') {
      window.location.href = '/main-menu';
    } else {
      window.location.href = '/smart-digital/main-menu';
    }

  }

}

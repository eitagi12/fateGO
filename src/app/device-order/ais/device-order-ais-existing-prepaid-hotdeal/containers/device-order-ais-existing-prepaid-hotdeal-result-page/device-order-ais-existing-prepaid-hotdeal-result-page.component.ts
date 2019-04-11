import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from 'mychannel-shared-libs';
import { ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_RESULT_PAGE, ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_AGGREGATE_PAGE } from '../../constants/route-path.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';

@Component({
  selector: 'app-device-order-ais-existing-prepaid-hotdeal-result-page',
  templateUrl: './device-order-ais-existing-prepaid-hotdeal-result-page.component.html',
  styleUrls: ['./device-order-ais-existing-prepaid-hotdeal-result-page.component.scss']
})
export class DeviceOrderAisExistingPrepaidHotdealResultPageComponent implements OnInit {

  transaction: Transaction;
  isSuccess: boolean;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
  ) {
    this.transaction = this.transactionService.load();
   }

  ngOnInit(): void {
    this.isSuccess = true;
  }

  onHome(): void {
    this.homeService.goToHome();
  }
}

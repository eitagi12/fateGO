import { Component, OnInit } from '@angular/core';
import { WIZARD_ORDER_NEW_REGISTER } from 'src/app/order/constants/wizard.constant';
import { HomeService, PageLoadingService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { CreatePreToPostService } from 'src/app/shared/services/create-pre-to-post.service';
import { ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_QUEUE_PAGE } from '../../constants/route-path.constant';
import { Router } from '@angular/router';

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
    private homeService: HomeService,
    private transactionService: TransactionService,
    private createPreToPostService: CreatePreToPostService,
    private pageLoadingService: PageLoadingService,
    private router: Router,
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.isSuccess = true;
  }

  onMainMenu(): void {
    this.homeService.goToHome();
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_QUEUE_PAGE]);
  }

}

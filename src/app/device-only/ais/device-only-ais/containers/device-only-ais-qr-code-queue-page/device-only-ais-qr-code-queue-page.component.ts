import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_DEVICE_ONLY_AIS_QUEUE_PAGE } from '../../constants/route-path.constant';
import { HomeService, AlertService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { CreateOrderService } from '../../services/create-order.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { HomeButtonService } from '../../services/home-button.service';

@Component({
  selector: 'app-device-only-ais-qr-code-queue-page',
  templateUrl: './device-only-ais-qr-code-queue-page.component.html',
  styleUrls: ['./device-only-ais-qr-code-queue-page.component.scss']
})
export class DeviceOnlyAisQrCodeQueuePageComponent implements OnInit, OnDestroy {

  transaction: Transaction;
  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private homeButtonService: HomeButtonService
    ) {
      this.transaction = this.transactionService.load();
     }

  ngOnInit(): void {
    this.homeButtonService.initEventButtonHome();
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ONLY_AIS_QUEUE_PAGE]);
  }
  ngOnDestroy(): void {

  }
}

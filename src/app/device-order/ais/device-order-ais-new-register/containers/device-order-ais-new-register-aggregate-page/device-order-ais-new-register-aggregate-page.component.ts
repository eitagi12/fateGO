import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, Aggregate } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_FACE_COMPARE_PAGE, ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_QUEUE_PAGE } from 'src/app/device-order/ais/device-order-ais-new-register/constants/route-path.constant';
@Component({
  selector: 'app-device-order-ais-new-register-aggregate-page',
  templateUrl: './device-order-ais-new-register-aggregate-page.component.html',
  styleUrls: ['./device-order-ais-new-register-aggregate-page.component.scss']
})
export class DeviceOrderAisNewRegisterAggregatePageComponent implements OnInit, OnDestroy {
  transaction: Transaction;
  aggregate: Aggregate;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit() { }

  onBack() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_FACE_COMPARE_PAGE]);
  }

  onNext() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_QUEUE_PAGE]);
  }

  onHome() {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    // this.transactionService.update(this.transaction);
  }
}

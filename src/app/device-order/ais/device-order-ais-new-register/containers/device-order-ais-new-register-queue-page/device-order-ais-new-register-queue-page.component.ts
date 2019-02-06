import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import {
  HomeService, PageLoadingService, REGEX_MOBILE
} from 'mychannel-shared-libs';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_AGGREGATE_PAGE, ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_RESULT_PAGE } from 'src/app/device-order/ais/device-order-ais-new-register/constants/route-path.constant';


@Component({
  selector: 'app-device-order-ais-new-register-queue-page',
  templateUrl: './device-order-ais-new-register-queue-page.component.html',
  styleUrls: ['./device-order-ais-new-register-queue-page.component.scss']
})
export class DeviceOrderAisNewRegisterQueuePageComponent implements OnInit {

  transaction: Transaction;
  queueFrom: FormGroup;
  constructor(
    private router: Router,
    private homeService: HomeService,
    private fb: FormBuilder,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
  ) {
  }

  ngOnInit() {
    this.createForm();
  }

  createForm(): void {
    this.queueFrom = this.fb.group({
      'mobileNo': ['', Validators.compose([Validators.required, Validators.pattern(REGEX_MOBILE)])],
    });
  }

  onBack() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_AGGREGATE_PAGE]);
  }

  onNext() {
    this.pageLoadingService.openLoading();
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_RESULT_PAGE]);
    this.pageLoadingService.closeLoading();

  }

  onHome() {
    this.homeService.goToHome();
  }

}


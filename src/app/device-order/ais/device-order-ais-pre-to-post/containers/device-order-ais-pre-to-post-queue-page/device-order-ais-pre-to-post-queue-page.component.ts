import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import {
  HomeService, PageLoadingService, REGEX_MOBILE
} from 'mychannel-shared-libs';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_AGGREGATE_PAGE, ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_RESULT_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-pre-to-post-queue-page',
  templateUrl: './device-order-ais-pre-to-post-queue-page.component.html',
  styleUrls: ['./device-order-ais-pre-to-post-queue-page.component.scss']
})
export class DeviceOrderAisPreToPostQueuePageComponent implements OnInit {

  transaction: Transaction;
  queueFrom: FormGroup;
  constructor(
    private router: Router,
    private homeService: HomeService,
    private fb: FormBuilder,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.queueFrom = this.fb.group({
      'mobileNo': ['', Validators.compose([Validators.required, Validators.pattern(REGEX_MOBILE)])],
    });
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_AGGREGATE_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_RESULT_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

}

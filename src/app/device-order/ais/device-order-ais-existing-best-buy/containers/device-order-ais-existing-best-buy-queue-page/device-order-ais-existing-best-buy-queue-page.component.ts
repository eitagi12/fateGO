import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { ApiRequestService, PageLoadingService, HomeService } from 'mychannel-shared-libs';
import { ROUTE_DEVICE_ORDER_AIS_BEST_BUY_RESULT_PAGE } from 'src/app/device-order/ais/device-order-ais-existing-best-buy/constants/route-path.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  selector: 'app-device-order-ais-existing-best-buy-queue-page',
  templateUrl: './device-order-ais-existing-best-buy-queue-page.component.html',
  styleUrls: ['./device-order-ais-existing-best-buy-queue-page.component.scss']
})
export class DeviceOrderAisExistingBestBuyQueuePageComponent implements OnInit, OnDestroy {

  transaction: Transaction;
  queueFrom: FormGroup;
  queue: string;

  constructor(
    @Inject(DOCUMENT) private document,
    private router: Router,
    private homeService: HomeService,
    private fb: FormBuilder,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private apiRequestService: ApiRequestService,
    private http: HttpClient
  ) {
    this.transaction = this.transactionService.load();
   }

  ngOnInit() {
    this.createForm();
    this.document.querySelector('body').classList.add('white-body');

  }

  createForm(): void {
    this.queueFrom = this.fb.group({
      'queue': ['', Validators.compose([Validators.required, Validators.pattern(/([A-Y]{1}[0-9]{3})/)])],
    });

    this.queueFrom.valueChanges.subscribe((value) => {
      this.queue = value.queue;
    });
  }


  onNext() {
    this.transaction.data.queue = { queueNo: this.queue };
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_RESULT_PAGE]);
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

  // onSubmitQueue() {
  //   const queueNo = this.queueFrom.value['queueNo'];
  //   this.deviceSellingService.setQueue(queueNo);
  //   this.createCampaignOrder(queueNo);
  // }

}

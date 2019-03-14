import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { PageLoadingService, AlertService } from 'mychannel-shared-libs';
import { ROUTE_DEVICE_ORDER_AIS_BEST_BUY_RESULT_PAGE } from 'src/app/device-order/ais/device-order-ais-existing-best-buy/constants/route-path.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateDeviceOrderBestBuyService } from '../../services/create-device-order-best-buy.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';

@Component({
  selector: 'app-device-order-ais-existing-best-buy-queue-page',
  templateUrl: './device-order-ais-existing-best-buy-queue-page.component.html',
  styleUrls: ['./device-order-ais-existing-best-buy-queue-page.component.scss']
})
export class DeviceOrderAisExistingBestBuyQueuePageComponent implements OnInit, OnDestroy {

  transaction: Transaction;
  priceOption: PriceOption;
  queueFrom: FormGroup;
  queue: string;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private createBestBuyService: CreateDeviceOrderBestBuyService,
    private alertService: AlertService,
    private priceOptionService: PriceOptionService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.queueFrom = this.fb.group({
      'queue': ['', Validators.compose([Validators.required, Validators.pattern(/([A-Y]{1}[0-9]{3})/)])],
    });

    this.queueFrom.valueChanges.subscribe((value) => {
      this.queue = value.queue;
    });
  }

  onNext(): void {
    this.transaction.data.queue = { queueNo: this.queue };
    this.createBestBuyService.createDeviceOrder(this.transaction, this.priceOption).then((response: any) => {
      if (response) {
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_RESULT_PAGE]);
      } else {
        this.alertService.error('ระบบขัดข้อง');
      }
    });
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}

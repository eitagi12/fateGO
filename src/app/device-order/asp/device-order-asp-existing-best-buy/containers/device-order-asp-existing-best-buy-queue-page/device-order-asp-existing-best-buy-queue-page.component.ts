import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { PageLoadingService, AlertService } from 'mychannel-shared-libs';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { ROUTE_DEVICE_ORDER_ASP_BEST_BUY_RESULT_PAGE } from '../../constants/route-path.constant';

////////////////////////  ดึง Service จาก flow ais  /////////////////////////
import { CreateDeviceOrderBestBuyService } from 'src/app/device-order/ais/device-order-ais-existing-best-buy/services/create-device-order-best-buy.service';

@Component({
  selector: 'app-device-order-asp-existing-best-buy-queue-page',
  templateUrl: './device-order-asp-existing-best-buy-queue-page.component.html',
  styleUrls: ['./device-order-asp-existing-best-buy-queue-page.component.scss']
})
export class DeviceOrderAspExistingBestBuyQueuePageComponent implements OnInit, OnDestroy {

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
    private priceOptionService: PriceOptionService,
    private pageLoadingService: PageLoadingService
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
    this.pageLoadingService.openLoading();
    this.transaction.data.queue = { queueNo: this.queue };
    this.createBestBuyService.createDeviceOrder(this.transaction, this.priceOption).then((response: any) => {
      if (response) {
        this.pageLoadingService.closeLoading();
        this.router.navigate([ROUTE_DEVICE_ORDER_ASP_BEST_BUY_RESULT_PAGE]);
      }
    }).catch((e) => {
      this.pageLoadingService.closeLoading();
      this.alertService.error(e);
    });
  }

  ngOnDestroy(): void {
    this.transactionService.remove();
    this.transactionService.update(this.transaction);
  }

}

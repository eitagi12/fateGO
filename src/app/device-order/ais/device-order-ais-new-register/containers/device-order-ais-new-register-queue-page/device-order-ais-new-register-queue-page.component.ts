import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit, OnDestroy} from '@angular/core';
import {
  HomeService, PageLoadingService,
  ApiRequestService, REGEX_MOBILE
} from 'mychannel-shared-libs';
import { Transaction, TransactionType } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_AGGREGATE_PAGE, ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_RESULT_PAGE } from 'src/app/device-order/ais/device-order-ais-new-register/constants/route-path.constant';


@Component({
  selector: 'app-device-order-ais-new-register-queue-page',
  templateUrl: './device-order-ais-new-register-queue-page.component.html',
  styleUrls: ['./device-order-ais-new-register-queue-page.component.scss']
})
export class DeviceOrderAisNewRegisterQueuePageComponent implements OnInit, OnDestroy {

  transaction: Transaction;
  queueFrom: FormGroup;
  constructor(
    private router: Router,
    private homeService: HomeService,
    private fb: FormBuilder,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private apiRequestService: ApiRequestService,
  ) {
    this.homeService.callback = () => {
      window.location.href = '/smart-shop';
    };
    this.createTransaction();
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

  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
  }

  private createTransaction() {
    // New x-api-request-id
    this.apiRequestService.createRequestId();

    this.transaction = {
      data: {
        transactionType: TransactionType.DEVICE_ORDER_NEW_REGISTER_AIS,
        action: null,
      }
    };
  }
}


import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, TokenService, PageLoadingService, REGEX_MOBILE, User } from 'mychannel-shared-libs';
import { ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_AGGREGATE_PAGE, ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_RESULT_PAGE } from '../../constants/route-path.constant';
import { Transaction, Customer, Payment, Prebooking, TransactionData, MainPackage } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { QueuePageService } from 'src/app/device-order/services/queue-page.service';
import { SharedTransactionService } from 'src/app/shared/services/shared-transaction.service';
import { CreateDeviceOrderAisExistingPrepaidHotdealService } from '../../service/create-device-order-ais-existing-prepaid-hotdeal.service';

@Component({
  selector: 'app-device-order-ais-existing-prepaid-hotdeal-queue-page',
  templateUrl: './device-order-ais-existing-prepaid-hotdeal-queue-page.component.html',
  styleUrls: ['./device-order-ais-existing-prepaid-hotdeal-queue-page.component.scss']
})
export class DeviceOrderAisExistingPrepaidHotdealQueuePageComponent implements OnInit, OnDestroy {

  transaction: Transaction;
  priceOption: PriceOption;
  mobileFrom: FormGroup;
  queueFrom: FormGroup;
  queue: string;
  user: User;
  mobileNo: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private queuePageService: QueuePageService,
    private sharedTransactionService: SharedTransactionService,
    private createDeviceOrderPrepaidHotdealService: CreateDeviceOrderAisExistingPrepaidHotdealService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.queueFrom = this.fb.group({
      'mobileNo': ['', Validators.compose([Validators.required, Validators.pattern(REGEX_MOBILE)])],
    });
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    this.queuePageService.getQueueQmatic(this.queueFrom.value.mobileNo)
      .then((resp: any) => {
        const data = resp.data && resp.data.result ? resp.data.result : {};
        return data.queueNo;
      })
      .then((queueNo: string) => {
        this.transaction.data.queue = {
          queueNo: queueNo
        };
        return this.http.post('/api/salesportal/device-sell/order',
        this.createDeviceOrderPrepaidHotdealService.getRequestDeviceSellOrder(this.transaction, this.priceOption)).toPromise()
          .then(() => {
            delete this.transaction.data.mainPackage;
            return this.sharedTransactionService.updateSharedTransaction(this.transaction, this.priceOption);
          });
      })
      .then(() => {
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_RESULT_PAGE]);
      })
      .then(() => this.pageLoadingService.closeLoading());
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_AGGREGATE_PAGE]);
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

}

import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageLoadingService, User, TokenService } from 'mychannel-shared-libs';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { SharedTransactionService } from 'src/app/shared/services/shared-transaction.service';
import { QueuePageService } from 'src/app/device-order/services/queue-page.service';
import { ROUTE_DEVICE_AIS_DEVICE_RESULT_PAGE } from 'src/app/device-order/ais/device-order-ais-device/constants/route-path.constant';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-device-order-ais-device-queue-page',
  templateUrl: './device-order-ais-device-queue-page.component.html',
  styleUrls: ['./device-order-ais-device-queue-page.component.scss']
})
export class DeviceOrderAisDeviceQueuePageComponent implements OnInit, OnDestroy {

  transaction: Transaction;
  priceOption: PriceOption;
  mobileFrom: FormGroup;
  queueFrom: FormGroup;
  queue: string;
  user: User;
  mobileNo: string;
  queueType: string;
  inputType: string;
  errorQueue: boolean = false;
  skipQueue: boolean = false;
  warehouse: boolean;

  constructor(
    private router: Router,
    private http: HttpClient,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private queuePageService: QueuePageService,
    private sharedTransactionService: SharedTransactionService,
    private formBuilder: FormBuilder,
    private tokenService: TokenService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.user = this.tokenService.getUser();
    this.warehouse = this.user.locationCode === '63259';
  }

  ngOnInit(): void {
    this.createForm();
    this.setQueueType();
  }

  setQueueType(): void {
    this.queueType = localStorage.getItem('queueType');
    console.log(this.queueType);

    if (this.transaction.data.simCard && this.transaction.data.simCard.mobileNo && this.queueType === 'SMART_SHOP') {
      this.mobileFrom.patchValue({ mobileNo: this.transaction.data.simCard.mobileNo || this.transaction.data.receiptInfo.telNo });
      this.mobileNo = this.transaction.data.simCard.mobileNo || this.transaction.data.receiptInfo.telNo;
    }
  }

  checkInput(event: any, type: string): void {
    this.inputType = type;
    if (type === 'mobileNo') {
      this.queueFrom.reset();
    } else {
      this.mobileFrom.reset();
    }
  }

  createForm(): void {
    this.mobileFrom = this.formBuilder.group({
      'mobileNo': ['', Validators.compose([Validators.required, Validators.pattern(/^0[6-9]{1}[0-9]{8}/)])],
    });

    this.mobileFrom.valueChanges.subscribe((value) => {
      this.mobileNo = value.mobileNo;
    });

    this.queueFrom = this.formBuilder.group({
      'queue': ['', Validators.compose([Validators.required, Validators.pattern(/([A-Y]{1}[0-9]{3})/)])],
    });

    this.queueFrom.valueChanges.subscribe((value) => {
      this.queue = value.queue;
    });
  }

  onSkip(): void {
    this.http.get('/api/salesportal/device-sell/gen-queue', { params: { locationCode: this.user.locationCode } }).toPromise()
      .then((resp: any) => {
        const queueNo = resp.data.queue;
        this.skipQueue = true;
        this.transaction.data.queue = { queueNo: queueNo };
        this.createOrderAndupdateTransaction();
      });
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    if (this.warehouse) {
      this.genQueueL();
    } else if (!this.queueType || this.queueType === 'MANUAL' || this.inputType === 'queue') {
      this.transaction.data.queue = { queueNo: this.queue };
      this.createOrderAndupdateTransaction();
    } else {
      if (this.isLocationPhuket()) {
        this.genQueuePhuket();
      } else {
        this.genQueueAuto();
      }
    }
  }

  isLocationPhuket(): boolean {
    return this.user.locationCode === '1213' && this.tokenService.isAisUser();
  }

  genQueuePhuket(): void {
    this.http.post('/api/salesportal/device-order/transaction/get-queue-qmatic', {
      mobileNo: this.mobileNo
    }).toPromise()
      .then((response: any) => {
        const data = response.data && response.data.result ? response.data.result : {};
        if (data.queueNo) {
          this.transaction.data.queue = { queueNo: data.queueNo };
          this.createOrderAndupdateTransaction();
        } else {
          this.onSkip();
        }
      }).catch((error) => {
        this.onSkip();
      });
  }

  genQueueAuto(): void {
    this.http.post('/api/salesportal/device-order/transaction/auto-gen-queue', {
      mobileNo: this.mobileNo
    }).toPromise()
      .then((response: any) => {
        if (response && response.data && response.data.data && response.data.data.queueNo) {
          this.transaction.data.queue = { queueNo: response.data.data.queueNo };
          this.createOrderAndupdateTransaction();
        } else {
          this.queueType = 'MANUAL';
          this.errorQueue = true;
          this.pageLoadingService.closeLoading();
        }
      }).catch((error) => {
        this.queueType = 'MANUAL';
        this.errorQueue = true;
        this.pageLoadingService.closeLoading();
      });
  }

  genQueueL(): void {
    this.queuePageService.getQueueL(this.user.locationCode).then((response: any) => {
      const data = response.data ? response.data : { queue: 'L9999' };
      this.transaction.data.queue = { queueNo: data.queue };
      this.createOrderAndupdateTransaction();
    }).catch(() => {
      this.transaction.data.queue = { queueNo: 'L9999' };
      this.createOrderAndupdateTransaction();
    });
  }

  createOrderAndupdateTransaction(): void {
    this.queuePageService.createDeviceSellingOrderList(this.transaction, this.priceOption).then(() => {
      return this.sharedTransactionService.updateSharedTransaction(this.transaction, this.priceOption).then(() => {
        this.pageLoadingService.closeLoading();
        this.router.navigate([ROUTE_DEVICE_AIS_DEVICE_RESULT_PAGE]);
      });
    });
  }

  checkValid(): boolean {
    if (this.queueType === 'AUTO_GEN_Q') {
      return this.mobileFrom.invalid && this.queueFrom.invalid;
    } else if (this.queueType === 'SMART_SHOP') {
      return this.mobileFrom.invalid;
    } else {
      return this.queueFrom.invalid;
    }
  }

  checkSkip(): boolean {
    return this.mobileFrom.value['mobileNo'] ? true : false;
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}

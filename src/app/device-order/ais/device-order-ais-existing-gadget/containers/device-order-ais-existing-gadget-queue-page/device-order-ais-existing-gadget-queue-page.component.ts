import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { AlertService, PageLoadingService, TokenService, User } from 'mychannel-shared-libs';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { SharedTransactionService } from 'src/app/shared/services/shared-transaction.service';
import { QueuePageService } from 'src/app/device-order/services/queue-page.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_RESULT_PAGE } from 'src/app/device-order/ais/device-order-ais-existing-gadget/constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-existing-gadget-queue-page',
  templateUrl: './device-order-ais-existing-gadget-queue-page.component.html',
  styleUrls: ['./device-order-ais-existing-gadget-queue-page.component.scss']
})
export class DeviceOrderAisExistingGadgetQueuePageComponent implements OnInit, OnDestroy {

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

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private transactionService: TransactionService,
    private alertService: AlertService,
    private priceOptionService: PriceOptionService,
    private pageLoadingService: PageLoadingService,
    private tokenService: TokenService,
    private sharedTransactionService: SharedTransactionService,
    private queuePageService: QueuePageService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.user = this.tokenService.getUser();
  }

  ngOnInit(): void {
    this.setQueueType();
    this.createForm();
  }

  setQueueType(): void {
    this.queuePageService.checkQueueLocation().then((queueType) => {
      this.queueType = queueType;
    }).then(() => this.createForm());
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
    this.mobileFrom = this.fb.group({
      'mobileNo': ['', Validators.compose([Validators.required, Validators.pattern(/^0[6-9]{1}[0-9]{8}/)])],
    });

    if (this.transaction.data.simCard.mobileNo && this.queueType === 'SMART_SHOP') {
      this.mobileFrom.patchValue({ mobileNo: this.transaction.data.simCard.mobileNo });
      this.mobileNo = this.transaction.data.simCard.mobileNo;
    }

    this.mobileFrom.valueChanges.subscribe((value) => {
      this.mobileNo = value.mobileNo;
    });

    this.queueFrom = this.fb.group({
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
    if (!this.queueType || this.queueType === 'MANUAL' || this.inputType === 'queue') {
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

  createOrderAndupdateTransaction(): void {
    this.queuePageService.createDeviceSellingOrder(this.transaction, this.priceOption).then(() => {
      return this.sharedTransactionService.updateSharedTransaction(this.transaction, this.priceOption).then(() => {
        this.pageLoadingService.closeLoading();
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_RESULT_PAGE]);
      });
    });
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

  isLocationPhuket(): boolean {
    return this.user.locationCode === '1213' && this.tokenService.isAisUser();
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

}

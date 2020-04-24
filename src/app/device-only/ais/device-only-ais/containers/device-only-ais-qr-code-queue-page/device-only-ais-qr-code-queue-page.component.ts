import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_DEVICE_ONLY_AIS_RESULT_QUEUE_PAGE } from '../../constants/route-path.constant';
import { HomeService, AlertService, PageLoadingService, REGEX_MOBILE, TokenService, User } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { FormGroup, FormBuilder, Validators, ValidationErrors, FormControl } from '@angular/forms';
import { SharedTransactionService } from 'src/app/shared/services/shared-transaction.service';
import { HomeButtonService } from 'src/app/device-only/services/home-button.service';
import { CreateOrderService } from 'src/app/device-only/services/create-order.service';
import { QueueService } from 'src/app/device-only/services/queue.service';

@Component({
  selector: 'app-device-only-ais-qr-code-queue-page',
  templateUrl: './device-only-ais-qr-code-queue-page.component.html',
  styleUrls: ['./device-only-ais-qr-code-queue-page.component.scss']
})

export class DeviceOnlyAisQrCodeQueuePageComponent implements OnInit, OnDestroy {
  transaction: Transaction;
  priceOption: PriceOption;
  price: string;

  queueFrom: FormGroup = new FormGroup({
    queue: new FormControl()
  });
  mobileFrom: FormGroup = new FormGroup({
    mobileNo: new FormControl()
  });

  mobileNo: string;
  queue: string;
  queueType: string;
  errorQueue: boolean;
  inputType: string;
  user: User;
  skipQueue: boolean = false;
  isLineShop: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private homeButtonService: HomeButtonService,
    private pageLoadingService: PageLoadingService,
    private sharedTransactionService: SharedTransactionService,
    private createOrderService: CreateOrderService,
    private queueService: QueueService,
    private tokenService: TokenService,
    private alertService: AlertService

  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.user = this.tokenService.getUser();
    if (this.user.locationCode === '63259' &&
      this.transaction.data.payment.paymentForm === 'FULL' &&
      this.transaction.data.payment.paymentOnlineCredit === true &&
      this.transaction.data.payment.paymentType === 'CREDIT') {
        this.isLineShop = true;
    }
  }

  ngOnInit(): void {
    this.price = this.priceOption.trade.priceType === 'NORMAL' ? this.priceOption.trade.normalPrice : this.priceOption.trade.promotionPrice;
    this.homeButtonService.initEventButtonHome();
    this.createForm();
    this.setQueueType();
  }

  setQueueType(): void {
    this.queueService.checkQueueLocation().then((queueType) => {
      this.queueType = queueType;
      if (this.transaction.data.simCard && this.transaction.data.simCard.mobileNo && this.queueType === 'SMART_SHOP') {
        this.mobileFrom.patchValue({ mobileNo: this.transaction.data.simCard.mobileNo || this.transaction.data.receiptInfo.telNo });
        this.mobileNo = this.transaction.data.simCard.mobileNo || this.transaction.data.receiptInfo.telNo;
      }
    });
  }

  createForm(): void {
    this.mobileFrom = this.fb.group({
      'mobileNo': ['', Validators.compose([Validators.required, Validators.pattern(/^0[6-9]{1}[0-9]{8}/)])],
    });

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

  checkValid(): boolean {
    if (this.queueType === 'AUTO_GEN_Q') {
      return this.mobileFrom.invalid && this.queueFrom.invalid;
    } else if (this.queueType === 'SMART_SHOP') {
      return this.mobileFrom.invalid;
    } else {
      return this.queueFrom.invalid;
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

  onHome(): void {
    this.homeService.goToHome();
  }

  onNext(): void {
    // this.autoGetQueue();
    this.pageLoadingService.openLoading();
    if (!this.queueType || this.queueType === 'MANUAL' || this.inputType === 'queue') {
      this.transaction.data.queue = { queueNo: this.queue };
      this.createOrderService.createOrderDeviceOnly(this.transaction, this.priceOption).then(() => {
        return this.sharedTransactionService.updateSharedTransaction(this.transaction, this.priceOption).then(() => {
          this.pageLoadingService.closeLoading();
          this.router.navigate([ROUTE_DEVICE_ONLY_AIS_RESULT_QUEUE_PAGE]);
        });
      }).catch((err: any) => {
        this.pageLoadingService.closeLoading();
        this.alertService.notify({
          type: 'error',
          confirmButtonText: 'OK',
          showConfirmButton: true,
          text: err.error.developerMessage
        });
      });
    } else {
      this.onSendSMSQueue(this.mobileNo).then((queue) => {
        if (queue) {
          this.transaction.data.queue = { queueNo: queue };
          return this.createOrderService.createOrderDeviceOnly(this.transaction, this.priceOption).then(() => {
            return this.sharedTransactionService.updateSharedTransaction(this.transaction, this.priceOption).then(() => {
              this.pageLoadingService.closeLoading();
              this.router.navigate([ROUTE_DEVICE_ONLY_AIS_RESULT_QUEUE_PAGE]);
            });
          });
        } else {
          this.queueType = 'MANUAL';
          this.errorQueue = true;
          this.pageLoadingService.closeLoading();
          return;
        }
      }).catch(() => {
        this.queueType = 'MANUAL';
        this.errorQueue = true;
        this.pageLoadingService.closeLoading();
        return;
      });
    }
  }

  onSendSMSQueue(mobileNo: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.isLocationPhuket()) {
        return this.queueService.getQueueNewMatic(mobileNo)
          .then((respQueue: any) => {
            const data = respQueue.data && respQueue.data.result ? respQueue.data.result : {};
            resolve(data.queueNo);
          }).catch((error) => {
            reject(null);
          });
      } else {
        return this.queueService.autoGetQueue(mobileNo)
          .then((queueNo: any) => {
            if (queueNo) {
              resolve(queueNo);
            } else {
              reject(null);
            }
          }).catch((error) => {
            reject(null);
          });
      }
    });
  }

  isLocationPhuket(): boolean {
    return this.user.locationCode === '1213' && this.tokenService.isAisUser();
  }

  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
  }

  checkSkip(): boolean {
    return this.mobileFrom.value['mobileNo'] ? true : false;
  }

  enableSkip(): boolean {
    if (this.user.locationCode === '1213' || this.user.locationCode === '63259') {
      return true;
    } else {
      return false;
    }
  }

  onSkip(): void {
    if (this.user.locationCode === '63259') {
      this.queueService.getQueueL(this.user.locationCode).then((respQueue: any) => {
        const data = respQueue.data ? respQueue.data : {};
        this.transaction.data.queue = { queueNo: data.queue };
        this.skipQueue = true;
        this.createOrderService.createDeviceSellingOrderList(this.transaction, this.priceOption).then((res) => {
          return this.sharedTransactionService.updateSharedTransaction(this.transaction, this.priceOption).then(() => {
            this.pageLoadingService.closeLoading();
            this.router.navigate([ROUTE_DEVICE_ONLY_AIS_RESULT_QUEUE_PAGE]);
          });
        });
      });
    } else {
      this.queueService.getQueueZ(this.user.locationCode)
        .then((resp: any) => {
          const queueNo = resp.data.queue;
          this.skipQueue = true;
          this.transaction.data.queue = { queueNo: queueNo };
          this.createOrderService.createOrderDeviceOnly(this.transaction, this.priceOption).then(() => {
            return this.sharedTransactionService.updateSharedTransaction(this.transaction, this.priceOption).then(() => {
              this.pageLoadingService.closeLoading();
              this.router.navigate([ROUTE_DEVICE_ONLY_AIS_RESULT_QUEUE_PAGE]);
            });
          });
        });
    }
  }
}

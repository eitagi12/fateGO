import { Component, OnInit, OnDestroy } from '@angular/core';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { QueueService } from 'src/app/device-only/services/queue.service';
import { TokenService, User, HomeService, PageLoadingService, AlertService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { ROUTE_DEVICE_ONLY_ASP_RESULT_QUEUE_PAGE } from '../../constants/route-path.constant';
import { HomeButtonService } from 'src/app/device-only/services/home-button.service';
import { SharedTransactionService } from 'src/app/shared/services/shared-transaction.service';
import { CreateOrderService } from 'src/app/device-only/services/create-order.service';

@Component({
  selector: 'app-device-only-asp-queue-page',
  templateUrl: './device-only-asp-queue-page.component.html',
  styleUrls: ['./device-only-asp-queue-page.component.scss']
})
export class DeviceOnlyAspQueuePageComponent implements OnInit, OnDestroy {
  private transaction: Transaction;
  private  priceOption: PriceOption;
  private price: any;
  private mobileFrom: FormGroup;
  private queueFrom: FormGroup;
  private mobileNo: string;
  private queue: string;
  public queueType: string;
  private inputType: string;
  public user: User;
  private skipQueue: boolean = false;
  private errorQueue: boolean = false;
  private transactionTypeTrade: any;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private homeService: HomeService,
    private homeButtonService: HomeButtonService,
    private pageLoadingService: PageLoadingService,
    private queueService: QueueService,
    private sharedTransactionService: SharedTransactionService,
    private createOrderService: CreateOrderService,
    private alertService: AlertService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private tokenService: TokenService,
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.user = this.tokenService.getUser();
  }

  ngOnInit(): void {
    this.homeButtonService.initEventButtonHome();
    this.getPriceOption();
    this.createForm();
    this.setQueueType();
  }

  private getPriceOption(): void {
    this.price = this.priceOption.trade.priceType === 'NORMAL' ? this.priceOption.trade.normalPrice : this.priceOption.trade.promotionPrice;
  }

  private createForm(): void {
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

  private setQueueType(): void {
    this.queueService.checkQueueLocation().then((queueType: any) => {
      this.queueType = queueType;
      if (this.transaction.data.simCard && this.transaction.data.simCard.mobileNo && this.queueType === 'SMART_SHOP') {
        this.mobileFrom.patchValue({ mobileNo: this.transaction.data.simCard.mobileNo || this.transaction.data.receiptInfo.telNo});
        this.mobileNo = this.transaction.data.simCard.mobileNo || this.transaction.data.receiptInfo.telNo;
      }
    });
  }

  private checkInput(event: any, type: string): void {
    this.inputType = type;
    if (type === 'mobileNo') {
      this.queueFrom.reset();
    } else {
      this.mobileFrom.reset();
    }
  }

  private isLocationPhuket(): boolean {
    return this.user.locationCode === '1213' && this.tokenService.isAisUser();
  }

   private onSendSMSQueue(mobileNo: string): Promise<any> {
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

  private checkSkip(): boolean {
    return this.mobileFrom.value['mobileNo'] ? true : false;
  }

  public checkValid(): boolean {
    if (this.queueType === 'AUTO_GEN_Q') {
      return this.mobileFrom.invalid && this.queueFrom.invalid;
    } else if (this.queueType === 'SMART_SHOP') {
      return this.mobileFrom.invalid;
    } else {
      return this.queueFrom.invalid;
    }
  }

  public onHome(): void {
    this.homeService.goToHome();
  }

  private onSkip(): void {
    this.queueService.getQueueZ(this.user.locationCode)
    .then((resp: any) => {
      const queueNo = resp.data.queue;
      this.skipQueue = true;
      this.transaction.data.queue = { queueNo: queueNo };
      this.createOrderService.createOrderDeviceOnly(this.transaction, this.priceOption).then(() => {
        return this.sharedTransactionService.updateSharedTransaction(this.transaction, this.priceOption).then(() => {
          this.pageLoadingService.closeLoading();
          this.router.navigate([ROUTE_DEVICE_ONLY_ASP_RESULT_QUEUE_PAGE]);
        });
      });
    });
  }

  public onNext(): void {
    this.pageLoadingService.openLoading();
    if (!this.queueType || this.queueType === 'MANUAL' || this.inputType === 'queue') {
      this.transaction.data.queue = { queueNo: this.queue };
      this.createOrderService.createOrderDeviceOnly(this.transaction, this.priceOption).then((res: any) => {
        return this.sharedTransactionService.updateSharedTransaction(this.transaction, this.priceOption).then(() => {
          this.pageLoadingService.closeLoading();
          this.router.navigate([ROUTE_DEVICE_ONLY_ASP_RESULT_QUEUE_PAGE]);
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
              this.router.navigate([ROUTE_DEVICE_ONLY_ASP_RESULT_QUEUE_PAGE]);
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

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

}

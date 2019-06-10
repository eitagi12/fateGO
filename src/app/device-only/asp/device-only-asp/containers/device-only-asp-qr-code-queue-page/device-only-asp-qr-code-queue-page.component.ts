import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { QueueService } from 'src/app/device-only/services/queue.service';
import { TokenService, User, HomeService, PageLoadingService } from 'mychannel-shared-libs';
import { HomeButtonService } from 'src/app/device-only/services/home-button.service';
import { SharedTransactionService } from 'src/app/shared/services/shared-transaction.service';
import { CreateOrderService } from 'src/app/device-only/services/create-order.service';
import { ROUTE_DEVICE_ONLY_ASP_RESULT_QUEUE_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-device-only-asp-qr-code-queue-page',
  templateUrl: './device-only-asp-qr-code-queue-page.component.html',
  styleUrls: ['./device-only-asp-qr-code-queue-page.component.scss']
})
export class DeviceOnlyAspQrCodeQueuePageComponent implements OnInit, OnDestroy {
  private transaction: Transaction;
  private priceOption: PriceOption;
  private user: User;
  private mobileFrom: FormGroup;
  private queueFrom: FormGroup;
  private mobileNo: string;
  private queue: string;
  private queueType: string;
  private price: any;
  private inputType: string;
  private errorQueue: boolean;
  private skipQueue: boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private homeService: HomeService,
    private homeButtonService: HomeButtonService,
    private queueService: QueueService,
    private pageLoadingService: PageLoadingService,
    private sharedTransactionService: SharedTransactionService,
    private createOrderService: CreateOrderService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private tokenService: TokenService
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
    this.queueService.checkQueueLocation().then((queueType) => {
      this.queueType = queueType;
      if (this.transaction.data.simCard && this.transaction.data.simCard.mobileNo && this.queueType === 'SMART_SHOP') {
        this.mobileFrom.patchValue({ mobileNo: this.transaction.data.simCard.mobileNo || this.transaction.data.receiptInfo.telNo });
        this.mobileNo = this.transaction.data.simCard.mobileNo || this.transaction.data.receiptInfo.telNo;
      }
    });
  }

  private checkValid(): boolean {
    if (this.queueType === 'AUTO_GEN_Q') {
      return this.mobileFrom.invalid && this.queueFrom.invalid;
    } else if (this.queueType === 'SMART_SHOP') {
      return this.mobileFrom.invalid;
    } else {
      return this.queueFrom.invalid;
    }
  }

  private checkInput(event: any, type: string): void {
    this.inputType = type;
    if (type === 'mobileNo') {
      this.queueFrom.reset();
    } else {
      this.mobileFrom.reset();
    }
  }

  private checkSkip(): boolean {
    return this.mobileFrom.value['mobileNo'] ? true : false;
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

  private isLocationPhuket(): boolean {
    return this.user.locationCode === '1213' && this.tokenService.isAisUser();
  }

  public onHome(): void {
    this.homeService.goToHome();
  }

  public onNext(): void {
    // this.autoGetQueue();
    this.pageLoadingService.openLoading();
    if (!this.queueType || this.queueType === 'MANUAL' || this.inputType === 'queue') {
      this.transaction.data.queue = { queueNo: this.queue };
      this.createOrderService.createOrderDeviceOnly(this.transaction, this.priceOption).then(() => {
        return this.sharedTransactionService.updateSharedTransaction(this.transaction, this.priceOption).then(() => {
          this.pageLoadingService.closeLoading();
          this.router.navigate([ROUTE_DEVICE_ONLY_ASP_RESULT_QUEUE_PAGE]);
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

  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
  }

}

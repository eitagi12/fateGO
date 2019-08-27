import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_DEVICE_ONLY_KIOSK_RESULT_QUEUE_PAGE } from '../../constants/route-path.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { User, HomeService, PageLoadingService, TokenService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { HomeButtonService } from 'src/app/device-only/services/home-button.service';
import { SharedTransactionService } from 'src/app/shared/services/shared-transaction.service';
import { CreateOrderService } from 'src/app/device-only/services/create-order.service';
import { QueueService } from 'src/app/device-only/services/queue.service';

@Component({
  selector: 'app-device-only-kiosk-qr-code-queue-page',
  templateUrl: './device-only-kiosk-qr-code-queue-page.component.html',
  styleUrls: ['./device-only-kiosk-qr-code-queue-page.component.scss']
})
export class DeviceOnlyKioskQrCodeQueuePageComponent implements OnInit , OnDestroy {
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
    private formBuilder: FormBuilder

  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.user = this.tokenService.getUser();
  }

  ngOnInit(): void {
    this.price = this.priceOption.trade.priceType === 'NORMAL' ? this.priceOption.trade.normalPrice : this.priceOption.trade.promotionPrice;
    this.homeButtonService.initEventButtonHome();
    this.createForm();
    this.setMobileNo();
  }

  setMobileNo(): void {
    if (this.transaction.data.simCard && this.transaction.data.simCard.mobileNo) {
      this.mobileFrom.patchValue({ mobileNo: this.transaction.data.simCard.mobileNo || this.transaction.data.receiptInfo.telNo});
      this.mobileNo = this.transaction.data.simCard.mobileNo || this.transaction.data.receiptInfo.telNo;
    }
  }

  createForm(): void {
    this.mobileFrom = this.formBuilder.group({
      'mobileNo': ['', Validators.compose([Validators.required, Validators.pattern(/^0[6-9]{1}[0-9]{8}/)])],
    });

    this.mobileFrom.valueChanges.subscribe((value) => {
      this.mobileNo = value.mobileNo;
    });

  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onSkip(): void {
    this.queueService.getQueueZ(this.user.locationCode)
      .then((resp: any) => {
        const queueNo = resp.data.queue;
        this.skipQueue = true;
        this.transaction.data.queue = { queueNo: queueNo };
        this.createOrderService.createOrderDeviceOnly(this.transaction, this.priceOption).then(() => {
          return this.sharedTransactionService.updateSharedTransaction(this.transaction, this.priceOption).then(() => {
            this.pageLoadingService.closeLoading();
            this.router.navigate([ROUTE_DEVICE_ONLY_KIOSK_RESULT_QUEUE_PAGE]);
          });
        });
      });
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    this.callServices();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

  isLocationPhuket(): boolean {
    return this.user.locationCode === '1213' && this.tokenService.isAisUser();
  }

  callServices(): void {
    this.queueService.getQueueNewMatic(this.mobileFrom.value.mobileNo)
      .then((resp: any) => {
        const data = resp.data && resp.data.result ? resp.data.result : {};
        return data.queueNo;
      })
      .then((queueNo: string) => {
        this.transaction.data.queue = {
          queueNo: queueNo
        };
        return this.callServiceCreateDeviceSellingOrderAndUpdateShareTransaction();
      })
      .then(() => this.router.navigate([ROUTE_DEVICE_ONLY_KIOSK_RESULT_QUEUE_PAGE]))
      .then(() => this.pageLoadingService.closeLoading());
  }

  callServiceCreateDeviceSellingOrderAndUpdateShareTransaction(): any {
    return this.createOrderService.createOrderDeviceOnly(this.transaction, this.priceOption)
      .then(() => {
        return this.sharedTransactionService.updateSharedTransaction(this.transaction, this.priceOption);
      });
  }
}

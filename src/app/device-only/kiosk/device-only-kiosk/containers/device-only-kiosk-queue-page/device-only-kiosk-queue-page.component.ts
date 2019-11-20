import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_DEVICE_ONLY_KIOSK_RESULT_QUEUE_PAGE, ROUTE_DEVICE_ONLY_KIOSK_CHECKOUT_PAYMENT_PAGE } from '../../constants/route-path.constant';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User, HomeService, PageLoadingService, TokenService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HomeButtonService } from 'src/app/device-only/services/home-button.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { CreateOrderService } from 'src/app/device-only/services/create-order.service';
import { QueueService } from 'src/app/device-only/services/queue.service';
import { SharedTransactionService } from 'src/app/shared/services/shared-transaction.service';

@Component({
  selector: 'app-device-only-kiosk-queue-page',
  templateUrl: './device-only-kiosk-queue-page.component.html',
  styleUrls: ['./device-only-kiosk-queue-page.component.scss']
})
export class DeviceOnlyKioskQueuePageComponent implements OnInit, OnDestroy {
  transaction: Transaction;
  priceOption: PriceOption;
  mobileFrom: FormGroup;
  price: string;
  queueFrom: FormGroup;
  queue: string;
  user: User;
  mobileNo: string;
  queueType: string;
  inputType: string;
  errorQueue: boolean = false;
  skipQueue: boolean = false;

  constructor(
    public router: Router,
    private transactionService: TransactionService,
    private homeService: HomeService,
    private homeButtonService: HomeButtonService,
    private priceOptionService: PriceOptionService,
    private createOrderService: CreateOrderService,
    private queueService: QueueService,
    private pageLoadingService: PageLoadingService,
    private formBuilder: FormBuilder,
    private sharedTransactionService: SharedTransactionService,
    private tokenService: TokenService
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
        this.createOrderService.createDeviceSellingOrderList(this.transaction, this.priceOption).then(() => {
          return this.sharedTransactionService.updateSharedTransaction(this.transaction, this.priceOption).then(() => {
            this.pageLoadingService.closeLoading();
            this.router.navigate([ROUTE_DEVICE_ONLY_KIOSK_RESULT_QUEUE_PAGE]);
          });
        });
      });
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ONLY_KIOSK_CHECKOUT_PAYMENT_PAGE]);
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
    return this.createOrderService.createDeviceSellingOrderList(this.transaction, this.priceOption)
      .then(() => {
        return this.sharedTransactionService.updateSharedTransaction(this.transaction, this.priceOption);
      });
  }

}

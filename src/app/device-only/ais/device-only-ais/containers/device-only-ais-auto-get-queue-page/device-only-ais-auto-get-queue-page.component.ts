import { Component, OnInit, OnDestroy } from '@angular/core';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HomeService, PageLoadingService, REGEX_MOBILE } from 'mychannel-shared-libs';
import { HomeButtonService } from '../../services/home-button.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { CreateOrderService } from '../../services/create-order.service';
import { QueueService } from '../../services/queue.service';
import { Subscription } from 'rxjs';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ROUTE_DEVICE_ONLY_AIS_QUEUE_PAGE, ROUTE_DEVICE_ONLY_AIS_KEY_IN_QUEUE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-device-only-ais-auto-get-queue-page',
  templateUrl: './device-only-ais-auto-get-queue-page.component.html',
  styleUrls: ['./device-only-ais-auto-get-queue-page.component.scss']
})
export class DeviceOnlyAutoGetQueuePageComponent implements OnInit, OnDestroy {
  transaction: Transaction;
  priceOption: PriceOption;
  queueSubscript: Subscription;
  public mobileForm: FormGroup;
  public queue: string;
  public queueForm: FormGroup;

  constructor(
    public router: Router,
    private transactionService: TransactionService,
    private homeService: HomeService,
    private homeButtonService: HomeButtonService,
    private priceOptionService: PriceOptionService,
    private createOrderService: CreateOrderService,
    private queueService: QueueService,
    private pageLoadingService: PageLoadingService,
    private fb: FormBuilder
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void {
    this.homeButtonService.initEventButtonHome();
    this.createForm();
    this.createQueueForm();
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  createForm(): void {
    this.mobileForm = this.fb.group({
      mobileNo: (['', Validators.compose([
        Validators.required,
        Validators.minLength(10),
        Validators.pattern(REGEX_MOBILE)
      ])])
    });
  }
  get f(): any { return this.mobileForm.controls; }

  onNext(): void {
    this.pageLoadingService.openLoading();
    if (!this.transaction.data.queue) {
      this.autoGetQueue();
    } else {
      this.transaction.data.queue.queueNo = this.queueForm.value.queueNo;
    }
  }

  private autoGetQueue(): void {
    const mobile = this.mobileForm.value.mobileNo;
    this.queueService.autoGetQueue(mobile).then((data) => {
      this.transaction.data.queue = {
        queueNo: data
      };
      this.checkDataLinkPage(data);
    }).catch((error: any) => {
      this.pageLoadingService.closeLoading();
      this.router.navigate([ROUTE_DEVICE_ONLY_AIS_KEY_IN_QUEUE]);
    });
  }

  private checkDataLinkPage(data: any): void {
    this.queue = data;
    if (data) {
      this.createOrderService.updateTransactionDB(this.transaction, this.priceOption).then((response) => {
        if (response === true) {
          this.createOrderService.createOrderDeviceOnly(this.transaction, this.priceOption).then((res) => {
            if (res.data.resultCode === 'S') {
              this.pageLoadingService.closeLoading();
              this.router.navigate([ROUTE_DEVICE_ONLY_AIS_QUEUE_PAGE]);
            } else if (res.data.resultCode === 'F') {
              this.pageLoadingService.closeLoading();
              this.router.navigate([ROUTE_DEVICE_ONLY_AIS_KEY_IN_QUEUE]);
            }
          });
        }
      }).catch((err: any) => {
        console.log(err);

      });
    } else {
      this.pageLoadingService.closeLoading();
      this.router.navigate([ROUTE_DEVICE_ONLY_AIS_KEY_IN_QUEUE]);
    }
  }

  public createQueueForm(): void {
    this.queueForm = this.fb.group({
      queueNo: (['', Validators])
    });
  }

  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
  }
}

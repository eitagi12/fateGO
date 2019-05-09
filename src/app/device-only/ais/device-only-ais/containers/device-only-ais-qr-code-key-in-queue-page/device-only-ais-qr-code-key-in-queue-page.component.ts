import { Component, OnInit, OnDestroy } from '@angular/core';
import { ROUTE_DEVICE_ONLY_AIS_QUEUE_PAGE } from '../../constants/route-path.constant';
import { Router } from '@angular/router';
import { HomeService, AlertService, PageLoadingService } from 'mychannel-shared-libs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { CreateOrderService } from '../../services/create-order.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { HomeButtonService } from '../../services/home-button.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { SharedTransactionService } from '../../../../../shared/services/shared-transaction.service';

@Component({
  selector: 'app-device-only-ais-qr-code-key-in-queue-page',
  templateUrl: './device-only-ais-qr-code-key-in-queue-page.component.html',
  styleUrls: ['./device-only-ais-qr-code-key-in-queue-page.component.scss']
})
export class DeviceOnlyAisQrCodeKeyInQueuePageComponent implements OnInit, OnDestroy {
  public queueForm: FormGroup;
  transaction: Transaction;
  priceOption: PriceOption;
  queue: string;
  price: string;

  constructor(
    public router: Router,
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private homeService: HomeService,
    private homeButtonService: HomeButtonService,
    private priceOptionService: PriceOptionService,
    private createOrderService: CreateOrderService,
    private alertService: AlertService,
    private pageLoadingService: PageLoadingService,
    private sharedTransactionService: SharedTransactionService) {
      this.transaction = this.transactionService.load();
      this.priceOption = this.priceOptionService.load();
     }

  ngOnInit(): void {
    this.price = this.priceOption.trade.priceType === 'NORMAL' ? this.priceOption.trade.normalPrice : this.priceOption.trade.promotionPrice;
    this.homeButtonService.initEventButtonHome();
    this.createQueueForm();
  }

  public createQueueForm(): void {
    this.queueForm = this.fb.group({
      queueNo: (['', Validators.compose([
        Validators.required,
        Validators.minLength(4),
        Validators.pattern(/([A-Y]{1}[0-9]{3})/)
      ])])
    });
    this.queueForm.valueChanges.subscribe((value) => {
      this.queue = value.queue;
    });
  }

  get f(): any { return this.queueForm.controls; }

  onNext(): void {
    if (!this.transaction.data.queue) {
      this.transaction.data.queue = {
        queueNo: this.queueForm.value.queueNo
        };
      } else {
        this.transaction.data.queue.queueNo = this.queueForm.value.queueNo;
      }
    this.stepNextQueuePage();
  }

  private stepNextQueuePage(): any {
    this.pageLoadingService.openLoading();
    this.transaction.data.mainPromotion = {
      campaign: this.priceOption.campaign,
      trade: this.priceOption.trade
    };
    this.sharedTransactionService.updateSharedTransaction(this.transaction, this.priceOption).then((response) => {
      if (response.data.isSuccess === true) {
        this.createOrderService.createOrderDeviceOnly(this.transaction, this.priceOption).subscribe(
          (res) => {
          if (res === 'S') {
            this.router.navigate([ROUTE_DEVICE_ONLY_AIS_QUEUE_PAGE]);
          } else {
            this.alertService.warning('ระบบไม่สามารถทำรายการได้');
          }
        },
        (err) => {
          this.pageLoadingService.closeLoading();
          this.alertService.warning('ระบบไม่สามารถทำรายการได้');
        },
        () => {
          this.pageLoadingService.closeLoading();
        });
      }
    }).catch((err) => {
      this.pageLoadingService.closeLoading();
      this.alertService.warning('ระบบไม่สามารถ update รายการได้ในขณะนี้');
    });
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
  }

}

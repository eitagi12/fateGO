import { Component, OnInit, OnDestroy } from '@angular/core';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService, PageLoadingService, HomeService } from 'mychannel-shared-libs';
import { SharedTransactionService } from 'src/app/shared/services/shared-transaction.service';
import { HomeButtonService } from 'src/app/device-only/services/home-button.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-device-only-asp-qr-code-key-in-queue-page',
  templateUrl: './device-only-asp-qr-code-key-in-queue-page.component.html',
  styleUrls: ['./device-only-asp-qr-code-key-in-queue-page.component.scss']
})
export class DeviceOnlyAspQrCodeKeyInQueuePageComponent implements OnInit, OnDestroy {
  private transaction: Transaction;
  private priceOption: PriceOption;
  private queueForm: FormGroup;
  private price: any;
  private queue: string;

  constructor(
    public router: Router,
    private http: HttpClient,
    private fb: FormBuilder,
    private alertService: AlertService,
    private pageLoadingService: PageLoadingService,
    private homeService: HomeService,
    private homeButtonService: HomeButtonService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private sharedTransactionService: SharedTransactionService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void {
    this.homeButtonService.initEventButtonHome();
    this.getPriceOption();
    this.createQueueForm();
  }

  private getPriceOption(): void {
    this.price = this.priceOption.trade.priceType === 'NORMAL' ? this.priceOption.trade.normalPrice : this.priceOption.trade.promotionPrice;
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

  private stepNextQueuePage(): any {
    this.pageLoadingService.openLoading();
    this.transaction.data.mainPromotion = {
      campaign: this.priceOption.campaign,
      trade: this.priceOption.trade
    };
    this.sharedTransactionService.updateSharedTransaction(this.transaction, this.priceOption).then((response) => {
      // if (response.data.isSuccess === true) {
      //   this.createOrderService.createOrderDeviceOnly(this.transaction, this.priceOption).subscribe(
      //     (res) => {
      //     if (res === 'S') {
      //       this.router.navigate([ROUTE_DEVICE_ONLY_AIS_RESULT_QUEUE_PAGE]);
      //     } else {
      //       this.alertService.warning('ระบบไม่สามารถทำรายการได้');
      //     }
      //   },
      //   (err) => {
      //     this.pageLoadingService.closeLoading();
      //     this.alertService.warning('ระบบไม่สามารถทำรายการได้');
      //   },
      //   () => {
      //     this.pageLoadingService.closeLoading();
      //   });
      // }
    }).catch((err) => {
      this.pageLoadingService.closeLoading();
      this.alertService.warning('ระบบไม่สามารถ update รายการได้ในขณะนี้');
    });
  }

  public onHome(): void {
    this.homeService.goToHome();
  }

  public onNext(): void {
    if (!this.transaction.data.queue) {
      this.transaction.data.queue = {
        queueNo: this.queueForm.value.queueNo
        };
      } else {
        this.transaction.data.queue.queueNo = this.queueForm.value.queueNo;
      }
    this.stepNextQueuePage();
  }

  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
  }

}

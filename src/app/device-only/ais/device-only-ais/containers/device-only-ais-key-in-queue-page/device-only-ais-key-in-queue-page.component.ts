import { Component, OnInit, OnDestroy } from '@angular/core';
import { ROUTE_DEVICE_ONLY_AIS_QUEUE_PAGE } from '../../constants/route-path.constant';
import { Router } from '@angular/router';
import { HomeService, AlertService } from 'mychannel-shared-libs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { CreateOrderService } from '../../services/create-order.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { HomeButtonService } from '../../services/home-button.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';

@Component({
  selector: 'app-device-only-ais-key-in-queue-page',
  templateUrl: './device-only-ais-key-in-queue-page.component.html',
  styleUrls: ['./device-only-ais-key-in-queue-page.component.scss']
})
export class DeviceOnlyAisKeyInQueuePageComponent implements OnInit, OnDestroy {
  public queueForm: FormGroup;
  transaction: Transaction;
  priceOption: PriceOption;
  constructor(
    public router: Router,
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private homeService: HomeService,
    private homeButtonService: HomeButtonService,
    private priceOptionService: PriceOptionService,
    private createOrderService: CreateOrderService,
    private alertService: AlertService) {
      this.transaction = this.transactionService.load();
      this.priceOption = this.priceOptionService.load();
     }

  ngOnInit(): void {
    this.homeButtonService.initEventButtonHome();
    this.createQueueForm();
  }

  public createQueueForm(): void {
    this.queueForm = this.fb.group({
      queueNo: (['', Validators.compose([
        Validators.required,
        Validators.minLength(4),
        Validators.pattern('^[A-Z0-9]+$')
      ])])
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
    this.createOrderService.updateTransactionDB(this.transaction, this.priceOption).then((response) => {
      if (response = true) {
        this.createOrderService.createOrderDeviceOnly(this.transaction, this.priceOption).then((res) => {
          this.router.navigate([ROUTE_DEVICE_ONLY_AIS_QUEUE_PAGE]);
        }).catch((errs) => {
          this.alertService.warning('ระบบไม่สามารถทำรายการได้');
        });
      }
    }).catch((err) => {
      this.alertService.warning('ระบบไม่สามารถ update รายการสินค้าได้');
    });
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
  }
}

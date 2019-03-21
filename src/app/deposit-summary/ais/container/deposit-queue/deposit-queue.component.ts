import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { PageLoadingService, AlertService } from 'mychannel-shared-libs';
import { DEPOSIT_RESULT_PAGE, DEPOSIT_PAYMENT_SUMMARY_PAGE} from '../../../constants/route-path.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateDeviceOrderService } from '../../../services/create-device-order.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { WIZARD_RESERVE_WITH_DEPOSIT } from '../../../constants/wizard.constant';

@Component({
  selector: 'app-deposit-queue',
  templateUrl: './deposit-queue.component.html',
  styleUrls: ['./deposit-queue.component.scss']
})
export class DepositQueueComponent implements OnInit, OnDestroy {

  transaction: Transaction;
  priceOption: PriceOption;
  queueFrom: FormGroup;
  queue: string;
  wizards: any = WIZARD_RESERVE_WITH_DEPOSIT;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private createOrderService: CreateDeviceOrderService,
    private alertService: AlertService,
    private priceOptionService: PriceOptionService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.queueFrom = this.fb.group({
      'queue': ['', Validators.compose([Validators.required, Validators.pattern(/([A-Y]{1}[0-9]{3})/)])],
    });

    this.queueFrom.valueChanges.subscribe((value) => {
      this.queue = value.queue;
    });
  }

  onNext(): void {
    this.transaction.data.queue = { queueNo: this.queue };
    this.createOrderService.createDeviceOrderDt(this.transaction, this.priceOption).then((response: any) => {
      if (response) {
        this.router.navigate([DEPOSIT_RESULT_PAGE]);
      } else {
        this.alertService.error('ระบบขัดข้อง');
      }
    }).catch((err) => {
      console.log('Error!!!');
      this.router.navigate([DEPOSIT_RESULT_PAGE]);
    });
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

  onBack(): void {
    this.router.navigate([DEPOSIT_PAYMENT_SUMMARY_PAGE]);
  }
}

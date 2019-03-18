import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AlertService } from 'mychannel-shared-libs';
import { CreateDeviceOrderBestBuyService } from '../../services/create-device-order-best-buy.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { QrcodePaymentService } from '../../services/qrcode-payment.service';
import { ROUTE_DEVICE_ORDER_AIS_BEST_BUY_QR_CODE_QUEUE_SUMMARY_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-existing-best-buy-qr-code-queue-page',
  templateUrl: './device-order-ais-existing-best-buy-qr-code-queue-page.component.html',
  styleUrls: ['./device-order-ais-existing-best-buy-qr-code-queue-page.component.scss']
})
export class DeviceOrderAisExistingBestBuyQrCodeQueuePageComponent implements OnInit, OnDestroy {

  transaction: Transaction;
  priceOption: PriceOption;
  queueFrom: FormGroup;
  queue: string;
  transId: string;
  deposit: number;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private createBestBuyService: CreateDeviceOrderBestBuyService,
    private qrcodePaymentService: QrcodePaymentService
  ) { }

  ngOnInit(): void {
    this.deposit = this.transaction.data.preBooking
      && this.transaction.data.preBooking.depositAmt ? -Math.abs(+this.transaction.data.preBooking.depositAmt) : 0;
    this.getTransactionId();
    this.createForm();
  }

  getTransactionId(): void {
    this.qrcodePaymentService.getInquiryCallbackMpay(this.transaction.data.order.soId).then((transId: any) => {
      this.transId = transId.mpay_payment.tranId;
      this.transaction.data.mpayPayment.tranId = this.transId;
    });
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
    this.createBestBuyService.createDeviceOrder(this.transaction, this.priceOption, this.transId).then((response: any) => {
      if (response) {
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_QR_CODE_QUEUE_SUMMARY_PAGE]);
      }
    });
  }

  summary(amount: number[]): number {
    return amount.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

}

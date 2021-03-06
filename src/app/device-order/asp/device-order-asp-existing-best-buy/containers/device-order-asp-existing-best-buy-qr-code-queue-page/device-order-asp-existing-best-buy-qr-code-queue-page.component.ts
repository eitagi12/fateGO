import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AlertService, PageLoadingService } from 'mychannel-shared-libs';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ROUTE_DEVICE_ORDER_ASP_BEST_BUY_QR_CODE_QUEUE_SUMMARY_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-device-order-asp-existing-best-buy-qr-code-queue-page',
  templateUrl: './device-order-asp-existing-best-buy-qr-code-queue-page.component.html',
  styleUrls: ['./device-order-asp-existing-best-buy-qr-code-queue-page.component.scss']
})
export class DeviceOrderAspExistingBestBuyQrCodeQueuePageComponent implements OnInit, OnDestroy {

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
    private priceOptionService: PriceOptionService,
    private pageLoadingService: PageLoadingService,
    private alertService: AlertService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
   }

  ngOnInit(): void {
    this.deposit = this.transaction.data.preBooking
      && this.transaction.data.preBooking.depositAmt ? -Math.abs(+this.transaction.data.preBooking.depositAmt) : 0;
    this.getTransactionId();
    this.createForm();
  }

  getTransactionId(): void {
    // this.qrcodePaymentService.getInquiryCallbackMpay(this.transaction.data.order.soId).then((transId: any) => {
    //   if (transId && transId.data && transId.data.DATA && transId.data.DATA.mpay_payment) {
    //     this.transId = transId.data.DATA.mpay_payment.tranId;
    //     // this.transaction.data.mpayPayment.tranId = this.transId;
    //   } else {
    //     this.alertService.error('เกิดข้อผิดพลาด ระบบไม่สามารถเรียก orderID(soID) มาใช้งานได้');
    //   }
    // });
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
    this.pageLoadingService.openLoading();
    this.transaction.data.queue = { queueNo: this.queue };
    // this.createBestBuyService.createDeviceOrder(this.transaction, this.priceOption, this.transId).then((response: any) => {
    //   if (response) {
    //     this.pageLoadingService.closeLoading();
    //     this.router.navigate([ROUTE_DEVICE_ORDER_ASP_BEST_BUY_QR_CODE_QUEUE_SUMMARY_PAGE]);
    //   }
    // }).catch((e) => {
    //   this.pageLoadingService.closeLoading();
    //   this.alertService.error(e);
    // });
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

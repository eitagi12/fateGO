import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Aggregate } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { ROUTE_DEVICE_AIS_DEVICE_SUMMARY_PAGE, ROUTE_DEVICE_AIS_DEVICE_QUEUE_PAGE, ROUTE_DEVICE_AIS_DEVICE_QR_CODE_SUMMARY_PAGE, ROUTE_DEVICE_AIS_DEVICE_OMISE_SUMMARY_PAGE } from 'src/app/device-order/ais/device-order-ais-device/constants/route-path.constant';
import { QueuePageService } from 'src/app/device-order/services/queue-page.service';
import { QrCodeOmisePageService } from 'src/app/device-order/services/qr-code-omise-page.service';

@Component({
  selector: 'app-device-order-ais-device-aggregate-page',
  templateUrl: './device-order-ais-device-aggregate-page.component.html',
  styleUrls: ['./device-order-ais-device-aggregate-page.component.scss']
})
export class DeviceOrderAisDeviceAggregatePageComponent implements OnInit {
  transaction: Transaction;
  aggregate: Aggregate;
  priceOption: PriceOption;
  omisePayment: boolean;

  constructor(
    private router: Router,
    private transactionService: TransactionService,
    private queuePageService: QueuePageService,
    private priceOptionService: PriceOptionService,
    private qrCodeOmisePageService: QrCodeOmisePageService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.omisePayment = this.qrCodeOmisePageService.isPaymentOnlineCredit(this.transaction, 'payment');
  }

  ngOnInit(): void {
    this.queuePageService.checkQueueLocation().then((queueType) => {
      localStorage.setItem('queueType', queueType);
    });
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_AIS_DEVICE_SUMMARY_PAGE]);
  }

  onNext(): void {
    const payment: any = this.transaction.data.payment || {};
    if (payment.paymentType === 'QR_CODE') {
      this.router.navigate([ROUTE_DEVICE_AIS_DEVICE_QR_CODE_SUMMARY_PAGE]);
    } else if (this.omisePayment) {
      this.router.navigate([ROUTE_DEVICE_AIS_DEVICE_OMISE_SUMMARY_PAGE]);
    } else {
      this.router.navigate([ROUTE_DEVICE_AIS_DEVICE_QUEUE_PAGE]);
    }
  }

  getThumbnail(): string {
    const product = (this.priceOption.productDetail.products || []).find((p: any) => {
      return p.colorName === this.priceOption.productStock.color;
    });
    return product && product.images ? product.images.thumbnail : '';
  }

  summary(amount: number[]): number {
    return amount.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
  }
}

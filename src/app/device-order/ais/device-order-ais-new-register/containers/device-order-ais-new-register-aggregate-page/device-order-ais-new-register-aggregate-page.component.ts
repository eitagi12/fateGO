import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, Aggregate } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import {
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_FACE_COMPARE_PAGE,
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_QR_CODE_SUMMARY_PAGE,
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_QUEUE_PAGE,
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_OMISE_SUMMARY_PAGE
} from 'src/app/device-order/ais/device-order-ais-new-register/constants/route-path.constant';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { QrCodeOmisePageService } from 'src/app/device-order/services/qr-code-omise-page.service';
@Component({
  selector: 'app-device-order-ais-new-register-aggregate-page',
  templateUrl: './device-order-ais-new-register-aggregate-page.component.html',
  styleUrls: ['./device-order-ais-new-register-aggregate-page.component.scss']
})
export class DeviceOrderAisNewRegisterAggregatePageComponent implements OnInit {
  transaction: Transaction;
  aggregate: Aggregate;
  priceOption: PriceOption;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private qrCodeOmisePageService: QrCodeOmisePageService,
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void { }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_FACE_COMPARE_PAGE]);
  }

  onNext(): void {
    const payment: any = this.transaction.data.payment || {};
    const advancePayment: any = this.transaction.data.advancePayment || {};

    if (payment.paymentType === 'QR_CODE' || advancePayment.paymentType === 'QR_CODE') {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_QR_CODE_SUMMARY_PAGE]);
    } else if (this.qrCodeOmisePageService.isPaymentOnlineCredit(this.transaction, 'payment') ||
      this.qrCodeOmisePageService.isPaymentOnlineCredit(this.transaction, 'advancePayment')) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_OMISE_SUMMARY_PAGE]);
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_QUEUE_PAGE]);
    }
  }

  onHome(): void {
    this.homeService.goToHome();
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

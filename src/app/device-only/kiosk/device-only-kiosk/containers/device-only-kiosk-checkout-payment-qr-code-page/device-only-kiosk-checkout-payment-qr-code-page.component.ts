import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_DEVICE_ONLY_KIOSK_SUMMARY_PAGE, ROUTE_DEVICE_ONLY_KIOSK_QR_CODE_SUMMARY_PAGE, ROUTE_DEVICE_ONLY_KIOSK_OMISE_SUMMARY_PAGE } from '../../constants/route-path.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { HomeService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { HomeButtonService } from 'src/app/device-only/services/home-button.service';
import { QrCodeOmiseService } from 'src/app/device-only/services/qr-code-omise.service';

@Component({
  selector: 'app-device-only-kiosk-checkout-payment-qr-code-page',
  templateUrl: './device-only-kiosk-checkout-payment-qr-code-page.component.html',
  styleUrls: ['./device-only-kiosk-checkout-payment-qr-code-page.component.scss']
})
export class DeviceOnlyKioskCheckoutPaymentQrCodePageComponent implements OnInit, OnDestroy {
  transaction: Transaction;
  priceOption: PriceOption;
  campaignName: string = 'โครงการ ซื้อเครื่องเปล่า';
  price: any;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private homeButtonService: HomeButtonService,
    private qrCodeOmiseService: QrCodeOmiseService

  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void {
    this.price = this.priceOption.trade.priceType === 'NORMAL' ? this.priceOption.trade.normalPrice : this.priceOption.trade.promotionPrice;
    this.homeButtonService.initEventButtonHome();
  }

  summary(aomunt: number[]): number {
    return aomunt.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ONLY_KIOSK_SUMMARY_PAGE]);
  }

  onNext(): void {
    // QR code
    if (this.qrCodeOmiseService.isPaymentOnlineCredit(this.transaction, 'payment') ||
      this.qrCodeOmiseService.isPaymentOnlineCredit(this.transaction, 'advancePayment')) {
      this.router.navigate([ROUTE_DEVICE_ONLY_KIOSK_OMISE_SUMMARY_PAGE]);
    } else {
      this.router.navigate([ROUTE_DEVICE_ONLY_KIOSK_QR_CODE_SUMMARY_PAGE]);
    }
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_DEVICE_ONLY_KIOSK_CHECKOUT_PAYMENT_QR_CODE_PAGE, ROUTE_DEVICE_ONLY_KIOSK_QR_CODE_GENERATE_PAGE } from '../../constants/route-path.constant';
import { Transaction, Payment } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { ImageBrannerQRCode, QRCodePaymentService } from 'src/app/shared/services/qrcode-payment.service';
import { HomeService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HomeButtonService } from 'src/app/device-only/services/home-button.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';

@Component({
  selector: 'app-device-only-kiosk-qr-code-summary-page',
  templateUrl: './device-only-kiosk-qr-code-summary-page.component.html',
  styleUrls: ['./device-only-kiosk-qr-code-summary-page.component.scss']
})
export class DeviceOnlyKioskQrCodeSummaryPageComponent implements OnInit {
  transaction: Transaction;
  priceOption: PriceOption;
  deposit: number;
  brannerImagePaymentQrCode: ImageBrannerQRCode;
  payment: Payment;
  price: any;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private homeButtonService: HomeButtonService,
    private priceOptionService: PriceOptionService,
    private qrcodePaymentService: QRCodePaymentService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.payment = this.transaction.data.payment;
    this.brannerImagePaymentQrCode = this.qrcodePaymentService.getBrannerImagePaymentQrCodeType(this.payment.paymentQrCodeType);
  }

  ngOnInit(): void {
    // tslint:disable-next-line:max-line-length
    this.price = this.priceOption.trade.priceType === 'NORMAL' ? this.priceOption.trade.normalPrice : this.priceOption.trade.promotionPrice;
    this.homeButtonService.initEventButtonHome();
    this.calculateSummary(this.deposit);
  }

  private calculateSummary(deposit: number): void {
    this.deposit = this.transaction.data.preBooking
      && this.transaction.data.preBooking.depositAmt ? -Math.abs(+this.transaction.data.preBooking.depositAmt) : 0;
  }

  summary(amount: number[]): number {
    return amount.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ONLY_KIOSK_CHECKOUT_PAYMENT_QR_CODE_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ONLY_KIOSK_QR_CODE_GENERATE_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }
}

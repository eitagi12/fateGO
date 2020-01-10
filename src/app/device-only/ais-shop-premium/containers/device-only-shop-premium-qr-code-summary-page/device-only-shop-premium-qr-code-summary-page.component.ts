import { Component, OnInit } from '@angular/core';
import { Transaction, Payment } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { ImageBrannerQRCode, QRCodePaymentService } from 'src/app/shared/services/qrcode-payment.service';
import { Router } from '@angular/router';
import { HomeService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HomeButtonService } from 'src/app/device-only/services/home-button.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { ROUTE_SHOP_PREMIUM_QR_CODE_GENERATE_PAGE, ROUTE_SHOP_PREMIUM_SUMMARY_PAGE, ROUTE_SHOP_PREMIUM_AGGREGATE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-device-only-shop-premium-qr-code-summary-page',
  templateUrl: './device-only-shop-premium-qr-code-summary-page.component.html',
  styleUrls: ['./device-only-shop-premium-qr-code-summary-page.component.scss']
})
export class DeviceOnlyShopPremiumQrCodeSummaryPageComponent implements OnInit {

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
    this.router.navigate([ROUTE_SHOP_PREMIUM_AGGREGATE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_SHOP_PREMIUM_QR_CODE_GENERATE_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

}

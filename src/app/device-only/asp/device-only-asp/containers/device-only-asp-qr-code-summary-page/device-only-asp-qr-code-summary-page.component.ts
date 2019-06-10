import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { Transaction, Payment } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { ROUTE_DEVICE_ONLY_ASP_CHECKOUT_PAYMENT_QR_CODE_PAGE, ROUTE_DEVICE_ONLY_ASP_QR_CODE_GENERATE_PAGE } from '../../constants/route-path.constant';
import { HomeButtonService } from 'src/app/device-only/services/home-button.service';
import { HomeService } from 'mychannel-shared-libs';
import { QRCodePaymentService, ImageBrannerQRCode } from 'src/app/shared/services/qrcode-payment.service';

@Component({
  selector: 'app-device-only-asp-qr-code-summary-page',
  templateUrl: './device-only-asp-qr-code-summary-page.component.html',
  styleUrls: ['./device-only-asp-qr-code-summary-page.component.scss']
})
export class DeviceOnlyAspQrCodeSummaryPageComponent implements OnInit {
  private transaction: Transaction;
  private priceOption: PriceOption;
  private brannerImagePaymentQrCode: ImageBrannerQRCode;
  private payment: Payment;
  private price: any;
  private deposit: number;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private homeButtonService: HomeButtonService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private qrcodePaymentService: QRCodePaymentService,
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.payment = this.transaction.data.payment;
    this.brannerImagePaymentQrCode = this.qrcodePaymentService.getBrannerImagePaymentQrCodeType(this.payment.paymentQrCodeType);
   }

  ngOnInit(): void {
    this.homeButtonService.initEventButtonHome();
    this.getPriceOption();
    this.calculateSummary(this.deposit);
  }

  private getPriceOption(): void {
    this.price = this.priceOption.trade.priceType === 'NORMAL' ? this.priceOption.trade.normalPrice : this.priceOption.trade.promotionPrice;
  }

  private calculateSummary(deposit: number): void {
    this.deposit = this.transaction.data.preBooking
    && this.transaction.data.preBooking.depositAmt ? -Math.abs(+this.transaction.data.preBooking.depositAmt) : 0;
  }

  private summary(amount: number[]): number {
    return amount.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
  }

  public onHome(): void {
    this.homeService.goToHome();
  }

  public onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ONLY_ASP_CHECKOUT_PAYMENT_QR_CODE_PAGE]);
  }

  public onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ONLY_ASP_QR_CODE_GENERATE_PAGE]);
  }

}

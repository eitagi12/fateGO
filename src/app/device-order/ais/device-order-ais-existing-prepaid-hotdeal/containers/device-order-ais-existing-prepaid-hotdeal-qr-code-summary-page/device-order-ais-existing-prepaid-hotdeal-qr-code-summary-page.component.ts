import { Component, OnInit } from '@angular/core';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { ImageBrannerQRCode, QRCodePaymentService } from 'src/app/shared/services/qrcode-payment.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HomeService, AlertService } from 'mychannel-shared-libs';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_AGGREGATE_PAGE, ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_QR_CODE_GENERATOR_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-existing-prepaid-hotdeal-qr-code-summary-page',
  templateUrl: './device-order-ais-existing-prepaid-hotdeal-qr-code-summary-page.component.html',
  styleUrls: ['./device-order-ais-existing-prepaid-hotdeal-qr-code-summary-page.component.scss']
})
export class DeviceOrderAisExistingPrepaidHotdealQrCodeSummaryPageComponent implements OnInit {

  transaction: Transaction;
  priceOption: PriceOption;
  deposit: number;

  brannerImagePaymentQrCode: ImageBrannerQRCode;

  constructor(
    private router: Router,
    private http: HttpClient,
    private homeService: HomeService,
    private alertService: AlertService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private qrcodePaymentService: QRCodePaymentService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.brannerImagePaymentQrCode = this.qrcodePaymentService.getBrannerImagePaymentQrCodeType(
      this.transaction.data.payment.paymentQrCodeType);
  }

  ngOnInit(): void {
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_AGGREGATE_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_QR_CODE_GENERATOR_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  summary(amount: number[]): any {
    return amount.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
  }

}

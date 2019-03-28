import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, AlertService } from 'mychannel-shared-libs';
import { ROUTE_DEVICE_ONLY_AIS_SUMMARY_PAGE, ROUTE_DEVICE_ONLY_AIS_QR_CODE_SUMMARY_PAGE } from '../../constants/route-path.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { CreateOrderService } from '../../services/create-order.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { HomeButtonService } from '../../services/home-button.service';
@Component({
  selector: 'app-device-only-ais-checkout-payment-qr-code-page',
  templateUrl: './device-only-ais-checkout-payment-qr-code-page.component.html',
  styleUrls: ['./device-only-ais-checkout-payment-qr-code-page.component.scss']
})
export class DeviceOnlyAisCheckoutPaymentQrCodePageComponent implements OnInit, OnDestroy {
  transaction: Transaction;
  price: string = '45,700';
  color: string = 'BLACK';
  mobileNo: string = '0889540584';
  firstName: string = 'ธีระยุทธ ';
  lastName: string = 'เจโตวิมุติพงศ์';
  titleName: string = 'นาย';
  model: string = 'Samsung S10 Plus';
  campaignName: string = 'โครงการ ซื้อเครื่องเปล่า';
  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private homeButtonService: HomeButtonService
  ) {
    this.transactionService.load();
   }

  ngOnInit(): void {
    this.homeButtonService.initEventButtonHome();
  }
  onBack(): void {
  this.router.navigate([ROUTE_DEVICE_ONLY_AIS_SUMMARY_PAGE]);
  }
  onNext(): void {
    // QR code
    this.router.navigate([ROUTE_DEVICE_ONLY_AIS_QR_CODE_SUMMARY_PAGE]);
  }
  onHome(): void {
    this.homeService.goToHome();
  }
  ngOnDestroy(): void {
  }
}

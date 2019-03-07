import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, Aggregate } from 'mychannel-shared-libs';
import { ROUTE_DEVICE_ONLY_AIS_SUMMARY_PAGE, ROUTE_DEVICE_ONLY_AIS_QR_CODE_SUMMARY_PAGE } from '../../constants/route-path.constant';
@Component({
  selector: 'app-device-only-ais-checkout-payment-qr-code-page',
  templateUrl: './device-only-ais-checkout-payment-qr-code-page.component.html',
  styleUrls: ['./device-only-ais-checkout-payment-qr-code-page.component.scss']
})
export class DeviceOnlyAisCheckoutPaymentQrCodePageComponent implements OnInit {

  constructor(
    private router: Router,
    private homeService: HomeService,
  ) { }

  ngOnInit() {
  }

onBack() {
  this.router.navigate([ROUTE_DEVICE_ONLY_AIS_SUMMARY_PAGE]);
  
  }

  onNext() {
    // QR code
    // this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_QUEUE_PAGE]);
    this.router.navigate([ROUTE_DEVICE_ONLY_AIS_QR_CODE_SUMMARY_PAGE]);
    // this.router.navigate([ROUTE_DEVICE_ONLY_AIS_QR_CODE_SUMMARY_PAGE]);
    // รอหน้ามา
  }

  onHome() {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    // this.transactionService.update(this.transaction);
  }

  // summary(amount: number[]) {
  //   return amount.reduce((prev, curr) => {
  //     return prev + curr;
  //   }, 0);
  // }
}
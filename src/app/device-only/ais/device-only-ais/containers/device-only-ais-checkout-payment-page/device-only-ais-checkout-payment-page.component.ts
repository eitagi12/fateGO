import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, Aggregate } from 'mychannel-shared-libs';
import { ROUTE_DEVICE_ONLY_AIS_SUMMARY_PAGE, ROUTE_DEVICE_ONLY_AIS_QR_CODE_QUEUE_PAGE } from '../../constants/route-path.constant';
@Component({
  selector: 'app-device-only-ais-checkout-payment-page',
  templateUrl: './device-only-ais-checkout-payment-page.component.html',
  styleUrls: ['./device-only-ais-checkout-payment-page.component.scss']
})
export class DeviceOnlyAisCheckoutPaymentPageComponent implements OnInit, OnDestroy {
  price = '99999';
  color = 'ROSESILVER';
  mobileNo = '0987654321';
  firstName = 'ปลายูดดดด';
  lastName = 'จะจันทร์แล้ว';
  titleName = 'นาย';
  model = 'IPHONE 7';
  campaignName = 'โครงการ ซื้อเครื่องเปล่า';
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
    this.router.navigate([ROUTE_DEVICE_ONLY_AIS_QR_CODE_QUEUE_PAGE]);
    // this.router.navigate([ROUTE_DEVICE_ONLY_AIS_QR_CODE_SUMMARY_PAGE]);
    // รอหน้ามา
  }
  onHome() {
    this.homeService.goToHome();
  }
  ngOnDestroy(): void {
  }
}


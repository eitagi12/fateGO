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
  price: string = '99999';
  color: string = 'ROSESILVER';
  mobileNo: string = '0987654321';
  firstName: string = 'ปลายูดดดด';
  lastName: string = 'จะจันทร์แล้ว';
  titleName: string = 'นาย';
  model: string = 'IPHONE 7';
  campaignName: string = 'โครงการ ซื้อเครื่องเปล่า';

  constructor(
    private router: Router,
    private homeService: HomeService,
  ) { }

  ngOnInit(): void {
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ONLY_AIS_SUMMARY_PAGE]);
  }
  onNext(): void {
    // QR code
    // this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_QUEUE_PAGE]);
    this.router.navigate([ROUTE_DEVICE_ONLY_AIS_QR_CODE_QUEUE_PAGE]);
    // this.router.navigate([ROUTE_DEVICE_ONLY_AIS_QR_CODE_SUMMARY_PAGE]);
    // รอหน้ามา
  }
  onHome(): void {
    this.homeService.goToHome();
  }
  ngOnDestroy(): void {
  }
}

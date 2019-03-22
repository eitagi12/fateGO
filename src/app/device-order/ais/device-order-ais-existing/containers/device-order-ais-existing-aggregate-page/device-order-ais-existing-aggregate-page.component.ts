import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, DeviceSelling } from 'mychannel-shared-libs';
import { ROUTE_DEVICE_ORDER_AIS_EXISTING_AGREEMENT_SIGN_PAGE, ROUTE_DEVICE_ORDER_AIS_EXISTING_QUEUE_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-existing-aggregate-page',
  templateUrl: './device-order-ais-existing-aggregate-page.component.html',
  styleUrls: ['./device-order-ais-existing-aggregate-page.component.scss']
})
export class DeviceOrderAisExistingAggregatePageComponent implements OnInit {

  deviceSelling: DeviceSelling;
  constructor(
    private router: Router,
    private homeService: HomeService,
  ) {
  }

  ngOnInit(): void {
    this.deviceSelling = {
      brand: 'APPLE',
      campaignName: '499 บาท',
      color: 'BLACK',
      fullName: 'dd  ff',
      mobileNo: '0999999999',
      model: 'dd',
      price: 1000,
      thumbnail: ''
    };
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_AGREEMENT_SIGN_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_QUEUE_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

}

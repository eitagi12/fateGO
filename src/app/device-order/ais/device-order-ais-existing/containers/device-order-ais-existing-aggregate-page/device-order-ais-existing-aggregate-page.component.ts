import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from 'mychannel-shared-libs';
import { ROUTE_DEVICE_ORDER_AIS_EXISTING_AGREEMENT_SIGN_PAGE, ROUTE_DEVICE_ORDER_AIS_EXISTING_QUEUE_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-existing-aggregate-page',
  templateUrl: './device-order-ais-existing-aggregate-page.component.html',
  styleUrls: ['./device-order-ais-existing-aggregate-page.component.scss']
})
export class DeviceOrderAisExistingAggregatePageComponent implements OnInit {

  constructor(
    private router: Router,
    private homeService: HomeService,
  ) {
  }

  ngOnInit() {
  }

  onBack() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_AGREEMENT_SIGN_PAGE]);
  }

  onNext() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_QUEUE_PAGE]);
  }

  onHome() {
    this.homeService.goToHome();
  }

}

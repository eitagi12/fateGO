import { Component, OnInit } from '@angular/core';
import { HomeService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { ROUTE_DEVICE_ORDER_AIS_EXISTING_RESULT_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-existing-queue-page',
  templateUrl: './device-order-ais-existing-queue-page.component.html',
  styleUrls: ['./device-order-ais-existing-queue-page.component.scss']
})
export class DeviceOrderAisExistingQueuePageComponent implements OnInit {

  constructor(
    private router: Router,
    private homeService: HomeService,
  ) {
  }

  ngOnInit() {
  }

  onNext() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_RESULT_PAGE]);
  }

  onHome() {
    this.homeService.goToHome();
  }

}

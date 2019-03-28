import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from 'mychannel-shared-libs';
import { ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_MOBILE_CARE_PAGE, ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_AGGREGATE_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-existing-prepaid-hotdeal-summary-page',
  templateUrl: './device-order-ais-existing-prepaid-hotdeal-summary-page.component.html',
  styleUrls: ['./device-order-ais-existing-prepaid-hotdeal-summary-page.component.scss']
})
export class DeviceOrderAisExistingPrepaidHotdealSummaryPageComponent implements OnInit {

  constructor(
    private router: Router,
    private homeService: HomeService,
  ) { }

  ngOnInit(): void {
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_AGGREGATE_PAGE]);
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_MOBILE_CARE_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }
}

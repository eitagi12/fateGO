import { Component, OnInit } from '@angular/core';
import { HomeService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import {
  ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_SELECT_PACKAGE_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_SUMMARY_PAGE
} from '../../constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-existing-prepaid-hotdeal-mobile-care-page',
  templateUrl: './device-order-ais-existing-prepaid-hotdeal-mobile-care-page.component.html',
  styleUrls: ['./device-order-ais-existing-prepaid-hotdeal-mobile-care-page.component.scss']
})
export class DeviceOrderAisExistingPrepaidHotdealMobileCarePageComponent implements OnInit {

  constructor(
    private router: Router,
    private homeService: HomeService,
  ) { }

  ngOnInit(): void {
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_SUMMARY_PAGE]);
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_SELECT_PACKAGE_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

}

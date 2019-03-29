import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from 'mychannel-shared-libs';
import {
  ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_CUSTOMER_INFO_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_VALIDATE_CUSTOMER_ID_CARD_PAGE
} from '../../constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-existing-prepaid-hotdeal-eligible-mobile-page',
  templateUrl: './device-order-ais-existing-prepaid-hotdeal-eligible-mobile-page.component.html',
  styleUrls: ['./device-order-ais-existing-prepaid-hotdeal-eligible-mobile-page.component.scss']
})
export class DeviceOrderAisExistingPrepaidHotdealEligibleMobilePageComponent implements OnInit {

  constructor(
    private router: Router,
    private homeService: HomeService,
  ) { }

  ngOnInit(): void {
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_CUSTOMER_INFO_PAGE]);
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_VALIDATE_CUSTOMER_ID_CARD_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

}

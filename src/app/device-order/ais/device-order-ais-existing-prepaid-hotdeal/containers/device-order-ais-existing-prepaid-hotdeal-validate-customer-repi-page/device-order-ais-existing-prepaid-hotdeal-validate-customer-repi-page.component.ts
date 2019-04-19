import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from 'mychannel-shared-libs';

@Component({
  selector: 'app-device-order-ais-existing-prepaid-hotdeal-validate-customer-repi-page',
  templateUrl: './device-order-ais-existing-prepaid-hotdeal-validate-customer-repi-page.component.html',
  styleUrls: ['./device-order-ais-existing-prepaid-hotdeal-validate-customer-repi-page.component.scss']
})
export class DeviceOrderAisExistingPrepaidHotdealValidateCustomerRepiPageComponent implements OnInit {

  constructor(
    private router: Router,
    private homeService: HomeService,
  ) { }

  ngOnInit(): void {
  }

  onNext(): void {
   // this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_QUEUE_PAGE]);
  }

  onBack(): void {
   // this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_SUMMARY_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }
}

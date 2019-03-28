import { Component, OnInit } from '@angular/core';
import { HomeService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_ELIGIBLE_MOBILE_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-existing-prepaid-hotdeal-validate-customer-page',
  templateUrl: './device-order-ais-existing-prepaid-hotdeal-validate-customer-page.component.html',
  styleUrls: ['./device-order-ais-existing-prepaid-hotdeal-validate-customer-page.component.scss']
})
export class DeviceOrderAisExistingPrepaidHotdealValidateCustomerPageComponent implements OnInit {

  constructor(
    private router: Router,
    private homeService: HomeService,
  ) {
    this.homeService.callback = () => {
      window.location.href = '';
    };
  }

  ngOnInit(): void {
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_ELIGIBLE_MOBILE_PAGE]);
  }

  onBack(): void {
    this.homeService.goToHome();
  }

  onHome(): void {
    this.homeService.goToHome();
  }

}

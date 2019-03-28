import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from 'mychannel-shared-libs';
import { ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_ELIGIBLE_MOBILE_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-existing-prepaid-hotdeal-validate-customer-id-card-page',
  templateUrl: './device-order-ais-existing-prepaid-hotdeal-validate-customer-id-card-page.component.html',
  styleUrls: ['./device-order-ais-existing-prepaid-hotdeal-validate-customer-id-card-page.component.scss']
})
export class DeviceOrderAisExistingPrepaidHotdealValidateCustomerIdCardPageComponent implements OnInit {

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

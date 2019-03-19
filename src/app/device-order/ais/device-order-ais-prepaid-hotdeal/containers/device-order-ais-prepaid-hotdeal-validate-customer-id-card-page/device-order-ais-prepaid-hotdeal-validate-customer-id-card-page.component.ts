import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-device-order-ais-prepaid-hotdeal-validate-customer-id-card-page',
  templateUrl: './device-order-ais-prepaid-hotdeal-validate-customer-id-card-page.component.html',
  styleUrls: ['./device-order-ais-prepaid-hotdeal-validate-customer-id-card-page.component.scss']
})
export class DeviceOrderAisPrepaidHotdealValidateCustomerIdCardPageComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  onBack() {
    // this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_CONFIRM_USER_INFORMATION_PAGE]);
  }
  onNext() {
    // this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_EAPPLICATION_PAGE]);
  }

  onHome() {
    // this.homeService.goToHome();
  }

}

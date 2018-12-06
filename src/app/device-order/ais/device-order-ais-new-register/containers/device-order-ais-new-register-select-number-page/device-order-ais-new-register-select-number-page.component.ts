import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from 'mychannel-shared-libs';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import {
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_VERIFY_INSTANT_SIM_PAGE,
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_BY_PATTERN_PAGE,
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_CUSTOMER_INFO_PAGE
} from 'src/app/device-order/ais/device-order-ais-new-register/constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-new-register-select-number-page',
  templateUrl: './device-order-ais-new-register-select-number-page.component.html',
  styleUrls: ['./device-order-ais-new-register-select-number-page.component.scss']
})
export class DeviceOrderAisNewRegisterSelectNumberPageComponent implements OnInit {

  wizards = WIZARD_DEVICE_ORDER_AIS;

  constructor(
    private router: Router,
    private homeService: HomeService,
  ) { }

  ngOnInit() { }

  onVerifyInstantSim() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_VERIFY_INSTANT_SIM_PAGE]);
  }

  onByPattern() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_BY_PATTERN_PAGE]);
  }

  onBack() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_CUSTOMER_INFO_PAGE]);
  }

  onHome() {
    this.homeService.goToHome();
  }
}

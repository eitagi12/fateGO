import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from 'mychannel-shared-libs';
import {
  ROUTE_DEVICE_ORDER_AIS_EXISTING_MOBILE_CARE_PAGE,
  ROUTE_DEVICE_ORDER_AIS_EXISTING_EFFECTIVE_START_DATE_PAGE
} from '../../constants/route-path.constant';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';

@Component({
  selector: 'app-device-order-ais-existing-mobile-care-available-page',
  templateUrl: './device-order-ais-existing-mobile-care-available-page.component.html',
  styleUrls: ['./device-order-ais-existing-mobile-care-available-page.component.scss']
})
export class DeviceOrderAisExistingMobileCareAvailablePageComponent implements OnInit {

  wizards = WIZARD_DEVICE_ORDER_AIS;

  constructor(
    private router: Router,
    private homeService: HomeService
  ) { }

  ngOnInit() {
  }

  onBack() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_EFFECTIVE_START_DATE_PAGE]);
  }

  onNext() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_MOBILE_CARE_PAGE]);
  }

  onHome() {
    this.homeService.goToHome();
  }

}

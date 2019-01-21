import { Component, OnInit } from '@angular/core';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { Router } from '@angular/router';
import { HomeService } from 'mychannel-shared-libs';
import { ROUTE_DEVICE_ORDER_AIS_EXISTING_EFFECTIVE_START_DATE_PAGE, ROUTE_DEVICE_ORDER_AIS_EXISTING_SUMMARY_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-existing-mobile-care-page',
  templateUrl: './device-order-ais-existing-mobile-care-page.component.html',
  styleUrls: ['./device-order-ais-existing-mobile-care-page.component.scss']
})
export class DeviceOrderAisExistingMobileCarePageComponent implements OnInit {

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
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_SUMMARY_PAGE]);
  }

  onHome() {
    this.homeService.goToHome();
  }

}

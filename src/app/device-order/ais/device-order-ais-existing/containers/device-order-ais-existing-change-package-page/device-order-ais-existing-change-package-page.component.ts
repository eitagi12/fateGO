import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_DEVICE_ORDER_AIS_EXISTING_ELIGIBLE_MOBILE_PAGE, ROUTE_DEVICE_ORDER_AIS_EXISTING_MOBILE_DETAIL_PAGE } from '../../constants/route-path.constant';
import { HomeService } from 'mychannel-shared-libs';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';

@Component({
  selector: 'app-device-order-ais-existing-change-package-page',
  templateUrl: './device-order-ais-existing-change-package-page.component.html',
  styleUrls: ['./device-order-ais-existing-change-package-page.component.scss']
})
export class DeviceOrderAisExistingChangePackagePageComponent implements OnInit {

  wizards = WIZARD_DEVICE_ORDER_AIS;
  
  constructor(
    private router: Router,
    private homeService: HomeService
  ) { }

  ngOnInit() {
  }

  onBack() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_ELIGIBLE_MOBILE_PAGE]);
  }

  onNext() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_MOBILE_DETAIL_PAGE]);
  }

  onHome() {
    this.homeService.goToHome();
  }

}

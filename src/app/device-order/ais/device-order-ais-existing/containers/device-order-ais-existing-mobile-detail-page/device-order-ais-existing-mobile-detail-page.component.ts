import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_DEVICE_ORDER_AIS_EXISTING_PAYMENT_DETAIL_PAGE, ROUTE_DEVICE_ORDER_AIS_EXISTING_CHANGE_PACKAGE_PAGE } from '../../constants/route-path.constant';
import { HomeService } from 'mychannel-shared-libs';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';

@Component({
  selector: 'app-device-order-ais-existing-mobile-detail-page',
  templateUrl: './device-order-ais-existing-mobile-detail-page.component.html',
  styleUrls: ['./device-order-ais-existing-mobile-detail-page.component.scss']
})
export class DeviceOrderAisExistingMobileDetailPageComponent implements OnInit {

  wizards = WIZARD_DEVICE_ORDER_AIS;
  
  constructor(
    private router: Router,
    private homeService: HomeService
  ) { }

  ngOnInit() {
  }

  onBack() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_CHANGE_PACKAGE_PAGE]);
  }

  onNext() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_PAYMENT_DETAIL_PAGE]);
  }

  onHome() {
    this.homeService.goToHome();
  }

}

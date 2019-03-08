import { Component, OnInit } from '@angular/core';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { Router } from '@angular/router';
import { HomeService } from 'mychannel-shared-libs';
import { ROUTE_DEVICE_ORDER_AIS_EXISTING_MOBILE_CARE_PAGE, ROUTE_DEVICE_ORDER_AIS_EXISTING_AGREEMENT_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-existing-summary-page',
  templateUrl: './device-order-ais-existing-summary-page.component.html',
  styleUrls: ['./device-order-ais-existing-summary-page.component.scss']
})
export class DeviceOrderAisExistingSummaryPageComponent implements OnInit {

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;

  constructor(
    private router: Router,
    private homeService: HomeService
  ) { }

  ngOnInit(): void {
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_MOBILE_CARE_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_AGREEMENT_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

}

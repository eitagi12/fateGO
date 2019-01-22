import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { WIZARD_DEVICE_ORDER_AIS } from '../../../../constants/wizard.constant';
import {
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_CONFIRM_USER_INFORMATION_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_SUMMARY_PAGE
} from '../../constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-pre-to-post-mobile-care-page',
  templateUrl: './device-order-ais-pre-to-post-mobile-care-page.component.html',
  styleUrls: ['./device-order-ais-pre-to-post-mobile-care-page.component.scss']
})
export class DeviceOrderAisPreToPostMobileCarePageComponent implements OnInit {

  wizards = WIZARD_DEVICE_ORDER_AIS;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  onBack() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_CONFIRM_USER_INFORMATION_PAGE]);
  }
  onNext() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_SUMMARY_PAGE]);
  }
}

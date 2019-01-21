import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_CURRENT_INFO_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_ELIGIBLE_MOBILE_PAGE
} from '../../constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-pre-to-post-payment-detail-page',
  templateUrl: './device-order-ais-pre-to-post-payment-detail-page.component.html',
  styleUrls: ['./device-order-ais-pre-to-post-payment-detail-page.component.scss']
})
export class DeviceOrderAisPreToPostPaymentDetailPageComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  onBack() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_ELIGIBLE_MOBILE_PAGE]);
  }
  onNext() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_CURRENT_INFO_PAGE]);
  }

}

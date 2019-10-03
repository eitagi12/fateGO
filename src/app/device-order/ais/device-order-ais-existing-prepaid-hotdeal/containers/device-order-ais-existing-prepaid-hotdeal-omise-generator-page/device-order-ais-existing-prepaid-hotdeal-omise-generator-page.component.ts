import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_DEVICE_ORDER_AIS_EXISTING_OMISE_QUEUE_PAGE } from 'src/app/device-order/ais/device-order-ais-existing/constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-existing-prepaid-hotdeal-omise-generator-page',
  templateUrl: './device-order-ais-existing-prepaid-hotdeal-omise-generator-page.component.html',
  styleUrls: ['./device-order-ais-existing-prepaid-hotdeal-omise-generator-page.component.scss']
})
export class DeviceOrderAisExistingPrepaidHotdealOmiseGeneratorPageComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }
  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_OMISE_QUEUE_PAGE]);
  }
}

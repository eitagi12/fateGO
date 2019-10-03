import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_DEVICE_ORDER_AIS_MNP_OMISE_QUEUE_PAGE } from 'src/app/device-order/ais/device-order-ais-mnp/constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-mnp-omise-generator-page',
  templateUrl: './device-order-ais-mnp-omise-generator-page.component.html',
  styleUrls: ['./device-order-ais-mnp-omise-generator-page.component.scss']
})
export class DeviceOrderAisMnpOmiseGeneratorPageComponent implements OnInit {
  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }
  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_OMISE_QUEUE_PAGE]);
  }
}

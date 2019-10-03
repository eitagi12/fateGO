import { Component, OnInit } from '@angular/core';
import { ROUTE_DEVICE_ORDER_AIS_EXISTING_OMISE_QUEUE_PAGE } from '../../constants/route-path.constant';
import { Router } from '@angular/router';

@Component({
  selector: 'app-device-order-ais-existing-omise-generator-page',
  templateUrl: './device-order-ais-existing-omise-generator-page.component.html',
  styleUrls: ['./device-order-ais-existing-omise-generator-page.component.scss']
})
export class DeviceOrderAisExistingOmiseGeneratorPageComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }
  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_OMISE_QUEUE_PAGE]);
  }
}

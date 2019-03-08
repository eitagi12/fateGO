import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  ROUTE_DEVICE_ORDER_AIS_EXISTING_RESULT_PAGE,
  ROUTE_DEVICE_ORDER_AIS_EXISTING_AGGREGATE_PAGE
} from '../../constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-existing-queue-page',
  templateUrl: './device-order-ais-existing-queue-page.component.html',
  styleUrls: ['./device-order-ais-existing-queue-page.component.scss']
})
export class DeviceOrderAisExistingQueuePageComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_RESULT_PAGE]);
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_AGGREGATE_PAGE]);
  }

}

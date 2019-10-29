import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_DEVICE_ONLY_AIS_OMISE_QUEUE_PAGE } from 'src/app/device-only/ais/device-only-ais/constants/route-path.constant';

@Component({
  selector: 'app-device-only-ais-omise-generate-page',
  templateUrl: './device-only-ais-omise-generate-page.component.html',
  styleUrls: ['./device-only-ais-omise-generate-page.component.scss']
})
export class DeviceOnlyAisOmiseGeneratePageComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }
  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ONLY_AIS_OMISE_QUEUE_PAGE]);
  }
}

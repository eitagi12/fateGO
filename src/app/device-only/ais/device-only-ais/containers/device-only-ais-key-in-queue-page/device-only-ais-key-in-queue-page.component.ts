import { Component, OnInit, OnDestroy } from '@angular/core';
import { ROUTE_DEVICE_ONLY_AIS_QUEUE_PAGE } from '../../constants/route-path.constant';
import { Router } from '@angular/router';

@Component({
  selector: 'app-device-only-ais-key-in-queue-page',
  templateUrl: './device-only-ais-key-in-queue-page.component.html',
  styleUrls: ['./device-only-ais-key-in-queue-page.component.scss']
})
export class DeviceOnlyAisKeyInQueuePageComponent implements OnInit, OnDestroy {

  constructor(private router: Router) { }

  ngOnInit() {

  }

  onNext() {
    this.router.navigate([ROUTE_DEVICE_ONLY_AIS_QUEUE_PAGE]);
  }
  ngOnDestroy(): void {

  }
}

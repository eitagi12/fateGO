import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_DEVICE_ONLY_AIS_QUEUE_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-device-only-ais-qr-code-queue-page',
  templateUrl: './device-only-ais-qr-code-queue-page.component.html',
  styleUrls: ['./device-only-ais-qr-code-queue-page.component.scss']
})
export class DeviceOnlyAisQrCodeQueuePageComponent implements OnInit, OnDestroy {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onHome(): void {

  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ONLY_AIS_QUEUE_PAGE]);
  }
  ngOnDestroy(): void {

  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-device-only-kiosk-qr-code-key-in-queue-page',
  templateUrl: './device-only-kiosk-qr-code-key-in-queue-page.component.html',
  styleUrls: ['./device-only-kiosk-qr-code-key-in-queue-page.component.scss']
})
export class DeviceOnlyKioskQrCodeKeyInQueuePageComponent implements OnInit {

  constructor(
    private router: Router,

  ) { }

  ngOnInit(): void  {
  }

  // onNext(): void {
  //   this.router.navigate([ROUTE_DEVICE_ONLY_KIOSK_SELECT_MOBILE_CARE_PAGE]);
  // }

  // onBack(): void {
  //   this.router.navigate([ROUTE_DEVICE_ONLY_KIOSK_SELECT_PAYMENT_AND_RECEIPT_INFORMATION_PAGE]);
  // }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_DEVICE_ONLY_AIS_QR_CODE_GENERATE_PAGE } from '../../constants/route-path.constant';
@Component({
  selector: 'app-device-only-ais-qr-code-summaray-page',
  templateUrl: './device-only-ais-qr-code-summaray-page.component.html',
  styleUrls: ['./device-only-ais-qr-code-summaray-page.component.scss']
})
export class DeviceOnlyAisQrCodeSummarayPageComponent implements OnInit {

  constructor(
    private router: Router
  ) {
  }

  ngOnInit() {
  }

  onNext() {
    this.router.navigate([ROUTE_DEVICE_ONLY_AIS_QR_CODE_GENERATE_PAGE]);
  }
}

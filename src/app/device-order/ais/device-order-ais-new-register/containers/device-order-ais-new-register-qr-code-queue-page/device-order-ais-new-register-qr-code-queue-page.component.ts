import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_RESULT_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-new-register-qr-code-queue-page',
  templateUrl: './device-order-ais-new-register-qr-code-queue-page.component.html',
  styleUrls: ['./device-order-ais-new-register-qr-code-queue-page.component.scss']
})
export class DeviceOrderAisNewRegisterQrCodeQueuePageComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  onNext() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_RESULT_PAGE]);
  }

}

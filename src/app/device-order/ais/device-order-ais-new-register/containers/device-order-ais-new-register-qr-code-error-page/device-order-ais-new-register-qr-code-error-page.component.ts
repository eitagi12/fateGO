import { Component, OnInit } from '@angular/core';
import { HomeService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_QR_CODE_GENERATOR_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-new-register-qr-code-error-page',
  templateUrl: './device-order-ais-new-register-qr-code-error-page.component.html',
  styleUrls: ['./device-order-ais-new-register-qr-code-error-page.component.scss']
})
export class DeviceOrderAisNewRegisterQrCodeErrorPageComponent implements OnInit {

  constructor(
    private router: Router,
    private homeService: HomeService
  ) { }

  ngOnInit(): void {
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_QR_CODE_GENERATOR_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

}

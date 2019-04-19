import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from 'mychannel-shared-libs';
import { ROUTE_DEVICE_ORDER_AIS_MNP_QR_CODE_GENERATOR_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-mnp-qr-code-error-page',
  templateUrl: './device-order-ais-mnp-qr-code-error-page.component.html',
  styleUrls: ['./device-order-ais-mnp-qr-code-error-page.component.scss']
})
export class DeviceOrderAisMnpQrCodeErrorPageComponent implements OnInit {

  constructor(
    private router: Router,
    private homeService: HomeService
  ) { }

  ngOnInit(): void {
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_QR_CODE_GENERATOR_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

}

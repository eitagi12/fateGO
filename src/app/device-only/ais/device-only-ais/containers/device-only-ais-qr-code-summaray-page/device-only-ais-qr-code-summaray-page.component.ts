import { Component, OnInit } from '@angular/core';
import { ROUTE_DEVICE_ONLY_AIS_CHECKOUT_PAYMENT_PAGE, ROUTE_DEVICE_ONLY_AIS_QR_CODE_GENERATE_PAGE } from '../../constants/route-path.constant';
import { WIZARD_DEVICE_ONLY_MOBILE_CARE } from '../../constants/wizard.constant';

@Component({
  selector: 'app-device-only-ais-qr-code-summaray-page',
  templateUrl: './device-only-ais-qr-code-summaray-page.component.html',
  styleUrls: ['./device-only-ais-qr-code-summaray-page.component.scss']
})
export class DeviceOnlyAisQrCodeSummarayPageComponent implements OnInit {
  router: any;
  homeService: any;

  constructor() { }

  ngOnInit() {
  }

  onBack() {
    this.router.navigate([ROUTE_DEVICE_ONLY_AIS_CHECKOUT_PAYMENT_PAGE]);
  }

  onNext() {
    this.router.navigate([ROUTE_DEVICE_ONLY_AIS_QR_CODE_GENERATE_PAGE]);
  }

  onHome() {
    this.homeService.goToHome();
  }

}

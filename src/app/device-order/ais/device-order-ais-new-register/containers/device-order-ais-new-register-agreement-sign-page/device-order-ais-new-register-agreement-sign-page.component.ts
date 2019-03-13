import { Component, OnInit } from '@angular/core';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { Router } from '@angular/router';
import { HomeService } from 'mychannel-shared-libs';
import {
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_AGREEMENT_PAGE
} from 'src/app/device-order/ais/device-order-ais-new-register/constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-new-register-agreement-sign-page',
  templateUrl: './device-order-ais-new-register-agreement-sign-page.component.html',
  styleUrls: ['./device-order-ais-new-register-agreement-sign-page.component.scss']
})
export class DeviceOrderAisNewRegisterAgreementSignPageComponent implements OnInit {

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;
  signatureImage: string;

  constructor(
    private router: Router,
    private homeService: HomeService,
  ) {
  }

  ngOnInit(): void {
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_AGREEMENT_PAGE]);
  }

  onNext(): void {

  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onOpenSignature(): void { }

}

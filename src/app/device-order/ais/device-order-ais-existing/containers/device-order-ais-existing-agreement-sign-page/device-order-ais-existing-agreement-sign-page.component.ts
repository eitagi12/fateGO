import { Component, OnInit } from '@angular/core';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { Router } from '@angular/router';
import { HomeService } from 'mychannel-shared-libs';
import {
  ROUTE_DEVICE_ORDER_AIS_EXISTING_AGREEMENT_PAGE,
  ROUTE_DEVICE_ORDER_AIS_EXISTING_AGGREGATE_PAGE
} from '../../constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-existing-agreement-sign-page',
  templateUrl: './device-order-ais-existing-agreement-sign-page.component.html',
  styleUrls: ['./device-order-ais-existing-agreement-sign-page.component.scss']
})
export class DeviceOrderAisExistingAgreementSignPageComponent implements OnInit {

  wizards = WIZARD_DEVICE_ORDER_AIS;

  signatureImage: string;
  constructor(
    private router: Router,
    private homeService: HomeService,
  ) {
  }

  ngOnInit() {
  }

  onBack() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_AGREEMENT_PAGE]);
  }

  onNext() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_AGGREGATE_PAGE]);
  }

  onHome() {
    this.homeService.goToHome();
  }

  onOpenSignature() {

  }

}

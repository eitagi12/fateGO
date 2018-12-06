import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Route, Router } from '@angular/router';
import { HomeService } from 'mychannel-shared-libs';
import {
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_VALIDATE_CUSTOMER_PAGE,
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_PAYMENT_DETAIL_PAGE
} from 'src/app/device-order/ais/device-order-ais-new-register/constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-new-register-validate-customer-key-in-page',
  templateUrl: './device-order-ais-new-register-validate-customer-key-in-page.component.html',
  styleUrls: ['./device-order-ais-new-register-validate-customer-key-in-page.component.scss']
})
export class DeviceOrderAisNewRegisterValidateCustomerKeyInPageComponent implements OnInit {
  params: Params;
  prefixes: string[];
  cardTypes: string[];

  keyInValid: boolean;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private homeService: HomeService
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => this.params = params);
  }

  onError(valid: boolean) {
    this.keyInValid = valid;
  }

  onCompleted(value: any) {
    console.log(value);
  }

  onHome() {
    this.homeService.goToHome();
  }

  onBack() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_VALIDATE_CUSTOMER_PAGE]);
  }

  onNext() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_PAYMENT_DETAIL_PAGE]);
  }

}

import { Component, OnInit } from '@angular/core';
import { Params, Router, ActivatedRoute } from '@angular/router';
import { HomeService } from 'mychannel-shared-libs';
import { ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_VALIDATE_CUSTOMER_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-new-register-mnp-validate-customer-key-in-page',
  templateUrl: './new-register-mnp-validate-customer-key-in-page.component.html',
  styleUrls: ['./new-register-mnp-validate-customer-key-in-page.component.scss']
})
export class NewRegisterMnpValidateCustomerKeyInPageComponent implements OnInit {
  params: Params;
  prefixes: string[];
  cardTypes: string[];

  keyInValid: boolean;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private homeService: HomeService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: Params) => this.params = params);
  }

  onError(valid: boolean): void {
    this.keyInValid = valid;
  }

  onCompleted(value: any): void {
    console.log(value);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_VALIDATE_CUSTOMER_PAGE]);
  }

  onNext(): void {
    this.router.navigate(['']);
  }
}

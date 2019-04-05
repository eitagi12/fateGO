import { Component, OnInit } from '@angular/core';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { Router } from '@angular/router';
import { HomeService, ShoppingCart } from 'mychannel-shared-libs';
import {
  ROUTE_DEVICE_ORDER_AIS_EXISTING_SELECT_PACKAGE_PAGE,
  ROUTE_DEVICE_ORDER_AIS_EXISTING_MOBILE_CARE_AVAILABLE_PAGE
} from '../../constants/route-path.constant';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';

@Component({
  selector: 'app-device-order-ais-existing-effective-start-date-page',
  templateUrl: './device-order-ais-existing-effective-start-date-page.component.html',
  styleUrls: ['./device-order-ais-existing-effective-start-date-page.component.scss']
})
export class DeviceOrderAisExistingEffectiveStartDatePageComponent implements OnInit {

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;
  shoppingCart: ShoppingCart;
  constructor(
    private router: Router,
    private homeService: HomeService,
    private shoppingCartService: ShoppingCartService,
  ) { }

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_SELECT_PACKAGE_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_MOBILE_CARE_AVAILABLE_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

}

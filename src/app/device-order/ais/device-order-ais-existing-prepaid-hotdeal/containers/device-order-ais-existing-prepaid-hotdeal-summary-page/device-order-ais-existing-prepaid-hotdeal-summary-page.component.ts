import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, ShoppingCart } from 'mychannel-shared-libs';
import { ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_MOBILE_CARE_PAGE, ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_AGGREGATE_PAGE } from '../../constants/route-path.constant';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';

@Component({
  selector: 'app-device-order-ais-existing-prepaid-hotdeal-summary-page',
  templateUrl: './device-order-ais-existing-prepaid-hotdeal-summary-page.component.html',
  styleUrls: ['./device-order-ais-existing-prepaid-hotdeal-summary-page.component.scss']
})
export class DeviceOrderAisExistingPrepaidHotdealSummaryPageComponent implements OnInit {

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;
  shoppingCart: ShoppingCart;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private shoppingCartService: ShoppingCartService,
  ) {
    this.shoppingCart = Object.assign(this.shoppingCartService.getShoppingCartData(), {
      mobileNo: ''
    });
  }

  ngOnInit(): void {
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_AGGREGATE_PAGE]);
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_MOBILE_CARE_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }
}

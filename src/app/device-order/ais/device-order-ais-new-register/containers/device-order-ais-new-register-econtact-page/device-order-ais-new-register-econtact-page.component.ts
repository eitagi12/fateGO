import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, ShoppingCart } from 'mychannel-shared-libs';
import { ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_EAPPLICATION_PAGE, ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_AGREEMENT_SIGN_PAGE, ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_SELECT_PACKAGE_PAGE, ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_SUMMARY_PAGE } from 'src/app/device-order/ais/device-order-ais-new-register/constants/route-path.constant';
import { ShoppingCartService } from 'src/app/device-order/ais/device-order-ais-new-register/service/shopping-cart.service';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';

@Component({
  selector: 'app-device-order-ais-new-register-econtact-page',
  templateUrl: './device-order-ais-new-register-econtact-page.component.html',
  styleUrls: ['./device-order-ais-new-register-econtact-page.component.scss']
})
export class DeviceOrderAisNewRegisterEcontactPageComponent implements OnInit {
  shoppingCart: ShoppingCart;
  wizards = WIZARD_DEVICE_ORDER_AIS;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private shoppingCartService: ShoppingCartService,
  ) { }

  ngOnInit() {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
  }

  onBack() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_SUMMARY_PAGE]);
  }

  onNext() {
    // if (this.transaction.data.simCard.simSerial) {
    //   this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_AGREEMENT_SIGN_PAGE]);
    // } else {
    //   this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_PERSO_SIM_PAGE]);
    // }
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_EAPPLICATION_PAGE]);
  }

  onHome() {
    this.homeService.goToHome();
  }

}

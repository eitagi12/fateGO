import { Component, OnInit, OnDestroy } from '@angular/core';
import { CreateEapplicationService } from 'src/app/shared/services/create-eapplication.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Router } from '@angular/router';
import { HomeService, PageLoadingService, ShoppingCart } from 'mychannel-shared-libs';
import { ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_AGREEMENT_SIGN_PAGE, ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_ECONTACT_PAGE, ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_PERSO_SIM_PAGE } from '../../constants/route-path.constant';
import { ShoppingCartService } from 'src/app/device-order/ais/device-order-ais-new-register/service/shopping-cart.service';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';

@Component({
  selector: 'app-device-order-ais-new-register-eapplication-page',
  templateUrl: './device-order-ais-new-register-eapplication-page.component.html',
  styleUrls: ['./device-order-ais-new-register-eapplication-page.component.scss']
})
export class DeviceOrderAisNewRegisterEapplicationPageComponent implements OnInit, OnDestroy {
  wizards = WIZARD_DEVICE_ORDER_AIS;
  transaction: Transaction;
  getDataBase64Eapp: string;
  shoppingCart: ShoppingCart;

  constructor(
    private router: Router,
    private createEapplicationService: CreateEapplicationService,
    private transactionService: TransactionService,
    private homeService: HomeService,
    private pageLoadingService: PageLoadingService,
    private shoppingCartService: ShoppingCartService, ) { }

  ngOnInit() {
    this.pageLoadingService.openLoading();
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    this.transaction = this.transactionService.load();
    this.createEapplicationService.createEapplication(this.transaction).then(res => {
      this.getDataBase64Eapp = 'data:image/jpeg;base64,' + res.data;
    }).then(() => {
      this.pageLoadingService.closeLoading();
    });
  }

  onBack() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_ECONTACT_PAGE]);
  }

  onNext() {
    // if (this.transaction.data.simCard.simSerial) {
    //   this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_AGREEMENT_SIGN_PAGE]);
    // } else {
    //   this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_PERSO_SIM_PAGE]);
    // }
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_AGREEMENT_SIGN_PAGE]);
  }

  onHome() {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}

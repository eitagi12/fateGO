import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { ShoppingCart, HomeService, PageLoadingService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { CreateEapplicationService } from 'src/app/shared/services/create-eapplication.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { ROUTE_DEVICE_ORDER_AIS_MNP_ECONTACT_PAGE, ROUTE_DEVICE_ORDER_AIS_MNP_AGREEMENT_SIGN_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-mnp-eapplication-page',
  templateUrl: './device-order-ais-mnp-eapplication-page.component.html',
  styleUrls: ['./device-order-ais-mnp-eapplication-page.component.scss']
})
export class DeviceOrderAisMnpEapplicationPageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;

  transaction: Transaction;
  shoppingCart: ShoppingCart;
  eApplicationSrc: string;

  constructor(
    private router: Router,
    private createEapplicationService: CreateEapplicationService,
    private transactionService: TransactionService,
    private homeService: HomeService,
    private pageLoadingService: PageLoadingService,
    private shoppingCartService: ShoppingCartService, ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.pageLoadingService.openLoading();
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    this.createEapplicationService.createEapplication(this.transaction)
      .then((resp: any) => this.eApplicationSrc = resp.data)
      .then(() => this.pageLoadingService.closeLoading());
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_ECONTACT_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_AGREEMENT_SIGN_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}

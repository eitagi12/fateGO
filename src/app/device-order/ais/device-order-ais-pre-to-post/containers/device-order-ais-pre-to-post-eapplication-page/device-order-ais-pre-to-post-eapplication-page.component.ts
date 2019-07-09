import { Component, OnInit, OnDestroy } from '@angular/core';
import { CreateEapplicationService } from 'src/app/shared/services/create-eapplication.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Router } from '@angular/router';
import { HomeService, PageLoadingService, ShoppingCart } from 'mychannel-shared-libs';

import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import {
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_AGREEMENT_SIGN_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_ECONTRACT_PAGE
} from '../../constants/route-path.constant';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-device-order-ais-pre-to-post-eapplication-page',
  templateUrl: './device-order-ais-pre-to-post-eapplication-page.component.html',
  styleUrls: ['./device-order-ais-pre-to-post-eapplication-page.component.scss']
})
export class DeviceOrderAisPreToPostEapplicationPageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;

  transaction: Transaction;
  shoppingCart: ShoppingCart;
  eApplicationSrc: string;
  translationSubscribe: Subscription;

  constructor(
    private router: Router,
    private createEapplicationService: CreateEapplicationService,
    private transactionService: TransactionService,
    private homeService: HomeService,
    private pageLoadingService: PageLoadingService,
    private translateService: TranslateService,
    private shoppingCartService: ShoppingCartService, ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.pageLoadingService.openLoading();
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    this.callService(this.transaction, this.translateService.currentLang);
    this.translationSubscribe = this.translateService.onLangChange.subscribe(language => {
      this.callService(this.transaction, language.lang);
    });
  }

  callService(transaction: Transaction, language: string): void {
    this.createEapplicationService.createEapplication(transaction)
    .then((resp: any) => this.eApplicationSrc = resp.data)
    .then(() => this.pageLoadingService.closeLoading());
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_ECONTRACT_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_AGREEMENT_SIGN_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    if (this.translationSubscribe) {
      this.translationSubscribe.unsubscribe();
    }
    this.transactionService.update(this.transaction);
  }
}

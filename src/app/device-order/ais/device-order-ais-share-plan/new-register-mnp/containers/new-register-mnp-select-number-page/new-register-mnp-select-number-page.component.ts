import { Component, OnInit } from '@angular/core';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { ShoppingCart, HomeService } from 'mychannel-shared-libs';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';

@Component({
  selector: 'app-new-register-mnp-select-number-page',
  templateUrl: './new-register-mnp-select-number-page.component.html',
  styleUrls: ['./new-register-mnp-select-number-page.component.scss']
})
export class NewRegisterMnpSelectNumberPageComponent implements OnInit {
  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;
  transaction: Transaction;
  shoppingCart: ShoppingCart;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private shoppingCartService: ShoppingCartService
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
  }

  onVerifyInstantSim(): void {
    this.router.navigate([]);
  }

  onByPattern(): void {
    this.router.navigate([]);
  }

  onBack(): void {
    this.router.navigate([]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

}

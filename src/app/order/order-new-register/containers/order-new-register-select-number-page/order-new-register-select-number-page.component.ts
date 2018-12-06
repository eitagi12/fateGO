import { Component, OnInit } from '@angular/core';
import { WIZARD_ORDER_NEW_REGISTER } from 'src/app/order/constants/wizard.constant';
import { Router } from '@angular/router';
import { HomeService } from 'mychannel-shared-libs';
import {
  ROUTE_ORDER_NEW_REGISTER_VERIFY_INSTANT_SIM_PAGE,
  ROUTE_ORDER_NEW_REGISTER_BY_PATTERN_PAGE,
  ROUTE_ORDER_NEW_REGISTER_FACE_COMPARE_PAGE,
} from 'src/app/order/order-new-register/constants/route-path.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';

@Component({
  selector: 'app-order-new-register-select-number-page',
  templateUrl: './order-new-register-select-number-page.component.html',
  styleUrls: ['./order-new-register-select-number-page.component.scss']
})
export class OrderNewRegisterSelectNumberPageComponent implements OnInit {

  wizards = WIZARD_ORDER_NEW_REGISTER;
  transaction: Transaction;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit() { }

  onVerifyInstantSim() {
    this.router.navigate([ROUTE_ORDER_NEW_REGISTER_VERIFY_INSTANT_SIM_PAGE]);
  }

  onByPattern() {
    this.router.navigate([ROUTE_ORDER_NEW_REGISTER_BY_PATTERN_PAGE]);
  }

  onBack() {
    this.router.navigate([ROUTE_ORDER_NEW_REGISTER_FACE_COMPARE_PAGE]);
  }

  onHome() {
    this.homeService.goToHome();
  }

}

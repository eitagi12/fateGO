import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PageLoadingService } from 'mychannel-shared-libs';
import { ROUTE_ORDER_NEW_REGISTER_FACE_CAPTURE_PAGE, ROUTE_ORDER_NEW_REGISTER_PASSPOPRT_INFO_PAGE } from '../../constants/route-path.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';

@Component({
  selector: 'app-order-new-register-passport-info-page',
  templateUrl: './order-new-register-passport-info-page.component.html',
  styleUrls: ['./order-new-register-passport-info-page.component.scss']
})
export class OrderNewRegisterPassportInfoPageComponent implements OnInit {
  transaction: Transaction;
  constructor(
    private router: Router,
    private transactionService: TransactionService,
    private pageLoadingService: PageLoadingService,
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit() {
    console.log('data', this.transaction);
  }

  onBack() {
    this.router.navigate([ROUTE_ORDER_NEW_REGISTER_PASSPOPRT_INFO_PAGE]);
  }

  onNext() {
    this.router.navigate([ROUTE_ORDER_NEW_REGISTER_FACE_CAPTURE_PAGE]);
  }

}

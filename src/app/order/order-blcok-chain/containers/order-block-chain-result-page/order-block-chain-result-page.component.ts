import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from 'mychannel-shared-libs';
import { ROUTE_ORDER_BLOCK_CHAIN_FACE_CONFIRM_PAGE } from 'src/app/order/order-blcok-chain/constants/route-path.constant';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';

@Component({
  selector: 'app-order-block-chain-result-page',
  templateUrl: './order-block-chain-result-page.component.html',
  styleUrls: ['./order-block-chain-result-page.component.scss']
})
export class OrderBlockChainResultPageComponent implements OnInit {

  isSuccess: boolean = true;
  transaction: Transaction;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {

  }
  onBack(): void {
    this.router.navigate([ROUTE_ORDER_BLOCK_CHAIN_FACE_CONFIRM_PAGE]);
  }

  onNext(): void {
    // this.router.navigate([ROUTE_ORDER_BLOCK_CHAIN_RESULT_PAGE]);
  }

}

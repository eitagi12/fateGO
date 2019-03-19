import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_RESERVE_WITH_DEPOSIT } from '../../../constants/wizard.constant';
import { LocalStorageService } from 'ngx-store';
import { ApiRequestService, PageLoadingService, HomeService, Utils, AlertService } from 'mychannel-shared-libs';
import { Transaction, TransactionType, TransactionAction } from 'src/app/shared/models/transaction.model';
import { PriceOption } from '../../../../shared/models/price-option.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { Router } from '@angular/router';
import { DEPOSIT_QUEUE_PAGE } from 'src/app/deposit-summary/constants/route-path.constant';

@Component({
  selector: 'app-deposit-payment-page',
  templateUrl: './deposit-payment-page.component.html',
  styleUrls: ['./deposit-payment-page.component.scss']
})
export class DepositPaymentPageComponent implements OnInit, OnDestroy {

  wizards: any = WIZARD_RESERVE_WITH_DEPOSIT;
  transaction: Transaction;
  priceOption: PriceOption;

  constructor(private localStorageService: LocalStorageService,
              private apiRequestService: ApiRequestService,
              private transactionServicet: TransactionService,
              private priceOptionService: PriceOptionService,
              private router: Router) { }

  ngOnInit(): void {
    this.transaction = {
      transactionId: this.apiRequestService.getCurrentRequestId(),
      data: {
        transactionType: TransactionType.RESERVE_WITH_DEPOSIT,
        customer: this.localStorageService.load('CustomerProfile').value,
        action: TransactionAction.KEY_IN
      }
    };

    this.priceOption = {
      trade: this.localStorageService.load('reserveProductInfo').value
    };

  }
  ngOnDestroy(): void {
    this.transactionServicet.save(this.transaction);
    this.priceOptionService.save(this.priceOption);
  }

  onNext(): void {
    this.router.navigate([DEPOSIT_QUEUE_PAGE]);
  }
}

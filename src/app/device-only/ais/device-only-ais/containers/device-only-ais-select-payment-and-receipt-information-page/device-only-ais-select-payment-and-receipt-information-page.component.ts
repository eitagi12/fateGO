import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { ROUTE_DEVICE_ONLY_AIS_SELECT_MOBILE_CARE_PAGE } from '../../constants/route-path.constant';
import { HomeService, ApiRequestService } from '../../../../../../../node_modules/mychannel-shared-libs';
import { Transaction, TransactionType, TransactionAction, Customer } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';

@Component({
  selector: 'app-device-only-ais-select-payment-and-receipt-information-page',
  templateUrl: './device-only-ais-select-payment-and-receipt-information-page.component.html',
  styleUrls: ['./device-only-ais-select-payment-and-receipt-information-page.component.scss']
})
export class DeviceOnlyAisSelectPaymentAndReceiptInformationPageComponent implements OnInit , OnDestroy {

  transaction: Transaction;
  isSuccess: boolean;

  constructor(

    private router: Router,
    private homeService: HomeService,
    private apiRequestService: ApiRequestService,
    private transactionService: TransactionService
  ) {
    this.transaction = this.transactionService.load();
   }

  ngOnInit(): void {
    this.apiRequestService.createRequestId();
    if (!this.transaction.data) {
      this.transaction = {
        data : {
          action: TransactionAction.KEY_IN,
          transactionType: TransactionType.DEVICE_ORDER_DEVICE_ONLY
        }
      };
    }
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onBack(): void {
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ONLY_AIS_SELECT_MOBILE_CARE_PAGE]);
  }

  onComplete(customerInfo: Customer): void {
    console.log('customerInfo', customerInfo);
  }

  onError(error: boolean): void {
    this.isSuccess = error;
    console.log(this.isSuccess);
  }

  checkAction(action: string): void {
    if (action === 'READ_CARD') {
      this.transaction.data.action = TransactionAction.READ_CARD;
    } else {
      this.transaction.data.action = TransactionAction.KEY_IN;
    }
  }

  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
  }
}

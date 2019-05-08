import { Component, OnInit, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { TransactionType, TransactionAction, Transaction } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { User, ApiRequestService, TokenService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { CreateDeviceOrderService } from 'src/app/deposit-summary/services/create-device-order.service';

@Component({
  selector: 'app-deposit-payment-receipt-page',
  templateUrl: './deposit-payment-receipt-page.component.html',
  styleUrls: ['./deposit-payment-receipt-page.component.scss']
})
export class DepositPaymentReceiptPageComponent implements OnInit {

  transaction: Transaction;
  priceOption: PriceOption;
  user: User;
  isReceiptInformationValid: boolean;
  customerInfoTemp: any;

  constructor(
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private createDeviceOrderService: CreateDeviceOrderService,
    private apiRequestService: ApiRequestService,
    private tokenService: TokenService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.user = this.tokenService.getUser();
  }

  ngOnInit(): void {
    if (!this.transaction.data) {
      this.transaction = {
        transactionId: this.apiRequestService.getCurrentRequestId(),
        data: {
          transactionType: TransactionType.RESERVE_WITH_DEPOSIT,
          action: TransactionAction.KEY_IN
        }
      };
    } else if (this.transaction.data.customer && this.transaction.data.billingInformation) {
      this.customerInfoTemp = {
        customer: this.transaction.data.customer,
        billDeliveryAddress: this.transaction.data.billingInformation.billDeliveryAddress,
        receiptInfo: this.transaction.data.receiptInfo,
        action: this.transaction.data.action
      };
    }
  }

  onComplete(customerInfo: any): void {
    this.transaction.data.customer = customerInfo.customer;
    this.transaction.data.billingInformation = {
      billDeliveryAddress: customerInfo.billDeliveryAddress
    };
    this.transaction.data.receiptInfo = customerInfo.receiptInfo;
  }

  onError(error: boolean): void {
    this.isReceiptInformationValid = error;
  }

  checkAction(action: string): void {
    if (action === 'READ_CARD') {
      this.transaction.data.action = TransactionAction.READ_CARD;
    } else {
      this.transaction.data.action = TransactionAction.KEY_IN;
    }
  }

  OnDestroy(): void {
    this.transactionService.save(this.transaction);
  }

}

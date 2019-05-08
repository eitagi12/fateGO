import { Component, OnInit, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { TransactionType, TransactionAction, Transaction, Customer } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { User, ApiRequestService, TokenService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { CreateDeviceOrderService } from 'src/app/deposit-summary/services/create-device-order.service';
import { Router } from '@angular/router';
import { DEPOSIT_PAYMENT_SUMMARY_PAGE, DEPOSIT_PAYMENT_DETAIL_KEY_IN } from 'src/app/deposit-summary/constants/route-path.constant';
import { WIZARD_RESERVE_WITH_DEPOSIT } from 'src/app/deposit-summary/constants/wizard.constant';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-deposit-payment-receipt-page',
  templateUrl: './deposit-payment-receipt-page.component.html',
  styleUrls: ['./deposit-payment-receipt-page.component.scss']
})
export class DepositPaymentReceiptPageComponent implements OnInit {

  wizards: any = WIZARD_RESERVE_WITH_DEPOSIT;
  transaction: Transaction;
  priceOption: PriceOption;
  user: User;
  customerInfoTemp: any;
  productImage: String;
  formID: String;
  paymentDetail: any;
  selectPaymentDetail: any;
  paymentDetailOption: any;
  paymentForm: FormGroup;
  discountForm: FormGroup;
  paymentMethod: string;
  customer: Customer;
  customerFullName: string;
  customerFullAddress: string;
  idCardNo: string;
  colorCodeStyle: any;
  priceOptionPayment: any;
  priceOptionBank: any;
  selectedMobile: string;
  locationNameTH: string;
  receiptCustomerAddress: string;
  otherPhoneNumber: string;
  isDisabled: boolean;
  isReceiptInformationValid: boolean;

  constructor(
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private createDeviceOrderService: CreateDeviceOrderService,
    private apiRequestService: ApiRequestService,
    private router: Router,
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

  onHome(): void {
    const url = '/';
  }

  onBack(): void {
    this.router.navigate([DEPOSIT_PAYMENT_DETAIL_KEY_IN]);
  }

  onNext(): void {
    this.router.navigate([DEPOSIT_PAYMENT_SUMMARY_PAGE]);
  }

  isNotFormValid(): boolean {
    return !(this.isReceiptInformationValid);
  }
  OnDestroy(): void {
    this.transactionService.save(this.transaction);
  }

}

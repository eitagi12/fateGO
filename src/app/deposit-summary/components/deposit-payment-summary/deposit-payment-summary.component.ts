import { Component, OnInit, Input } from '@angular/core';
import { Customer, ProductInfo, Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';

@Component({
  selector: 'app-deposit-payment-summary',
  templateUrl: './deposit-payment-summary.component.html',
  styleUrls: ['./deposit-payment-summary.component.scss']
})
export class DepositPaymentSummaryComponent implements OnInit {
  _customer: Customer;
  _reserveProductInfo: ProductInfo;
  transaction: Transaction;

  private customerFullName: string;
  private customerFullAddress: string;
  private customerIdCardNo: string;
  // mobileNo: string = this.registerNumberService.getNewRegistration().mobileNo;
  public useDepositAmt: boolean;
  public colorName: string;
  public brand: string;
  public model: string;
  public tradeReserve: any;
  constructor(private transactionService: TransactionService) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    const CUSTOMER_DATA = this.transactionService.load().data.customer;
    this.customerFullName = CUSTOMER_DATA.firstName + ' ' + CUSTOMER_DATA.lastName;
    this.customerIdCardNo = CUSTOMER_DATA.idCardNo;
    this.customerFullAddress =  CUSTOMER_DATA.moo + ' ' + CUSTOMER_DATA.mooBan + ' ' + CUSTOMER_DATA.soi + ' ' + CUSTOMER_DATA.street
    + ' ' + CUSTOMER_DATA.amphur + ' ' + CUSTOMER_DATA.floor + ' ' + CUSTOMER_DATA.room + ' ' + CUSTOMER_DATA.buildingName
    + ' ' + CUSTOMER_DATA.homeNo + ' ' + + CUSTOMER_DATA.province + ' ' + CUSTOMER_DATA.tumbol + CUSTOMER_DATA.zipCode;

  }
  // get reserveProductInfo(): ProductInfo {

  //   return this._reserveProductInfo;
  // }

  // get customer(): Customer {
  //   var customerData = this.transactionService.load().data.customer;
  //   this.customerFullName = customerData.firstName + ' ' + customerData.lastName;
  //   this.customerIdCardNo = customerData.idCardNo;
  //   this.customerFullAddress =  customerData.moo + ' ' + customerData.mooBan + ' ' + customerData.soi + ' ' + customerData.street
  //   + ' ' + customerData.amphur + ' ' + customerData.floor + ' ' + customerData.room + ' ' + customerData.buildingName
  //   + ' ' + customerData.homeNo + ' ' + + customerData.province + ' ' + customerData.tumbol + customerData.zipCode
  //   return this._customer;
  // }

}

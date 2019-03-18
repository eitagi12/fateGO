import { Component, OnInit, Input } from '@angular/core';
import { Customer, ProductInfo, Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Utils } from 'mychannel-shared-libs';

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
  constructor(private transactionService: TransactionService,
    private utils: Utils) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    // const customer = this.transaction.data.customer;
    // this.customerFullAddress = this.utils.getCurrentAddress({
    //   homeNo: customer.homeNo,
    //   moo: customer.moo,
    //   room: customer.room,
    //   floor: customer.floor,
    //   buildingName: customer.buildingName,
    //   soi: customer.soi,
    //   street: customer.street,
    //   tumbol: customer.tumbol,
    //   amphur: customer.amphur,
    //   province: customer.province,
    //   zipCode: customer.zipCode
    // });

  }
  // get reserveProductInfo(): ProductInfo {

  //   return this._reserveProductInfo;
  // }
}

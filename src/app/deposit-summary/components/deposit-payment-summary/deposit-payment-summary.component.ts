import { Component, OnInit, Input } from '@angular/core';
import { Customer, ProductInfo, Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Utils } from 'mychannel-shared-libs';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';

@Component({
  selector: 'app-deposit-payment-summary',
  templateUrl: './deposit-payment-summary.component.html',
  styleUrls: ['./deposit-payment-summary.component.scss']
})
export class DepositPaymentSummaryComponent implements OnInit {
  _customer: Customer;
  _reserveProductInfo: PriceOption;
  transaction: Transaction;
  priceOption: PriceOption;

  private customerFullName: string;
  private customerFullAddress: string;
  private customerIdCardNo: string;
  public mobileNo: string;
  public depositAmt: boolean;
  public colorName: string;
  public brand: string;
  public model: string;
  public tradeReserve: any;
  public summaryPrice: number;
  constructor(
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private utils: Utils) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void {
    const customer = this.transaction.data.customer;
    const reserveProductInfo = this.priceOption.trade;
    this.customerFullName = customer.firstName + ' ' + customer.lastName;
    this.customerFullAddress = customer.homeNo + ' ' + customer.moo + ' ' + customer.room + ' ' +
     customer.floor + ' ' + customer.buildingName + ' ' + customer.soi + ' ' + customer.street + ' ' +
     customer.tumbol + ' ' + customer.amphur + ' ' + customer.province + ' ' + customer.zipCode;
    this.customerIdCardNo = customer.idCardNo;
    this.mobileNo = customer.mainMobile;
    this.brand = reserveProductInfo.brand;
    this.colorName = reserveProductInfo.colorName;
    this.model = reserveProductInfo.model;
    this.depositAmt = reserveProductInfo.tradeReserve.trades[0].deposit.depositIncludeVat;
    this.summaryPrice = reserveProductInfo.tradeReserve.trades[0].normalPrice;
  }
}

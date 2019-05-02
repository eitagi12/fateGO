import { Component, OnInit } from '@angular/core';
import { Customer, Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
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

  public customerFullName: string;
  public customerFullAddress: string;
  public customerIdCardNo: string;
  public mobileNo: string;
  public depositAmt: boolean;
  public colorName: string;
  public brand: string;
  public model: string;
  public tradeReserve: any;
  public summaryPrice: number;
  public paymentType: string;
  public customerReceiptAddress: string;
  // public recipientCustomerAddress: string;

  constructor(
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void {
    const customer = this.transaction.data.customer;
    const reserveProductInfo = this.priceOption.trade;
    this.customerFullName = customer.firstName + ' ' + customer.lastName;
    // this.customerFullAddress = this.getFullAddress(customer);
    this.customerFullAddress = this.transaction.data.customer.shipaddress.shipCusAddr;
    this.customerIdCardNo = customer.idCardNo;
    this.mobileNo = this.getMobileFormat(customer.selectedMobile);
    this.customerReceiptAddress = this.getFullAddress(customer);
    // this.recipientCustomerAddress =  JSON.parse(localStorage.getItem('recipientCustomerAddress'));
    this.brand = reserveProductInfo.brand;
    this.colorName = reserveProductInfo.colorName;
    this.model = reserveProductInfo.model;
    if (reserveProductInfo.tradeReserve.trades[0].deposit) {
      this.depositAmt = reserveProductInfo.tradeReserve.trades[0].deposit.depositIncludeVat;
    }
    if (reserveProductInfo.tradeReserve.trades[0].normalPrice) {
      this.summaryPrice = reserveProductInfo.tradeReserve.trades[0].normalPrice;
    }
    if (this.transaction.data.payment && this.transaction.data.payment.paymentMethod === 'CA') {
      this.paymentType = 'เงินสด';
    } else if (this.transaction.data.payment && this.transaction.data.payment.paymentMethod === 'CC') {
      this.paymentType = 'บัตรเครดิต';
    }

  }
  getFullAddress(customer: Customer): string {
    if (!customer) {
      return '-';
    }
    const fullAddress =
      (customer.homeNo ? customer.homeNo + ' ' : '') +
      (customer.moo ? 'หมู่ที่ ' + customer.moo + ' ' : '') +
      (customer.mooBan ? 'หมู่บ้าน ' + customer.mooBan + ' ' : '') +
      (customer.room ? 'ห้อง ' + customer.room + ' ' : '') +
      (customer.floor ? 'ชั้น ' + customer.floor + ' ' : '') +
      (customer.buildingName ? 'อาคาร ' + customer.buildingName + ' ' : '') +
      (customer.soi ? 'ซอย ' + customer.soi + ' ' : '') +
      (customer.street ? 'ถนน ' + customer.street + ' ' : '') +
      (customer.tumbol ? 'ตำบล/แขวง ' + customer.tumbol + ' ' : '') +
      (customer.amphur ? 'อำเภอ/เขต ' + customer.amphur + ' ' : '') +
      (customer.province ? 'จังหวัด ' + customer.province + ' ' : '') +
      (customer.zipCode || '');
    return fullAddress || '-';
  }

  getMobileFormat(mobileNo: string): string {
    let firstThreeDigitMobileNo = '';
    let lastForthDigitMobileNo = '';
    let result = '';
    if (mobileNo) {
      firstThreeDigitMobileNo = mobileNo.substring(0, 3);
      lastForthDigitMobileNo = mobileNo.substring(6, 10);
      return result = (firstThreeDigitMobileNo + 'XXX' + lastForthDigitMobileNo).toUpperCase();
    }
  }
}

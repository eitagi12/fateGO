import { Component, OnInit } from '@angular/core';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Utils } from 'mychannel-shared-libs';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-summary-payment-detail',
  templateUrl: './summary-payment-detail.component.html',
  styleUrls: ['./summary-payment-detail.component.scss']
})
export class SummaryPaymentDetailComponent implements OnInit {
  mobileNo: string = '0935880795';
  balance: any;

  priceOption: PriceOption;
  transaction: Transaction;
  customerAddress: string;
  price: string;

  constructor(
    private priceOptionService: PriceOptionService,
    private transactionService: TransactionService,
    private utils: Utils,
    private http: HttpClient
    ) {
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.price = this.priceOption.trade.priceType === 'NORMAL' ? this.priceOption.trade.normalPrice : this.priceOption.trade.promotionPrice;
    this.getDataCustomer();
  }

  getDataCustomer(): void {
    const customer = this.transaction.data.customer;
    if (customer) {
      this.customerAddress = this.utils.getCurrentAddress({
        homeNo: customer.homeNo,
        moo: customer.moo,
        room: customer.room,
        floor: customer.floor,
        buildingName: customer.buildingName,
        soi: customer.soi,
        street: customer.street,
        tumbol: customer.tumbol,
        amphur: customer.amphur,
        province: customer.province,
        zipCode: customer.zipCode
      });
    } else {
      this.customerAddress = '';
    }
    this.getQueryBalance(this.mobileNo);
  }

  private getQueryBalance(mobileNo: string): void {
    this.http.get(`/api/customerportal/newRegister/${mobileNo}/queryBalance`).toPromise().then((response: any) => {
      this.balance = response.data.remainingBalance;
      console.log('Balance => : ', this.balance);
    });
  }
}

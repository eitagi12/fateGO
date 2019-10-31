import { Component, OnInit } from '@angular/core';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Utils, User, TokenService } from 'mychannel-shared-libs';

@Component({
  selector: 'app-summary-payment-detail',
  templateUrl: './summary-payment-detail.component.html',
  styleUrls: ['./summary-payment-detail.component.scss']
})
export class SummaryPaymentDetailComponent implements OnInit {

  public enoughBalance: boolean;
  priceOption: PriceOption;
  transaction: Transaction;
  customerAddress: string;
  price: string;
  isShowReceiptTnfomation: boolean = false;
  user: User;

  constructor(
    private priceOptionService: PriceOptionService,
    private transactionService: TransactionService,
    private utils: Utils,
    private tokenService: TokenService
  ) {
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();
    this.user = this.tokenService.getUser();
  }

  ngOnInit(): void {
    this.checkUserType();
    this.getDataCustomer();
    this.price = this.priceOption.trade.priceType === 'NORMAL' ? this.priceOption.trade.normalPrice : this.priceOption.trade.promotionPrice;
  }

  private checkUserType(): boolean {
    return this.isShowReceiptTnfomation = this.user.userType === 'ASP' ? false : true;
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
  }

}

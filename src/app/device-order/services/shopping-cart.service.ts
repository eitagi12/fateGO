import { Injectable } from '@angular/core';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  constructor(
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService

  ) { }

  getShoppingCartData(): any {
    const transaction = this.transactionService.load();
    const priceOption = this.priceOptionService.load();
    const customer = transaction.data.customer;
    const simCard = transaction.data.simCard;
    const campaign = priceOption.campaign;
    const trade = priceOption.trade || {};
    const productDetail = priceOption.productDetail || {};

    const advancePay = +trade.advancePay.amount || 0;
    return {
      fullName: customer.titleName + ' ' + customer.firstName + ' ' + customer.lastName,
      mobileNo: simCard && simCard.mobileNo ? simCard.mobileNo : '',
      campaignName: campaign.campaignName,
      commercialName: productDetail.name,
      qty: 1,
      price: +trade.promotionPrice + advancePay
    };
  }
}

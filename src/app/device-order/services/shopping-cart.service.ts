import { Injectable } from '@angular/core';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
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
    const productStock = priceOption.productStock;

    return {
      fullName: customer.titleName + ' ' + customer.firstName + ' ' + customer.lastName,
      mobileNo: simCard && simCard.mobileNo ? simCard.mobileNo : '',
      campaignName: campaign.campaignName,
      brand: productStock.stock.branch,
      model: productStock.stock.model,
      color: productStock.stock.color,
      qty: 1,
      price: +campaign.maximumPromotionPrice + (+campaign.minimumAdvancePay)
    };
  }
}

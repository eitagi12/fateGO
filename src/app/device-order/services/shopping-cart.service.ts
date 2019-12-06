import { Injectable } from '@angular/core';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  constructor(
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private translateService: TranslateService
  ) { }

  getShoppingCartData(): any {
    const transaction = this.transactionService.load();
    const priceOption = this.priceOptionService.load();
    const customer = transaction.data.customer;
    const simCard = transaction.data.simCard;
    const campaign = priceOption.campaign;
    const trade = priceOption.trade || {};
    const productDetail = priceOption.productDetail || {};
    const productStock = priceOption.productStock || {};

    const advancePay = +trade.advancePay.amount || 0;
    let commercialName = productDetail.name;
    if (productStock.color) {
      commercialName += ` สี ${productStock.color}`;
    }
    const shoppingCartData = {
      fullName: `${customer.titleName || ''} ${customer.firstName || ''} ${customer.lastName || ''}`.trim() || '-',
      mobileNo: simCard && simCard.mobileNo ? simCard.mobileNo : '',
      campaignName: campaign.campaignName,
      commercialName: commercialName,
      qty: 1,
      price: +trade.promotionPrice + advancePay
    };
    this.translateService.stream(campaign.campaignName).subscribe(campaignName => shoppingCartData.campaignName = campaignName);
    return shoppingCartData;
  }

  getShoppingCartDataSuperKhum(): any {
    const transaction = this.transactionService.load();
    const priceOption = this.priceOptionService.load();
    const customer = transaction.data.customer;
    const simCard = transaction.data.simCard;
    const campaign = priceOption.campaign;
    const trade = priceOption.trade || {};
    const productDetail = priceOption.productDetail || {};
    const productStock = priceOption.productStock || {};

    const advancePay = +trade.advancePay.amount || 0;
    let commercialName = productDetail.name;
    if (productStock.colorName) {
      commercialName += ` สี ${productStock.colorName}`;
    }
    const shoppingCartData = {
      fullName: `${customer.titleName || ''} ${customer.firstName || ''} ${customer.lastName || ''}`.trim() || '-',
      mobileNo: simCard && simCard.mobileNo ? simCard.mobileNo : '',
      campaignName: campaign.campaignName,
      commercialName: commercialName,
      qty: 1,
      price: +trade.promotionPrice + advancePay
    };
    this.translateService.stream(campaign.campaignName).subscribe(campaignName => shoppingCartData.campaignName = campaignName);
    return shoppingCartData;
  }
}

import { Injectable } from '@angular/core';
import { Transaction } from '../models/transaction.model';
import { HttpClient } from '@angular/common/http';
import { PriceOption } from '../models/price-option.model';
import { DecimalPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CreateContractService {

  constructor(
    private http: HttpClient,
    private decimalPipe: DecimalPipe
  ) { }

  createEContractV2(transaction: Transaction, priceOption: PriceOption, condition: any, language: any): Promise<any> {
    return this.http.post(
      '/api/salesportal/v2/generate-e-document-econtract',
      this.getRequestEContractV2(transaction, priceOption, condition, language)
    ).toPromise();
  }

  getRequestEContractV2(transaction: Transaction, priceOption: PriceOption, condition: any, language: any): any {
    const campaign: any = priceOption.campaign || {};
    const trade: any = priceOption.trade || {};
    const productStock: any = priceOption.productStock || {};
    const customer: any = transaction.data.customer || {};
    const simCard: any = transaction.data.simCard || {};
    const mainPackage: any = transaction.data.mainPackage || {};
    const mobileCarePackage: any = transaction.data.mobileCarePackage || {};
    const advancePay: any = trade.advancePay || {};

    const data: any = {
      campaignName: campaign.campaignName,
      locationName: productStock.locationName || '',
      customerType: '',
      idCard: this.transformIDcard(customer.idCardNo), // this.transformIDcard(customer.idCardNo),
      fullName: `${customer.firstName || ''} ${customer.lastName || ''}`,
      mobileNumber: simCard.mobileNo,
      imei: simCard.imei || '',
      brand: productStock.brand,
      model: productStock.model,
      color: productStock.color,
      priceIncludeVat: this.transformDecimalPipe(trade.normalPrice),
      priceDiscount: this.transformDecimalPipe(trade.discount ? trade.discount.amount : 0),
      netPrice: this.transformDecimalPipe(trade.promotionPrice),
      advancePay: this.transformDecimalPipe(advancePay.amount),
      contract: trade.durationContract,
      packageDetail: mainPackage.detailTH,
      airTimeDiscount: this.getAirTimeDiscount(advancePay.amount, advancePay.promotions),
      airTimeMonth: this.getAirTimeMonth(advancePay.promotions),
      price: this.transformDecimalPipe(+trade.promotionPrice + (+advancePay.amount)),
      signature: '',
      mobileCarePackageTitle: mobileCarePackage.detailTH ? `พร้อมใช้บริการ ${mobileCarePackage.detailTH}` : '',
      condition: condition.conditionText,
      language: language
    };
    return data;
  }

  getAirTimeDiscount(amount: number, advancePayPromotions: any): number {
    if (!advancePayPromotions) {
      return 0;
    }
    if (Array.isArray(advancePayPromotions)) {
      return advancePayPromotions.length > 0 ? (amount / advancePayPromotions[0].month) : 0;
    } else {
      return (amount / advancePayPromotions.month) ? (amount / advancePayPromotions.month) : 0;
    }
  }

  getAirTimeMonth(advancePayPromotions: any): number {
    if (!advancePayPromotions) {
      return 0;
    }

    if (Array.isArray(advancePayPromotions) && advancePayPromotions.length > 0) {
      return advancePayPromotions[0].month;
    }
    return 0;
  }

  transformIDcard(value: any, args?: any): any {
    if (!value) {
      return '';
    }
    const offset = 4;
    const temp: string = value.slice(value.length - offset);
    return value.slice(0, value.length - offset).replace(/./gi, 'X') + temp;
  }

  transformDecimalPipe(value: any): any {
    if (!value) {
      return '';
    }
    return this.decimalPipe.transform(value);
  }
}

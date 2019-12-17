import { Injectable } from '@angular/core';
import { Transaction, SimCard } from '../models/transaction.model';
import { HttpClient } from '@angular/common/http';
import { PriceOption } from '../models/price-option.model';
import { DecimalPipe } from '@angular/common';
import { BillingSystemType } from 'mychannel-shared-libs';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class CreateEcontractService {

  constructor(
    private http: HttpClient,
    private decimalPipe: DecimalPipe,
    private translateService: TranslateService
  ) { }

  createEContractV2(transaction: Transaction, priceOption: PriceOption, condition: any, language: any): Promise<any> {
    return this.http.post(
      '/api/salesportal/v2/generate-e-document-econtract',
      this.getRequestEContractV2(transaction, priceOption, condition, language)
    ).toPromise();
  }

  getRequestEContractV2(transaction: Transaction, priceOption: PriceOption, condition: any, language: any): Promise<any> {
    const campaign: any = priceOption.campaign || {};
    const trade: any = priceOption.trade || {};
    const productStock: any = priceOption.productStock || {};
    const customer: any = transaction.data.customer || {};
    const simCard: any = transaction.data.simCard || {};
    const mainPackage: any = (transaction.data.mainPackage || transaction.data.currentPackage) || {};
    const mobileCarePackage: any = transaction.data.mobileCarePackage || {};
    const advancePay: any = trade.advancePay || {};
    const promotionByMainPackage = this.findPromotionByMainPackage(mainPackage.customAttributes, simCard, priceOption);

    const seller: any = transaction.data.seller || {};
    const locationFromSeller = (seller && seller.locationName) ? seller.locationName : productStock.locationName;

    const data: any = {
      campaignName: campaign.campaignName,
      locationName: this.translateService.instant(locationFromSeller) || '',
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
      packageDetail: language === 'EN' ? (mainPackage.detailEN || mainPackage.detailEng) : (mainPackage.detailTH || mainPackage.detail),
      airTimeDiscount: this.getAirTimeDiscount(advancePay.amount, promotionByMainPackage
        ? promotionByMainPackage : advancePay.promotions) || 0,
      airTimeMonth: this.getAirTimeMonth(promotionByMainPackage ? promotionByMainPackage : advancePay.promotions) || 0,
      price: this.transformDecimalPipe(+trade.promotionPrice + (+advancePay.amount)),
      signature: '',
      mobileCarePackageTitle: this.getMobileCarePackageTitle(mobileCarePackage.customAttributes, language) || '',
      isPayAdvance: this.isAdvancePay(trade),
      language: language
    };
    return data;
  }

  getMobileCarePackageTitle(mobileCarePackage: any = {}, langCurrent: any): string {
    if (langCurrent === 'TH') {
      return mobileCarePackage.shortNameThai ? `พร้อมใช้บริการ ${mobileCarePackage.shortNameThai}` : '';
    } else {
      return mobileCarePackage.shortNameEng ? `Ready to use ${mobileCarePackage.shortNameEng}` : '';
    }
  }

  isAdvancePay(trade: any): boolean {
    const advancePay = trade.advancePay || {};
    return (advancePay && advancePay.amount > 0);
  }

  findPromotionByMainPackage(mainPackageCustomAttributes: any, simCard: SimCard, priceOption: PriceOption): any {
    if (priceOption.trade) {
      // check mainPackage กับเบอร์ที่ทำรายการให้ตรงกับ billingSystem ของเบอร์ที่ทำรายการ
      const advancePay = priceOption.trade.advancePay || {};
      const billingSystem = (simCard.billingSystem === 'RTBS')
        ? BillingSystemType.IRB : simCard.billingSystem || BillingSystemType.IRB;
      if (advancePay.promotions) {
        return advancePay.promotions
          .find(promotion =>
            (promotion && promotion.billingSystem) === (mainPackageCustomAttributes || billingSystem));
      } else {
        return null;
      }
    }
  }

  getAirTimeDiscount(amount: number, advancePayPromotions: any): number {
    if (!advancePayPromotions) {
      return 0;
    }
    if (Array.isArray(advancePayPromotions)) {
      return advancePayPromotions.length > 0 ? +(amount / advancePayPromotions[0].month).toFixed(2) : 0;
    } else {
      return (amount / advancePayPromotions.month) ? +(amount / advancePayPromotions.month).toFixed(2) : 0;
    }
  }

  getAirTimeMonth(advancePayPromotions: any): number {
    if (!advancePayPromotions) {
      return 0;
    }

    if (Array.isArray(advancePayPromotions)) {
      return advancePayPromotions.length > 0 ? advancePayPromotions[0].month : 0;
    } else {
      return advancePayPromotions.month;
    }
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

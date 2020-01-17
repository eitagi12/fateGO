import { Injectable } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { BillingSystemType } from 'mychannel-shared-libs';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Transaction } from '../models/transaction.model';
import { TransactionService } from './transaction.service';

@Injectable({
  providedIn: 'root'
})
export class CreateEcontractService {
  constructor(
    private http: HttpClient,
    private decimalPipe: DecimalPipe,
    private translateService: TranslateService,
    private transaction: TransactionService
  ) { }

  createEContractV2(transaction: Transaction, condition: any): Promise<any> {
    return this.http.post(
      '/api/salesportal/v2/generate-e-document-econtract',
      this.getRequestEContractV2(transaction, condition)
    ).toPromise();
  }

  getRequestEContractV2(transaction: Transaction, condition: any): Promise<any> {
    const campaign: any = transaction.data.campaign || {};
    // const trade: any = priceOption.trade || {};
    // const productStock: any = priceOption.productStock || {};
    const customer: any = transaction.data.customer || {};
    const simCard: any = transaction.data.customer.mobileNo || {};
    const mainPackage: any = (transaction.data.mainPackage || transaction.data.currentPackage) || {};
    // const mobileCarePackage: any = transaction.data.mobileCarePackage || {};
    const advancePay: any = parseInt(transaction.data.mainPackage.payAdvance, 0) || {};
    // const promotionByMainPackage = this.findPromotionByMainPackage(mainPackage);

    // const seller: any = transaction.data.seller.locationDestName || {};
    // const locationFromSeller = (seller && seller.locationName) ? seller.locationName : productStock.locationName;

    const productPrice = parseInt(transaction.data.productPrice, 0);
    const productDiscount = parseInt(transaction.data.productDiscount, 0);
    const productNetPrice = parseInt(transaction.data.productNetPrice, 0);
    const locationFromSeller = transaction.data.locationDestName;
    const data: any = {
      campaignName: campaign.campaignName,
      locationName: this.translateService.instant(locationFromSeller) || '',
      customerType: '',
      idCard: this.transformIDcard(customer.idCardNo), // this.transformIDcard(customer.idCardNo),
      fullName: `${customer.firstName || ''} ${customer.lastName || ''}`,
      mobileNumber: simCard.mobileNo,
      imei: simCard.imei || '',
      brand: transaction.data.brand,
      model: transaction.data.model,
      color: transaction.data.color,
      priceIncludeVat: this.transformDecimalPipe(productPrice),
      priceDiscount: this.transformDecimalPipe(productDiscount),
      netPrice: this.transformDecimalPipe(productNetPrice),
      advancePay: this.transformDecimalPipe(advancePay),
      contract: mainPackage.durationContract,
      packageDetail: mainPackage.mainPackageName,
      airTimeDiscount: 0,
      airTimeMonth:  0,
      price: 2000,
      signature: '',
      // mobileCarePackageTitle: this.getMobileCarePackageTitle(mobileCarePackage.customAttributes, language) || '',
      isPayAdvance: this.isAdvancePay(mainPackage.payAdvance) || '',
      // language: language
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

  isAdvancePay(mainPackage: any): boolean {
    const advancePay = mainPackage.payAdvance || {};
    return (advancePay && advancePay.amount > 0);
  }

  // findPromotionByMainPackage(mainPackageCustomAttributes: any): any {
  //   if (this.transaction.data.mainPackage.payAdvance) {
  //     // check mainPackage กับเบอร์ที่ทำรายการให้ตรงกับ billingSystem ของเบอร์ที่ทำรายการ
  //     const advancePay = this.transaction.data.mainPackage.payAdvance || {};
  //     const billingSystem = (simCard.billingSystem === 'RTBS')
  //       ? BillingSystemType.IRB : simCard.billingSystem || BillingSystemType.IRB;
  //     if (advancePay.promotions) {
  //       return advancePay.promotions
  //         .find(promotion =>
  //           (promotion && promotion.billingSystem) === (mainPackageCustomAttributes || billingSystem));
  //     } else {
  //       return null;
  //     }
  //   }
  // }

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

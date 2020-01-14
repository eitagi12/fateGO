import { Injectable } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { BillingSystemType } from 'mychannel-shared-libs';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CreateEcontractService {

  constructor(
    private http: HttpClient,
    private decimalPipe: DecimalPipe,
    private translateService: TranslateService
  ) { }

  createEContractV2( condition: any): Promise<any> {
    return this.http.post(
      '/api/salesportal/v2/generate-e-document-econtract',
      this.getRequestEContractV2(condition)
    ).toPromise();
  }

  getRequestEContractV2(condition: any): Promise<any> {
    // const campaign: any = priceOption.campaign || {};
    // const trade: any = priceOption.trade || {};
    // const productStock: any = priceOption.productStock || {};
    // const customer: any = transaction.data.customer || {};
    // const simCard: any = transaction.data.simCard || {};
    // const mainPackage: any = (transaction.data.mainPackage || transaction.data.currentPackage) || {};
    // const mobileCarePackage: any = transaction.data.mobileCarePackage || {};
    const advancePay: any = {};
    // const promotionByMainPackage = this.findPromotionByMainPackage(mainPackage.customAttributes, simCard, priceOption);

    // const seller: any = transaction.data.seller || {};
    // const locationFromSeller = (seller && seller.locationName) ? seller.locationName : productStock.locationName;

    const data: any = {
      campaignName: 'Hot deal NEW',
      locationName: 'สาขาอาคารเอไอเอส 2',
      customerType: '',
      idCard: '1479900297517', // this.transformIDcard(customer.idCardNo),
      fullName: 'นางสาวปิ่นแก้ว ศิริวรรณา',
      mobileNumber: '0849725128',
      imei: '',
      brand: 'SAMSUNG',
      model: 'J200',
      color: 'BLACK',
      priceIncludeVat: '4280.00',
      priceDiscount: '899.00',
      netPrice: '3280.00',
      advancePay: '1070.00',
      contract: '10',
      packageDetail: 'แพ็กเกจค่าบริการรายเดือน 1,000 บาท',
      airTimeDiscount: 12,
      airTimeMonth: 10,
      price: 2899,
      signature: '',
      mobileCarePackageTitle:  '',
      isPayAdvance: '',
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

  // findPromotionByMainPackage(mainPackageCustomAttributes: any): any {
  //   if (priceOption.trade) {
  //     // check mainPackage กับเบอร์ที่ทำรายการให้ตรงกับ billingSystem ของเบอร์ที่ทำรายการ
  //     const advancePay = priceOption.trade.advancePay || {};
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

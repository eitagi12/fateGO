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
    const campaign: any = transaction.data.campaign || '';
    const customer: any = transaction.data.customer || '';
    const idCard: any = transaction.data.customer.idCardNo || '';
    const simCard: any = transaction.data.cusMobileNo || '';
    const mainPackage: any = (transaction.data.mainPackage || transaction.data.currentPackage) || {};
    const advancePay = transaction.data.mainPackage.payAdvance || '';
    const productPrice = transaction.data.productPrice;
    const productDiscount = transaction.data.productDiscount;
    const payAdvanceDiscount = transaction.data.mainPackage.payAdvanceDiscount;
    const locationFromSeller = transaction.data.locationDestName;
    const amount = transaction.data.mainPackage.durationMonthlyFee;

    const data: any = {
      campaignName: campaign.campaignName,
      locationName: this.translateService.instant(locationFromSeller) || '',
      customerType: '',
      idCard: this.transformIDcard(idCard), // this.transformIDcard(customer.idCardNo),
      fullName: `${customer.firstName || ''} ${customer.lastName || ''}`,
      fullNameEN: `${(customer.firstNameEn || '')} ${(customer.lastNameEn || '')}`,
      mobileNumber: simCard || '',
      imei: simCard.imei || '',
      brand: transaction.data.brand,
      model: transaction.data.model,
      color: transaction.data.color,
      priceIncludeVat: this.transformDecimalPipe(productPrice) || '',
      priceDiscount: this.transformDecimalPipe(productDiscount) || '',
      netPrice: this.transformDecimalPipe(productPrice - productDiscount) || '',
      advancePay: advancePay,
      contract: mainPackage.durationContract,
      packageDetail: mainPackage.mainPackageDesc,
      airTimeDiscount: this.getAirTimeDiscount(amount, payAdvanceDiscount) || 0,
      airTimeMonth: amount || '',
      price: this.transformDecimalPipe(+productPrice + (+productDiscount)),
      signature: '',
      mobileCarePackageTitle: '',
      isPayAdvance: this.isAdvancePay(mainPackage.payAdvance) || '',
      language: 'TH',
    };
    return data;
  }

  isAdvancePay(mainPackage: any): boolean {
    const advancePay = mainPackage.payAdvance || {};
    return (advancePay && advancePay.amount > 0);
  }

  getAirTimeDiscount(amount: number, payAdvanceDiscount: any): any {
    return (payAdvanceDiscount / amount).toFixed(2);
  }

  getAirTimeMonth(payAdvanceDiscount: any): number {
    if (!payAdvanceDiscount) {
      return 0;
    }

    if (Array.isArray(payAdvanceDiscount)) {
      return payAdvanceDiscount.length > 0 ? payAdvanceDiscount[0].month : 0;
    } else {
      return payAdvanceDiscount.month;
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

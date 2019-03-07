import { Injectable } from '@angular/core';
import { Utils, TokenService } from 'mychannel-shared-libs';
import { Transaction, TransactionAction } from '../models/transaction.model';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class CreateEapplicationService {

  constructor(
    private http: HttpClient,
    private utils: Utils,
    private tokenService: TokenService,
    private translation: TranslateService
  ) { }

  createEapplication(transaction: Transaction): Promise<any> {
    return this.http.post(
      '/api/salesportal/generate-e-document-eapplication',
      this.getRequestEapplication(transaction)
    ).toPromise();
  }

  createEapplicationV2(transaction: Transaction, language): Promise<any> {
    return this.http.post(
      '/api/salesportal/v2/generate-e-document-eapplication',
      this.getRequestEapplicationV2(transaction, language)
    ).toPromise();
  }

  getRequestEapplication(transaction: Transaction): any {
    const customer = transaction.data.customer;
    const billingInformation = transaction.data.billingInformation;
    const billCycleData = billingInformation.billCycleData;
    const action = transaction.data.action;

    const data: any = {
      fullNameTH: customer.firstName + ' ' + customer.lastName || '',
      idCard: customer.idCardNo || '',
      birthDate: customer.birthdate || '',
      customerAddress: this.utils.getCurrentAddress({
        homeNo: customer.homeNo || '',
        moo: customer.moo || '',
        room: customer.room || '',
        floor: customer.floor || '',
        buildingName: customer.buildingName || '',
        soi: customer.soi || '',
        street: customer.street || '',
        tumbol: customer.tumbol || '',
        amphur: customer.amphur || '',
        province: customer.province || '',
        zipCode: customer.zipCode || ''
      }, this.translation.currentLang) || '',
      mobileNumber: transaction.data.simCard.mobileNo || '',
      mainPackage: {
        name: transaction.data.mainPackage.shortNameThai || '',
        description: transaction.data.mainPackage.statementThai || ''
      },
      billCycle: billCycleData.billCycleText || '',
      receiveBillMethod: billCycleData.receiveBillMethod || '',
      billDeliveryAddress: billCycleData.billAddressText || '',
      fullNameEN: `${(customer.firstNameEn || '')} ${(customer.lastNameEn || '')}`,
      issueDate: customer.issueDate || '',
      expireDate: customer.expireDate || '',
      signature: customer.imageSignature || '',
    };

    if (action === TransactionAction.READ_CARD || action === TransactionAction.READ_CARD_REPI) {
      data.customerImg = customer.imageReadSmartCard;
    } else {
      data.customerImgKeyIn = customer.imageSmartCard || customer.imageReadPassport;
    }

    return data;
  }

  getRequestEapplicationV2(transaction: Transaction, language): any {
    const customer = transaction.data.customer;
    const billingInformation = transaction.data.billingInformation;
    const billCycleData = billingInformation.billCycleData;
    const action = transaction.data.action;

    const data: any = {
      fullNameTH: customer.firstName + ' ' + customer.lastName || '',
      idCard: customer.idCardNo || '',
      idCardType: customer.idCardType || '',
      birthDate: customer.birthdate || '',
      customerAddress: this.utils.getCurrentAddress({
        homeNo: customer.homeNo || '',
        moo: customer.moo || '',
        room: customer.room || '',
        floor: customer.floor || '',
        buildingName: customer.buildingName || '',
        soi: customer.soi || '',
        street: customer.street || '',
        tumbol: customer.tumbol || '',
        amphur: customer.amphur || '',
        province: customer.province || '',
        zipCode: customer.zipCode || ''
      }, this.translation.currentLang) || '',
      mobileNumber: transaction.data.simCard.mobileNo || '',

      mainPackage: {
        name: transaction.data.mainPackage.shortNameThai || '',
        description: transaction.data.mainPackage.statementThai || ''
      },
      billCycle: billCycleData.billCycleText || '',
      receiveBillMethod: billCycleData.receiveBillMethod || '',
      billDeliveryAddress: billCycleData.billAddressText || '',
      fullNameEN: `${(customer.firstNameEn || '')} ${(customer.lastNameEn || '')}`,
      issueDate: customer.issueDate || '',
      expireDate: customer.expireDate || '',
      signature: customer.imageSignature || '',
      language: language || '',
    };
    if (language === 'EN') {
      data.billCycle = billCycleData.billCycleTextEng;
      data.mainPackage = {
        name: transaction.data.mainPackage.shortNameEng || '',
        description: transaction.data.mainPackage.statementEng || ''
      };
    } else {
      data.billCycle = billCycleData.billCycleText;
      data.mainPackage = {
        name: transaction.data.mainPackage.shortNameThai || '',
        description: transaction.data.mainPackage.statementThai || ''
      };
    }
    if (action === TransactionAction.READ_CARD || action === TransactionAction.READ_CARD_REPI) {
      data.customerImg = customer.imageReadSmartCard;
    } else {
      data.customerImgKeyIn = customer.imageSmartCard || customer.imageReadPassport;
    }

    return data;
  }
}

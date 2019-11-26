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

  createEapplicationV2(transaction: Transaction, language: any): Promise<any> {
    return this.http.post(
      '/api/salesportal/v2/generate-e-document-eapplication',
      this.getRequestEapplicationV2(transaction, language)
    ).toPromise();
  }

  createEapplicationSuperKhumSharepalnNewRegister(transaction: any, language: any): Promise<any> {
    return this.http.post(
      '/api/salesportal/v2/generate-e-document-eapplication',
      this.getRequestEapplicationSuperKhumSharePlanNewRegister(transaction, language)
    ).toPromise();
  }

  createEapplicationSuperKhumSharepalnMnp(transaction: any, language: any): Promise<any> {
    return this.http.post(
      '/api/salesportal/v2/generate-e-document-eapplication-share-plan',
      this.getRequestEapplicationSuperKhumSharePlanMnp(transaction, language)
    ).toPromise();
  }

  getRequestEapplication(transaction: Transaction): any {
    const customer = transaction.data.customer;
    const billingInformation = transaction.data.billingInformation;
    const billCycleData = billingInformation.billCycleData;
    const action = transaction.data.action;
    const transactionType = transaction.data.transactionType;

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
        name: transaction.data.mainPackage.title || '',
        description: transaction.data.mainPackage.detailTH || ''
      },
      billCycle: billCycleData.billCycleText || '',
      receiveBillMethod: this.translation.instant(billCycleData.receiveBillMethod) || '',
      billDeliveryAddress: billCycleData.billAddressText || '',
      fullNameEN: `${(customer.firstNameEn || '')} ${(customer.lastNameEn || '')}`,
      issueDate: customer.issueDate || '',
      expireDate: customer.expireDate || '',
      signature: '',
    };

    if (action === TransactionAction.READ_CARD || action === TransactionAction.READ_CARD_REPI) {
      data.customerImg = 'data:image/jpeg;base64,' + customer.imageReadSmartCard;
    } else {
      data.customerImgKeyIn = 'data:image/jpeg;base64,' + customer.imageSmartCard || customer.imageReadPassport;
    }

    return data;
  }

  getRequestEapplicationSuperKhumSharePlanMnp(transaction: any, language: any): any {
    const customer: any = transaction.data.customer || {};
    const billingInformation: any = transaction.data.billingInformation || {};
    const billCycleData: any = billingInformation.billCycleData || {};
    const action: any = transaction.data.action;
    const mainPackage: any = transaction.data.mainPackage.memberMainPackage[0] || {};
    const simCard: any = transaction.data.simCard.memberSimCard[0] || {}; // Get simNo of member
    const data: any = {
      fullNameTH: language === 'EN' ? `${(customer.firstNameEn || '')} ${(customer.lastNameEn || '')}` :
        customer.firstName + ' ' + customer.lastName || '',
      idCard: this.privateIdcard(customer.idCardNo) || '',
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
      mobileNumber: simCard.mobileNo || '',
      mainPackage: {
        name: mainPackage.title || '',
        description: mainPackage.detailTH || ''
      },
      billCycle: billCycleData.billCycleText || '',
      receiveBillMethod: billCycleData.receiveBillMethod || '',
      billDeliveryAddress: billCycleData.billAddressText || '',
      fullNameEN: `${(customer.firstNameEn || '')} ${(customer.lastNameEn || '')}`,
      issueDate: customer.issueDate || '',
      expireDate: customer.expireDate || '',
      signature: customer.imageSignatureSmartCard || customer.imageSignature || ''
    };
    if (language === 'EN') {
      data.billCycle = billCycleData.billCycleTextEng;
      data.mainPackage = {
        name: (mainPackage.customAttributes || {}).shortNameEng || mainPackage.title || '',
        description: mainPackage.statementEng || mainPackage.detailEN || ''
      };
    } else {
      data.billCycle = billCycleData.billCycleText;
      data.mainPackage = {
        name: (mainPackage.customAttributes || {}).shortNameThai || mainPackage.title || '',
        description: mainPackage.statementThai || mainPackage.detailTH || ''
      };
    }
    if (action === TransactionAction.READ_CARD || action === TransactionAction.READ_CARD_REPI) {
      data.customerImg = customer.imageReadSmartCard || customer.imageSmartCard;
    } else {
      data.customerImgKeyIn = customer.imageSmartCard ? customer.imageSignatureWithWaterMark : customer.imageReadPassport;
    }
    return data;
  }

  getRequestEapplicationSuperKhumSharePlanNewRegister(transaction: any, language: any): any {
    const customer: any = transaction.data.customer || {};
    const billingInformation: any = transaction.data.billingInformation || {};
    const billCycleData: any = billingInformation.billCycleData || {};
    const action: any = transaction.data.action;
    const mainPackage: any = transaction.data.mainPackage || {};
    const simCard: any = transaction.data.simCard || {};

    const data: any = {
      fullNameTH: language === 'EN' ? `${(customer.firstNameEn || '')} ${(customer.lastNameEn || '')}` :
        customer.firstName + ' ' + customer.lastName || '',
      idCard: this.privateIdcard(customer.idCardNo) || '',
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
      mobileNumber: simCard.mobileNo || '',

      mainPackage: {
        name: mainPackage.shortNameThai || '',
        description: mainPackage.statementThai || ''
      },
      billCycle: billCycleData.billCycleText || '',
      receiveBillMethod: billCycleData.receiveBillMethod || '',
      billDeliveryAddress: billCycleData.billAddressText || '',
      fullNameEN: `${(customer.firstNameEn || '')} ${(customer.lastNameEn || '')}`,
      issueDate: customer.issueDate || '',
      expireDate: customer.expireDate || '',
      signature: customer.imageSignatureSmartCard || customer.imageSignature || ''
    };
    if (language === 'EN') {
      data.billCycle = billCycleData.billCycleTextEng;
      data.mainPackage = {
        name: (mainPackage.customAttributes || {}).shortNameEng || mainPackage.title || '',
        description: mainPackage.statementEng || mainPackage.detailEN || ''
      };
    } else {
      data.billCycle = billCycleData.billCycleText;
      data.mainPackage = {
        name: (mainPackage.customAttributes || {}).shortNameThai || mainPackage.title || '',
        description: mainPackage.statementThai || mainPackage.detailTH || ''
      };
    }
    if (action === TransactionAction.READ_CARD || action === TransactionAction.READ_CARD_REPI) {
      data.customerImg = customer.imageReadSmartCard || customer.imageSmartCard;
    } else {
      data.customerImgKeyIn = customer.imageSmartCard ? customer.imageSignatureWithWaterMark : customer.imageReadPassport;
    }

    return data;
  }

  getRequestEapplicationV2(transaction: Transaction, language: any): any {
    const customer: any = transaction.data.customer || {};
    const billingInformation: any = transaction.data.billingInformation || {};
    const billCycleData: any = billingInformation.billCycleData || {};
    const action: any = transaction.data.action;
    const mainPackage: any = transaction.data.mainPackage || {};
    const simCard: any = transaction.data.simCard || {};

    const data: any = {
      fullNameTH: language === 'EN' ? `${(customer.firstNameEn || '')} ${(customer.lastNameEn || '')}` :
        customer.firstName + ' ' + customer.lastName || '',
      idCard: this.privateIdcard(customer.idCardNo) || '',
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
      mobileNumber: simCard.mobileNo || '',

      mainPackage: {
        name: mainPackage.shortNameThai || '',
        description: mainPackage.statementThai || ''
      },
      billCycle: billCycleData.billCycleText || '',
      receiveBillMethod: this.translation.instant(billCycleData.receiveBillMethod) || '',
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
        name: (mainPackage.customAttributes || {}).shortNameEng || mainPackage.title || '',
        description: mainPackage.statementEng || mainPackage.detailEN || ''
      };
    } else {
      data.billCycle = billCycleData.billCycleText;
      data.mainPackage = {
        name: (mainPackage.customAttributes || {}).shortNameThai || mainPackage.title || '',
        description: mainPackage.statementThai || mainPackage.detailTH || ''
      };
    }
    if (action === TransactionAction.READ_CARD || action === TransactionAction.READ_CARD_REPI) {
      data.customerImg = customer.imageReadSmartCard;
    } else {
      data.customerImgKeyIn = customer.imageSmartCard || customer.imageReadPassport;
    }

    return data;
  }

  private privateIdcard(idcardNo: string): string {
    return idcardNo.replace(/^[0-9]{9}/, 'XXXXXXXXX');
  }
}

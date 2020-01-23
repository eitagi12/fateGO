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
    // private translation: TranslateService
  ) { }

  createEapplicationV2(transaction: Transaction): Promise<any> {
    return this.http.post(
      '/api/salesportal/v2/generate-e-document-eapplication',
      this.getRequestEapplicationV2(transaction)
    ).toPromise();
  }

  getRequestEapplicationV2(transaction: Transaction): any {
    const customer: any = transaction.data.customer || transaction.data || {};
    // const billingInformation: any = transaction.data.billingInformation || {};
    // const billCycleData: any = transaction.data.billingInformation.billCycles[0] || {};
    const action: any = transaction.data.action;
    const mainPackage: any = transaction.data.mainPackage || {};
    const simCard: any = transaction.data.cusMobileNo || {};
    // const billCycle = 'วันที่ 16 ถึงวันที่ 15 กุมภาพันธ์';
    const billingInformation = transaction.data.billingInformation;
    const billCycleData = billingInformation.billCycleData || {};

    const data: any = {
      fullNameTH: customer.firstName + ' ' + customer.lastName || '',
      idCard: this.privateIdcard(customer.cardId) || '',
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
      }, 'TH') || '',
      mobileNumber: simCard || '',

      mainPackage: {
        name: mainPackage.mainPackageName || '',
        description: mainPackage.mainPackageDesc || ''
      },
      billCycle: billCycleData.billCycleText || '',
      receiveBillMethod: billCycleData.billMedia || '',
      billDeliveryAddress: billCycleData.billAddressText || '',
      fullNameEN: `${(customer.firstNameEn || '')} ${(customer.lastNameEn || '')}`,
      issueDate: customer.issueDate || '',
      expireDate: customer.expireDate || '',
      signature: customer.imageSignature || '',
      language: 'TH',
    };
    // if (language === 'EN') {
    //   data.billCycle = billCycleData.billCycleTextEng;
    //   data.mainPackage = {
    //     name: (mainPackage.customAttributes || {}).shortNameEng || mainPackage.title || '',
    //     description: mainPackage.statementEng || mainPackage.detailEN || ''
    //   };
    // } else {
      // data.billCycle = billCycleData.billCycleText;
      // data.mainPackage = {
      //   name: (mainPackage.customAttributes || {}).shortNameThai || mainPackage.title || '',
      //   description: mainPackage.statementThai || mainPackage.detailTH || ''
      // };
    // }
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

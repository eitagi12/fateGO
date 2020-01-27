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
    const customer: any = transaction.data.customer;
    const action: any = transaction.data.action;
    const mainPackage: any = transaction.data.mainPackage || {};
    const simCard: any = transaction.data.cusMobileNo || {};
    const billingInformation = transaction.data.billingInformation;
    const billCycles =  billingInformation.billCycles[0];
    const billCycleData = billingInformation.billCycleData[0] || {};

    const data: any = {
      fullNameTH: customer.firstName + ' ' + customer.lastName || '',
      idCard: this.privateIdcard(transaction.data.cardId) || '',
      idCardType: customer.idCardType || '',
      birthDate: customer.birthdate || '',
      // imgName: customer.imageReadSmartCard || customer.imageSmartCard || '',
      today: Date.now(),
      customerImg: customer.imageReadSmartCard || customer.imageSmartCard || '',
      customerImgKeyIn: customer.customerImgKeyIn || '',
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
      billCycle: billCycles || '',
      receiveBillMethod: billCycleData.billMedia || '',
      billDeliveryAddress: billCycleData.billAddressText || '',
      fullNameEN: `${(customer.firstNameEn || '')} ${(customer.lastNameEn || '')}`,
      issueDate: customer.issueDate || '',
      expireDate: customer.expireDate || '',
      signature: customer.imageSignatureSmartCard || customer.imageSignature || '',
      language: 'TH',
    };

    // if (action === TransactionAction.READ_CARD) {
    //   data.customerImg = 'data:image/jpeg;base64,' + customer.imageReadSmartCard;
    // } else {
    //   data.customerImgKeyIn = 'data:image/jpeg;base64,' + customer.imageSmartCard;
    // }

    return data;
  }

  private privateIdcard(cardId: string): string {
    return cardId.replace(/^[0-9]{9}/, 'XXXXXXXXX');
  }
}

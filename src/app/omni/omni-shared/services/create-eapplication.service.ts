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

  createEapplication(transaction: Transaction): Promise<any> {
    return this.http.post(
      '/api/salesportal/generate-e-document-eapplication',
      this.getRequestEapplication(transaction)
    ).toPromise();
  }

  createEapplicationV2(transaction: Transaction): Promise<any> {
    return this.http.post(
      '/api/salesportal/v2/generate-e-document-eapplication',
      this.getRequestEapplicationV2(transaction)
    ).toPromise();
  }

  getRequestEapplication(transaction: Transaction): any {
    const customer: any = transaction.data.customer;
    const action: any = transaction.data.action;
    const mainPackage: any = transaction.data.mainPackage || {};
    const simCard: any = transaction.data.cusMobileNo || {};
    const billingInformation = transaction.data.billingInformation;
    const billCycleData = billingInformation.billCycleData[0] || {};
    const currentAddress = billingInformation.billCycleData[0].customer || {};

    const data: any = {
      fullNameTH: customer.firstName + ' ' + customer.lastName || '',
      idCard: customer.idCardNo || '',
      birthDate: customer.birthdate || '',
      customerPincode: '',
      chargeType: '',
      customerImgKeyIn: 'data:image/jpeg;base64,' + customer.imageSignatureWithWaterMark || '',
      customerAddress: {
        homeNo: currentAddress.homeNo || '',
        moo: currentAddress.moo || '',
        room: currentAddress.room || '',
        floor: currentAddress.floor || '',
        buildingName: currentAddress.buildingName || '',
        soi: currentAddress.soi || '',
        street: currentAddress.street || '',
        tumbol: currentAddress.tumbol || '',
        amphur: currentAddress.amphur || '',
        province: currentAddress.province || '',
        zipCode: currentAddress.zipCode || ''
      } || '',
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
      signature: 'data:image/jpeg;base64,' + customer.imageSignature || '',
    };

    return data;
  }

  getRequestEapplicationV2(transaction: Transaction): any {
    const customer: any = transaction.data.customer;
    const action: any = transaction.data.action;
    const mainPackage: any = transaction.data.mainPackage || {};
    const simCard: any = transaction.data.cusMobileNo || {};
    const billingInformation = transaction.data.billingInformation;
    const billCycleData = billingInformation.billCycleData[0] || {};
    const currentAddress = billingInformation.billCycleData[0].customer || {};

    const data: any = {
      fullNameTH: customer.firstName + ' ' + customer.lastName || '',
      idCard: this.privateIdcard(transaction.data.cardId) || '',
      idCardType: customer.idCardType || '',
      birthDate: customer.birthdate || '',
      today: Date.now(),
      customerImg: customer.imageReadSmartCard || '',
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
      fullNameEN: `${(customer.firstNameEn || '-')} ${(customer.lastNameEn || '')}`,
      issueDate: customer.issueDate || '',
      expireDate: customer.expireDate || '',
      signature: customer.imageSignatureSmartCard || '',
      language: 'TH',
    };

    // if (action === TransactionAction.READ_CARD) {
    //   data.customerImg = customer.imageReadSmartCard;
    // } else if (action === TransactionAction.KEY_IN) {
    //   data.customerImg = customer.imageSmartCard;
    // }

    // if (action === TransactionAction.READ_CARD ) {
    //   data.customerImg = customer.imageReadSmartCard || customer.imageSmartCard;
    // } else {
    //   data.customerImgKeyIn = customer.imageSmartCard ? customer.imageSignatureWithWaterMark : customer.imageReadPassport;
    // }
    return data;
  }

  private privateIdcard(cardId: string): string {
    return cardId.replace(/^[0-9]{9}/, 'XXXXXXXXX');
  }
}

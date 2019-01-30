import { Injectable } from '@angular/core';
import { Utils, TokenService } from 'mychannel-shared-libs';
import { Transaction, TransactionAction, TransactionType } from '../models/transaction.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CreateEapplicationService {

  constructor(private http: HttpClient,
    private utils: Utils,
    private tokenService: TokenService) { }

  createEapplication(transaction: Transaction): Promise<any> {
    return this.http.post(
      '/api/salesportal/generate-e-document-eapplication',
      this.getRequestEapplication(transaction)
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
      }) || '',
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
    };
    if (transactionType === TransactionType.ORDER_NEW_REGISTER
      || transactionType === TransactionType.ORDER_PRE_TO_POST
      || transactionType === TransactionType.ORDER_MNP) {
      data.signature = 'data:image/jpeg;base64,' + (customer.imageSignature || '');
    }


    if (action === TransactionAction.KEY_IN) {
      data.customerImg = 'data:image/jpeg;base64,' + customer.imageSmartCard;
    } else {
      data.customerImg = 'data:image/jpeg;base64,' + customer.imageReadSmartCard;
    }

    return data;
  }
}

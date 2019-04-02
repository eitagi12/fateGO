import { Injectable } from '@angular/core';
import { Transaction } from '../models/transaction.model';
import { PriceOption } from '../models/price-option.model';
import { TokenService } from 'mychannel-shared-libs';
import { HttpClient } from '@angular/common/http';

import * as moment from 'moment';
const Moment = moment;

export const SharedTransactionStatus = {
  PENDING: {
    code: '001',
    description: 'pending'
  },
  WAITING_PAYMENT: { // Update Step หน้าสุดท้าย รอจ่ายตัง
    code: '002',
    description: 'Waiting Payment'
  }
};

@Injectable({
  providedIn: 'root'
})
export class SharedTransactionService {

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
  ) { }

  createSharedTransaction(transaction: Transaction, priceOption: PriceOption): Promise<any> {
    const user = this.tokenService.getUser();
    //
    transaction.transactionId = this.getTransactionId();
    transaction.createBy = user.username;
    transaction.createDate = Moment().toISOString();
    transaction.data.status = SharedTransactionStatus.PENDING;

    return this.http.post('/api/salesportal/device-order/create-transaction',
      this.getRequestSharedTransaction(transaction, priceOption)
    ).toPromise();
  }

  updateSharedTransaction(transaction: Transaction, priceOption: PriceOption): Promise<any> {
    const user = this.tokenService.getUser();
    //
    transaction.lastUpdateBy = user.username;
    transaction.lastUpdateDate = Moment().toISOString();
    transaction.data.status = {
      code: '001',
      description: 'pending'
    };

    return this.http.post('/api/salesportal/device-order/update-transaction',
      this.getRequestSharedTransaction(transaction, priceOption)
    ).toPromise();
  }

  private getRequestSharedTransaction(transaction: Transaction, priceOption: PriceOption): any {
    const data = transaction.data;
    const productDetail = priceOption.productDetail;
    const productStock = priceOption.productStock;

    const params: any = {
      transactionId: transaction.transactionId,
      createBy: transaction.createBy,
      createDate: transaction.createDate,
      lastUpdateBy: transaction.lastUpdateBy,
      lastUpdateDate: transaction.lastUpdateDate,
      issueBy: transaction.lastUpdateBy || transaction.createBy,
      data: {
        action: data.action,
        transactionType: data.transactionType,
        customer: data.customer || {},
        sim_card: data.simCard || {},
        device: {
          amount: 1,
          brand: productStock.brand,
          model: productStock.model || '',
          colorCode: productStock.colorCode || '',
          colorName: productStock.color || '',
          company: productStock.company || '',
          name: productDetail.name || ''
        },
        billing_information: {},
        mobile_care_package: {},
        air_time: {},
        on_top_package: {},
        order: {
          soId: data.order.soId
        },
        queue: {},
        seller: {
          locationCode: productStock.location || '',
          locationName: productStock.locationName || '',
          sellerName: '',
          employeeId: '',
          ascCode: ''
        },
        status: data.status || {}
      }
    };

    if (transaction.data.preBooking) {
      params.data.pre_booking = transaction.data.preBooking;
    }

    return params;
  }

  private getTransactionId(): string {
    let emptyString: string = '';
    const alphabet: string = 'abcdefghijklmnopqrstuvwxyz';
    while (emptyString.length < 2) {
      emptyString += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    const randomAlphabet = emptyString;
    const today: any = moment().format('YYYYMMD');
    const randomNumber = Math.floor(Math.random() * 1000000).toString();
    const transactionId = randomAlphabet + today + randomNumber;
    return transactionId;
  }
}

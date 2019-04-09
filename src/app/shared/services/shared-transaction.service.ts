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
    transaction.data.status = SharedTransactionStatus.WAITING_PAYMENT;

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
          brand: productStock.brand || productDetail.brand,
          model: productStock.model || productDetail.model || '',
          colorCode: productStock.colorCode || '',
          colorName: productStock.color || productStock.colorName || '',
          company: productStock.company || '',
          name: productDetail.name || '',
          imei: !!data.device ? data.device.imei : ''
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
          locationCode: !!data.seller ? data.seller.locationCode : productStock.location || '',
          locationName: !!data.seller ? data.seller.locationName : productStock.locationName || '',
          sellerName: !!data.seller ? data.seller.sellerName : '',
          isAscCode: !this.tokenService.isAisUser(),
          sellerNo: !!data.seller ? data.seller.sellerNo : ''
        },
        status: data.status || {}
      }
    };

    if (data.preBooking) {
      params.data.pre_booking = transaction.data.preBooking;
    }

    if (data.mainPromotion) {
      // เดี๋ยวปรับอีกทีว่าเก็บอะไรบ้าง
      params.data.main_promotion = {
        campaign: priceOption.campaign,
        privilege: priceOption.privilege,
        trade: priceOption.trade
      };
    }

    if (data.billingInformation) {
      // หน้า web payment ใช้ show ที่อยู่รับบิล
      params.data.billing_information = {
        customer: data.billingInformation.billDeliveryAddress
      };
    }

    if (priceOption.trade) {
      // ใช้ check airtime
      params.data.air_time = priceOption.trade.advancePay;
    }

    if (data.existingMobileCare) {
      // ของเดิม เก็บเป็น list TODO
      params.data.existing_mobile_care_package = [data.existingMobileCare];
    }

    if (data.mobileCarePackage) {
      if (typeof data.mobileCarePackage === 'string' || data.mobileCarePackage instanceof String) {
        // ของเดิม เก็บ reason ไว้ใน object
        params.data.mobile_care_package = { reason: data.mobileCarePackage };
      } else {
        params.data.mobile_care_package = data.mobileCarePackage;
      }
    }

    if (data.queue) {
      params.data.queue = data.queue;
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

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
        on_top_package: transaction.data.onTopPackage || {},
        order: {
          soId: data.order.soId
        },
        queue: {},
        contract: {},
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

    if (data.mainPackage) {
      params.data.main_package = {
        title: data.mainPackage.title,
        detailTH: data.mainPackage.detailTH,
        customAttributes: {}
      };
      if (data.mainPackage.customAttributes) {
        params.data.main_package.customAttributes = {
          promotionCode: data.mainPackage.customAttributes.promotionCode,
          promotionName: data.mainPackage.customAttributes.promotionName,
          chargeType: data.mainPackage.customAttributes.chargeType
        };
      }
    }

    if (data.preBooking) {
      params.data.pre_booking = transaction.data.preBooking;
    }

    // เดี๋ยวปรับอีกทีว่าเก็บอะไรบ้าง
    params.data.main_promotion = {
      campaign: priceOption.campaign,
      privilege: priceOption.privilege,
      trade: priceOption.trade
    };

    if (data.billingInformation) {
      // หน้า web payment ใช้ show ที่อยู่รับบิล
      params.data.billing_information = {
        customer: { ...data.customer, ...data.billingInformation.billDeliveryAddress },
      };

      // วันที่มีผลการใช้งาน รอบบิลถัดไป/วันถัดไป/มีผลทันที
      if (data.billingInformation.overRuleStartDate) {
        params.data.billing_information.overRuleStartDate = data.billingInformation.overRuleStartDate;
      }

      // isNewBAFlag
      if (data.billingInformation.isNewBAFlag) {
        params.data.billing_information.isNewBAFlag = data.billingInformation.isNewBAFlag;
      }

      const billCycle: string = data.billingInformation.billCycle ? data.billingInformation.billCycle.bill : data.customer.billCycle;

      let billCycleFrom: string = '0';
      let billCycleTo: string = '0';

      switch (billCycle) {
        case '11':
          billCycleFrom = '4';
          billCycleTo = '3';
          break;
        case '12':
          billCycleFrom = '8';
          billCycleTo = '7';
          break;
        case '13':
          billCycleFrom = '12';
          billCycleTo = '11';
          break;
        case '14':
          billCycleFrom = '16';
          billCycleTo = '15';
          break;
        case '15':
          billCycleFrom = '20';
          billCycleTo = '19';
          break;
        case '16':
          billCycleFrom = '24';
          billCycleTo = '23';
          break;
        case '17':
          billCycleFrom = '28';
          billCycleTo = '27';
          break;
        case '18':
          billCycleFrom = '1';
          billCycleTo = 'สิ้นเดือน';
          break;
      }

      params.data.billing_information.billCycle = billCycle;
      params.data.billing_information.billCycles = [{
        billNo: billCycle,
        from: billCycleFrom,
        to: billCycleTo
      }];

      if (data.billingInformation.billCycleData) {
        params.data.billing_information.billMedia = data.billingInformation.billCycleData.billMedia || '';
        params.data.billing_information.emailAddress = data.billingInformation.billCycleData.email || '';
        params.data.billing_information.phoneNumberContact = data.billingInformation.billCycleData.phoneNoContact || '';
        params.data.billing_information.mobileNumberContact = data.billingInformation.billCycleData.mobileNoContact || '';
      }
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
        params.data.mobile_care_package = {
          title: data.mobileCarePackage.title,
          id: data.mobileCarePackage.id,
          customAttributes: {}
        };
        if (data.mobileCarePackage.customAttributes) {
          params.data.mobile_care_package.customAttributes = {
            promotionCode: data.mobileCarePackage.customAttributes.promotionCode
          };
        }
      }
    }

    if (data.queue) {
      params.data.queue = data.queue;
    }

    if (data.contract && data.contract.conditionCode) {
      params.data.contract.conditionCode = data.contract.conditionCode;
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

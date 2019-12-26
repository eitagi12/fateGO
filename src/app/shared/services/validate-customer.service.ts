import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User, Utils, TokenService } from 'mychannel-shared-libs';
import { Transaction, Prebooking } from '../models/transaction.model';
import { PriceOption } from '../models/price-option.model';
import * as moment from 'moment';
import { TransactionService } from './transaction.service';

@Injectable({
  providedIn: 'root'
})
export class ValidateCustomerService {

  constructor(
    private http: HttpClient,
    private utils: Utils,
    private transactionService: TransactionService,
    private tokenService: TokenService
  ) { }

  queryCustomerInfo(identity: string): Promise<any> {
    return this.http.get(`/api/customerportal/newRegister/${identity}/queryCustomerInfo`).toPromise();
  }

  checkValidateCustomer(idCardNo: string, idCardType: string, transactionType: string): Promise<any> {
    return this.http.get('/api/customerportal/validate-customer-new-register', {
      params: {
        identity: idCardNo,
        idCardType: idCardType,
        transactionType: transactionType
      }
    }).toPromise();
  }

  checkValidateCustomerHandleMessages(idCardNo: string, idCardType: string, transactionType: string): Promise<any> {
    return this.http.get('/api/customerportal/validate-customer-new-register-handle-messages', {
      params: {
        identity: idCardNo,
        idCardType: idCardType,
        transactionType: transactionType
      }
    }).toPromise();
  }

  queryBillingAccount(identity: string): Promise<any> {
    return this.http.get(`/api/customerportal/newRegister/${identity}/queryBillingAccount`).toPromise();
  }

  getCurrentDate(): Promise<any> {
    return this.http.get(`/api/customerportal/currentDate`).toPromise();
  }

  addDeviceSellingCart(body: any): Promise<any> {
    return this.http.post(`/api/salesportal/add-device-selling-cart`, body).toPromise();
  }

  billingNetExtreme(data: any): Promise<any> {
    return this.http.post('/api/customerportal/verify/billingNetExtreme', {
      businessType: '1',
      listBillingAccount: data.billingAccountList
    }).toPromise();
  }

  createTransaction(transactionObject: any): Promise<any> {
    return this.http.post(`/api/salesportal/device-order/create-transaction`, transactionObject).toPromise();
  }

  buildTransaction(data: { transaction: Transaction, transactionType: string }): any {
    const user: User = this.tokenService.getUser();
    const transaction: Transaction = data.transaction;
    const transactionType: string = data.transactionType;
    const customer: any = transaction.data.customer;
    const order: any = transaction.data.order;
    const transactionId = transaction.transactionId || this.generateTransactionId();

    const $transaction: any = {
      transactionId: transactionId,
      data: {
        customer: customer,
        order: order,
        status: {
          code: '001',
          description: 'pending'
        },
        transactionType: transactionType,
        billingInformation: transaction.data.billingInformation
      },
      create_date: Date.now(),
      create_by: user.username,
      issueBy: user.username
    };
    return $transaction;
  }

  selectMobileNumberRandom(user: User, transaction: Transaction): Promise<any> {
    return this.http.post('/api/customerportal/newRegister/selectMobileNumberRandom', {
      userId: user.username,
      mobileNo: transaction.data.simCard.mobileNo,
      action: 'Unlock'
    }).toPromise();
  }
  clearTempStock(priceOption: PriceOption, transaction: Transaction): Promise<any> {
    return this.http.post('/api/salesportal/device-sell/item/clear-temp-stock', {
      location: priceOption.productStock.location,
      soId: transaction.data.order.soId,
      transactionId: transaction.transactionId
    }).toPromise();
  }

  app3Step(idCardNo: string, username: string): Promise<any> {
    return this.http.get(`/api/customerportal/customerprofile/${idCardNo}/${username}/app3steps`).toPromise();
  }

  // getRequestAddDeviceSellingCart(user: User, transaction: Transaction, priceOption: PriceOption, bodyRequest: any): any {
  //   try {
  //     const productStock = priceOption.productStock;
  //     const productDetail = priceOption.productDetail;
  //     const preBooking: Prebooking = transaction.data.preBooking;
  //     let subStock;
  //     const customer: any = bodyRequest.customer.data || bodyRequest.customer;
  //     const trade: any = priceOption.trade;
  //     if (preBooking && preBooking.preBookingNo) {
  //       subStock = 'PRE';
  //     }
  //     return {
  //       soCompany: productStock.company || 'AWN',
  //       locationSource: user.locationCode,
  //       locationReceipt: user.locationCode,
  //       productType: productDetail.productType || 'DEVICE',
  //       productSubType: productDetail.productSubType || 'HANDSET',
  //       brand: productDetail.brand || productStock.brand,
  //       model: productDetail.model || productStock.model,
  //       color: productStock.color || productStock.colorName,
  //       priceIncAmt: '' + trade.normalPrice,
  //       priceDiscountAmt: '' + trade.discount.amount,
  //       grandTotalAmt: '',
  //       userId: user.username,
  //       cusNameOrder: `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || '-',
  //       preBookingNo: preBooking ? preBooking.preBookingNo : '',
  //       depositAmt: preBooking ? preBooking.depositAmt : '',
  //       reserveNo: preBooking ? preBooking.reserveNo : '',
  //       subStockDestination: subStock
  //     };
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  getRequestAddDeviceSellingCart(user: User, transaction: Transaction, priceOption: PriceOption, bodyRequest?: any): any {
    const productStock = priceOption.productStock;
    const productDetail = priceOption.productDetail;
    const customer: any = bodyRequest.customer.data || bodyRequest.customer;
    const product = {
      productType: productDetail.productType || 'DEVICE',
      soCompany: productStock.company || 'AWN',
      productSubType: productDetail.productSubType || 'HANDSET',
      brand: productDetail.brand,
      model: productDetail.model,
      qty: '1',
      color: productStock.color || productStock.colorName,
      matCode: '',
      priceIncAmt: '',
      priceDiscountAmt: '',
      matAirTime: '',
      listMatFreeGoods: [{
        matCodeFG: '',
        qtyFG: '' // จำนวนของแถม *กรณีส่งค่า matCodeFreeGoods ค่า qty จะต้องมี
      }]
    };

    return {
      locationSource: user.locationCode,
      locationReceipt: user.locationCode,
      userId: user.username,
      cusNameOrder: `${customer.firstName || ''} ${customer.lastName || ''}`.trim(),
      soChannelType: 'CSP',
      soDocumentType: 'RESERVED',
      productList: [product],
      grandTotalAmt: '',
      preBookingNo: '',
      depositAmt: '',
      reserveNo: '',
      subStockDestination: 'BRN',
      storeName: ''
    };
  }

  addDeviceSellingCartSharePlan(body: any): Promise<any> {
    return this.http.post(`/api/salesportal/dt/add-cart-list`, body).toPromise();
  }

  mapCardType(idCardType: string): string {
    idCardType = idCardType ? idCardType : 'ID_CARD';
    const mapCardType: any = {
      CERT_FOUND: 'หนังสือจัดตั้งสมาคม / มูลนิธิ',
      EMB_LET: 'หนังสือออกจากสถานทูต',
      GOV_LET: 'หนังสือออกจากหน่วยราชการ',
      HILL_CARD: 'บัตรประจำตัวคนบนที่ราบสูง',
      ID_CARD: 'บัตรประชาชน',
      IMM_CARD: 'บัตรประจำตัวคนต่างด้าว',
      MONK_CERT: 'ใบสุทธิพระ',
      PASSPORT: 'หนังสือเดินทาง',
      ROY_LET: 'หนังสือออกจากสำนักพระราชวัง',
      STA_LET: 'หนังสือออกจากรัฐวิสาหกิจ',
      TAX_ID: 'เลขที่ประจำตัวผู้เสียภาษีอากร'
    };
    return mapCardType[idCardType];
  }

  mapCustomer(customer: any, transaction?: any): any {
    return {
      idCardNo: customer.idCardNo,
      idCardType: customer.idCardType || '',
      titleName: customer.prefix || customer.titleName || '',
      firstName: customer.firstName || '',
      lastName: customer.lastName || '',
      birthdate: customer.birthdate || customer.birthDay + '/' + customer.birthMonth + '/' + customer.birthYear || '',
      gender: customer.gender || '',
      homeNo: customer.homeNo || '',
      moo: customer.moo || '',
      mooBan: customer.mooban || '',
      buildingName: customer.buildingName || '',
      floor: customer.floor || '',
      room: customer.room || '',
      street: customer.street || '',
      soi: customer.soi || '',
      tumbol: customer.tumbol || '',
      amphur: customer.amphur,
      province: customer.province || customer.provinceName || '',
      firstNameEn: '',
      lastNameEn: '',
      issueDate: customer.birthdate || customer.issueDate || '',
      // tslint:disable-next-line: max-line-length
      expireDate: customer.expireDate || customer.expireDay ? customer.expireDay + '/' + customer.expireMonth + '/' + customer.expireYear : '',
      zipCode: customer.zipCode || '',
      mainMobile: customer.mainMobile || '',
      mainPhone: customer.mainPhone || '',
      billCycle: customer.billCycle || '',
      caNumber: customer.caNumber || '',
      mobileNo: '',
      imageSignature: '',
      imageSmartCard: '',
      imageReadSmartCard: customer.imageReadSmartCard ? customer.imageReadSmartCard : transaction ? transaction.imageReadSmartCard : '',
      imageSignatureWidthCard: ''
    };
  }

  generateTransactionId(): any {
    let emptyString: string = '';
    const alphabet: string = 'abcdefghijklmnopqrstuvwxyz';
    while (emptyString.length < 2) {
      emptyString += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    const randomAlphabet: string = emptyString;
    const today: any = moment().format('YYYYMMD');
    const randomNumber: string = Math.floor(Math.random() * 1000000).toString();
    const transactionId: string = randomAlphabet + today + randomNumber;
    return transactionId;
  }

  checkAgeAndExpireCard(transaction: Transaction): any {
    const birthdate = transaction.data.customer.birthdate;
    const expireDate = transaction.data.customer.expireDate;
    const idCardType = transaction.data.customer.idCardType;

    if (this.utils.isLowerAge17Year(birthdate)) {
      return { false: 'ไม่สามารถทำรายการได้ เนื่องจากอายุของผู้ใช้บริการต่ำกว่า 17 ปี' };
    }
    if (this.utils.isIdCardExpiredDate(expireDate)) {
      return { false: 'ไม่สามารถทำรายการได้ เนื่องจาก' + idCardType + 'หมดอายุ' };
    }
    return { true: true };
  }

  // isLowerAge(birthdate: string, currentDate?: Date): boolean {
  //   const b: moment.Moment = moment(birthdate, 'DD/MM/YYYY');
  //   const c: moment.Moment = moment(currentDate).add(543, 'years');
  //   if (b.isValid()) {
  //     const age: any = c.diff(b, 'years');
  //     const isLegal: any = (age >= 17);
  //     return isLegal;
  //   } else {
  //     throw new Error('กรอกวันเกิดไม่ถูกต้อง กรุณากรอกใหม่อีกครั้ง');
  //   }
  // }

  // isLowerAgeEra(birthdate: string, currentDate?: Date): boolean {
  //   const radix: number = 10;
  //   const buddhistEra: number = 543;
  //   const birthd: any = birthdate.split('/');
  //   const year: number = parseInt(birthd[2], radix) - buddhistEra;
  //   birthdate = birthd[0] + '/' + birthd[1] + '/' + year;
  //   const b: moment.Moment = moment(birthdate, 'DD/MM/YYYY');
  //   const c: moment.Moment = moment(currentDate);
  //   if (b.isValid()) {
  //     const age: any = c.diff(b, 'years');
  //     const isLegal: any = (age >= 17);
  //     return isLegal;
  //   } else {
  //     throw new Error('กรอกวันเกิดไม่ถูกต้อง กรุณากรอกใหม่อีกครั้ง');
  //   }
  // }
}

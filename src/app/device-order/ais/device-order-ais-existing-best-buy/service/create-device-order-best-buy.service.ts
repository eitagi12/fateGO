import { Injectable } from '@angular/core';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Transaction, Payment, Customer, Prebooking } from 'src/app/shared/models/transaction.model';
import { HttpClient } from '@angular/common/http';
import { Utils, TokenService, ApiRequestService, User } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import * as moment from 'moment';

export const REMARK_CASH_PAYMENT = '[CA]';
export const REMARK_CREDIT_CARD_PAYMENT = '[CC]';
export const REMARK_BANK = '[B]';
export const REMARK_INSTALLMENT = '[I]';
export const REMARK_POINT = '[P]';
export const REMARK_DISCOUNT = '[D]';
export const REMARK_TRADE_NO = '[T]';
export const REMARK_REMARK = '[RM]';
export const REMARK_SUMMARY_POINT = '[SP]';
export const REMARK_SUMMARY_DISCOUNT = '[SD]';
export const REMARK_RETURN_CODE = '[RC]';
export const REMARK_PROMOTION_NAME = '[PM]';
export const REMARK_MOBILE_CARE_CODE = '[MCC]';
export const REMARK_MOBILE_CARE = '[MC]';
export const REMARK_QUEUE_NUMBER = '[Q]';
export const REMARK_AIR_TIME = '[AT]';
export const REMARK_DEVICE = '[DV]';
export const REMARK_AIR_TIME_AND_DEVICE = '[AD]';
export const REMARK_DEVICE_AND_ADVANCE_PAYMENT = '[DP]';
export const REMARK_PRMOTION_CODE = '[PC]';
export const REMARK_PRIVILEGE_DESC = '[PN]';
export const REMARK_ORDER_TYPE = '[OT]';
export const REMARK_PROMPT_PAY_PAYMENT = '[PB]';
export const REMARK_RABBIT_LINE_PAY_PAYMENT = '[RL]';


@Injectable({
  providedIn: 'root'
})
export class CreateDeviceOrderBestBuyService {

  priceOption: PriceOption;
  transaction: Transaction;
  user: User;
  _cookieService: any;
  jwtHelper: any;
  defaultEmployeeeCode: any;

  constructor(
    private http: HttpClient,
    private utils: Utils,
    private tokenService: TokenService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private apiRequestService: ApiRequestService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.user = this.tokenService.getUser();
  }

  private callAddToCart(transaction, priceOption): Promise<any> {
    const device = priceOption.productStock;
    const preBooking: Prebooking = transaction.data.prebooking || {};
    const customer = transaction.data.customer;
    const cusNameOrder = customer.firstName && customer.lastName ? `${customer.firstName} ${customer.lastName}` : '-';
    const requestData: any = {
      soCompany: device.company || 'AWN',
      locationSource: this.user.locationCode,
      locationReceipt: this.user.locationCode,
      productType: device.productType || 'DEVICE',
      productSubType: device.productSubType || 'HANDSET',
      brand: device.brand,
      model: device.model,
      color: device.color,
      priceIncAmt: '',
      priceDiscountAmt: '',
      grandTotalAmt: '',
      userId: this.user.username,
      cusNameOrder: cusNameOrder,
      preBookingNo: preBooking.preBookingNo,
      depositAmt: preBooking.depositAmt,
      reserveNo: preBooking.reserveNo
    };

    // return this.http.post('/api/salesportal/device-sell/item', requestData).toPromise()
    //   .then((res: any) => res.data);
    // TEST
    return new Promise((resolve, reject) => {
      resolve({ resultCode: 'S', soId: '11111' });
    });
  }

  private createTransaction(transaction, priceOption): Promise<any> {

    return this.http.post('/api/salesportal/device-order/create-transaction', this.mapCreateTransactionDB(transaction, priceOption))
      .toPromise().then(resp => transaction);
  }

  createAddToCartTrasaction(transaction, priceOption) {
    return new Promise((resolve, reject) => {
      if (transaction
        && transaction.data
        && transaction.data.order
        && transaction.data.order.soId) {
        resolve(transaction);
      } else {
        this.callAddToCart(transaction, priceOption).then((response) => {
          if (response.resultCode === 'S') {
            transaction.data.order = {
              soId: response.soId
            };
            this.createTransaction(transaction, priceOption).then((createTrans) => {
              resolve(createTrans);
            }).catch(resolve);
          } else {
            reject('Cannot add item to the cart');
          }
        }).catch(reject);
      }
    });

  }

  createDeviceOrder(transaction: Transaction, queueNo: string): any {

    return this.getRequestCreateOrder(transaction, queueNo).then((data) => {
      this.updateOrder(transaction, data);
      // console.log(data);
      return this.http.post('/api/salesportal/device-sell/order', data).toPromise()
        .then((response: any) => {
          if (response) {
            if (response.resultCode === 'S') {
              return response;
            } else {
              switch (response.resultMessage) {
                case 'QueueNo is duplicated':
                  throw 'เลขที่คิวซ้ำ กรุณาระบุใหม่';
                default:
                  throw 'Fail to create the order';
              }
            }
          } else {
            throw 'Fail';
          }
        });
    });
  }

  getQueueByNumber(mobileNo: string): Promise<any> {
    const body = {
      mobileNo: mobileNo
    };
    return this.http.post('/api/salesportal/device-order/transaction/get-queue-qmatic', body).toPromise();
  }

  updateOrder(transaction: Transaction, data: any): Promise<any> {

    transaction.data.order = {
      soId: data.soId ? data.soId : ''
    };

    transaction.data.queue = {
      queueNo: data.queueNo ? data.queueNo : ''
    };

    transaction.issueBy = this.user.username;

    // transaction.data.status = {
    //   code: '002',
    //   description: 'Waiting Payment'
    // };

    return this.http.post('/api/salesportal/device-order/update-transaction', transaction).toPromise();
  }

  getRequestCreateOrder(transaction: Transaction, queueNo: string): Promise<any> {

    const user = this.tokenService.getUser();
    const action = transaction.data.action;
    const customer = transaction.data.customer;
    const productStock = this.priceOption.productStock;
    const trade = this.priceOption.trade;
    const payment = transaction.data.payment;
    const advancePayment = transaction.data.advancePayment;
    const simCard = transaction.data.simCard;
    const mainPackage = transaction.data.mainPackage;

    const data: any = {
      soId: '', // this.soId,
      soCompany: productStock.stock.company,
      locationSource: user.locationCode,
      locationReceipt: user.locationCode,
      productType: productStock.stock.productType || 'DEVICE',
      productSubType: productStock.stock.productSubType || 'HANDSET',
      brand: productStock.stock.brand,
      model: productStock.stock.model,
      color: productStock.stock.color,
      matCode: '',
      priceIncAmt: trade.normalPrice.toFixed(2),
      priceDiscountAmt: trade.discount.amount.toFixed(2),
      grandTotalAmt: this.getGrandTotalAmt(trade),
      userId: user.username,
      saleCode: '', // seller && seller.sellerNo || '',
      queueNo: queueNo || '',
      cusNameOrder: customer.titleName + ' ' + customer.firstName + ' ' + customer.lastName,
      taxCardId: customer.idCardNo || '',
      cusMobileNoOrder: simCard.mobileNo || '',
      customerAddress: this.getCustomerAddress(customer),
      tradeNo: trade.tradeNo,
      ussdCode: trade.ussdCode,
      returnCode: customer.privilegeCode,
      cashBackFlg: '',
      matAirTime: trade.advancePay ? trade.advancePay.matAirtime : '',
      matCodeFreeGoods: '',
      paymentRemark: this.getOrderRemark(undefined, trade, payment, advancePayment, undefined, queueNo, transaction),
      installmentTerm: payment && payment.bank ? payment.bank.installments[0].installmentMonth : 0,
      installmentRate: payment && payment.bank ? payment.bank.installments[0].installmentPercentage : 0,
      mobileAisFlg: 'Y',
      paymentMethod: this.getPaymentMethod(payment, advancePayment, trade) || '',
      bankCode: this.getBankCode(payment, advancePayment) || '',
      tradeFreeGoodsId: trade.freeGoods[0] ? trade.freeGoods[0].tradeFreegoodsId : '',
      matairtimeId: '',
      tradeDiscountId: trade.discount ? trade.discount.tradeAirtimeId : '',
      tradeAirtimeId: trade.advancePay ? trade.advancePay.tradeAirtimeId : '',
      focCode: '',
      bankAbbr: this.getBankCode(payment, advancePayment),
      preBookingNo: '',
      depositAmt: '',
    };

    return Promise.resolve(data);
  }

  private getPaymentMethod(payment: Payment, advancePayment: Payment, trade: any) {

    if (trade.advancePay.installmentFlag === 'Y') {
      return payment.method;
    }

    let paymentMethod = payment.method + '|';

    if (advancePayment && +trade.advancePay.amount !== 0) {
      paymentMethod += advancePayment.method;
    }
    return paymentMethod;
  }

  getBankCode(payment: Payment, advancePayment: Payment): string {
    return payment && payment.bank ? payment.bank.abb : '' + '|' + advancePayment && advancePayment.bank ? advancePayment.bank.abb : '';
  }

  getOrderRemark(
    promotion: any,
    trade: any,
    payment: Payment,
    advancePayment: Payment,
    mobileCare: any,
    queueNo: string,
    transaction: Transaction) {
    const customer = transaction.data.customer;
    const newLine = '\n';
    const comma = ',';
    const space = ' ';

    // campaign
    let remarkDesc = REMARK_PROMOTION_NAME + space + '' + newLine;

    // advancePay
    let advancePay = '';
    if (trade.advancePay.installmentFlag !== 'Y' && +trade.advancePay.amount !== 0) {
      if (advancePayment) {
        advancePay += REMARK_AIR_TIME;
        if (advancePayment.type === 'qrcode') {
          if (advancePayment.qrCode.id === parseInt('003', 8)) {
            advancePay += REMARK_PROMPT_PAY_PAYMENT;
          } else {
            advancePay += REMARK_RABBIT_LINE_PAY_PAYMENT;
          }
        } else if (advancePayment.type === 'credit') {
          advancePay += REMARK_CREDIT_CARD_PAYMENT + comma + space;
          advancePay += REMARK_BANK + advancePayment.bank.abb;
        } else {
          advancePay += REMARK_CASH_PAYMENT;
        }
      }
    }
    remarkDesc += advancePay + newLine;

    // tradeAndInstallment
    let tradeAndInstallment = '';

    if (trade.advancePay.installmentFlag === 'Y') {
      tradeAndInstallment = REMARK_AIR_TIME_AND_DEVICE;
    } else {
      tradeAndInstallment = REMARK_DEVICE;
    }

    if (payment) {
      if (payment.type === 'qrcode') {
        if (payment.qrCode.id === parseInt('003', 8)) {
          tradeAndInstallment += REMARK_PROMPT_PAY_PAYMENT + comma + space;
        } else {
          tradeAndInstallment += REMARK_RABBIT_LINE_PAY_PAYMENT + comma + space;
        }
      } else if (payment.type === 'credit') {
        tradeAndInstallment += REMARK_CREDIT_CARD_PAYMENT + comma + space;
        tradeAndInstallment += REMARK_BANK + payment.bank.abb + comma + space;
        if (payment.bank.installments.length > 0) {
          tradeAndInstallment += REMARK_INSTALLMENT + payment.bank.installments[0].installmentPercentage +
            '%' + space + payment.bank.installments[0].installmentMonth + 'เดือน' + comma + space;
        }
      } else {
        tradeAndInstallment += REMARK_CASH_PAYMENT + comma + space;
      }
    }
    tradeAndInstallment += REMARK_TRADE_NO + trade.tradeNo;
    remarkDesc += tradeAndInstallment + newLine;

    // otherInformation
    const summaryPoint = 0;
    const summaryDiscount = 0;
    let otherInformation = '';
    otherInformation += REMARK_SUMMARY_POINT + space + summaryPoint + comma + space;
    otherInformation += REMARK_SUMMARY_DISCOUNT + space + summaryDiscount + comma + space;
    otherInformation += REMARK_DISCOUNT + space + trade.discount.amount.toFixed(2) + comma + space;
    otherInformation += REMARK_RETURN_CODE + space + customer.privilegeCode + comma + space;
    otherInformation += REMARK_ORDER_TYPE + space + 'MC001' + comma + space;
    otherInformation += REMARK_PRMOTION_CODE + space + 'remark.mainPackageCode' + comma + space;
    otherInformation += REMARK_MOBILE_CARE_CODE + space + mobileCare.customAttributes.promotionCode + comma + space;
    otherInformation += REMARK_MOBILE_CARE + space + mobileCare.customAttributes.shortNameThai + comma + space;
    otherInformation += REMARK_PRIVILEGE_DESC + space + 'remark.privilegeDesc' + comma + space;
    otherInformation += REMARK_QUEUE_NUMBER + space + queueNo;

    remarkDesc += otherInformation + newLine;

    return remarkDesc;

  }

  public getUsername(): any {
    return this._cookieService.get('accessToken')
      ? this.jwtHelper.decodeToken(this._cookieService.get('accessToken')).username
      : this.defaultEmployeeeCode;
  }

  getGrandTotalAmt(trade: any): string {

    const normalPrice: number = trade.normalPrice;
    const advancePay: number = trade.advancePay.amount;
    const discount: number = trade.discount.amount || 0;
    const depositAmt = 0;
    const useDeposit = false;

    let result: any = normalPrice;
    result += advancePay && advancePay ? +advancePay : 0;
    result -= discount && discount ? +discount : 0;
    result -= useDeposit ? depositAmt : 0;
    return result.toFixed(2) || '';
  }

  getCustomerAddress(customer: Customer) {
    return {
      addrNo: customer.homeNo,
      moo: customer.moo,
      mooban: '',
      buildingName: '',
      floor: '',
      room: '',
      soi: customer.soi,
      streetName: customer.street,
      tumbon: customer.tumbol,
      amphur: customer.amphur,
      province: customer.province,
      postCode: customer.zipCode,
      country: '',
    };
  }

  // private generateTransactionId(): any {
  //   let emptyString = '';
  //   const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  //   while (emptyString.length < 2) {
  //     emptyString += alphabet[Math.floor(Math.random() * alphabet.length)];
  //   }
  //   const randomAlphabet: string = emptyString;
  //   const today: any = moment().format('YYYYMMD');
  //   const randomNumber: string = Math.floor(Math.random() * 1000000).toString();
  //   const transactionId: string = randomAlphabet + today + randomNumber;
  //   return transactionId;
  // }

  private mapCreateTransactionDB(transaction, priceOption) {
    const username: any = this.tokenService.getUser().username;
    const product: any = priceOption.productStock;
    const productDetail: any = priceOption.productDetail;
    const main_promotion = {
      campaign: priceOption.campaign,
      privilege: priceOption.privilege,
      trade: priceOption.trade
    };
    const device = {
      model: productDetail.model,
      brand: productDetail.brand,
      amount: 1,
      name: productDetail.productName,
      colorName: product.color,
      colorCode: product.colorCode,
      productType: productDetail.productType,
      productSubtype: productDetail.productSubType
    };

    return {
      transactionId: this.apiRequestService.getCurrentRequestId(),
      data: {
        ...transaction.data,
        main_promotion: main_promotion,
        device: device,
        status: {
          code: '001',
          description: 'pending'
        }
      },
      create_by: transaction.create_by,
      issueBy: transaction.issueBy || username,
      last_update_by: username
    };
  }

  clearAddToCart(transactionId: string, soId: string) {
    return this.http.post('/api/salesportal/device-sell/item/clear-temp-stock', {
      transactionId: transactionId,
      soId: soId
    }).toPromise().then((res: any) => res.data);
  }

  cancelTrasaction(transactionId: string) {
    return this.http.post('/api/salesportal/device-order/cancel-transaction', {
      transactionId: transactionId,
      issueBy: this.user.username
    }).toPromise();
  }

  getBanks() {
    return this.http.post('/api/salesportal/banks-promotion', {
      location: this.user.locationCode
    }).toPromise().then((response: any) => {
      return response.data.map((bank) => {
        return {
          abb: bank.abb,
          imageUrl: bank.imageUrl,
          name: bank.name,
          promotion: '',
          installment: '',
          remark: '',
          installmentDatas: new Array<any>()
        };
      });
    });

  }
}

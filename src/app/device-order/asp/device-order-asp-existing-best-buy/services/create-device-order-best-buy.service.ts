import { Injectable } from '@angular/core';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Transaction, Payment, Customer, Prebooking } from 'src/app/shared/models/transaction.model';
import { HttpClient } from '@angular/common/http';
import { Utils, TokenService, User } from 'mychannel-shared-libs';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';

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

  user: User;
  // priceOption: PriceOption;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {
    this.user = this.tokenService.getUser();
  }

  private callAddToCart(transaction: Transaction, priceOption: PriceOption): Promise<any> {
    const productStock = priceOption.productStock;
    const productDetail = priceOption.productDetail;
    const preBooking: Prebooking = transaction.data.preBooking;
    const customer = transaction.data.customer;
    const cusNameOrder = customer.firstName && customer.lastName ? `${customer.firstName} ${customer.lastName}` : '-';
    const requestData: any = {
      soCompany: productStock.company || 'AWN',
      locationSource: this.user.locationCode,
      locationReceipt: this.user.locationCode,
      productType: productDetail.productType || 'DEVICE',
      productSubType: productDetail.productSubType || 'HANDSET',
      brand: productDetail.brand,
      model: productDetail.model,
      color: productStock.color,
      priceIncAmt: '',
      priceDiscountAmt: '',
      grandTotalAmt: '',
      userId: this.user.username,
      cusNameOrder: cusNameOrder,
      preBookingNo: preBooking ? preBooking.preBookingNo : '',
      depositAmt: preBooking ? preBooking.depositAmt : '',
      reserveNo: preBooking ? preBooking.reserveNo : ''
    };

    return this.http.post('/api/salesportal/device-sell/item', requestData).toPromise()
      .then((res: any) => res.data);
  }

  private createTransaction(transaction: Transaction, priceOption: PriceOption): Promise<any> {
    return this.http.post('/api/salesportal/device-order/create-transaction', this.mapCreateTransactionDb(transaction, priceOption))
      .toPromise().then(resp => transaction);
  }

  createAddToCartTrasaction(transaction: Transaction, priceOption: PriceOption): Promise<any> {
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
        });
      }
    });

  }

  createDeviceOrder(transaction: Transaction, priceOption: PriceOption, transId?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getRequestCreateOrder(transaction, priceOption, transId).then((data) => {
        this.http.post('/api/salesportal/device-sell/order', data).toPromise()
          .then((response: any) => {
            if (response.data.resultCode === 'S') {
              this.updateTransactionOrder(transaction, priceOption).then((updateStatus) => {
                resolve(updateStatus);
              }).catch((err: any) => { reject('ไม่สามารถทำรายการได้ในขณะนี้'); });
            } else {
              switch (response.resultMessage) {
                case 'QueueNo is duplicated':
                  reject('เลขที่คิวซ้ำ กรุณาระบุใหม่');
                  break;
                default:
                  reject('Fail to create the order');
              }
            }
          });
      });
    });
  }

  private updateTransactionOrder(transaction: Transaction, priceOption: PriceOption): Promise<any> {
    const shareTrasaction = this.mapUpdateTransactionDb(transaction, priceOption);
    return this.http.post('/api/salesportal/device-order/update-transaction', shareTrasaction).toPromise();
  }

  private getRequestCreateOrder(transaction: Transaction, priceOption: PriceOption, transId?: string): Promise<any> {

    const user = this.tokenService.getUser();
    const customer = transaction.data.customer;
    const productStock = priceOption.productStock;
    const productDetail = priceOption.productDetail;
    const trade = transaction.data.mainPromotion.trade;
    const payment = transaction.data.payment;
    const advancePayment = transaction.data.advancePayment;
    const simCard = transaction.data.simCard;
    const queue = transaction.data.queue;
    const seller = transaction.data.seller;
    const prebooking = transaction.data.preBooking;
    const mobileCare = transaction.data.mobileCarePackage;
    const order = transaction.data.order;

    // [SORY Krap]
    /*
    let qrAmt;
    if (payment.type === 'qrcode' && transId) {
      qrAmt = this.getQrAmount(trade.normalPrice, trade.discount);
    }

    const paymentMethod = (payment.type === 'qrcode' && transId) ? this.replacePaymentMethodForQRCodeWithOutAirtime(payment.qrCode)
       : payment.method;
*/
    const data: any = {
      soId: order.soId,
      soCompany: productStock.company,
      locationSource: this.user.locationCode,
      locationReceipt: this.user.locationCode,
      productType: productDetail.productType || 'DEVICE',
      productSubType: productDetail.productSubtype || 'HANDSET',
      brand: productDetail.brand,
      model: productDetail.model,
      color: productStock.color,
      matCode: '',
      priceIncAmt: trade.normalPrice.toFixed(2),
      priceDiscountAmt: (+trade.discount.amount).toFixed(2),
      grandTotalAmt: this.getGrandTotalAmt(trade),
      userId: this.user.username,
      saleCode: seller && seller.employeeId ? seller.employeeId : '',
      queueNo: queue.queueNo || '',
      cusNameOrder: this.getFullName(customer),
      taxCardId: customer && customer.idCardNo || '',
      cusMobileNoOrder: simCard && simCard.mobileNo || '',
      customerAddress: this.getCustomerAddress(customer),
      tradeNo: trade && trade.tradeNo || '',
      ussdCode: trade && trade.ussdCode || '',
      returnCode: customer.privilegeCode || '',
      cashBackFlg: '',
      matAirTime: '',
      matCodeFreeGoods: '',
      paymentRemark: this.getOrderRemark(trade, payment, advancePayment, mobileCare, queue.queueNo, transaction),
      // [SORRY Krap]
      /*installmentTerm: payment && payment.bank ? payment.bank.installments[0].installmentMonth : 0,
      installmentRate: payment && payment.bank ? payment.bank.installments[0].installmentPercentage : 0,
      mobileAisFlg: 'Y',
      paymentMethod: paymentMethod,*/
      bankCode: this.getBankCode(payment, advancePayment),
      tradeFreeGoodsId: trade.freeGoods[0] ? trade.freeGoods[0].tradeFreegoodsId : '',
      matairtimeId: '',
      tradeDiscountId: trade.discount ? trade.discount.tradeAirtimeId : '',
      tradeAirtimeId: trade.advancePay ? trade.advancePay.tradeAirtimeId : '',
      focCode: '',
      bankAbbr: this.getBankCode(payment, advancePayment),
      preBookingNo: prebooking ? prebooking.preBookingNo : '',
      depositAmt: prebooking ? prebooking.depositAmt : '',
      qrTransId: transId ? transId : '',
      // [SORRY Krap]
      /*qrAmt: qrAmt*/
    };

    return Promise.resolve(data);
  }

  private getQrAmount(normalPrice: number, discount: any): string {
    const qrAmt: number = normalPrice - discount.amount;
    return qrAmt.toFixed(2);
  }

  private getPaymentMethod(payment: Payment, advancePayment: Payment, trade: any): string {
    // [SORRY Krap]
    /*
        if (trade.advancePay.installmentFlag === 'Y') {
          return payment.method;
        }
        let paymentMethod = payment.method + '|';
        if (advancePayment && +trade.advancePay.amount !== 0) {
          paymentMethod += advancePayment.method;
        }
        return paymentMethod;
        */
    return null;
  }

  private replacePaymentMethodForQRCodeWithOutAirtime(qrCode: any): string {
    let paymentMethod;
    if (qrCode) {
      if (qrCode.qrType === '003') {
        paymentMethod = 'PB';
        return paymentMethod;
      } else {
        paymentMethod = 'RL';
        return paymentMethod;
      }
    }
    return paymentMethod;
  }

  private getBankCode(payment: Payment, advancePayment: Payment): string {
    // [SORRY Krap]
    // return payment && payment.bank ? payment.bank.abb : '' + '|';
    return null;
  }

  private getOrderRemark(
    trade: any,
    payment: Payment,
    advancePayment: Payment,
    mobileCare: any,
    queueNo: string,
    transaction: Transaction): string {
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
        // [SORRY Krap]
        /*if (advancePayment.type === 'qrcode') {
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
        }*/
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
      // [SORRY Krap]
      /*
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
      }*/
    }
    tradeAndInstallment += REMARK_TRADE_NO + trade.tradeNo;
    remarkDesc += tradeAndInstallment + newLine;

    // otherInformation
    const summaryPoint = 0;
    const summaryDiscount = 0;
    let otherInformation = '';
    otherInformation += REMARK_SUMMARY_POINT + space + summaryPoint + comma + space;
    otherInformation += REMARK_SUMMARY_DISCOUNT + space + summaryDiscount + comma + space;
    otherInformation += REMARK_DISCOUNT + space + (+trade.discount.amount).toFixed(2) + comma + space;
    otherInformation += REMARK_RETURN_CODE + space + customer.privilegeCode + comma + space;
    otherInformation += REMARK_ORDER_TYPE + space + 'MC004' + comma + space;
    if (mobileCare && !mobileCare.reason) {
      otherInformation += REMARK_PRMOTION_CODE + space + 'remark.mainPackageCode' + comma + space;
      otherInformation += REMARK_MOBILE_CARE_CODE + space + mobileCare.customAttributes.promotionCode + comma + space;
      otherInformation += REMARK_MOBILE_CARE + space + mobileCare.customAttributes.shortNameThai + comma + space;
    }
    otherInformation += REMARK_PRIVILEGE_DESC + space + 'remark.privilegeDesc' + comma + space;
    otherInformation += REMARK_QUEUE_NUMBER + space + queueNo;

    remarkDesc += otherInformation + newLine;

    return remarkDesc;

  }

  private getGrandTotalAmt(trade: any): string {

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

  private getCustomerAddress(customer: Customer): any {
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

  generateTransactionId(requestId: string): any {
    let emptyString = '';
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    while (emptyString.length < 2) {
      emptyString += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    const randomAlphabet: string = emptyString;
    const transactionId: string = randomAlphabet + requestId;
    return transactionId;
  }

  private mapCreateTransactionDb(transaction: Transaction, priceOption: PriceOption): any {
    const username: any = this.tokenService.getUser().username;
    return {
      transactionId: transaction.transactionId,
      data: {
        ...transaction.data,
        main_promotion: transaction.data.mainPromotion,
        device: this.getDevice(priceOption),
        status: {
          code: '001',
          description: 'pending'
        },
        contract: transaction.data.mainPromotion.campaign.conditionCode || {}
      },
      create_by: username,
      // [SORRY Krap] อันนี้ไม่น่าใช้ใช่ปะ
      // issueBy: transaction.issueBy || username,
      last_update_by: username
    };
  }

  private mapUpdateTransactionDb(transaction: Transaction, priceOption: PriceOption): any {
    return {
      transactionId: transaction.transactionId,
      data: {
        customer: transaction.data.customer,
        main_promotion: transaction.data.mainPromotion,
        air_time: transaction.data.advancePayment,
        sim_card: transaction.data.simCard,
        main_package: transaction.data.mainPackage || null,
        device: this.getDevice(priceOption),
        mobile_care_package: transaction.data.mobileCarePackage,
        existing_mobile_care_package: transaction.data.existingMobileCare,
        preBooking: transaction.data.preBooking,
        billing_information: transaction.data.billingInformation || {},
        queue: transaction.data.queue,
        seller: transaction.data.seller,
        order: transaction.data.order,
        contract: transaction.data.mainPromotion.campaign.conditionCode || {},
        provision: {},
        currentProcess: {},
        status: {
          code: '002',
          description: 'Waiting Payment'
        },
        transactionType: transaction.data.transactionType
      },
      issueBy: this.user.username,
      last_update_by: this.user.username
    };
  }

  private getDevice(priceOption: PriceOption): any {
    const product: any = priceOption.productStock;
    const productDetail: any = priceOption.productDetail;
    return {
      model: productDetail.model,
      brand: productDetail.brand,
      amount: 1,
      name: productDetail.productName,
      colorName: product.colorName,
      colorCode: product.colorCode,
      productType: productDetail.productType,
      productSubtype: productDetail.productSubtype
    };
  }

  clearAddToCart(transactionId: string, soId: string): Promise<any> {
    return this.http.post('/api/salesportal/device-sell/item/clear-temp-stock', {
      transactionId: transactionId,
      soId: soId
    }).toPromise().then((res: any) => res.data);
  }

  cancelTrasaction(transactionId: string): Promise<any> {
    return this.http.post('/api/salesportal/device-order/cancel-transaction', {
      transactionId: transactionId,
      issueBy: this.user.username
    }).toPromise();
  }

  getBanks(): Promise<any> {
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

  getFullName(customer: Customer): string {
    return customer && customer.titleName && customer.firstName && customer.lastName
      ? `${customer.titleName} ${customer.firstName} ${customer.lastName}` : '';
  }

  cancelOrder(transaction: Transaction): Promise<any> {
    return new Promise((resolve, reject) => {
      if (transaction
        && transaction.data
        && transaction.data.order
        && transaction.data.order.soId) {
        this.clearAddToCart(transaction.transactionId, transaction.data.order.soId)
          .then((res: any) => {
            resolve(res.isSuccess);
          });
      } else {
        resolve(false);
      }
    });
  }
}

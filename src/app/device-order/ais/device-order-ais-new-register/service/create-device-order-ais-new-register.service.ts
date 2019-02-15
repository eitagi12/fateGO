import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenService, Utils, ImageUtils, AWS_WATERMARK } from 'mychannel-shared-libs';
import { Transaction, TransactionAction, Customer, Payment } from 'src/app/shared/models/transaction.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';

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
export class CreateDeviceOrderAisNewRegisterService {

  priceOption: PriceOption;
  transaction: Transaction;

  constructor(
    private http: HttpClient,
    private utils: Utils,
    private tokenService: TokenService,
  ) {
  }

  createOrderNewRegister(transaction: Transaction, priceOption: PriceOption): Promise<any> {
    return this.getQueueByNumber(transaction.data.simCard.mobileNo).then((resp) => {
      if (resp.resultPass) {
        return this.getRequestCreateNewRegister(transaction, resp.result.queueNo).then((data) => {
          // console.log(data);
          return this.http.post('/api/saleportal/device-sell/order', data).toPromise();
          //   if (orderResponse) {
          //     if (orderResponse.resultCode === 'S') {
          //         return orderResponse;
          //     } else {
          //       switch (orderResponse.resultMessage) {
          //         case 'QueueNo is duplicated':
          //           throw 'เลขที่คิวซ้ำ กรุณาระบุใหม่';
          //         default:
          //           throw 'Fail to create the order';
          //       }
          //     }
          // } else {
          //     throw 'Fail';
          // }
        });
      }
    });

  }

  public getQueueByNumber(mobileNo: string): Promise<any> {
    const body = {
      mobileNo: mobileNo
    };
    return this.http.post('/api/salesportal/device-order/transaction/get-queue-qmatic', body).toPromise();
  }

  updateOrderNewRegister(transaction: Transaction): Promise<any> {

    // transaction.data.order = {
    //   soId: queue.soId ? queue.soId : ''
    // };
    // transaction.data.queue = {
    //   queueNo: deviceItemBuyingInformation.queueNo ? deviceItemBuyingInformation.queueNo : ''
    // };
    // transaction.issueBy = this.tokenService.getUsername();
    // transaction.data.status = {
    //   code: '002',
    //   description: 'Waiting Payment'
    // };

    return this.http.post('/api/salesportal/device-order/update-transaction', transaction).toPromise();
  }

  getRequestCreateNewRegister(transaction: Transaction, queueNo: string): Promise<any> {

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
      returnCode: '4GEYYY',
      cashBackFlg: '',
      matAirTime: trade.advancePay ? trade.advancePay.matAirtime : '',
      matCodeFreeGoods: '',
      paymentRemark: this.getOrderRemark(undefined, trade, payment, advancePayment, undefined, queueNo),
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

  getOrderRemark(promotion: any, trade: any, payment: Payment, advancePayment: Payment, mobileCare: any, queueNo: string) {
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
    otherInformation += REMARK_RETURN_CODE + space + '4GEYYY' + comma + space;
    otherInformation += REMARK_ORDER_TYPE + space + 'MC001' + comma + space;
    otherInformation += REMARK_PRMOTION_CODE + space + 'remark.mainPackageCode' + comma + space;
    otherInformation += REMARK_MOBILE_CARE_CODE + space + mobileCare.customAttributes.promotionCode + comma + space;
    otherInformation += REMARK_MOBILE_CARE + space + mobileCare.customAttributes.shortNameThai + comma + space;
    otherInformation += REMARK_PRIVILEGE_DESC + space + 'remark.privilegeDesc' + comma + space;
    otherInformation += REMARK_QUEUE_NUMBER + space + queueNo;

    remarkDesc += otherInformation + newLine;

    return remarkDesc;

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
}

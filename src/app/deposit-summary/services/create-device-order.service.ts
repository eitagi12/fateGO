import { Injectable } from '@angular/core';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Transaction, Customer } from 'src/app/shared/models/transaction.model';
import { HttpClient } from '@angular/common/http';
import { TokenService, User } from 'mychannel-shared-libs';
import { LocalStorageService } from 'ngx-store';
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
export class CreateDeviceOrderService {

  user: User;
  // priceOption: PriceOption;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private localStorageService: LocalStorageService
  ) {
    this.user = this.tokenService.getUser();
  }

  private callAddToCart(transaction: Transaction, priceOption: PriceOption): Promise<any> {
    const productStock = priceOption.productStock;
    // const productDetail = priceOption.productDetail;
    // const preBooking: Prebooking = transaction.data.preBooking;
    const customer = transaction.data.customer;
    const cusNameOrder = customer.firstName && customer.lastName ? `${customer.firstName} ${customer.lastName}` : '-';
    const requestData: any = {
      soCompany: productStock.company || 'AWN',
      locationSource: this.user.locationCode,
      locationReceipt: this.user.locationCode,
      // productType: productDetail.productType || 'DEVICE',
      // productSubType: productDetail.productSubType || 'HANDSET',
      // brand: productDetail.brand,
      // model: productDetail.model,
      color: productStock.color,
      priceIncAmt: '',
      priceDiscountAmt: '',
      grandTotalAmt: '',
      userId: this.user.username,
      cusNameOrder: cusNameOrder,
      // preBookingNo: preBooking ? preBooking.preBookingNo : '',
      // depositAmt: preBooking ? preBooking.depositAmt : '',
      // reserveNo: preBooking ? preBooking.reserveNo : ''
    };

    return this.http.post('/api/salesportal/device-sell/item', requestData).toPromise()
      .then((res: any) => res.data);
  }

  createDeviceOrderDt(transaction: Transaction, priceOption: PriceOption, transId?: string): Promise<any> {
    console.log('test');
    return new Promise((resolve, reject) => {
      this.getRequestCreateOrder(transaction, priceOption, transId).then((data) => {
        this.http.post('/api/salesportal/dt/create-order', data).toPromise()
          .then((response: any) => {
            console.log(JSON.stringify(response));
            if (response.data.resultCode === 'S') {
              resolve(response);
            } else {
              switch (response.data.resultCode) {
                case 'F':
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

  private getRequestCreateOrder(transaction: Transaction, priceOption: PriceOption, transId?: string): Promise<any> {

    const user = this.tokenService.getUser();
    const customer = transaction.data.customer;
    const productStock = priceOption.productStock || '';
    const productDetail = priceOption.trade;
    const trade = priceOption.trade;
    const payment = transaction.data.payment || '';
    // const advancePayment = transaction.data.advancePayment;
    const simCard = transaction.data.simCard || '';
    const queue = transaction.data.queue;
    const seller = transaction.data.seller;
    // const prebooking = transaction.data.preBooking;
    const order = transaction.data.order || '';
    const data: any = {
      soId: this.localStorageService.load('reserveSoId').value,
      soCompany: trade.company || 'AWN',
      locationSource: this.user.locationCode || '',
      locationReceipt: customer.selectedLocation.locationCode || '',
      productType: trade.productType || '',
      productSubType: trade.productSubtype || '',
      brand: productDetail.brand,
      model: productDetail.model,
      color: productDetail.colorName,
      matCode: trade.sku[0],
      priceIncAmt:  '',
      priceDiscountAmt:  '',
      grandTotalAmt: trade ? trade.tradeReserve.trades[0].deposit.depositIncludeVat : '',
      userId: this.user.username,
      // saleCode: seller && seller.employeeId ? seller.employeeId : '',
      queueNo: queue.queueNo || '',
      cusNameOrder: this.getFullName(customer),
      taxCardId: customer && customer.idCardNo || '',
      cusMobileNoOrder: customer.selectedMobile || '',   //
      customerAddress: this.getCustomerAddress(customer),
      tradeNo: trade ? trade.tradeReserve.trades[0].tradeNo : '',
      ussdCode: '',
      // returnCode: customer.privilegeCode || '',
      cashBackFlg: '',
      matAirTime: '',
      matCodeFreeGoods: '',
      paymentRemark: this.getPaymentRemark(transaction , priceOption),
      // installmentTerm: payment && payment.bank ? payment.bank.installments[0].installmentMonth : 0,
      // installmentRate: payment && payment.bank ? payment.bank.installments[0].installmentPercentage : 0,
      mobileAisFlg: 'Y',
      paymentMethod: payment.paymentMethod,
      // bankCode: this.getBankCode(payment, advancePayment),
      tradeFreeGoodsId: '',
      matairtimeId: '',
      tradeDiscountId: '',
      tradeAirtimeId:  '',
      focCode: '',
      // bankAbbr: this.getBankCode(payment, advancePayment),
      // preBookingNo: prebooking ? prebooking.preBookingNo : '',
      depositAmt: '',
      // qrAmt: qrAmt
      saleCode : seller.sellerNo ? seller.sellerNo : '',
      bankAbbr : payment.selectPaymentDetail.bank ? payment.selectPaymentDetail.bank.abb : '',
      storeName : 'WH',
      soChannelType : 'MC_PRE',
     soDocumentType : 'DEPOSIT_TF',
     shipCusName : customer.shipaddress.shipCusName,
     shipCusAddr : customer.shipaddress.shipCusAddr,
    };

    return Promise.resolve(data);
  }

  private getQrAmount(normalPrice: number, discount: any): string {
    const qrAmt: number = normalPrice - discount.amount;
    return qrAmt.toFixed(2);
  }

  private getCustomerAddress(customer: Customer): any {
    return {
      addrNo: customer.homeNo || '',
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
  getPaymentRemark(transaction: Transaction, priceOption: PriceOption): string {
    let paymentRemark = '';
    paymentRemark = REMARK_PROMOTION_NAME + ' ';
    paymentRemark += REMARK_DEVICE;
    if (transaction.data.payment.paymentMethod === 'CA') {
      paymentRemark += REMARK_CASH_PAYMENT;
    } else {
      paymentRemark += REMARK_CREDIT_CARD_PAYMENT + ', ';
      paymentRemark += REMARK_BANK + transaction.data.payment.selectPaymentDetail.bank.abb;
    }
    paymentRemark += ', ' + REMARK_TRADE_NO + priceOption.trade.tradeReserve.trades[0].tradeNo + ', ';
    paymentRemark += REMARK_PRIVILEGE_DESC + ' ' + ', ' + REMARK_QUEUE_NUMBER + ' ' + transaction.data.queue.queueNo;

    return paymentRemark;
  }

}

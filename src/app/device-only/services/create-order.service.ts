import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenService } from 'mychannel-shared-libs';
import { SharedTransactionService } from 'src/app/shared/services/shared-transaction.service';
import { Transaction, Customer, Payment } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { User } from 'mychannel-shared-libs';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CreateOrderService {

  user: User;
  private readonly CASH_PAYMENT: string = '[CA]';
  private readonly CREDIT_CARD_PAYMENT: string = '[CC]';
  private readonly BANK: string = '[B]';
  private readonly INSTALLMENT: string = '[I]';
  private readonly POINT: string = '[P]';
  private readonly DISCOUNT: string = '[D]';
  private readonly TRADE_NO: string = '[T]';
  private readonly REMARK: string = '[RM]';
  private readonly SUMMARY_POINT: string = '[SP]';
  private readonly SUMMARY_DISCOUNT: string = '[SD]';
  private readonly RETURN_CODE: string = '[RC]';
  private readonly PROMOTION_NAME: string = '[PM]';
  private readonly MOBILE_CARE_CODE: string = '[MCC]';
  private readonly MOBILE_CARE: string = '[MC]';
  private readonly QUEUE_NUMBER: string = '[Q]';
  private readonly AIR_TIME: string = '[AT]';
  private readonly DEVICE: string = '[DV]';
  private readonly AIR_TIME_AND_DEVICE: string = '[AD]';
  private readonly DEVICE_AND_ADVANCE_PAYMENT: string = '[DP]';
  private readonly PRMOTION_CODE: string = '[PC]';
  private readonly PRIVILEGE_DESC: string = '[PN]';
  private readonly ORDER_TYPE: string = '[OT]';
  private readonly SPACE: string = ' ';
  private readonly NEW_LINE: string = '\n';
  private readonly COMMA: string = ',';
  private readonly PROMPT_PAY_PAYMENT: string = '[PB]';
  private readonly RABBIT_LINE_PAY_PAYMENT: string = '[RL]';

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private sharedTransactionService: SharedTransactionService
  ) {
    this.user = this.tokenService.getUser();
  }

  createTransaction(transaction: Transaction, priceOption: PriceOption): Promise<any> {
    return this.http.post('/api/salesportal/device-order/create-transaction', this.mapCreateTransactionDb(transaction, priceOption))
      .toPromise()
      .then((resp => transaction));
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
      },
      create_by: username,
      issueBy: username,
      last_update_by: username,
    };
  }

  getDevice(priceOption: PriceOption): any {
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
            this.sharedTransactionService.createSharedTransaction(transaction, priceOption).then((res) => {
              if (res.data.isSuccess === true) {
                resolve(transaction);
              }
            }).catch(resolve);
          } else {
            reject('Cannot add item to the cart');
          }
        });
      }
    });
  }

  private callAddToCart(transaction: Transaction, priceOption: PriceOption): Promise<any> {
    const productStock = priceOption.productStock;
    const productDetail = priceOption.productDetail;
    const customer = transaction.data.customer;
    const cusNameOrder = customer && customer.firstName && customer.lastName ? `${customer.firstName} ${customer.lastName}` : '-';
    const color = productStock.colorName || productStock.color;
    const requestData: any = {
      soCompany: productStock.company || 'AWN',
      locationSource: this.user.locationCode,
      locationReceipt: this.user.locationCode,
      productType: productDetail.productType || 'DEVICE',
      productSubType: productDetail.productSubType || 'HANDSET',
      brand: productDetail.brand || productStock.brand,
      model: productDetail.model,
      color: color,
      priceIncAmt: '',
      priceDiscountAmt: '',
      grandTotalAmt: '',
      userId: this.user.username,
      cusNameOrder: cusNameOrder,
      preBookingNo: '',
      depositAmt: '',
      reserveNo: ''
    };

    return this.http.post('/api/salesportal/device-sell/item', requestData).toPromise()
      .then((res: any) => res.data);
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

  updateTransactionDB(transaction: Transaction): Promise<any> {
    const updateTransaction = {
      ...transaction,
      issueBy: this.user.username
    };
    return this.http.post('/api/salesportal/device-order/update-transaction', updateTransaction).pipe(
      map((res: any) => res.data.isSuccess)
    ).toPromise();
  }

  createOrderDeviceOnly(transaction: Transaction, priceOption: PriceOption): Promise<any> {
    const order = this.mapCreateOrder(transaction, priceOption);
    return this.http.post('/api/salesportal/create-device-selling-order', order).toPromise();
  }

  mapCreateOrder(transaction: Transaction, priceOption: PriceOption): any {
    const sellerNo = (transaction.data.seller && transaction.data.seller.sellerNo) ? transaction.data.seller.sellerNo : '';
    const mapInstallmentTerm = transaction.data.payment.paymentMethod.month ? transaction.data.payment.paymentMethod.month : 0;
    const mapInstallmentRate = transaction.data.payment.paymentMethod.percentage ? transaction.data.payment.paymentMethod.percentage : 0;
    const mapBankAbb = transaction.data.payment.paymentBank.abb ? transaction.data.payment.paymentBank.abb : '';
    const mapBankCode = transaction.data.payment.paymentBank.abb ? transaction.data.payment.paymentBank.abb : '';
    const mapQrTran = transaction.data.mpayPayment ? transaction.data.mpayPayment.tranId : '';
    const mapQrOrderId = transaction.data.mpayPayment ? transaction.data.mpayPayment.orderId : '';
    return {
      soId: transaction.data.order.soId,
      soCompany: priceOption.productStock.company,
      locationSource: this.user.locationCode,
      locationReceipt: this.user.locationCode,
      productType: priceOption.productDetail.productType,
      productSubType: priceOption.productDetail.productSubtype,
      brand: priceOption.productDetail.brand,
      model: priceOption.productDetail.model,
      color: priceOption.productStock.colorName,
      matCode: priceOption.productStock.colorCode,
      priceIncAmt: (+priceOption.trade.normalPrice).toFixed(2),
      priceDiscountAmt: (+priceOption.trade.priceDiscount).toFixed(2),
      grandTotalAmt: (+priceOption.trade.normalPrice - +priceOption.trade.priceDiscount).toFixed(2),
      userId: this.user.username,
      saleCode: sellerNo,
      queueNo: transaction.data.queue.queueNo,
      cusNameOrder: transaction.data.customer.firstName + ' ' + transaction.data.customer.lastName,
      taxCardId: transaction.data.customer.idCardNo,
      cusMobileNoOrder: transaction.data.receiptInfo.telNo,
      customerAddress: this.mapCusAddress(transaction.data.customer),
      tradeNo: priceOption.trade.tradeNo,
      paymentRemark: this.getOrderRemark(transaction, priceOption),
      installmentTerm: mapInstallmentTerm,
      installmentRate: mapInstallmentRate,
      paymentMethod: this.getPaymentMethod(transaction, priceOption),
      bankCode: mapBankCode,
      qrTransId: mapQrTran,
      bankAbbr: mapBankAbb,
      qrAmt: this.getQRAmt(priceOption, transaction), // add
      reqMinimumBalance: transaction.data.simCard ? this.getReqMinimumBalance(transaction, transaction.data.mobileCarePackage) : '',
      qrOrderId: mapQrOrderId,
      tradeType: transaction.data.tradeType
    };
  }

  mapCusAddress(addressCus: Customer): any {
    return {
      addrNo: addressCus ? addressCus.homeNo : '',
      moo: addressCus ? addressCus.moo : '',
      mooban: addressCus ? addressCus.mooBan : '',
      buildingName: addressCus ? addressCus.buildingName : '',
      floor: addressCus ? addressCus.floor : '',
      room: addressCus ? addressCus.room : '',
      soi: addressCus ? addressCus.soi : '',
      streetName: addressCus ? addressCus.street : '',
      tumbon: addressCus ? addressCus.tumbol : '',
      amphur: addressCus ? addressCus.amphur : '',
      province: addressCus ? addressCus.province : '',
      postCode: addressCus ? addressCus.zipCode : '',
      country: 'THA'
    };
  }

  mapPaymentType(paymentType: string): string {
    if (paymentType === 'CREDIT') {
      return 'CC';
    }
    if (paymentType === 'DEBIT') {
      return 'CA';
    }
  }

  private getOrderRemark(transaction: Transaction, priceOption: PriceOption): string {
    const installment = this.getInstallment(transaction, priceOption);
    const information = this.getInformation(transaction, priceOption);
    return `${this.PROMOTION_NAME}${this.SPACE}${this.NEW_LINE}${installment}${this.NEW_LINE}${information}${this.NEW_LINE}`;
  }

  private getQRAmt(priceOption: PriceOption, transaction: Transaction): any {
    const payment: Payment = transaction.data.payment;
    if (priceOption.trade && payment.paymentType === 'QR_CODE') {
      const qrAmt: number = priceOption.trade.normalPrice - priceOption.trade.priceDiscount;
      return qrAmt.toFixed(2);
    } else {
      return undefined;
    }
  }

  private getPaymentMethod(transaction: Transaction, priceOption: PriceOption): string {
    const payment: Payment = transaction.data.payment;
    const trade: any = priceOption.trade;
    let tradePayment: any;
    if ((trade.payment && trade.payment.length > 0)) {
      tradePayment = priceOption.trade.payment[0];
    } else if ((trade.payments && trade.payments.length > 0)) {
      tradePayment = priceOption.trade.payments[0];
    } else {
      tradePayment = {};
    }
    if (payment.paymentType === 'QR_CODE') {
      if (payment.paymentQrCodeType === 'THAI_QR') {
        return 'PB';
      } else {
        return 'RL';
      }
    } else if (payment.paymentType === 'CREDIT') {
      return 'CC';
    } else if (payment.paymentType === 'DEBIT') {
      return 'CA';
    } else {
      return tradePayment.method;
    }
  }

  private getInstallment(transaction: Transaction, priceOption: PriceOption): string {
    let message = '';
    const trade = priceOption.trade;
    const payment = transaction.data.payment;
    message += this.DEVICE;
    if (payment.paymentType === 'QR_CODE') {
      if (payment.paymentQrCodeType === 'THAI_QR') {
        message += `${this.PROMPT_PAY_PAYMENT}`;
      } else {
        message += `${this.RABBIT_LINE_PAY_PAYMENT}`;
      }
      message += `${this.COMMA}${this.SPACE}`;
    } else {
      if (payment.paymentForm === 'INSTALLMENT') {
        message += `${this.CREDIT_CARD_PAYMENT}${this.COMMA}${this.SPACE}`;
        message += `${this.BANK}${payment.paymentMethod.abb || payment.paymentBank.abb}${this.COMMA}${this.SPACE}`;
        message += `${this.INSTALLMENT}${payment.paymentMethod.percentage}%${this.SPACE}${payment.paymentMethod.month}`;
        message += `เดือน${this.COMMA}${this.SPACE}`;
      } else {
        if (payment.paymentType === 'DEBIT') {
          message += `${this.CASH_PAYMENT}${this.COMMA}${this.SPACE}`;
        } else {
          message += `${this.CREDIT_CARD_PAYMENT}${this.COMMA}${this.SPACE}`;
          message += `${this.BANK}${payment.paymentMethod.abb || payment.paymentBank.abb}${this.COMMA}${this.SPACE}`;
        }
      }
    }
    message += `${this.TRADE_NO}${trade.tradeNo}`;
    return message;
  }

  private getInformation(transaction: Transaction, priceOption: PriceOption): string {
    let message = '';
    let customerGroupName = '';
    const customerGroup = priceOption.customerGroup;
    const privilege = priceOption.privilege;
    const trade = priceOption.trade;
    const mobileCarePackage = transaction.data.mobileCarePackage || {};
    const customer: any = transaction.data.customer || {};
    const queue: any = transaction.data.queue || {};
    const customAttributes = mobileCarePackage.customAttributes || {};

    if ('MC001' === customerGroup.code) {
      customerGroupName = 'New Register';
    } else if ('MC002' === customerGroup.code) {
      customerGroupName = 'Convert Pre to Post';
    } else if ('MC005' === customerGroup.code) {
      customerGroupName = 'Device Only';
    }

    message += this.DISCOUNT + this.SPACE + (trade.priceDiscount ? (+trade.discount.amount).toFixed(2) : 0.00) + this.COMMA + this.SPACE;
    message += this.ORDER_TYPE + this.SPACE + customerGroupName + this.COMMA + this.SPACE;
    message += this.MOBILE_CARE_CODE + this.SPACE + (customAttributes.promotionCode || '') + this.COMMA + this.SPACE;
    message += this.MOBILE_CARE + this.SPACE + (customAttributes.shortNameThai || '') + this.COMMA + this.SPACE;
    message += this.PRIVILEGE_DESC + this.SPACE + (trade.tradeDesc || '') + this.COMMA + this.SPACE;
    message += this.QUEUE_NUMBER + this.SPACE + queue.queueNo;
    return message;
  }

  private getReqMinimumBalance(transaction: Transaction, mobileCarePackage: any): number { // Package only
    if (transaction.data.simCard.chargeType === 'Pre-paid') {
    let total: number = 0;
    if (mobileCarePackage && mobileCarePackage.customAttributes) {
      const customAttributes = mobileCarePackage.customAttributes;
      total += +(customAttributes.priceInclVat || 0);
      }
    return total;
    }
  }

}

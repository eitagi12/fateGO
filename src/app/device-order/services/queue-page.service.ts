import { Injectable } from '@angular/core';
import { TokenService } from 'mychannel-shared-libs';
import { Transaction, Payment, Prebooking } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QueuePageService {

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
    private tokenService: TokenService
  ) { }

  getQueueQmatic(mobileNo: string): Promise<any> {
    return this.http.post('/api/salesportal/device-order/transaction/get-queue-qmatic', {
      mobileNo: mobileNo
    }).toPromise();
  }

  createDeviceSellingOrder(transaction: Transaction, priceOption: PriceOption): Promise<any> {
    return this.http.post('/api/salesportal/create-device-selling-order',
      this.getRequestCreateDeviceSellingOrder(transaction, priceOption)
    ).toPromise();
  }

  private getRequestCreateDeviceSellingOrder(transaction: Transaction, priceOption: PriceOption): any {
    const user = this.tokenService.getUser();
    const productStock = priceOption.productStock;
    const productDetail = priceOption.productDetail;
    const trade = priceOption.trade;
    const transactionData = transaction.data;

    const discount = trade.discount;
    const customer = transactionData.customer;
    const simCard = transactionData.simCard;
    const order = transactionData.order;
    const queue: any = transactionData.queue || {};
    const seller = transactionData.seller || {};
    const payment = transactionData.payment;
    const prebooking: Prebooking = transactionData.preBooking;
    const mpayPayment: any = transactionData.mpayPayment || {};

    const data: any = {
      soId: order.soId,
      soCompany: productStock.company,
      locationSource: user.locationCode,
      locationReceipt: user.locationCode,
      productType: productStock.productType || productDetail.productType || 'DEVICE',
      productSubType: productStock.productSubType || productDetail.productSubtype || 'HANDSET',
      brand: productStock.brand || productDetail.brand,
      model: productStock.model || productDetail.model,
      color: productStock.color || productStock.colorName,
      matCode: '',
      priceIncAmt: (+trade.normalPrice || 0).toFixed(2),
      priceDiscountAmt: (+discount.amount || 0).toFixed(2),
      grandTotalAmt: this.getGrandTotalAmt(trade, prebooking),
      userId: user.username,
      saleCode: this.tokenService.isAisUser() ? (seller.sellerNo || '') : (seller.sellerNo || user.ascCode),
      queueNo: queue.queueNo || '',
      cusNameOrder: `${customer.titleName || ''} ${customer.firstName || ''} ${customer.lastName || ''}`.trim(),
      taxCardId: customer.idCardNo || '',
      cusMobileNoOrder: simCard.mobileNo || '',
      customerAddress: {
        addrNo: customer.homeNo,
        amphur: customer.amphur,
        buildingName: customer.buildingName,
        country: 'ประเทศไทย',
        floor: customer.floor,
        moo: customer.moo,
        mooban: customer.mooBan,
        postCode: customer.zipCode,
        province: customer.province.replace(/มหานคร$/, ''),
        room: customer.room,
        soi: customer.soi,
        streetName: customer.street,
        tumbon: customer.tumbol
      },
      tradeNo: trade.tradeNo || '',
      ussdCode: trade.ussdCode || '',
      returnCode: simCard.privilegeCode || customer.privilegeCode || '4GEYYY',
      cashBackFlg: '',
      matAirTime: trade.advancePay ? trade.advancePay.matAirtime : '',
      matCodeFreeGoods: '',
      paymentRemark: this.getOrderRemark(transaction, priceOption),
      installmentTerm: payment.paymentMethod.month || 0,
      installmentRate: payment.paymentMethod.percentage || 0,
      mobileAisFlg: 'Y',
      paymentMethod: this.getPaymentMethod(transaction, priceOption),
      bankCode: payment && payment.paymentBank ? payment.paymentBank.abb : '',
      tradeFreeGoodsId: trade.freeGoods[0] ? trade.freeGoods[0].tradeFreegoodsId : '',
      matairtimeId: '',
      tradeDiscountId: trade.discount ? trade.discount.tradeAirtimeId : '',
      tradeAirtimeId: trade.advancePay ? trade.advancePay.tradeAirtimeId : '',
      focCode: '',
      bankAbbr: payment && payment.paymentBank ? payment.paymentBank.abb : '',
      preBookingNo: prebooking ? prebooking.preBookingNo : '',
      depositAmt: prebooking ? prebooking.depositAmt : '',
      qrTransId: mpayPayment ? mpayPayment.tranId : '',
      qrAmt: this.getQRAmt(trade, transaction)
    };

    // ผ่อนชำระ
    if (payment && payment.paymentMethod) {
      data.installmentTerm = payment.paymentMethod.month || 0;
      data.installmentRate = payment.paymentMethod.percentage || 0;
    }

    return data;
  }

  private getOrderRemark(transaction: Transaction, priceOption: PriceOption): string {
    const onTopPackage = transaction.data.onTopPackage || {};
    const airTime: string = this.getAirTime(priceOption.trade, transaction);
    const installment = this.getInstallment(transaction, priceOption);
    const information = this.getInformation(transaction, priceOption);

    return `
${this.PROMOTION_NAME}${this.SPACE}${onTopPackage.shortNameThai || ''}${this.NEW_LINE}
${airTime}${this.NEW_LINE}${installment}${this.NEW_LINE}${information}${this.NEW_LINE}
`;
  }

  private getQRAmt(trade: any, transaction: Transaction): any {
    const payment: Payment = transaction.data.payment;
    if (trade && payment.paymentType === 'QR_CODE') {
      const qrAmt: number = trade.normalPrice - trade.discount.amount;
      return qrAmt.toFixed(2);
    } else {
      return '';
    }
  }

  private getAirTime(trade: any, transaction: Transaction): string {
    let message = '';

    if (!trade || !trade.advancePay) {
      return message;
    }

    const advancePay = trade.advancePay || {};
    if (advancePay.installmentFlag === 'Y' || +advancePay.amount <= 0) { // ผ่อนรวม
      return message;
    }

    message = `${this.AIR_TIME}`;
    const advancePayment: any = transaction.data.advancePayment || {};
    if (advancePayment.paymentType === 'QR_CODE') {
      if (advancePayment.paymentQrCodeType === 'THAI_QR') {
        message += `${this.PROMPT_PAY_PAYMENT}`;
      } else {
        message += `${this.RABBIT_LINE_PAY_PAYMENT}`;
      }
    } else {
      if (advancePayment.paymentType === 'DEBIT') {
        message += `${this.CASH_PAYMENT}`;
      } else {
        message += `${this.CREDIT_CARD_PAYMENT}${this.COMMA}${this.SPACE}`;
        message += `${this.BANK}${advancePayment.abb || ''}`;
      }
    }
    return message;
  }

  private getPaymentMethod(transaction: Transaction, priceOption: PriceOption): string {
    const payment: Payment = transaction.data.payment;
    const priceOptionpayment: any = priceOption.trade && priceOption.trade.payment ? priceOption.trade.payment : '';
    const priceOptionpayments: any = priceOption.trade && priceOption.trade.payments ? priceOption.trade.payments : '';
    const tradePayment = (priceOptionpayment && priceOptionpayment[0]) ? priceOptionpayment[0] : priceOptionpayments[0];
    if (payment.paymentType === 'QR_CODE') {
      if (payment.paymentQrCodeType === 'THAI_QR') {
        return 'PB';
      } else {
        return 'RL';
      }
    } else {
      return tradePayment.method;
    }
  }

  private getInstallment(transaction: Transaction, priceOption: PriceOption): string {
    let message = '';

    const trade = priceOption.trade;
    const payment = transaction.data.payment;

    const advancePay = trade.advancePay || {};
    if (advancePay.installmentFlag === 'Y' && +advancePay.amount > 0) {
      message += this.AIR_TIME_AND_DEVICE;
    } else {
      message += this.DEVICE;
    }

    if (payment.paymentType === 'QR_CODE') {
      if (payment.paymentQrCodeType === 'THAI_QR') {
        message += `${this.PROMPT_PAY_PAYMENT}`;
      } else {
        message += `${this.RABBIT_LINE_PAY_PAYMENT}`;
      }
      message += `${this.COMMA}${this.SPACE}`;
    } else {
      // ใช้ได้ทั้งบัตร credit, debit
      if (payment.paymentForm === 'INSTALLMENT') { // ผ่อนชำระ
        message += `${this.CREDIT_CARD_PAYMENT}${this.COMMA}${this.SPACE}`;
        message += `${this.BANK}${payment.paymentMethod.abb}${this.COMMA}${this.SPACE}`;
        message += `${this.INSTALLMENT}${payment.paymentMethod.percentage}%${this.SPACE}${payment.paymentMethod.month}`;
      } else { // ชำระเต็มจำนวน
        message += `${this.CASH_PAYMENT}${this.COMMA}${this.SPACE}`;
        message += `${this.BANK}${this.COMMA}${this.SPACE}`;
        message += `${this.INSTALLMENT}0%${this.SPACE}0`;
      }
      message += `เดือน${this.COMMA}${this.SPACE}`;
    }
    message += `${this.TRADE_NO}${trade.tradeNo}`;
    return message;
  }

  private getInformation(transaction: Transaction, priceOption: PriceOption): string {
    let message = '';

    const customerGroup = priceOption.customerGroup;
    const privilege = priceOption.privilege;
    const trade = priceOption.trade;
    const onTopPackage = transaction.data.onTopPackage || {};
    const mobileCarePackage = transaction.data.mobileCarePackage || {};
    const simCard = transaction.data.simCard;

    let customerGroupName = '';
    if ('MC001' === customerGroup.code) {
      customerGroupName = 'New Register';
    } else if ('MC002' === customerGroup.code) {
      customerGroupName = 'Convert Pre to Post';
    }
    const customAttributes = mobileCarePackage.customAttributes || {};

    message += this.SUMMARY_POINT + this.SPACE + 0 + this.COMMA + this.SPACE;
    message += this.SUMMARY_DISCOUNT + this.SPACE + 0 + this.COMMA + this.SPACE;
    message += this.DISCOUNT + this.SPACE + (trade.discount ? +trade.discount.amount : 0) + this.COMMA + this.SPACE;
    message += this.RETURN_CODE + this.SPACE + (simCard.privilegeCode || '') + this.COMMA + this.SPACE;
    message += this.ORDER_TYPE + this.SPACE + customerGroupName + this.COMMA + this.SPACE;
    message += this.PRMOTION_CODE + this.SPACE + (onTopPackage.promotionCode || '') + this.COMMA + this.SPACE;
    message += this.MOBILE_CARE_CODE + this.SPACE + (customAttributes.promotionCode || '') + this.COMMA + this.SPACE;
    message += this.MOBILE_CARE + this.SPACE + (customAttributes.shortNameThai || '') + this.COMMA + this.SPACE;
    message += this.PRIVILEGE_DESC + this.SPACE + (privilege.privilegeDesc || '') + this.COMMA + this.SPACE;
    message += this.QUEUE_NUMBER + this.SPACE + trade.tradeNo;
    return message;
  }

  private getGrandTotalAmt(trade: any, prebooking?: Prebooking): number {
    const normalPrice = +(+trade.normalPrice || 0).toFixed(2);
    const discount = +(+trade.discount ? (+trade.discount.amount || 0) : 0).toFixed(2);
    const advancePay = +(trade.advancePay ? (+trade.advancePay.amount || 0) : 0).toFixed(2);
    const depositAmt = +(prebooking && +prebooking.depositAmt ? (+prebooking.depositAmt || 0) : 0).toFixed(2);
    return (((normalPrice + advancePay) - discount) - depositAmt);
  }

  private getReqMinimumBalance(onTopPackage: any, mobileCarePackage: any): number { // Package only
    let total: number = 0;

    if (onTopPackage) {
      total += +(onTopPackage.priceIncludeVat || 0);
    }

    if (mobileCarePackage) {
      const customAttributes = mobileCarePackage.customAttributes;
      total += +(customAttributes.priceInclVat || 0);
    }
    return total;
  }
}

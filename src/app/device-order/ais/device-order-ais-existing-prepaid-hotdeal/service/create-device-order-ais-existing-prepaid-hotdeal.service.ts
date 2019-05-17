import { Injectable } from '@angular/core';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Transaction, Payment } from 'src/app/shared/models/transaction.model';
import { TokenService } from 'mychannel-shared-libs';

@Injectable({
  providedIn: 'root'
})
export class CreateDeviceOrderAisExistingPrepaidHotdealService {

  private priceOption: PriceOption;
  private transaction: Transaction;

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
    private tokenService: TokenService,
  ) { }

  getRequestDeviceSellOrder(transaction: Transaction, priceOption: PriceOption): any {
    this.transaction = transaction;
    this.priceOption = priceOption;
    const user = this.tokenService.getUser();
    const productStock = this.priceOption.productStock;
    const trade = this.priceOption.trade;
    const transactionData = this.transaction.data;
    const customerGroup = this.priceOption.customerGroup;
    const discount = trade.discount;
    const customer = transactionData.customer;
    const simCard = transactionData.simCard;
    const order = transactionData.order;
    const queue = transactionData.queue;
    const payment = transactionData.payment;
    const paymentMethod = payment.paymentMethod;
    const mobileCare = this.transaction.data.mobileCarePackage;
    const mpayPayment: any = transactionData.mpayPayment || {};

    const data: any = {
      userId: user.username,
      locationSource: user.locationCode,
      locationReceipt: user.locationCode,
      soCompany: productStock.company,
      productType: productStock.productType,
      productSubType: productStock.productSubType,
      brand: productStock.brand,
      model: productStock.model,
      color: productStock.color,
      matCode: '',
      priceIncAmt: Number((+trade.normalPrice || 0)),
      tradeNo: trade.tradeNo || '',
      ussdCode: trade.ussdCode || '',
      priceDiscountAmt: Number((+discount.amount || 0)),
      grandTotalAmt: Number((+trade.promotionPrice || 0)),
      soId: order.soId,
      queueNo: queue.queueNo || '',
      cusNameOrder: `${customer.titleName || ''} ${customer.firstName || ''} ${customer.lastName || ''}`.trim(),
      taxCardId: customer.idCardNo || '',
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
      cusMobileNoOrder: simCard.mobileNo || '',
      returnCode: customer.privilegeCode || '4GEYYY',
      // cashBackFlg: cashBackFlg,
      matAirTime: trade.matAirtime || '',
      matCodeFreeGoods: '',
      paymentRemark: this.getOrderRemark(this.transaction,  this.priceOption),
      installmentTerm: paymentMethod && paymentMethod.month ? paymentMethod.month : 0,
      installmentRate: paymentMethod && paymentMethod.percentage ? paymentMethod.percentage : 0,
      mobileAisFlg: 'Y',
      reqMinimumBalance: this.getReqMinimumBalance(transactionData.onTopPackage, mobileCare),
      paymentMethod: this.getPaymentMethod(transaction, priceOption),
      ankCode: payment && payment.paymentBank ? payment.paymentBank.abb : '',
      // tradeFreeGoodsId: trade.freeGoods[0] && trade.freeGoods[0].tradeFreegoodsId ? trade.freeGoods[0].tradeFreegoodsId : '',
      // tradeDiscountId: trade.discount.tradeDiscountId || '',
      // tradeAirtimeId: trade.advancePay.tradeAirtimeId || '',
      bankAbbr: payment && payment.paymentBank ? payment.paymentBank.abb : '',
      convertToNetwotkType: customerGroup.code === 'MC002' ? '3G POSTPAID' : undefined,
      qrTransId: mpayPayment ? mpayPayment.tranId : '',
      qrAmt: this.getQRAmt(trade, transaction)
    };
    return data;
  }

  private getQRAmt(trade: any, transaction: Transaction): any {
    const payment: Payment = transaction.data.payment;
    if (trade && payment.paymentType === 'QR_CODE') {
      const qrAmt: number = trade.normalPrice - trade.discount.amount;
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
    } else {
      return tradePayment.method;
    }
  }

  private getBankCode(trade: any, payment: Payment, advancePay: Payment): string {

    let bankCode: string = payment.paymentBank.abb;

    if (trade.advancePay.installmentFlag === 'Y') { // ผ่อนรวม
      return bankCode;
    }
    if (trade.amount > 0) {
      if (advancePay.paymentType === 'CREDIT') {
        bankCode = payment.paymentBank.abb + '|' + advancePay.paymentBank.abb;
      } else {
        bankCode = payment.paymentBank.abb;
      }
    }
    return bankCode;
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
        message += `${this.BANK}${payment.paymentMethod.abb || payment.paymentBank.abb}${this.COMMA}${this.SPACE}`;
        message += `${this.INSTALLMENT}${payment.paymentMethod.percentage}%${this.SPACE}${payment.paymentMethod.month}`;
        message += `เดือน${this.COMMA}${this.SPACE}`;
      } else { // ชำระเต็มจำนวน
        if (payment.paymentType === 'DEBIT') {
          message += `${this.CASH_PAYMENT}${this.COMMA}${this.SPACE}`;
        } else {
          message += `${this.CREDIT_CARD_PAYMENT}${this.COMMA}${this.SPACE}`;
          message += `${this.BANK}${payment.paymentMethod.abb || payment.paymentBank.abb}${this.COMMA}${this.SPACE}`;
          // message += `${this.INSTALLMENT}0%${this.SPACE}0`;
        }
      }
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
    const customer = transaction.data.customer;
    const queue = transaction.data.queue;
    const campaign = priceOption.campaign;

    let customerGroupName = '';
    if ('MC001' === customerGroup.code) {
      customerGroupName = 'New Register';
    } else if ('MC002' === customerGroup.code) {
      customerGroupName = 'Convert Pre to Post';
    }
    const customAttributes = mobileCarePackage.customAttributes || {};
    // trade.ussdCode || privilege.ussdCode
    // newPrivilegeDesc = `${priceOption.campaignName} ${customerGroup.name} ${newussdCode}`Hot Deal Prepaid ลูกค้าปัจจุบัน ( *999*022*2# )
    const privilegeDesc = (campaign.campaignName || '') + this.SPACE +
    (customerGroup.name || '') + ` ( ${( privilege.ussdCode || trade.ussdCode || '')} )`;

    message += this.SUMMARY_POINT + this.SPACE + 0 + this.COMMA + this.SPACE;
    message += this.SUMMARY_DISCOUNT + this.SPACE + 0 + this.COMMA + this.SPACE;
    message += this.DISCOUNT + this.SPACE + (trade.discount ? +trade.discount.amount : 0) + this.COMMA + this.SPACE;
    message += this.RETURN_CODE + this.SPACE + (customer.privilegeCode || '') + this.COMMA + this.SPACE;
    message += this.ORDER_TYPE + this.SPACE + customerGroupName + this.COMMA + this.SPACE;
    message += this.PRMOTION_CODE + this.SPACE + (onTopPackage.promotionCode || '') + this.COMMA + this.SPACE;
    message += this.MOBILE_CARE_CODE + this.SPACE + (customAttributes.promotionCode || '') + this.COMMA + this.SPACE;
    message += this.MOBILE_CARE + this.SPACE + (customAttributes.shortNameThai || '') + this.COMMA + this.SPACE;
    message += this.PRIVILEGE_DESC + this.SPACE + privilegeDesc + this.COMMA + this.SPACE;
    message += this.QUEUE_NUMBER + this.SPACE + queue.queueNo;
    return message;
  }

  private getReqMinimumBalance(onTopPackage: any, mobileCarePackage: any): number { // Package only
    let total: number = 0;

    if (onTopPackage) {
      total += +(onTopPackage.priceIncludeVat || 0);
    }

    if (mobileCarePackage && mobileCarePackage.customAttributes ) {
      const customAttributes = mobileCarePackage.customAttributes;
      total += +(customAttributes.priceInclVat || 0);
    }
    return total;
  }
}

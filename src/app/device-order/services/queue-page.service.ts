import { Injectable } from '@angular/core';
import { TokenService } from 'mychannel-shared-libs';
import { Transaction, Payment, Prebooking, Customer, Queue } from 'src/app/shared/models/transaction.model';
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
      grandTotalAmt: (+this.getGrandTotalAmt(trade, prebooking)).toFixed(2),
      userId: user.username,
      saleCode: this.tokenService.isAisUser() ? (seller.sellerNo || '') : (seller.sellerNo || user.ascCode),
      queueNo: queue.queueNo || '',
      cusNameOrder: `${customer.titleName || ''} ${customer.firstName || ''} ${customer.lastName || ''}`.trim() || '-',
      taxCardId: customer.idCardNo || '',
      cusMobileNoOrder: simCard.mobileNo || '',
      customerAddress: {
        addrNo: customer.homeNo,
        room: customer.room,
        buildingName: customer.buildingName,
        moo: customer.moo,
        floor: customer.floor,
        soi: customer.soi,
        streetName: customer.street,
        mooban: customer.mooBan,
        tumbon: customer.tumbol,
        amphur: customer.amphur,
        province: (customer.province || '').replace(/มหานคร$/, ''),
        country: 'ประเทศไทย',
        postCode: customer.zipCode
      },
      tradeNo: trade.tradeNo || '',
      ussdCode: trade.ussdCode || '',
      returnCode: simCard.privilegeCode || customer.privilegeCode || '4GEYYY',
      cashBackFlg: '',
      matAirTime: trade.advancePay ? trade.advancePay.matAirtime : '',
      matCodeFreeGoods: '',
      paymentRemark: this.getOrderRemark(transaction, priceOption),
      mobileAisFlg: 'Y',
      paymentMethod: this.getPaymentMethod(transaction, priceOption),
      bankCode: payment && payment.paymentBank ? payment.paymentBank.abb : '',
      matairtimeId: '',
      tradeDiscountId: trade.discount ? trade.discount.tradeDiscountId : '',
      tradeAirtimeId: trade.advancePay ? trade.advancePay.tradeAirtimeId : '',
      focCode: '',
      bankAbbr: payment && payment.paymentBank ? payment.paymentBank.abb : '',
      preBookingNo: prebooking ? prebooking.preBookingNo : '',
      depositAmt: prebooking ? prebooking.depositAmt : '',
      qrTransId: payment.paymentType === 'QR_CODE' ? mpayPayment.tranId : null,
      qrAmt: payment.paymentType === 'QR_CODE' && mpayPayment.tranId ? this.getQRAmt(trade, transaction) : null,
      qrOrderId: payment.paymentType === 'QR_CODE' ? transactionData.mpayPayment.mpayStatus.orderIdDevice : null,
    };

    // freeGoods
    if (trade.freeGoods && trade.freeGoods.length > 0) {
      data.tradeFreeGoodsId = trade.freeGoods[0] ? trade.freeGoods[0].tradeFreegoodsId : '';
    }

    // QR code for airtime
    if (transactionData.advancePayment && transactionData.advancePayment.paymentType === 'QR_CODE' ) {
      data.qrAirtimeTransId = mpayPayment.qrAirtimeTransId || mpayPayment.tranId || null;
      data.qrAirtimeAmt =  this.getQRAmt(trade, transaction);
    }

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
${this.PROMOTION_NAME}${this.SPACE}${onTopPackage.shortNameThai || ''}
${airTime}${this.NEW_LINE}${installment}${this.NEW_LINE}${information}${this.NEW_LINE}
`;
  }

  private getQRAmt(trade: any, transaction: Transaction): any {
    const payment: Payment = transaction.data.payment;
    let cost = 0;
    if (trade && payment.paymentType === 'QR_CODE') {
      const qrAmt: number = trade.normalPrice - trade.discount.amount;
      cost += +qrAmt;
    }
    if (trade && transaction.data.advancePayment && transaction.data.advancePayment.paymentType === 'QR_CODE') {
      cost += +trade.advancePay.amount;
    }
    return cost ? cost.toFixed(2) : undefined;
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
    const trade: any = priceOption.trade;
    const advancePayment: any = transaction.data.advancePayment || {};
    let tradePayment: any;
    if ((trade.payment && trade.payment.length > 0)) {
      tradePayment = priceOption.trade.payment[0];
    } else if ((trade.payments && trade.payments.length > 0)) {
      tradePayment = priceOption.trade.payments[0];
    } else {
      tradePayment = {};
    }

    if (trade.advancePay.installmentFlag === 'Y' || !payment || !advancePayment.paymentType) {
        //  tread no pay  จะเข้าอันนี้
      if (payment.paymentType === 'QR_CODE') {
        return payment.paymentQrCodeType === 'THAI_QR' ? 'PB' : 'RL';
      }
      if (advancePayment.paymentType === 'QR_CODE') {
        return advancePayment.paymentQrCodeType === 'THAI_QR' ? 'PB' : 'RL';
      }
      return tradePayment.method;
    } else {
      let paymentMethod = '';
      // AWN หรือ WDS จ่ายแยก
      if (payment.paymentType === 'QR_CODE') {
        paymentMethod += payment.paymentQrCodeType === 'THAI_QR' ? 'PB|' : 'RL|';
      } else {
        paymentMethod += tradePayment.method + '|';
      }
      if (advancePayment.paymentType === 'QR_CODE') {
        paymentMethod += advancePayment.paymentQrCodeType === 'THAI_QR' ? 'PB' : 'RL';
      } else {
        paymentMethod += tradePayment.method;
      }
      return paymentMethod;
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
    const mainPackage = transaction.data.mainPackage && transaction.data.mainPackage.customAttributes || {};
    const mobileCarePackage = transaction.data.mobileCarePackage || {};
    const simCard = transaction.data.simCard;
    const customer: any = transaction.data.customer || {};
    const queue: any = transaction.data.queue || {};

    let customerGroupName = '';
    if ('MC001' === customerGroup.code) {
      customerGroupName = 'New Register';
    } else if ('MC002' === customerGroup.code) {
      customerGroupName = 'Convert Pre to Post';
    }
    const customAttributes = mobileCarePackage.customAttributes || {};

    message += this.SUMMARY_POINT + this.SPACE + 0 + this.COMMA + this.SPACE;
    message += this.SUMMARY_DISCOUNT + this.SPACE + 0 + this.COMMA + this.SPACE;
    message += this.DISCOUNT + this.SPACE + (trade.discount ? (+trade.discount.amount).toFixed(2) : 0.00) + this.COMMA + this.SPACE;
    message += this.RETURN_CODE + this.SPACE + (simCard.privilegeCode || customer.privilegeCode || '') + this.COMMA + this.SPACE;
    message += this.ORDER_TYPE + this.SPACE + customerGroupName + this.COMMA + this.SPACE;
    message += this.PRMOTION_CODE + this.SPACE + (mainPackage.promotionCode || '') + this.COMMA + this.SPACE;
    message += this.MOBILE_CARE_CODE + this.SPACE + (customAttributes.promotionCode || '') + this.COMMA + this.SPACE;
    message += this.MOBILE_CARE + this.SPACE + (customAttributes.shortNameThai || '') + this.COMMA + this.SPACE;
    message += this.PRIVILEGE_DESC + this.SPACE + (privilege.privilegeDesc || '') + this.COMMA + this.SPACE;
    message += this.QUEUE_NUMBER + this.SPACE + queue.queueNo;
    return message;
  }

  private getGrandTotalAmt(trade: any, prebooking?: Prebooking): number {
    const normalPrice = +(+trade.normalPrice || 0).toFixed(2);
    const discount = +(trade.discount ? (+trade.discount.amount || 0) : 0).toFixed(2);
    const advancePay = +(trade.advancePay ? (+trade.advancePay.amount || 0) : 0).toFixed(2);
    const depositAmt = +(prebooking && +prebooking.depositAmt ? (+prebooking.depositAmt || 0) : 0).toFixed(2);
    return +(((normalPrice + advancePay) - discount) - depositAmt);
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

  public checkQueueLocation(): Promise<any> {
    return this.http.get('/api/salesportal/check-queue-location').toPromise().then((response: any) => {
      return response && response.data && response.data.queueType ? response.data.queueType : undefined;
    }).catch((e) => false);
  }
}

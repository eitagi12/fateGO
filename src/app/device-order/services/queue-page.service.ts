import { Injectable } from '@angular/core';
import { TokenService } from 'mychannel-shared-libs';
import { Transaction, Payment, Prebooking, Customer, Queue, Omise } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { HttpClient } from '@angular/common/http';
import { CustomerGroup } from 'src/app/buy-product/services/flow.service';
import { QrCodeOmisePageService } from 'src/app/device-order/services/qr-code-omise-page.service';

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
    private tokenService: TokenService,
    private qrCodeOmisePageService: QrCodeOmisePageService,
  ) { }

  getQueueQmatic(mobileNo: string): Promise<any> {
    return this.http.post('/api/salesportal/device-order/transaction/get-queue-qmatic', {
      mobileNo: mobileNo
    }).toPromise();
  }

  createDeviceSellingOrderList(transaction: Transaction, priceOption: PriceOption): Promise<any> {
    return this.http.post('/api/salesportal/dt/create-order-list',
      this.getRequestCreateDeviceSellingOrderList(transaction, priceOption)
    ).toPromise();
  }

  private getRequestCreateDeviceSellingOrderList(transaction: Transaction, priceOption: PriceOption): any {
    const user = this.tokenService.getUser();
    const productStock = priceOption.productStock;
    const productDetail = priceOption.productDetail;
    const trade = priceOption.trade;
    const transactionData = transaction.data;

    const discount = trade.discount;
    const customer = transactionData.customer;
    const simCard = transactionData.simCard;
    const order = transactionData.order;
    const currentPackage = transactionData.currentPackage || {};
    const mainPackage = transaction.data.mainPackage && transaction.data.mainPackage.customAttributes || {};
    const contract = transaction.data.contractFirstPack || {};
    const queue: any = transactionData.queue || {};
    const seller = transactionData.seller || {};
    const payment = transactionData.payment;
    const prebooking: Prebooking = transactionData.preBooking;
    const mpayPayment: any = transactionData.mpayPayment || {};
    const advancePayment = transactionData.advancePayment;
    const omise: Omise = transactionData.omise || {};

    const product: any = {
      productType: productStock.productType || productDetail.productType || 'DEVICE',
      soCompany: productStock.company,
      productSubType: productStock.productSubType || productDetail.productSubtype || 'HANDSET',
      brand: productStock.brand || productDetail.brand,
      model: productStock.model || productDetail.model,
      qty: 1,

      color: productStock.color || productStock.colorName,
      matCode: '',
      priceIncAmt: (+trade.normalPrice || 0).toFixed(2),
      priceDiscountAmt: (+discount.amount || 0).toFixed(2),
      matAirTime: trade.advancePay ? trade.advancePay.matAirtime : '',
      tradeNo: trade.tradeNo || '',
      ussdCode: trade.ussdCode || '',
      returnCode: simCard.privilegeCode || customer.privilegeCode || '4GEYYY',
      cashBackFlg: '',
      tradeAirtimeId: trade.advancePay ? trade.advancePay.tradeAirtimeId : '',
      tradeDiscountId: trade.discount ? trade.discount.tradeDiscountId : '',
      listMatFreeGoods: [{
        matCodeFG: '',
        qtyFG: '', // จำนวนของแถม *กรณีส่งค่า matCodeFreeGoods ค่า qty จะต้องมี
        tradeFreeGoodsId: trade.freeGoods && trade.freeGoods.length > 0 ? trade.freeGoods[0].tradeFreegoodsId : '' // freeGoods
      }],
    };

    const data: any = {
      soId: order.soId,
      locationSource: user.locationCode,
      locationReceipt: user.locationCode,
      userId: user.username,
      queueNo: queue.queueNo || '',
      cusNameOrder: `${customer.titleName || ''} ${customer.firstName || ''} ${customer.lastName || ''}`.trim() || '-',
      soChannelType: 'CSP',
      soDocumentType: 'RESERVED',
      productList: [product],

      grandTotalAmt: (+this.getGrandTotalAmt(trade, prebooking)).toFixed(2),
      saleCode: this.tokenService.isAisUser() ? (seller.sellerNo || '') : (seller.sellerNo || user.ascCode),
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
      paymentRemark: this.getOrderRemark(transaction, priceOption),
      paymentMethod: this.getPaymentMethod(transaction),
      // bankCode: payment && payment.paymentBank ? payment.paymentBank.abb : '',
      focCode: '',
      mobileAisFlg: 'Y',
      bankAbbr: payment && payment.paymentBank ? payment.paymentBank.abb : '',
      reqMinimumBalance: '',
      preBookingNo: prebooking ? prebooking.preBookingNo : '',
      depositAmt: prebooking ? prebooking.depositAmt : '',
      convertToNetwotkType: '',
      shipCusName: '',
      shipCusAddr: '',
      storeName: '',
      shipLocation: '',
      remarkReceipt: '',
    };

    if (this.checkAddCurrentPackAmt(priceOption, trade, contract)) {
      data.currentPackAmt = (mainPackage.priceExclVat || '0');
    }

    // payment with omise
    if (this.qrCodeOmisePageService.isPaymentOnlineCredit(transaction, 'payment') &&
      this.qrCodeOmisePageService.isPaymentOnlineCredit(transaction, 'advancePayment')) {
      data.soChannelType = 'MC_KIOSK';
      data.clearingType = 'MPAY';
      data.qrOrderId = omise.orderId;
      data.creditCardNo = omise.creditCardNo ? omise.creditCardNo.substring(omise.creditCardNo.length - 16) : '';
      data.cardExpireDate = omise.cardExpireDate || '12/30';

      data.qrTransId = omise.tranId;
      data.qrAmt = (+this.getGrandTotalAmt(trade, prebooking)).toFixed(2);
      data.qrAirtimeTransId = omise.tranId;
      data.qrAirtimeAmt = (+this.getGrandTotalAmt(trade, prebooking)).toFixed(2);

    } else if (this.qrCodeOmisePageService.isPaymentOnlineCredit(transaction, 'payment') ||
      this.qrCodeOmisePageService.isPaymentOnlineCredit(transaction, 'advancePayment')) {
      data.soChannelType = 'MC_KIOSK';
      data.clearingType = 'MPAY';
      data.qrOrderId = omise.orderId;
      data.creditCardNo = omise.creditCardNo ? omise.creditCardNo.substring(omise.creditCardNo.length - 16) : '';
      data.cardExpireDate = omise.cardExpireDate || '12/30';

      // omise for device
      if (this.qrCodeOmisePageService.isPaymentOnlineCredit(transaction, 'payment')) {
        data.qrTransId = omise.tranId;
        data.qrAmt = this.getOnlinePaymentAmt(trade, transaction);
      }
      // omise for airtime
      if (this.qrCodeOmisePageService.isPaymentOnlineCredit(transaction, 'advancePayment')) {
        data.qrAirtimeTransId = omise.tranId;
        data.qrAirtimeAmt = this.getOnlinePaymentAmt(trade, transaction);
      }

    }

    // payment with QR code
    if (payment && payment.paymentType === 'QR_CODE' || (advancePayment && advancePayment.paymentType === 'QR_CODE')) {
      if (mpayPayment && mpayPayment.mpayStatus && mpayPayment.mpayStatus.orderIdDevice) {
        data.qrOrderId = mpayPayment.mpayStatus.orderIdDevice;
      } else {
        data.qrOrderId = mpayPayment && mpayPayment.orderId ? mpayPayment.orderId : null;
      }
      // QR code for device
      if (payment && payment.paymentType === 'QR_CODE') {
        data.qrTransId = payment.paymentType === 'QR_CODE' ? mpayPayment.tranId : null;
        data.qrAmt = payment.paymentType === 'QR_CODE' && mpayPayment.tranId ? this.getQRAmt(trade, transaction) : null;
      }
      // QR code for airtime
      if (advancePayment && advancePayment.paymentType === 'QR_CODE') {
        data.qrAirtimeTransId = mpayPayment.qrAirtimeTransId || mpayPayment.tranId || null;
        data.qrAirtimeAmt = this.getQRAmt(trade, transaction);
      }
    }

    // ผ่อนชำระ
    if (payment && payment.paymentMethod) {
      data.installmentTerm = payment.paymentMethod.month || 0;
      data.installmentRate = payment.paymentMethod.percentage || 0;
    }
    return data;
  }

  private getOrderRemark(transaction: Transaction, priceOption: PriceOption): string {
    const mainPackage = transaction.data.mainPackage && transaction.data.mainPackage.customAttributes || {};
    const airTime: string = this.getAirTimeRemark(priceOption.trade, transaction);
    const installment = this.getInstallmentRemark(transaction, priceOption);
    const information = this.getInformationRemark(transaction, priceOption);

    return `
${this.PROMOTION_NAME}${this.SPACE}${mainPackage.shortNameThai || ''}
${airTime}${this.NEW_LINE}${installment}${this.NEW_LINE}${information}${this.NEW_LINE}
`;
  }

  private getOnlinePaymentAmt(trade: any, transaction: Transaction): any {
    let cost = 0;
    if (trade && this.qrCodeOmisePageService.isPaymentOnlineCredit(transaction, 'payment')) {
      const qrAmt: number = trade.normalPrice - trade.discount.amount;
      cost += +qrAmt;
    }
    if (trade && this.qrCodeOmisePageService.isPaymentOnlineCredit(transaction, 'advancePayment')) {
      cost += +trade.advancePay.amount;
    }
    return cost ? cost.toFixed(2) : undefined;
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

  private getPaymentMethod(transaction: Transaction): string {
    const payment: Payment = transaction.data.payment;
    const advancePayment: any = transaction.data.advancePayment;

    let paymentMethod = '';
    if (payment) {
      paymentMethod = this.getInstallment(payment);
    }
    if (advancePayment) {
      paymentMethod += '|' + this.getAirTime(advancePayment);
    }
    return paymentMethod;
  }

  private getInstallment(payment: any): string {
    if (payment.paymentType === 'QR_CODE') {
      if (payment.paymentQrCodeType === 'THAI_QR') {
        return 'PB';
      } else {
        return 'RL';
      }
    } else {
      // ใช้ได้ทั้งบัตร credit, debit
      if (payment.paymentForm === 'INSTALLMENT') { // ผ่อนชำระ
        return 'CC';
      } else { // ชำระเต็มจำนวน
        if (payment.paymentType === 'DEBIT') {
          return 'CA';
        } else {
          return 'CC';
        }
      }
    }
  }

  private getAirTime(advancePayment: any): string {
    if (advancePayment.paymentType === 'QR_CODE') {
      if (advancePayment.paymentQrCodeType === 'THAI_QR') {
        return 'PB';
      } else {
        return 'RL';
      }
    } else {
      if (advancePayment.paymentType === 'DEBIT') {
        return 'CA';
      } else {
        return 'CC';
      }
    }
  }

  private getAirTimeRemark(trade: any, transaction: Transaction): string {
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

  private getInstallmentRemark(transaction: Transaction, priceOption: PriceOption): string {
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

  private getInformationRemark(transaction: Transaction, priceOption: PriceOption): string {
    let message = '';

    const customerGroup = priceOption.customerGroup || {};
    const privilege = priceOption.privilege || {};
    const trade = priceOption.trade;
    const campaign = priceOption.campaign || {};
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
    const privilegeDesc = `${campaign.campaignName} ${customerGroup.name || ''} ${privilege.ussdCode || ''}`;

    message += this.SUMMARY_POINT + this.SPACE + 0 + this.COMMA + this.SPACE;
    message += this.SUMMARY_DISCOUNT + this.SPACE + 0 + this.COMMA + this.SPACE;
    message += this.DISCOUNT + this.SPACE + (trade.discount ? (+trade.discount.amount).toFixed(2) : 0.00) + this.COMMA + this.SPACE;
    message += this.RETURN_CODE + this.SPACE + (simCard.privilegeCode || customer.privilegeCode || '') + this.COMMA + this.SPACE;
    message += this.ORDER_TYPE + this.SPACE + customerGroupName + this.COMMA + this.SPACE;
    message += this.PRMOTION_CODE + this.SPACE + (mainPackage.promotionCode || '') + this.COMMA + this.SPACE;
    message += this.MOBILE_CARE_CODE + this.SPACE + (customAttributes.promotionCode || '') + this.COMMA + this.SPACE;
    message += this.MOBILE_CARE + this.SPACE + (customAttributes.shortNameThai || '') + this.COMMA + this.SPACE;
    message += this.PRIVILEGE_DESC + this.SPACE + (privilegeDesc || '') + this.COMMA + this.SPACE;
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

  checkAddCurrentPackAmt(priceOption: PriceOption, trade: any, contract: any): boolean {
    return priceOption.customerGroup.code === CustomerGroup.EXISTING
      && this.isContractFirstPack(contract) === 0;
  }

  isContractFirstPack(contract: any = {}): number {
    return Math.max(+contract.firstPackage || 0, +contract.minPrice || 0, +contract.initialPackage || 0);
  }

  public checkQueueLocation(): Promise<any> {
    return this.http.get('/api/salesportal/check-queue-location').toPromise().then((response: any) => {
      return response && response.data && response.data.queueType ? response.data.queueType : undefined;
    }).catch((e) => false);
  }
}

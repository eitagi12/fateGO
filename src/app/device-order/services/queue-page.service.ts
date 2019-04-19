import { Injectable } from '@angular/core';
import { TokenService } from 'mychannel-shared-libs';
import { Transaction } from 'src/app/shared/models/transaction.model';
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
    const trade = priceOption.trade;
    const transactionData = transaction.data;

    const discount = trade.discount;
    const customer = transactionData.customer;
    const simCard = transactionData.simCard;
    const order = transactionData.order;
    const queue: any = transactionData.queue || {};
    const seller = transactionData.seller || {};
    const payment = transactionData.payment;

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
      priceIncAmt: (+trade.normalPrice || 0).toFixed(2),
      tradeNo: trade.tradeNo || '',
      ussdCode: trade.ussdCode || '',
      priceDiscountAmt: (+discount.amount || 0).toFixed(2),
      grandTotalAmt: this.getGrandTotalAmt(trade),
      soId: order.soId,
      saleCode: this.tokenService.isAisUser() ? (seller.sellerNo || '') : (seller.sellerNo || user.ascCode),
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
      returnCode: simCard.privilegeCode || '4GEYYY',
      matCode: '',
      cashBackFlg: '',
      matCodeFreeGoods: '',
      matAirTime: trade.advancePay ? trade.advancePay.matAirtime : '',
      paymentRemark: this.getOrderRemark(transaction, priceOption),
      installmentTerm: 0,
      installmentRate: 0,
      mobileAisFlg: 'Y',
      paymentMethod: '',
      bankCode: '',
      tradeFreeGoodsId: '',
      matairtimeId: '',
      tradeDiscountId: '',
      focCode: '',
      bankAbbr: ''
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
    const airTime: string = this.getAirTime(priceOption.trade);
    const installment = this.getInstallment(transaction, priceOption);
    const information = this.getInformation(transaction, priceOption);

    return `
${this.PROMOTION_NAME}${this.SPACE}${onTopPackage.shortNameThai || ''}${this.NEW_LINE}
${airTime}${this.NEW_LINE}${installment}${this.NEW_LINE}${information}${this.NEW_LINE}
`;
  }

  private getAirTime(trade: any): string {
    let message = '';

    if (trade && trade.advancePay) {
      const advancePay = trade.advancePay;
      if (advancePay.installmentFlag !== 'Y' && +advancePay.amount > 0) {
        message = `${this.AIR_TIME}${this.CREDIT_CARD_PAYMENT}`;
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
    if (payment.paymentForm === 'INSTALLMENT') { // ผ่อนชำระ
      message += this.CREDIT_CARD_PAYMENT + this.COMMA + this.SPACE;
      message += this.BANK + payment.paymentMethod.abb + this.COMMA + this.SPACE;
      message += this.INSTALLMENT + payment.paymentMethod.percentage + '%' + this.SPACE + payment.paymentMethod.month;
    } else { // ชำระเต็มจำนวน
      message += this.CASH_PAYMENT + this.COMMA + this.SPACE;
      message += this.BANK + this.COMMA + this.SPACE;
      message += this.INSTALLMENT + '0%' + this.SPACE + '0';
    }
    message += 'เดือน' + this.COMMA + this.SPACE;
    message += this.TRADE_NO + trade.tradeNo;
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

  private getGrandTotalAmt(trade: any): number {
    const normalPrice = +(+trade.normalPrice || 0).toFixed(2);
    const discount = +(+trade.discount ? (+trade.discount.amount || 0) : 0).toFixed(2);
    const advancePay = +(trade.advancePay ? (+trade.advancePay.amount || 0) : 0).toFixed(2);
    return ((normalPrice + advancePay) - discount);
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

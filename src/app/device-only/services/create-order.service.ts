import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenService } from 'mychannel-shared-libs';
import { SharedTransactionService } from 'src/app/shared/services/shared-transaction.service';
import { Transaction, Customer, Payment, Prebooking, Omise } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { User } from 'mychannel-shared-libs';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { QRCodeModel } from 'src/app/shared/services/qrcode-payment.service';
import { environment } from 'src/environments/environment';
import { QrCodeOmiseService } from 'src/app/device-only/services/qr-code-omise.service';
import { CustomerGroup } from 'src/app/buy-product/services/flow.service';

@Injectable({
  providedIn: 'root'
})
export class CreateOrderService {

  user: User;
  terminalId: any;
  serviceId: any;
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
    public qrCodeOmiseService: QrCodeOmiseService,
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
        this.callAddToCartDT(transaction, priceOption).then((response) => {
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

  private callAddToCartDT(transaction: Transaction, priceOption: PriceOption): Promise<any> {
    const productStock = priceOption.productStock;
    const productDetail = priceOption.productDetail;
    const trade = priceOption.trade;
    const customer = transaction.data.customer;
    const preBooking: Prebooking = transaction.data.preBooking;

    const product = {
      productType: productDetail.productType || 'DEVICE',
      soCompany: productStock.company || 'AWN',
      productSubType: productDetail.productSubType || 'HANDSET',
      brand: productDetail.brand || productStock.brand,
      model: productDetail.model || productStock.model,
      qty: '1',

      color: productStock.color || productStock.colorName,
      matCode: '',
      priceIncAmt: '' + trade.normalPrice,
      priceDiscountAmt: '' + trade.discount.amount,
      matAirTime: '',
      listMatFreeGoods: [{
        matCodeFG: '',
        qtyFG: '' // จำนวนของแถม *กรณีส่งค่า matCodeFreeGoods ค่า qty จะต้องมี
      }]
    };

    let subStock;
    if (preBooking && preBooking.preBookingNo) {
      subStock = 'PRE';
    } else {
      subStock = 'BRN';
    }

    const requestData: any = {
      locationSource: this.user.locationCode,
      locationReceipt: this.user.locationCode,
      userId: this.user.username,
      cusNameOrder: `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || '-',
      soChannelType: 'CSP',
      soDocumentType: 'RESERVED',
      productList: [product],

      grandTotalAmt: '',
      preBookingNo: preBooking ? preBooking.preBookingNo : '',
      depositAmt: preBooking ? preBooking.depositAmt : '',
      reserveNo: preBooking ? preBooking.reserveNo : '',
      subStockDestination: 'BRN',
      storeName: ''
    };

    return this.http.post('/api/salesportal/dt/add-cart-list', requestData).toPromise()
      .then((res: any) => res.data);
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
      productSubType: productDetail.productSubtype || 'HANDSET',
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

    return this.http.post('/api/salesportal/add-device-selling-cart', requestData).toPromise()
      .then((res: any) => res.data);
  }

  cancelOrder(transaction: Transaction): Promise<any> {
    return new Promise(resolve => {
      const promiseAll = [];
      if (transaction.data) {
        if (transaction.data.order && transaction.data.order.soId) {
          const order = this.http.post('/api/salesportal/device-sell/item/clear-temp-stock', {
            location: this.user.locationCode,
            soId: transaction.data.order.soId,
            transactionId: transaction.transactionId
          }).toPromise().catch(() => Promise.resolve());
          promiseAll.push(order);
        }
      }
      Promise.all(promiseAll).then(() => resolve());
    });
  }

  cancelOrderDT(transaction: Transaction): Promise<any> {
    return new Promise(resolve => {
      const promiseAll = [];
      if (transaction.data) {
        if (transaction.data.order && transaction.data.order.soId) {
          const order = this.http.post('/api/salesportal/dt/remove-cart', {
            userId: this.user.username,
            location: this.user.locationCode,
            soId: transaction.data.order.soId,
            transactionId: transaction.transactionId
          }).toPromise().catch(() => Promise.resolve());
          promiseAll.push(order);
        }
      }
      Promise.all(promiseAll).then(() => resolve());
    });
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

  createOrderDeviceOnlyASP(transaction: Transaction, priceOption: PriceOption): Promise<any> {
    const order = this.mapCreateOrderFlowWeb(transaction, priceOption);
    return this.http.post('/api/salesportal/create-device-selling-order', order).toPromise();
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
    if (this.qrCodeOmiseService.isPaymentOnlineCredit(transaction, 'payment') &&
      this.qrCodeOmiseService.isPaymentOnlineCredit(transaction, 'advancePayment')) {
      data.soChannelType = 'MC_KIOSK';
      data.clearingType = 'MPAY';
      data.qrOrderId = omise.orderId;
      data.creditCardNo = omise.creditCardNo ? omise.creditCardNo.substring(omise.creditCardNo.length - 16) : '';
      data.cardExpireDate = omise.cardExpireDate || '12/30';
      data.qrTransId = omise.tranId;
      data.qrAmt = (+this.getGrandTotalAmt(trade, prebooking)).toFixed(2);
      data.qrAirtimeTransId = omise.tranId;
      data.qrAirtimeAmt = (+this.getGrandTotalAmt(trade, prebooking)).toFixed(2);

    } else if (this.qrCodeOmiseService.isPaymentOnlineCredit(transaction, 'payment') ||
      this.qrCodeOmiseService.isPaymentOnlineCredit(transaction, 'advancePayment')) {
      data.soChannelType = 'MC_KIOSK';
      data.clearingType = 'MPAY';
      data.qrOrderId = omise.orderId;
      data.creditCardNo = omise.creditCardNo ? omise.creditCardNo.substring(omise.creditCardNo.length - 16) : '';
      data.cardExpireDate = omise.cardExpireDate || '12/30';

      // omise for device
      if (this.qrCodeOmiseService.isPaymentOnlineCredit(transaction, 'payment')) {
        data.qrTransId = omise.tranId;
        data.qrAmt = this.getOnlinePaymentAmt(trade, transaction);
      }
      // omise for airtime
      if (this.qrCodeOmiseService.isPaymentOnlineCredit(transaction, 'advancePayment')) {
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
      brand: priceOption.productStock.brand,
      model: priceOption.productDetail.model,
      color: priceOption.productStock.colorName || priceOption.productStock.color,
      matCode: priceOption.productStock.colorCode,
      priceIncAmt: (+priceOption.trade.normalPrice).toFixed(2),
      priceDiscountAmt: (+priceOption.trade.priceDiscount).toFixed(2),
      grandTotalAmt: (+priceOption.trade.normalPrice - +priceOption.trade.priceDiscount).toFixed(2),
      userId: this.user.username,
      saleCode: sellerNo,
      queueNo: transaction.data.queue.queueNo,
      cusNameOrder: transaction.data.customer.firstName + ' ' + transaction.data.customer.lastName,
      taxCardId: transaction.data.customer.idCardNo,
      cusMobileNoOrder: transaction.data.receiptInfo.telNo || '',
      customerAddress: this.mapCusAddress(transaction.data.customer),
      tradeNo: priceOption.trade.tradeNo,
      paymentRemark: this.getOrderRemark(transaction, priceOption),
      installmentTerm: mapInstallmentTerm,
      installmentRate: mapInstallmentRate,
      paymentMethod: this.getPaymentMethod(transaction),
      bankCode: mapBankCode,
      qrTransId: mapQrTran,
      bankAbbr: mapBankAbb,
      qrAmt: this.getQRAmt(priceOption, transaction), // add
      reqMinimumBalance: transaction.data.simCard ? this.getReqMinimumBalance(transaction, transaction.data.mobileCarePackage) : '',
      qrOrderId: mapQrOrderId,
      tradeType: transaction.data.tradeType
    };
  }

  mapCreateOrderFlowWeb(transaction: Transaction, priceOption: PriceOption): any {
    const sellerNo = (transaction.data.seller && transaction.data.seller.sellerNo) ? transaction.data.seller.sellerNo : '';
    const mapInstallmentTerm = transaction.data.payment.paymentMethod.month ? transaction.data.payment.paymentMethod.month : 0;
    const mapInstallmentRate = transaction.data.payment.paymentMethod.percentage ? transaction.data.payment.paymentMethod.percentage : 0;
    const mapBankAbb = transaction.data.payment.paymentBank.abb ? transaction.data.payment.paymentBank.abb : '';
    const mapBankCode = transaction.data.payment.paymentBank.abb ? transaction.data.payment.paymentBank.abb : '';
    const mapTelNo = transaction.data.receiptInfo.telNo ? transaction.data.receiptInfo.telNo : '';
    // tslint:disable-next-line: max-line-length
    const mapCustomerNameOrder = (transaction.data.customer && transaction.data.customer.firstName && transaction.data.customer.lastName) ? transaction.data.customer.firstName + ' ' + transaction.data.customer.lastName : '';

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
      cusNameOrder: mapCustomerNameOrder,
      taxCardId: transaction.data.customer.idCardNo,
      cusMobileNoOrder: mapTelNo,
      customerAddress: this.mapCusAddress(transaction.data.customer),
      tradeNo: priceOption.trade.tradeNo,
      paymentRemark: this.getOrderRemark(transaction, priceOption),
      installmentTerm: mapInstallmentTerm,
      installmentRate: mapInstallmentRate,
      paymentMethod: this.getPaymentMethod(transaction),
      bankCode: mapBankCode,
      bankAbbr: mapBankAbb,
      reqMinimumBalance: transaction.data.simCard ? this.getReqMinimumBalance(transaction, transaction.data.mobileCarePackage) : '',
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
    const installment = this.getInstallmentRemark(transaction, priceOption);
    const information = this.getInformationRemark(transaction, priceOption);
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

  private getInstallmentRemark(transaction: Transaction, priceOption: PriceOption): string {
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

  private getInformationRemark(transaction: Transaction, priceOption: PriceOption): string {
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

  checkAddCurrentPackAmt(priceOption: PriceOption, trade: any, contract: any): boolean {
    return priceOption.customerGroup.code === CustomerGroup.EXISTING
      && this.isContractFirstPack(contract) === 0;
  }

  isContractFirstPack(contract: any = {}): number {
    return Math.max(+contract.firstPackage || 0, +contract.minPrice || 0, +contract.initialPackage || 0);
  }

  private getGrandTotalAmt(trade: any, prebooking?: Prebooking): number {
    const normalPrice = +(+trade.normalPrice || 0).toFixed(2);
    const discount = +(trade.discount ? (+trade.discount.amount || 0) : 0).toFixed(2);
    const advancePay = +(trade.advancePay ? (+trade.advancePay.amount || 0) : 0).toFixed(2);
    const depositAmt = +(prebooking && +prebooking.depositAmt ? (+prebooking.depositAmt || 0) : 0).toFixed(2);
    return +(((normalPrice + advancePay) - discount) - depositAmt);
  }

  private getOnlinePaymentAmt(trade: any, transaction: Transaction): any {
    let cost = 0;
    if (trade && this.qrCodeOmiseService.isPaymentOnlineCredit(transaction, 'payment')) {
      const qrAmt: number = trade.normalPrice - trade.discount.amount;
      cost += +qrAmt;
    }
    if (trade && this.qrCodeOmiseService.isPaymentOnlineCredit(transaction, 'advancePayment')) {
      cost += +trade.advancePay.amount;
    }
    return cost ? cost.toFixed(2) : undefined;
  }

}

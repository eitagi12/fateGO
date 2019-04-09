import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenService } from 'mychannel-shared-libs';
import { Transaction, BillDeliveryAddress } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { User } from 'mychannel-shared-libs';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CreateOrderService {
  user: User;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
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

  public generateTransactionId(requestId: string): any {
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

  private callAddToCart(transaction: Transaction, priceOption: PriceOption): Promise<any> {
    const productStock = priceOption.productStock;
    const productDetail = priceOption.productDetail;
    const customer = transaction.data.customer;
    const cusNameOrder = customer && customer.firstName && customer.lastName ? `${customer.firstName} ${customer.lastName}` : '-';
    const requestData: any = {
      soCompany: productStock.company || 'AWN',
      locationSource: this.user.locationCode,
      locationReceipt: this.user.locationCode,
      productType: productDetail.productType || 'DEVICE',
      productSubType: productDetail.productSubType || 'HANDSET',
      brand: productDetail.brand || productStock.brand,
      model: productDetail.model,
      color: productStock.color,
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
    console.log('transaction', transaction);
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
    const updateTransaction = {...transaction,
      issueBy: this.user.username};
      return this.http.post('/api/salesportal/device-order/update-transaction', updateTransaction).pipe(
        map((res: any) => res.data.isSuccess)
    ).toPromise();
  }

  createOrderDeviceOnly(transaction: Transaction, priceOption: PriceOption): Observable<any> {
    const order = this.mapCreateOrder(transaction, priceOption);
    return this.http.post('/api/salesportal/device-sell/order', order).pipe(
      map((response: any) => response.data.resultCode)
    );
  }

  mapCreateOrder(transaction: Transaction, priceOption: PriceOption): any {
    const sellerNo = (transaction.data.seller && transaction.data.seller.sellerNo)  ? transaction.data.seller.sellerNo : '';
    const mapInstallmentTerm = transaction.data.payment.paymentMethod.month
                              ? transaction.data.payment.paymentMethod.month : 0;
    const mapInstallmentRate = transaction.data.payment.paymentMethod.percentage
                              ? transaction.data.payment.paymentMethod.percentage : 0;
    const mapBankAbb = transaction.data.payment.paymentMethod.abb ? transaction.data.payment.paymentMethod.abb : '';
    const mapPaymentMethod = this.mapPaymentType(transaction.data.payment.paymentType);
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
      priceIncAmt: '',
      priceDiscountAmt: '',
      grandTotalAmt: priceOption.trade.promotionPrice,
      userId: this.user.username,
      saleCode: sellerNo,
      queueNo: transaction.data.queue.queueNo,
      cusNameOrder: transaction.data.customer.firstName + ' ' + transaction.data.customer.lastName,
      taxCardId: transaction.data.customer.idCardNo,
      cusMobileNoOrder: transaction.data.receiptInfo.telNo,
      customerAddress: this.mapCusAddress(transaction.data.billingInformation.billDeliveryAddress),
      tradeNo: priceOption.trade.tradeNo,
      // ussdCode: priceOption.trade.ussdCode,
      // returnCode: '4GEYYY',
      // matAirTime: '',
      // matCodeFreeGoods: '',
      paymentRemark: '',
      installmentTerm: mapInstallmentTerm,
      installmentRate: mapInstallmentRate,
      // mobileAisFlg: '',
      paymentMethod: mapPaymentMethod,
      bankAbbr: mapBankAbb
      // tradeFreeGoodsId: '',
      // matairtimeId: '',
      // tradeDiscountId: '',
      // focCode: '',
      // preBookingNo: '',
      // depositAmt: '',
      // bankCode: ''
    };
  }
  mapCusAddress(addressCus: BillDeliveryAddress): any {
    return {
      addrNo: addressCus.homeNo ? addressCus.homeNo : '',
      moo: addressCus.moo ? addressCus.moo : '',
      mooban: addressCus.mooBan ? addressCus.mooBan : '',
      buildingName: addressCus.buildingName ? addressCus.buildingName : '',
      floor: addressCus.floor ? addressCus.floor : '',
      room: addressCus.room ? addressCus.room : '',
      soi: addressCus.soi ? addressCus.soi : '',
      streetName: addressCus.street ? addressCus.street : '',
      tumbon: addressCus.tumbol ? addressCus.tumbol : '',
      amphur: addressCus.amphur ? addressCus.amphur : '',
      province: addressCus.province ? addressCus.province : '',
      postCode: addressCus.zipCode ? addressCus.zipCode : '',
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
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenService } from 'mychannel-shared-libs';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { User } from 'mychannel-shared-libs';
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
    const product: any = {
      colorCode: 'FEDBD5',
      colorName: 'ROSE GOLD'
    };
    const productDetail: any = {
      model: 'MOCK IPHONE7256',
      brand: 'MOCK APPLE',
      name: 'MOCK IPHONE 7 256GB',
      productType: '',
      productSubtype: ''
    };
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

}

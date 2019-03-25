import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenService } from 'mychannel-shared-libs';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';

@Injectable({
  providedIn: 'root'
})
export class CreateOrderService {

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) { }

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

}

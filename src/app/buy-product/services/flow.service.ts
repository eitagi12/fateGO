import { Injectable } from '@angular/core';
import { ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_VALIDATE_CUSTOMER_ID_CARD_PAGE } from 'src/app/device-order/ais/device-order-ais-new-register/constants/route-path.constant';
import { ROUTE_DEVICE_ONLY_AIS_SELECT_PAYMENT_AND_RECEIPT_INFORMATION_PAGE } from 'src/app/device-only/ais/device-only-ais/constants/route-path.constant';

export interface AddToCart {
  soId: string;
  nextUrl: string;
}
@Injectable({
  providedIn: 'root'
})
export class FlowService {

  constructor() { }

  nextUrl(priceOption: any): Promise<string> {
    return new Promise<string>((resovle, reject) => {
      console.log('PriceOption ::: ', priceOption);

      let nextUrl;
      switch (priceOption.customerGroup.code) {
        case 'MC001': // New register
          nextUrl = ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_VALIDATE_CUSTOMER_ID_CARD_PAGE;
          break;
        case 'MC002': // Pre to Post
        case 'MC003': // MNP
        case 'MC004': // Existing
        default:
          return reject('My Channel flow not implemented.');
      }

      resovle(nextUrl);

    });
  }
}

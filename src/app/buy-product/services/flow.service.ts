import { Injectable } from '@angular/core';
import {
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_VALIDATE_CUSTOMER_ID_CARD_PAGE
} from 'src/app/device-order/ais/device-order-ais-new-register/constants/route-path.constant';
import {
  ROUTE_DEVICE_ORDER_AIS_MNP_VALIDATE_CUSTOMER_ID_CARD_PAGE
} from 'src/app/device-order/ais/device-order-ais-mnp/constants/route-path.constant';
import {
  ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_VALIDATE_CUSTOMER_ID_CARD_PAGE
} from 'src/app/device-order/ais/device-order-ais-existing-prepaid-hotdeal/constants/route-path.constant';
import {
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_VALIDATE_CUSTOMER_PAGE
} from 'src/app/device-order/ais/device-order-ais-pre-to-post/constants/route-path.constant';

export enum CustomerGroup {
  NEW_REGISTER = 'MC001',
  PRE_TO_POST = 'MC002',
  MNP = 'MC003',
  EXISTING = 'MC004'
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
        case CustomerGroup.NEW_REGISTER: // New register
          nextUrl = ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_VALIDATE_CUSTOMER_ID_CARD_PAGE;
          break;
        case CustomerGroup.PRE_TO_POST: // Pre to Post
          nextUrl = ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_VALIDATE_CUSTOMER_PAGE;
          break;
        case CustomerGroup.MNP: // MNP
          nextUrl = ROUTE_DEVICE_ORDER_AIS_MNP_VALIDATE_CUSTOMER_ID_CARD_PAGE;
          break;
        case CustomerGroup.EXISTING: // Existing
          if (priceOption.campaign.code === 'AISHOTDEAL_PREPAID') {
            nextUrl = ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_VALIDATE_CUSTOMER_ID_CARD_PAGE;
          } else {
            // TODO ..
            return reject('My Channel flow not implemented.');
          }
          break;
        default:
          return reject('My Channel flow not implemented.');
      }

      resovle(nextUrl);

    });
  }
}

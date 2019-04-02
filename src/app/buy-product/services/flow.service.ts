import { Injectable } from '@angular/core';
import {
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_VALIDATE_CUSTOMER_ID_CARD_PAGE
} from 'src/app/device-order/ais/device-order-ais-new-register/constants/route-path.constant';
import { ROUTE_DEVICE_ORDER_AIS_MNP_VALIDATE_CUSTOMER_ID_CARD_PAGE } from 'src/app/device-order/ais/device-order-ais-mnp/constants/route-path.constant';
import { ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_VALIDATE_CUSTOMER_ID_CARD_PAGE } from 'src/app/device-order/ais/device-order-ais-existing-prepaid-hotdeal/constants/route-path.constant';
import { ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_VALIDATE_CUSTOMER_PAGE } from 'src/app/device-order/ais/device-order-ais-pre-to-post/constants/route-path.constant';

@Injectable({
  providedIn: 'root'
})
export class FlowService {

  constructor() { }

  nextUrl(priceOption: any): Promise<string> {
    return new Promise<string>((resovle, reject) => {
      console.log('PriceOption ::: ', priceOption);
      console.log(priceOption.customerGroup.code);

      let nextUrl;
      switch (priceOption.customerGroup.code) {
        case 'MC001': // New register
          nextUrl = ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_VALIDATE_CUSTOMER_ID_CARD_PAGE;
          break;
        case 'MC002': // Pre to Post
          nextUrl = ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_VALIDATE_CUSTOMER_PAGE;
          break;
        case 'MC003': // MNP
          console.log('MC003');
          nextUrl = ROUTE_DEVICE_ORDER_AIS_MNP_VALIDATE_CUSTOMER_ID_CARD_PAGE;
          break;
        case 'MC004': // Existing
          if (priceOption.campaign.code && priceOption.campaign.code === 'AISHOTDEAL_PREPAID') {
            nextUrl = ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_VALIDATE_CUSTOMER_ID_CARD_PAGE;
          }
          break;
        default:
          return reject('My Channel flow not implemented.');
      }

      resovle(nextUrl);

    });
  }
}

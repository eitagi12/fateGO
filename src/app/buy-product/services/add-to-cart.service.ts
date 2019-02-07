import { Injectable } from '@angular/core';
import { ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_VALIDATE_CUSTOMER_ID_CARD_PAGE } from 'src/app/device-order/ais/device-order-ais-new-register/constants/route-path.constant';
import { ROUTE_DEVICE_ORDER_AIS_EXISTING_VALIDATE_CUSTOMER_ID_CARD_PAGE } from 'src/app/device-order/ais/device-order-ais-existing/constants/route-path.constant';

@Injectable({
  providedIn: 'root'
})
export class AddToCartService {
  constructor() {}

  reserveStock(campaign: any): Promise<string> {
    return new Promise<string>(resovle => {
      // / relative To
      let nextUrl;
      if (campaign.customerGroup.code === 'MC001') {
        nextUrl = ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_VALIDATE_CUSTOMER_ID_CARD_PAGE;
      }
      if (campaign.customerGroup.code === 'MC002') {
        nextUrl = '';
      }
      if (campaign.customerGroup.code === 'MC003') {
        nextUrl = '';
      }
      if (campaign.customerGroup.code === 'MC004') {
        nextUrl = ROUTE_DEVICE_ORDER_AIS_EXISTING_VALIDATE_CUSTOMER_ID_CARD_PAGE;
      }

      resovle(nextUrl);

    });
  }
}

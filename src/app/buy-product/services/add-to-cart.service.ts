import { Injectable } from '@angular/core';
import { ROUTE_DEVICE_ORDER_AIS_EXISTING_VALIDATE_CUSTOMER_ID_CARD_PAGE } from 'src/app/device-order/ais/device-order-ais-existing/constants/route-path.constant';

@Injectable({
  providedIn: 'root'
})
export class AddToCartService {

  constructor() { }

  reserveStock(): Promise<string> {
    return new Promise<string>((resovle) => {
      // / relative To
      resovle(ROUTE_DEVICE_ORDER_AIS_EXISTING_VALIDATE_CUSTOMER_ID_CARD_PAGE);
    });
  }
}

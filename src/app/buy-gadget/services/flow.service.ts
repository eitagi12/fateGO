import { Injectable } from '@angular/core';
import { ROUTE_DEVICE_ORDER_AIS_GADGET_VALIDATE_CUSTOMER_PAGE } from 'src/app/device-order/ais/device-order-ais-existing-gadget/constants/route-path.constant';

export enum CustomerGroup {
  NEW_REGISTER = 'MC001',
  PRE_TO_POST = 'MC002',
  MNP = 'MC003',
  EXISTING = 'MC004',
  DEVICE_ONLY = 'MC005'
}

@Injectable({
  providedIn: 'root'
})
export class FlowService {

  constructor() { }

  nextUrl(priceOption: any): Promise<string> {
    return new Promise<string>((resovle, reject) => {
      console.log('PriceOption ::: ', priceOption);

      const campaignCode = priceOption.campaign.code;
      const nextUrl = this.getRouterPostPaid(priceOption);
      resovle(nextUrl);
    });
  }

  private getRouterPostPaid(priceOption: any): string {
    switch (priceOption.customerGroup.code) {
      case CustomerGroup.EXISTING:
        return ROUTE_DEVICE_ORDER_AIS_GADGET_VALIDATE_CUSTOMER_PAGE;
      default:
        return '/';
    }
  }
}

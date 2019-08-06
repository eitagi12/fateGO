import { Injectable } from '@angular/core';
import { ROUTE_DEVICE_ORDER_AIS_GADGET_EXISTING_VALIDATE_CUSTOMER_PAGE } from 'src/app/device-order/ais/device-order-ais-existing-gadget/constants/route-path.constant';
import { ROUTE_DEVICE_AIS_DEVICE_PAYMENT_PAGE } from 'src/app/device-order/ais/device-order-ais-device/constants/route-path.constant';
import { ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_VALIDATE_CUSTOMER_PAGE } from 'src/app/device-order/ais/device-order-ais-existing-best-buy-shop/constants/route-path.constant';
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
      let nextUrl;
      if (this.isCampaignBestBuy(priceOption.campaign.code)) {
        nextUrl = this.getRouterBestBuy();
      } else {
        nextUrl = this.getRouterByCustomerGrop(priceOption);
      }
      resovle(nextUrl);

    });
  }

  private getRouterByCustomerGrop(priceOption: any): string {
    switch (priceOption.customerGroup.code) {
      case CustomerGroup.NEW_REGISTER:
        return '';
      case CustomerGroup.PRE_TO_POST:
        return '';
      case CustomerGroup.MNP:
        return '';
      case CustomerGroup.EXISTING:
        return ROUTE_DEVICE_ORDER_AIS_GADGET_EXISTING_VALIDATE_CUSTOMER_PAGE;
      case CustomerGroup.DEVICE_ONLY:
        return ROUTE_DEVICE_AIS_DEVICE_PAYMENT_PAGE;
      default:
        return '/';
    }
  }

  isCampaignBestBuy(campaignCode: string): boolean {
    return campaignCode === 'BEST_BUY_12M';
  }

  private getRouterBestBuy(): string {
    return ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_VALIDATE_CUSTOMER_PAGE;
  }
}

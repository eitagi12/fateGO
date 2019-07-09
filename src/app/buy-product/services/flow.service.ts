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
import {
  ROUTE_DEVICE_ORDER_AIS_EXISTING_VALIDATE_CUSTOMER_ID_CARD_PAGE
} from 'src/app/device-order/ais/device-order-ais-existing/constants/route-path.constant';
import { ROUTE_DEVICE_AIS_DEVICE_PAYMENT_PAGE } from 'src/app/device-order/ais/device-order-ais-device/constants/route-path.constant';

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
      let nextUrl;
      if (this.isCampaignPrepaid(campaignCode)) {
        nextUrl = this.getRouterPrepaid(priceOption);

      } else if (this.isCampaignPrebooking(campaignCode)) {
        return reject('Prebooking not implements.');

      } else if (this.isCampaignBestBuy(campaignCode)) {
        return reject('Best buy not implements.');
      } else {
        nextUrl = this.getRouterPostPaid(priceOption);
      }
      resovle(nextUrl);

    });
  }

  isCampaignBestBuy(campaignCode: string): boolean {
    return campaignCode === 'BEST_BUY_3M';
  }

  isCampaignPrebooking(campaignCode: string): boolean {
    return campaignCode === 'PREBOOKING';
  }

  isCampaignPrepaid(campaignCode: string): boolean {
    return campaignCode === 'AISHOTDEAL_PREPAID';
  }

  private getRouterPostPaid(priceOption: any): string {
    switch (priceOption.customerGroup.code) {
      case CustomerGroup.NEW_REGISTER:
        return ROUTE_DEVICE_AIS_DEVICE_PAYMENT_PAGE;
      case CustomerGroup.PRE_TO_POST:
        return ROUTE_DEVICE_AIS_DEVICE_PAYMENT_PAGE;
      case CustomerGroup.MNP:
        return ROUTE_DEVICE_AIS_DEVICE_PAYMENT_PAGE;
      case CustomerGroup.EXISTING:
        return ROUTE_DEVICE_AIS_DEVICE_PAYMENT_PAGE;
      default:
        return '/';
    }
  }

  private getRouterPrepaid(priceOption: any): string {
    // Allow campaign existing จากการ filter campaign-page.component [getCampaignSliders];
    return ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_VALIDATE_CUSTOMER_ID_CARD_PAGE;
  }
}

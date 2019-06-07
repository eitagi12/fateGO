import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface MobileCareInfo {
  packageKeyRef: string;
  billingSystem: string; // 'IRB'
}

@Injectable({
  providedIn: 'root'
})
export class MobileCareService {

  constructor(
    private http: HttpClient
  ) { }

  /*
  * chargeType = Pre-paid , Post-paid
  */
  getMobileCare(
    mobileCareInfo: MobileCareInfo,
    chargeType: string,
    billingSystem: string,
    endUserPrice: number,
    mobileSegment?: string): Promise<any> {

    return this.http.post('/api/salesportal/promotion-shelves', {
      userId: mobileCareInfo.packageKeyRef
    }).toPromise()
      .then((resp: any) => {
        const data = resp.data.data || [];

        return data.map((mobileCare: any) => {
          return { // group
            id: mobileCare.id,
            title: mobileCare.title,
            icon: (mobileCare.icon || '').replace(/\.jpg$/, ''),
            sanitizedName: mobileCare.sanitizedName,
            items: []
          };
        });

      })
      .then((mobileCares: any[]) => {
        const parameter = [{
          'name': 'billingSystem',
          'value': mobileCareInfo.billingSystem
        }];

        const promotions = [];
        (mobileCares || []).forEach((mobileCare: any) => {
          const pro = this.http.post('/api/salesportal/promotion-shelves/promotion', {
            userId: mobileCareInfo.packageKeyRef,
            sanitizedName: mobileCare.sanitizedName,
            parameters: parameter
          }).toPromise()
            .then((resp: any) => {
              const data = resp.data.data || [];
              const promotionData = data.filter((promotion: any) => {
                const customAttributes: any = promotion.customAttributes;

                // filter bundle pack
                if ((/^Bundle/i).test(customAttributes.offerType)
                  || !(customAttributes.chargeType === 'All' || customAttributes.chargeType === chargeType)) {
                  return false;
                }

                return (customAttributes.billingSystem === billingSystem
                  && +customAttributes.startDevicePrice <= endUserPrice
                  && +customAttributes.endDevicePrice >= endUserPrice);
              })
                .sort((a, b) => {
                  // sort priceInclVat with ascending
                  const priceInclVatA = +a.customAttributes.priceInclVat;
                  const priceInclVatB = +b.customAttributes.priceInclVat;
                  if (priceInclVatA >= 0 && priceInclVatB >= 0) {
                    if (priceInclVatA > priceInclVatB) {
                      return 1;
                    } else if (priceInclVatA < priceInclVatB) {
                      return -1;
                    } else {
                      return 0;
                    }
                  } else {
                    return 0;
                  }
                })
                .sort((a) => a.customAttributes.priceType === 'Recurring' ? 1 : -1);

              mobileCare.items = promotionData.filter((promotion: any) => {
                const packageType: any[] = (promotion.customAttributes.packageType || '').split(',');
                return packageType.filter(pkg => !(/^(Emerald|Gold|Platinum)$/i).test(pkg.trim())).length > 0;
              }).map((promotion: any) => {
                return {
                  id: promotion.id,
                  title: promotion.title,
                  priceExclVat: +promotion.customAttributes.priceExclVat,
                  value: promotion
                };
              });

              mobileCare.itemsSerenade = promotionData.filter((promotion: any) => {
                const packageType: any[] = (promotion.customAttributes.packageType || '').split(',');
                return mobileSegment && packageType.filter(pkg => mobileSegment === pkg.trim()).length > 0;
              }).map((promotion: any) => {
                return {
                  id: promotion.id,
                  title: promotion.title,
                  priceExclVat: +promotion.customAttributes.priceExclVat,
                  value: promotion
                };
              });

            });
          promotions.push(pro);
        });

        return Promise.all(promotions).then(() => mobileCares);
      });

  }

  getMobileCarePrePaid(
    mobileCareInfo: MobileCareInfo,
    chargeType: string,
    billingSystem: string,
    endUserPrice: number,
    mobileSegment?: string): Promise<any> {

    return this.http.post('/api/salesportal/promotion-shelves', {
      userId: mobileCareInfo.packageKeyRef
    }).toPromise()
      .then((resp: any) => {
        const data = resp.data.data || [];

        return data.map((mobileCare: any) => {
          return { // group
            id: mobileCare.id,
            title: mobileCare.title,
            icon: (mobileCare.icon || '').replace(/\.jpg$/, ''),
            sanitizedName: mobileCare.sanitizedName,
            items: []
          };
        });

      })
      .then((mobileCares: any[]) => {
        const parameter = [{
          'name': 'billingSystem',
          'value': mobileCareInfo.billingSystem
        }];

        const promotions = [];
        (mobileCares || []).forEach((mobileCare: any) => {
          const pro = this.http.post('/api/salesportal/promotion-shelves/promotion', {
            userId: mobileCareInfo.packageKeyRef,
            sanitizedName: mobileCare.sanitizedName,
            parameters: parameter
          }).toPromise()
            .then((resp: any) => {
              const data = resp.data.data || [];
              const promotionData = data.filter((promotion: any) => {
                const customAttributes: any = promotion.customAttributes;

                // filter bundle pack
                if ((/^Bundle/i).test(customAttributes.offerType)
                  || !(customAttributes.chargeType === 'All' || customAttributes.chargeType === chargeType)) {
                  return false;
                }

                console.log('customAttributes.chargeType', customAttributes.chargeType);
                console.log('billingSystem', billingSystem);
                console.log('customAttributes.billingSystem', customAttributes.billingSystem);

                const isbillingSystem: any = customAttributes.billingSystem.includes(billingSystem);

                return (isbillingSystem
                  && +customAttributes.startDevicePrice <= endUserPrice
                  && +customAttributes.endDevicePrice >= endUserPrice);

              })
                .sort((a, b) => {
                  // sort priceInclVat with ascending
                  const priceInclVatA = +a.customAttributes.priceInclVat;
                  const priceInclVatB = +b.customAttributes.priceInclVat;
                  if (priceInclVatA >= 0 && priceInclVatB >= 0) {
                    if (priceInclVatA > priceInclVatB) {
                      return 1;
                    } else if (priceInclVatA < priceInclVatB) {
                      return -1;
                    } else {
                      return 0;
                    }
                  } else {
                    return 0;
                  }
                })
                .sort((a) => a.customAttributes.priceType === 'Recurring' ? 1 : -1);

              mobileCare.items = promotionData.filter((promotion: any) => {
                const packageType: any[] = (promotion.customAttributes.packageType || '').split(',');
                return packageType.filter(pkg => !(/^(Emerald|Gold|Platinum)$/i).test(pkg.trim())).length > 0;
              }).map((promotion: any) => {
                return {
                  id: promotion.id,
                  title: promotion.title,
                  priceExclVat: +promotion.customAttributes.priceExclVat,
                  value: promotion
                };
              });

              mobileCare.itemsSerenade = promotionData.filter((promotion: any) => {
                const packageType: any[] = (promotion.customAttributes.packageType || '').split(',');
                return mobileSegment && packageType.filter(pkg => mobileSegment === pkg.trim()).length > 0;
              }).map((promotion: any) => {
                return {
                  id: promotion.id,
                  title: promotion.title,
                  priceExclVat: +promotion.customAttributes.priceExclVat,
                  value: promotion
                };
              });

            });
          promotions.push(pro);
        });

        return Promise.all(promotions).then(() => mobileCares);
      });

  }
}

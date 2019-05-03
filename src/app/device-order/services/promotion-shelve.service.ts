import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChargeType } from 'mychannel-shared-libs';

export interface PromotionShelveInfo {
  packageKeyRef: string;
  orderType: string; // 'New Registration';
  billingSystem?: string; // 'IRB'
}

@Injectable({
  providedIn: 'root'
})
export class PromotionShelveService {

  constructor(
    private http: HttpClient
  ) { }

  getPromotionShelve(
    promotionShelveInfo: PromotionShelveInfo,
    minimumPackagePrice: number = 0,
    maximumPackagePrice: number = 0): Promise<any> {
    return this.http.post('/api/salesportal/promotion-shelves', {
      userId: promotionShelveInfo.packageKeyRef
    }).toPromise()
      .then((resp: any) => {

        const data = resp.data.data || [];
        return data.map((promotionShelve: any) => {
          return {
            title: promotionShelve.title,
            icon: promotionShelve.icon,
            promotions: promotionShelve.subShelves
              .sort((a, b) => a.priority !== b.priority ? a.priority < b.priority ? -1 : 1 : 0)
              .map((subShelve: any) => {
                return { // group
                  id: subShelve.id,
                  title: subShelve.title,
                  sanitizedName: subShelve.sanitizedName,
                  condition: subShelve.conditionCode,
                  items: []
                };
              })
          };
        });

      })
      .then((promotionShelves: any) => {
        const parameter = [{
          'name': 'orderType',
          'value': promotionShelveInfo.orderType
        }];

        if (promotionShelveInfo.billingSystem) {
          parameter.push({
            'name': 'billingSystem',
            'value': promotionShelveInfo.billingSystem
          });
        }

        const promotions = [];
        (promotionShelves || []).forEach((promotionShelve: any) => {

          (promotionShelve.promotions || []).forEach((promotion: any) => {
            const pro = this.http.post('/api/salesportal/promotion-shelves/promotion', {
              userId: promotionShelveInfo.packageKeyRef,
              sanitizedName: promotion.sanitizedName,
              parameters: parameter
            }).toPromise()
              .then((resp: any) => {
                const data = resp.data.data || [];
                promotion.items = data.filter((promotionData: any) => {
                  return promotionData.customAttributes.chargeType === ChargeType.POST_PAID &&
                    minimumPackagePrice <= +promotionData.customAttributes.priceExclVat &&
                    (maximumPackagePrice > 0 ? maximumPackagePrice >= +promotionData.customAttributes.priceExclVat : true);
                }).sort((a, b) => {
                  return +a.customAttributes.priceInclVat !== +b.customAttributes.priceInclVat ?
                    +a.customAttributes.priceInclVat < +b.customAttributes.priceInclVat ? -1 : 1 : 0;
                }).map((promotionData: any) => {
                  const uniqueId = `${promotion.id}-${promotionData.id}`;
                  promotionData.uniqueId = uniqueId;
                  return { // item
                    id: uniqueId,
                    title: promotionData.title,
                    detail: promotionData.detailTH,
                    value: promotionData
                  };
                });
              });

            promotions.push(pro);
          });

        });

        return Promise.all(promotions).then(() => {
          (promotionShelves || []).forEach((promotionShelve: any) => {
            promotionShelve.promotions = (promotionShelve.promotions || []).filter((promomotion: any) => {
              return (promomotion.items || []).length > 0;
            });
          });
          return promotionShelves;
        });
      });
  }

  defaultBySelected(promotionShelves: any = [], promotionShelveSelected?: any): any[] {
    if (!promotionShelves || promotionShelves.length <= 0) {
      return;
    }

    if (promotionShelveSelected) {
      promotionShelves.forEach(promotionShelve => {
        promotionShelve.promotions.forEach(promotion => {

          (promotion.items || []).forEach((promotionShelveItem: any) => {
            if (promotionShelveItem.value.uniqueId === promotionShelveSelected.uniqueId) {
              promotionShelve.active = true;
              promotion.active = true;
            }
          });

        });
      });

    } else {
      promotionShelves[0].active = true;
      promotionShelves.forEach((promotionShelve: any) => {
        if (promotionShelve.promotions && promotionShelve.promotions.length > 0) {
          promotionShelve.promotions[0].active = true;

        }
      });
    }
    return promotionShelves;
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, MobileCare, PageLoadingService, MobileCareGroup } from 'mychannel-shared-libs';
import {
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_CONFIRM_USER_INFORMATION_PAGE,
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_SUMMARY_PAGE
} from 'src/app/device-order/ais/device-order-ais-new-register/constants/route-path.constant';
import { HttpClient } from '@angular/common/http';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';

@Component({
  selector: 'app-device-order-ais-new-register-mobile-care-page',
  templateUrl: './device-order-ais-new-register-mobile-care-page.component.html',
  styleUrls: ['./device-order-ais-new-register-mobile-care-page.component.scss']
})
export class DeviceOrderAisNewRegisterMobileCarePageComponent implements OnInit, OnDestroy {

  wizards = WIZARD_DEVICE_ORDER_AIS;

  priceOption: PriceOption;
  transaction: Transaction;
  mobileCare: MobileCare;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private priceOptionService: PriceOptionService,
    private transactionService: TransactionService,
    private pageLoadingService: PageLoadingService,
    private http: HttpClient
  ) {
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();
  }

  ngOnInit() {
    delete this.transaction.data.mobileCarePackage;
    // this.callService();
  }

  onBack() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_CONFIRM_USER_INFORMATION_PAGE]);
  }

  onNext() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_SUMMARY_PAGE]);
  }

  onHome() {
    this.homeService.goToHome();
  }

  onCompleted(mobileCare: any) {
    this.transaction.data.mobileCarePackage = mobileCare;
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

  callService() {
    // this.mobileCare = {
    //   campaignPrice: +this.priceOption.trade.normalPrice
    // };

    this.pageLoadingService.openLoading();

    const packageKeyRef = '1vP1Qbr1T6svJISttRAoZ0y95OsYxxh7bUnfMOAV8LmjpsVStlifT3fquoatH2JUz4LpfsD4tVY2p0LR'
    const chargeType = this.transaction.data.mainPackage['customAttributes'].billingSystem;
    const billingSystem = this.transaction.data.simCard.billingSystem || 'IRB';
    const endUserPrice = +this.priceOption.trade.normalPrice;

    // new ไม่ต้อง check moblie segment
    this.http.post('/api/salesportal/promotion-shelves', {
      userId: packageKeyRef
    }).toPromise()
      .then((resp: any) => {
        const data = resp.data.data || [];

        const mobileCareGroups: MobileCareGroup[] = data.map((mobileCare: any) => {
          return { // group
            id: mobileCare.id,
            title: mobileCare.title,
            icon: (mobileCare.icon || '').replace(/\.jpg$/, ''),
            sanitizedName: mobileCare.sanitizedName
          };
        });
        return Promise.resolve(mobileCareGroups);
      })
      .then((mobileCareGroups: MobileCareGroup[]) => {
        this.mobileCare.promotions = mobileCareGroups;

        const parameter = [{
          'name': 'billingSystem',
          'value': 'IRB'
        }];

        let promiseAll = mobileCareGroups.map((promotion: MobileCareGroup) => {

          return this.http.post('/api/salesportal/promotion-shelves/promotion', {
            userId: packageKeyRef,
            sanitizedName: promotion.sanitizedName,
            parameters: parameter
          }).toPromise().then((resp: any) => {
            const data = resp.data.data || [];

            // reference object
            const promotions = data.filter((promotion: any) => {
              const customAttributes: any = promotion.customAttributes;

              if ((/^Bundle/i).test(customAttributes.offerType)
                || !(customAttributes.chargeType === 'All' || customAttributes.chargeType === chargeType)) {
                return false;
              }

              return (customAttributes.billingSystem === billingSystem
                && +customAttributes.startDevicePrice <= endUserPrice
                && +customAttributes.endDevicePrice >= endUserPrice);
            }).sort((a, b) => {
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
              .sort((a) => a.customAttributes.priceType === 'Recurring' ? 1 : -1)
            // sort priceType 'Recurring' first

            promotion.items = promotions.filter((promotion: any) => {
              const packageType: any[] = (promotion.customAttributes.packageType || '').split(',');
              return packageType.filter(pkg => !(/^(Emerald|Gold|Platinum)$/i).test(pkg.trim())).length > 0;
            }).map((promotion: any) => {
              return {
                id: promotion.id,
                title: promotion.title,
                priceExclVat: +promotion.customAttributes.priceExclVat,
                value: promotion
              }
            });

            const mobileSegment = '';
            promotion.itemsSerenade = promotions.filter((promotion: any) => {
              const packageType: any[] = (promotion.customAttributes.packageType || '').split(',');
              return mobileSegment && packageType.filter(pkg => mobileSegment == pkg.trim()).length > 0;
            }).map((promotion: any) => {
              return {
                id: promotion.id,
                title: promotion.title,
                priceExclVat: +promotion.customAttributes.priceExclVat,
                value: promotion
              }
            });

          });
        });

        Promise.all(promiseAll).then(() => {
          if (this.mobileCare.promotions && this.mobileCare.promotions.length > 0) {
            this.mobileCare.promotions[0].active = true;
          }
        })
          .then(() => {
            this.pageLoadingService.closeLoading();
          });

      });
  }
}

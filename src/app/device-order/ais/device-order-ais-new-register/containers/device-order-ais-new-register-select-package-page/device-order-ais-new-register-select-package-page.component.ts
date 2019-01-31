import { Component, OnInit, OnDestroy } from '@angular/core';
import { PromotionShelve, HomeService, PageLoadingService, PromotionShelveGroup, ShoppingCart } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import {
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_BY_PATTERN_PAGE,
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_VERIFY_INSTANT_SIM_PAGE,
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_CONFIRM_USER_INFORMATION_PAGE
} from 'src/app/device-order/ais/device-order-ais-new-register/constants/route-path.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { ShoppingCartService } from 'src/app/device-order/ais/device-order-ais-new-register/service/shopping-cart.service';

@Component({
  selector: 'app-device-order-ais-new-register-select-package-page',
  templateUrl: './device-order-ais-new-register-select-package-page.component.html',
  styleUrls: ['./device-order-ais-new-register-select-package-page.component.scss']
})
export class DeviceOrderAisNewRegisterSelectPackagePageComponent implements OnInit, OnDestroy {

  wizards = WIZARD_DEVICE_ORDER_AIS;

  priceOption: PriceOption;
  transaction: Transaction;
  promotionShelves: PromotionShelve[];
  shoppingCart: ShoppingCart;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private pageLoadingService: PageLoadingService,
    private priceOptionService: PriceOptionService,
    private transactionService: TransactionService,
    private http: HttpClient,
    private shoppingCartService: ShoppingCartService,
  ) {
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();
  }

  ngOnInit() {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    delete this.transaction.data.mainPackage;
    this.callService();
  }

  onCompleted(promotion) {
    // รอแก้ไขตัวแปรที่จะเก็บลงใน share transaction
    this.transaction.data.mainPackage = promotion;
  }

  onBack() {
    if (this.transaction.data.simCard.simSerial) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_VERIFY_INSTANT_SIM_PAGE]);
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_BY_PATTERN_PAGE]);
    }
  }

  onNext() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_CONFIRM_USER_INFORMATION_PAGE]);
  }

  onHome() {
    this.homeService.goToHome();
  }

  callService() {
    this.pageLoadingService.openLoading();
    const packageKeyRef = this.priceOption.trade.packageKeyRef;
    this.http.post('/api/salesportal/promotion-shelves', {
      userId: packageKeyRef
    }).toPromise()
      .then((resp: any) => {
        const data = resp.data.data || [];
        const promotionShelves: PromotionShelve[] = data.map((promotionShelve: any) => {
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
                  items: []
                };
              })
          }
        });
        return Promise.resolve(promotionShelves);
      })
      .then((promotionShelves: PromotionShelve[]) => {
        const parameter = [{
          'name': 'orderType',
          'value': 'New Registration'
        }, {
          'name': 'billingSystem',
          'value': 'IRB'
        }];

        const promiseAll = [];
        promotionShelves.forEach((promotionShelve: PromotionShelve) => {
          const promise = promotionShelve.promotions.map((promotion: PromotionShelveGroup) => {
            return this.http.post('/api/salesportal/promotion-shelves/promotion', {
              userId: packageKeyRef,
              sanitizedName: promotion.sanitizedName,
              parameters: parameter
            }).toPromise().then((resp: any) => {
              const data = resp.data.data || [];
              const campaign: any = this.priceOption.campaign;
              const minimumPackagePrice = +campaign.minimumPackagePrice;
              const maxinumPackagePrice = +campaign.maxinumPackagePrice;

              // reference object
              promotion.items = data.filter((promotion: any) => {
                return promotion.customAttributes.chargeType === 'Post-paid' &&
                  minimumPackagePrice <= +promotion.customAttributes.priceExclVat &&
                  (maxinumPackagePrice > 0 ? maxinumPackagePrice >= +promotion.customAttributes.priceExclVat : true);
              })
                .sort((a, b) => {
                  return +a.customAttributes.priceInclVat !== +b.customAttributes.priceInclVat ?
                    +a.customAttributes.priceInclVat < +b.customAttributes.priceInclVat ? -1 : 1 : 0;
                }).map((promotion: any) => {
                  return { // item
                    id: promotion.id,
                    title: promotion.title,
                    detail: promotion.detailTH,
                    value: promotion
                  };
                });
            });
          });
          promiseAll.concat(promise);
        });

        Promise.all(promiseAll).then(() => {
          // console.log(promotionShelves);
          this.promotionShelves = promotionShelves;
          if (this.promotionShelves && this.promotionShelves.length > 0) {
            this.promotionShelves[0].active = true;
            if (this.promotionShelves[0].promotions && this.promotionShelves[0].promotions.length > 0) {
              this.promotionShelves[0].promotions[0].active = true;
            }
          }
        });

      })
      .then(() => {
        this.pageLoadingService.closeLoading();
      });
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}

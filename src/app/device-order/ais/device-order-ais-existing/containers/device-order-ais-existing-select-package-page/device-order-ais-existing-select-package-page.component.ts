import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { PromotionShelve, HomeService, PageLoadingService, AlertService, PromotionShelveItem, PromotionShelveGroup, ShoppingCart } from 'mychannel-shared-libs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient } from '@angular/common/http';
import { ROUTE_DEVICE_ORDER_AIS_EXISTING_PAYMENT_DETAIL_PAGE, ROUTE_DEVICE_ORDER_AIS_EXISTING_EFFECTIVE_START_DATE_PAGE } from '../../constants/route-path.constant';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';

@Component({
  selector: 'app-device-order-ais-existing-select-package-page',
  templateUrl: './device-order-ais-existing-select-package-page.component.html',
  styleUrls: ['./device-order-ais-existing-select-package-page.component.scss']
})
export class DeviceOrderAisExistingSelectPackagePageComponent implements OnInit, OnDestroy {

  @ViewChild('conditionTemplate')
  conditionTemplate: any;

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;

  transaction: Transaction;
  priceOption: PriceOption;
  promotionShelves: PromotionShelve[];
  condition: any;
  modalRef: BsModalRef;
  shoppingCart: ShoppingCart;

  constructor(
    private router: Router,
    private http: HttpClient,
    private homeService: HomeService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private shoppingCartService: ShoppingCartService
  ) {
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();

    delete this.transaction.data.mainPackageOneLove;
    if (this.transaction.data.billingInformation) {
      delete this.transaction.data.billingInformation.billCycle;
      delete this.transaction.data.billingInformation.mergeBilling;
    }
  }

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    this.callService();
  }

  onTermConditions(event: any): void {}

  onCompleted(promotion: any): void {
    // รอแก้ไขตัวแปรที่จะเก็บลงใน share transaction
    this.transaction.data.mainPackage = promotion;
  }

  onBack(): void {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_PAYMENT_DETAIL_PAGE]);
  }

  onNext(): void {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_EFFECTIVE_START_DATE_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  callService(): void {
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
          };
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
              promotion.items = data.filter((promotions: any) => {
                return promotions.customAttributes.chargeType === 'Post-paid' &&
                  minimumPackagePrice <= +promotions.customAttributes.priceExclVat &&
                  (maxinumPackagePrice > 0 ? maxinumPackagePrice >= +promotions.customAttributes.priceExclVat : true);
              })
                .sort((a, b) => {
                  return +a.customAttributes.priceInclVat !== +b.customAttributes.priceInclVat ?
                    +a.customAttributes.priceInclVat < +b.customAttributes.priceInclVat ? -1 : 1 : 0;
                }).map((promotionmap: any) => {
                  return { // item
                    id: promotionmap.id,
                    title: promotionmap.title,
                    detail: promotionmap.detailTH,
                    value: promotionmap
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

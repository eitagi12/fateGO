import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Transaction, ExistingMobileCare } from 'src/app/shared/models/transaction.model';
import { PromotionShelve, ShoppingCart, HomeService, PageLoadingService, BillingSystemType, AlertService, PromotionShelveGroup } from 'mychannel-shared-libs';
import { BsModalRef } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { PromotionShelveService } from 'src/app/device-order/services/promotion-shelve.service';
import { HttpClient } from '@angular/common/http';
import { ROUTE_DEVICE_ORDER_AIS_MNP_EFFECTIVE_START_DATE_PAGE, ROUTE_DEVICE_ORDER_AIS_MNP_PAYMENT_DETAIL_PAGE, ROUTE_DEVICE_ORDER_AIS_MNP_MOBILE_CARE_PAGE, ROUTE_DEVICE_ORDER_AIS_MNP_NEW_BILLING_ACCOUNT_PAGE, ROUTE_DEVICE_ORDER_AIS_MNP_MOBILE_CARE_AVALIBLE_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-mnp-select-package-page',
  templateUrl: './device-order-ais-mnp-select-package-page.component.html',
  styleUrls: ['./device-order-ais-mnp-select-package-page.component.scss']
})
export class DeviceOrderAisMnpSelectPackagePageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;

  @ViewChild('conditionTemplate')
  conditionTemplate: any;

  priceOption: PriceOption;
  transaction: Transaction;
  promotionShelves: PromotionShelve[];
  shoppingCart: ShoppingCart;

  showSelectCurrentPackage: boolean;
  selectCurrentPackage: boolean;
  showCurrentPackage: boolean;

  condition: any;
  modalRef: BsModalRef;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private pageLoadingService: PageLoadingService,
    private priceOptionService: PriceOptionService,
    private transactionService: TransactionService,
    private shoppingCartService: ShoppingCartService,
    private promotionShelveService: PromotionShelveService,
    private http: HttpClient,
  ) {
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();

    delete this.transaction.data.mainPackageOneLove;
    if (this.transaction.data.billingInformation) {
      delete this.transaction.data.billingInformation.billCycle;
      delete this.transaction.data.billingInformation.mergeBilling;
    }
    if (this.isNotMathHotDeal && !this.advancePay) {
      this.showCurrentPackage = true;
    }
    if ((this.priceOption && this.priceOption.privilege && this.priceOption.privilege.minimumPackagePrice) <=
      (this.transaction.data && this.transaction.data.currentPackage && this.transaction.data.currentPackage.priceExclVat)) {
      this.showSelectCurrentPackage = true;
    }
  }

  get advancePay(): any {
    return this.priceOption.trade.advancePay && this.priceOption.trade.advancePay.amount || 0;
  }

  get isNotMathHotDeal(): boolean {
    return !this.priceOption.campaign.campaignName.match(/\b(\w*Hot\s+Deal\w*)\b/);
  }

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    this.callService();
  }

  onCompleted(promotion: any): void {
    // รอแก้ไขตัวแปรที่จะเก็บลงใน share transaction
    this.selectCurrentPackage = false;
    this.transaction.data.mainPackage = promotion;
  }

  onClickCurrentPackage(): void {
    this.selectCurrentPackage = true;
    this.transaction.data.mainPackage = null;
    this.promotionShelves[0].promotions.forEach((promotion: any) => promotion.active = false);
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_PAYMENT_DETAIL_PAGE]);
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    const mobileNo = this.transaction.data.simCard.mobileNo;
    this.http.get(`/api/customerportal/get-existing-mobile-care/${mobileNo}`).toPromise().then((response: any) => {
      const exMobileCare = response.data;
      if (exMobileCare.hasExistingMobileCare) {
        const existingMobileCare: ExistingMobileCare = exMobileCare.existMobileCarePackage;
        existingMobileCare.handSet = exMobileCare.existHandSet;
        this.transaction.data.existingMobileCare = existingMobileCare;
        if (this.selectCurrentPackage) {
          this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_MOBILE_CARE_AVALIBLE_PAGE]);
        } else {
          this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_EFFECTIVE_START_DATE_PAGE]);
        }
      } else {
        this.transaction.data.existingMobileCare = null;
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_EFFECTIVE_START_DATE_PAGE]);
      }
    }).then(() => this.pageLoadingService.closeLoading());
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

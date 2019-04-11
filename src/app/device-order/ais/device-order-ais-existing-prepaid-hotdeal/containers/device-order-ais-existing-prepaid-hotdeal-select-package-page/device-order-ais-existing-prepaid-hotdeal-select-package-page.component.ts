import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, ShoppingCart, PromotionShelve, PageLoadingService, BillingSystemType } from 'mychannel-shared-libs';
import {
  ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_PAYMENT_DETAIL_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_MOBILE_CARE_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_MOBILE_CARE_AVAILABLE_PAGE
} from '../../constants/route-path.constant';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Transaction, ExistingMobileCare } from 'src/app/shared/models/transaction.model';
import { BsModalRef } from 'ngx-bootstrap';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PromotionShelveService } from 'src/app/device-order/services/promotion-shelve.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-device-order-ais-existing-prepaid-hotdeal-select-package-page',
  templateUrl: './device-order-ais-existing-prepaid-hotdeal-select-package-page.component.html',
  styleUrls: ['./device-order-ais-existing-prepaid-hotdeal-select-package-page.component.scss']
})
export class DeviceOrderAisExistingPrepaidHotdealSelectPackagePageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;

  @ViewChild('conditionTemplate')
  conditionTemplate: any;

  priceOption: PriceOption;
  transaction: Transaction;
  promotionShelves: PromotionShelve[];
  shoppingCart: ShoppingCart;

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
  }

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    delete this.transaction.data.onTopPackage;
    this.callService();
  }

  onCompleted(promotion: any): void {
    this.transaction.data.onTopPackage = promotion;
  }

  callService(): void {
    this.pageLoadingService.openLoading();

    const trade: any = this.priceOption.trade;
    const campaign: any = this.priceOption.campaign;
    const privilege: any = this.priceOption.privilege;
    const simcard = this.transaction.data.simCard;

    this.http.get('/api/customerportal/newRegister/queryOnTopPackage', {
      params: {
        orderType: 'Change Promotion',
        billingSystem: BillingSystemType.IRB,
        chargeType: simcard.chargeType,
        allowNtype: simcard.nType,
        cpcUserId: trade.packageKeyRef || campaign.packageKeyRef
      }
    }).toPromise()
    .then((resp: any) => {
      const data = resp.data.packageList || [];
      const promotionShelves: PromotionShelve[] = data.map((promotionShelve: any) => {
        return {
          title: promotionShelve.title,
          // replace to class in css
          icon: (promotionShelve.icon || '').replace(/\.jpg$/, '').replace(/_/g, '-'),
          promotions: promotionShelve.subShelves
            .map((subShelve: any) => {
              return { // group
                id: subShelve.subShelveId,
                title: subShelve.title,
                sanitizedName: subShelve.sanitizedName,
                items: (subShelve.items || []).map((promotion: any) => {
                  return { // item
                    id: promotion.itemId,
                    title: promotion.shortNameThai,
                    detail: promotion.statementThai,
                    value: promotion
                  };
                })
              };
            })
        };
      });
      return Promise.resolve(promotionShelves);
    }).then((promotionShelves: PromotionShelve[]) => {
      this.promotionShelves = promotionShelves;
      if (this.promotionShelves && this.promotionShelves.length > 0) {
        this.promotionShelves[0].active = true;
        if (this.promotionShelves[0].promotions && this.promotionShelves[0].promotions.length > 0) {
          this.promotionShelves[0].promotions[0].active = true;
        }
      }
    }).then(() => {
      this.pageLoadingService.closeLoading();
    });
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    const mobileNo = this.transaction.data.simCard.mobileNo;
    this.http.get(`/api/customerportal/get-existing-mobile-care/${mobileNo}`).toPromise().then((response: any) => {
      this.pageLoadingService.closeLoading();
      const exMobileCare = response.data;
      if (exMobileCare.hasExistingMobileCare) {
        const existingMobileCare: ExistingMobileCare = exMobileCare.existMobileCarePackage;
        existingMobileCare.handSet = exMobileCare.existHandSet;
        this.transaction.data.existingMobileCare = existingMobileCare;
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_MOBILE_CARE_AVAILABLE_PAGE]);
      } else {
        this.transaction.data.existingMobileCare = null;
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_MOBILE_CARE_PAGE]);
      }
    })
    .catch(() => {
      this.pageLoadingService.closeLoading();
      this.transaction.data.existingMobileCare = null;
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_MOBILE_CARE_PAGE]);
    });
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_PAYMENT_DETAIL_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

}

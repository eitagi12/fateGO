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

  transaction: Transaction;
  priceOption: PriceOption;
  promotionShelves: PromotionShelve[];
  condition: any;
  selectCurrentPackage: boolean;
  showSelectCurrentPackage: boolean;
  showCurrentPackage: boolean;
  modalRef: BsModalRef;
  shoppingCart: ShoppingCart;
  isContractFirstPack: number;

  constructor(
    private router: Router,
    private http: HttpClient,
    private homeService: HomeService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private shoppingCartService: ShoppingCartService,
    private promotionShelveService: PromotionShelveService
  ) {
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();

    delete this.transaction.data.mainPackageOneLove;

    if (this.transaction.data.billingInformation) {
      delete this.transaction.data.billingInformation.billCycle;
      delete this.transaction.data.billingInformation.mergeBilling;
    }

    const contract = this.transaction.data.contractFirstPack || {};
    const priceExclVat = this.transaction.data.currentPackage && this.transaction.data.currentPackage.priceExclVat || 0;
    this.isContractFirstPack = Math.max(contract.firstPackage || 0, contract.minPrice || 0, contract.initialPackage || 0);

    if (!this.mathHotDeal && !this.advancePay) {
      this.showCurrentPackage = true;
    }

    if (this.priceOption.privilege.minimumPackagePrice <= priceExclVat) {
      this.showSelectCurrentPackage = true;
    }
  }

  get advancePay(): boolean {
    return !!((this.priceOption.trade.advancePay && this.priceOption.trade.advancePay.amount || 0) > 0);
  }

  get mathHotDeal(): boolean {
    return !!this.priceOption.campaign.campaignName.match(/\b(\w*Hot\s+Deal\w*)\b/);
  }

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    if (this.transaction.data.promotionsShelves) {

      this.promotionShelves = this.promotionShelveService
      .defaultBySelected(this.transaction.data.promotionsShelves, this.transaction.data.mainPackage);

      if (this.showCurrentPackage) {
        this.promotionShelves[0].promotions[0].active = false;
      }

    } else {
      this.callService();
    }
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
      const exMobileCare = response.data || {};

      if (exMobileCare.hasExistingMobileCare) {
        const existingMobileCare: ExistingMobileCare = exMobileCare.existMobileCarePackage;
        existingMobileCare.handSet = exMobileCare.existHandSet;
        this.transaction.data.existingMobileCare = existingMobileCare;
      }

      if (this.selectCurrentPackage) {
        if (exMobileCare.hasExistingMobileCare) {
          this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_MOBILE_CARE_AVALIBLE_PAGE]);
        } else {
          this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_EFFECTIVE_START_DATE_PAGE]);
        }
      } else {
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_EFFECTIVE_START_DATE_PAGE]);
      }

    }).then(() => this.pageLoadingService.closeLoading());
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  callService(): void {
    this.pageLoadingService.openLoading();
    const trade: any = this.priceOption.trade;
    const privilege: any = this.priceOption.privilege;
    const billingSystem = (this.transaction.data.simCard.billingSystem === 'RTBS')
    ? BillingSystemType.IRB : this.transaction.data.simCard.billingSystem || BillingSystemType.IRB;

    this.promotionShelveService.getPromotionShelve(
      {
        packageKeyRef: trade.packageKeyRef,
        orderType: `Change Service`,
        billingSystem: billingSystem
      },
      +privilege.minimumPackagePrice, +privilege.maxinumPackagePrice)
      .then((promotionShelves: any) => {
        this.promotionShelves = this.promotionShelveService.defaultBySelected(promotionShelves, this.transaction.data.mainPackage);
      })
      .then(() => this.pageLoadingService.closeLoading());
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}

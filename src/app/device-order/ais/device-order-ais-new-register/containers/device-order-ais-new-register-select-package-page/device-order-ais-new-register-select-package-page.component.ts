import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap';
import {
  PromotionShelve, HomeService, PageLoadingService, ShoppingCart, BillingSystemType
} from 'mychannel-shared-libs';
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
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { PromotionShelveService } from 'src/app/device-order/services/promotion-shelve.service';

@Component({
  selector: 'app-device-order-ais-new-register-select-package-page',
  templateUrl: './device-order-ais-new-register-select-package-page.component.html',
  styleUrls: ['./device-order-ais-new-register-select-package-page.component.scss']
})
export class DeviceOrderAisNewRegisterSelectPackagePageComponent implements OnInit, OnDestroy {

  wizards = WIZARD_DEVICE_ORDER_AIS;

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
    private promotionShelveService: PromotionShelveService
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

    const campaign: any = this.priceOption.campaign;
    this.promotionShelveService.getPromotionShelve(
      {
        packageKeyRef: campaign.packageKeyRef,
        orderType: 'New Registration',
        billingSystem: BillingSystemType.IRB
      },
      +campaign.minimumPackagePrice, +campaign.maxinumPackagePrice)
      .then((promotionShelves: any) => {
        this.promotionShelves = this.promotionShelveService.defaultBySelected(promotionShelves, this.transaction.data.mainPackage);
      })
      .then(() => this.pageLoadingService.closeLoading());
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}

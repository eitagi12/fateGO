import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap';
import {
  PromotionShelve, HomeService, PageLoadingService, ShoppingCart, BillingSystemType
} from 'mychannel-shared-libs';
import { WIZARD_DEVICE_ORDER_AIS } from '../../../../constants/wizard.constant';
import {
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_CONFIRM_USER_INFORMATION_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_CURRENT_INFO_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_PAYMENT_DETAIL_PAGE
} from '../../constants/route-path.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { PromotionShelveService } from 'src/app/device-order/services/promotion-shelve.service';

@Component({
  selector: 'app-device-order-ais-pre-to-post-select-package-page',
  templateUrl: './device-order-ais-pre-to-post-select-package-page.component.html',
  styleUrls: ['./device-order-ais-pre-to-post-select-package-page.component.scss']
})
export class DeviceOrderAisPreToPostSelectPackagePageComponent implements OnInit, OnDestroy {

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
    private promotionShelveService: PromotionShelveService
  ) {
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    delete this.transaction.data.mainPackage;
    this.callService();
  }

  onCompleted(promotion: any): void {
    // รอแก้ไขตัวแปรที่จะเก็บลงใน share transaction
    this.transaction.data.mainPackage = promotion;
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_PAYMENT_DETAIL_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_CONFIRM_USER_INFORMATION_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  callService(): void {
    this.pageLoadingService.openLoading();

    const trade: any = this.priceOption.trade;
    const privilege: any = this.priceOption.privilege;

    this.promotionShelveService.getPromotionShelve(
      {
        packageKeyRef: trade.packageKeyRef || privilege.packageKeyRef,
        orderType: 'Change Charge Type',
        billingSystem: BillingSystemType.IRB
      },
      +privilege.minimumPackagePrice, +privilege.maximumPackagePrice)
      .then((promotionShelves: any) => {
        this.promotionShelves = this.promotionShelveService.defaultBySelected(promotionShelves, this.transaction.data.mainPackage);
      })
      .then(() => this.pageLoadingService.closeLoading());
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}

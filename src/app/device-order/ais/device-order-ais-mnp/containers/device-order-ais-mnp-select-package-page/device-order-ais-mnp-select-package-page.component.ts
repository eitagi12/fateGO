import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { PromotionShelve, ShoppingCart, HomeService, PageLoadingService, BillingSystemType } from 'mychannel-shared-libs';
import { BsModalRef } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { PromotionShelveService } from 'src/app/device-order/services/promotion-shelve.service';
import { ROUTE_DEVICE_ORDER_AIS_MNP_VERIFY_INSTANT_SIM_PAGE, ROUTE_DEVICE_ORDER_AIS_MNP_BY_PATTERN_PAGE, ROUTE_DEVICE_ORDER_AIS_MNP_CONFIRM_USER_INFORMATION_PAGE } from '../../constants/route-path.constant';

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
    if (this.transaction.data.simCard.simSerial) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_VERIFY_INSTANT_SIM_PAGE]);
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_BY_PATTERN_PAGE]);
    }
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_CONFIRM_USER_INFORMATION_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  callService(): void {
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

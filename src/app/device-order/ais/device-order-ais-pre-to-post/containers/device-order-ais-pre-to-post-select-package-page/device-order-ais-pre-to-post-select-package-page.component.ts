
import { OnDestroy, OnInit, Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { PromotionShelve, HomeService, PageLoadingService, AlertService, PromotionShelveItem, ShoppingCart, BillingSystemType } from 'mychannel-shared-libs';
import * as moment from 'moment';

import { WIZARD_DEVICE_ORDER_AIS } from '../../../../constants/wizard.constant';
import {
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_CONFIRM_USER_INFORMATION_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_CURRENT_INFO_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_PAYMENT_DETAIL_PAGE
} from '../../constants/route-path.constant';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction, TransactionAction } from 'src/app/shared/models/transaction.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { PromotionShelveService } from 'src/app/device-order/services/promotion-shelve.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';

@Component({
  selector: 'app-device-order-ais-pre-to-post-select-package-page',
  templateUrl: './device-order-ais-pre-to-post-select-package-page.component.html',
  styleUrls: ['./device-order-ais-pre-to-post-select-package-page.component.scss']
})
export class DeviceOrderAisPreToPostSelectPackagePageComponent implements OnInit, OnDestroy {

  @ViewChild('conditionTemplate')
  conditionTemplate: any;

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;

  priceOption: PriceOption;
  transaction: Transaction;
  promotionShelves: PromotionShelve[];
  condition: any;
  modalRef: BsModalRef;
  shoppingCart: ShoppingCart;

  constructor(
    private router: Router,
    private http: HttpClient,
    private homeService: HomeService,
    private alertService: AlertService,
    private modalService: BsModalService,
    private priceOptionService: PriceOptionService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
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
  }

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    delete this.transaction.data.mainPackage;
    this.callService();
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

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

  onCompleted(promotion: any): void {
    this.transaction.data.mainPackage = promotion;
  }

  callService(): void {

    this.pageLoadingService.openLoading();

    const campaign: any = this.priceOption.campaign;
    this.promotionShelveService.getPromotionShelve(
      {
        packageKeyRef: campaign.packageKeyRef,
        orderType: 'Change Charge Type',
        billingSystem: BillingSystemType.IRB
      },
      +campaign.minimumPackagePrice, +campaign.maxinumPackagePrice)
      .then((promotionShelves: any) => {
        this.promotionShelves = this.promotionShelveService.defaultBySelected(promotionShelves, this.transaction.data.mainPackage);
      })
      .then(() => this.pageLoadingService.closeLoading());
  }

  onTermConditions(condition: any): void {
    if (!condition) {
      this.alertService.warning('ระบบไม่สามารถแสดงข้อมูลได้ในขณะนี้');
      return;
    }
    this.pageLoadingService.openLoading();
    this.http.get('/api/customerportal/newRegister/termAndCondition', {
      params: { conditionCode: condition }
    }).toPromise()
      .then((resp: any) => {
        this.condition = resp.data || {};
        this.modalRef = this.modalService.show(this.conditionTemplate, { class: 'modal-lg' });
      })
      .then(() => {
        this.pageLoadingService.closeLoading();
      });
  }

  isPackageOneLove(): boolean {
    const REGEX_NET_EXTREME = /[Nn]et[Ee]xtreme/;
    const mainPackage = this.transaction.data.mainPackage;
    if (mainPackage && REGEX_NET_EXTREME.test(mainPackage.productPkg)) {
      return false;
    }
    return (+mainPackage.numberOfMobile) > 0;
  }
}

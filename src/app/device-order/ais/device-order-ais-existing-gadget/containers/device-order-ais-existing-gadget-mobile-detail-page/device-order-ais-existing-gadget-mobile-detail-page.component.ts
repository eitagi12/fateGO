import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { Transaction, TransactionAction } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';

import { MobileInfo, ShoppingCart, HomeService, PageLoadingService, BillingSystemType } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { PromotionShelveService } from 'src/app/device-order/services/promotion-shelve.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { ROUTE_DEVICE_ORDER_AIS_GADGET_VALIDATE_CUSTOMER_PAGE,
  ROUTE_DEVICE_ORDER_AIS_GADGET_ELIGIBLE_MOBILE_PAGE,
  ROUTE_DEVICE_ORDER_AIS_GADGET_VALIDATE_CUSTOMER_PI_PAGE,
  ROUTE_DEVICE_ORDER_AIS_GADGET_PAYMENT_DETAIL_PAGE
} from 'src/app/device-order/ais/device-order-ais-existing-gadget/constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-existing-gadget-mobile-detail-page',
  templateUrl: './device-order-ais-existing-gadget-mobile-detail-page.component.html',
  styleUrls: ['./device-order-ais-existing-gadget-mobile-detail-page.component.scss']
})
export class DeviceOrderAisExistingGadgetMobileDetailPageComponent implements OnInit {

  wizards: any = WIZARD_DEVICE_ORDER_AIS;
  transaction: Transaction;
  priceOption: PriceOption;
  mobileInfo: MobileInfo;
  shoppingCart: ShoppingCart;
  mobileNo: string;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private http: HttpClient,
    private shoppingCartService: ShoppingCartService,
    private promotionShelveService: PromotionShelveService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void {
    if (this.transaction.data.action === TransactionAction.KEY_IN
      || this.transaction.data.action === TransactionAction.READ_CARD) {
        // this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    }
    this.mobileNo = this.transaction.data.simCard.mobileNo;
    this.getFbbInfo();
  }

  getFbbInfo(): void {
    this.pageLoadingService.openLoading();

      this.mobileInfo = {
        mobileNo: '8812345554',
        chargeType: 'รายเดือน',
        status: 'Active',
        sagment: 'Classic',
        serviceYear: '1 ปี 2 เดือน ',
        mainPackage: 'HomeBROADBAND Package 50/20 Mbps 599 THB'
      };
      this.transaction.data.simCard.chargeType = null;
      this.transaction.data.simCard.billingSystem = 'IRB';
      this.pageLoadingService.closeLoading();
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onBack(): void {
    const action = this.transaction.data.action;
    if (action === TransactionAction.KEY_IN_FBB) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_GADGET_VALIDATE_CUSTOMER_PAGE]);
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_GADGET_ELIGIBLE_MOBILE_PAGE]);
    }
  }

  onNext(): void {
    this.callService()
      .then(promotionsShelves => this.checkRouteNavigate(promotionsShelves))
      .then(() => this.pageLoadingService.closeLoading());
  }

  callService(): Promise<any> {
    const trade: any = this.priceOption.trade;
    const privilege: any = this.priceOption.privilege;
    const billingSystem = (this.transaction.data.simCard.billingSystem === 'RTBS')
      ? BillingSystemType.IRB : this.transaction.data.simCard.billingSystem || BillingSystemType.IRB;

    return this.callQueryContractFirstPackAndGetPromotionShelveServices(trade, billingSystem, privilege);
  }

  callQueryContractFirstPackAndGetPromotionShelveServices(trade: any, billingSystem: string, privilege: any): Promise<any> {
    return this.http.post(`/api/salesportal/query/contract-first-pack`, {
      option: '3',
      mobileNo: this.mobileNo || '',
      idCardNo: this.transaction.data.customer.idCardNo || '',
      profileType: 'All'
    }).toPromise()
      .then((resp: any) => {
        const contract = resp.data || {};
        if (contract) {
          this.transaction.data.contractFirstPack = contract;
        }
        return this.callGetPromotionShelveService(trade, billingSystem, privilege, contract);
      });
  }

  callGetPromotionShelveService(trade: any, billingSystem: string, privilege: any, contract: any): any[] | PromiseLike<any[]> {
    return this.promotionShelveService.getPromotionShelve({
      packageKeyRef: trade.packageKeyRef,
      orderType: `Change Service`,
      billingSystem: billingSystem
    }, +privilege.minimumPackagePrice, +privilege.maximumPackagePrice)
      .then((promotionShelves: any) => this.filterPromotions(promotionShelves, contract));
  }

  filterPromotions(promotionShelves: any = [], contract: any = {}): any[] {
    (promotionShelves || [])
    .forEach((promotionShelve: any) => {
      promotionShelve.promotions = (promotionShelve.promotions || [])
      .filter((promotion: any) => {
        promotion.items = this.filterItemsByFirstPackageAndInGroup(promotion, contract);
        return promotion.items.length > 0;
      });
    });
    return promotionShelves;

  }

  filterItemsByFirstPackageAndInGroup(promotion: any, contract: any): any {
    return (promotion.items || [])
      .filter((item: {
        value: {
          customAttributes: {
            priceExclVat: number;
            productPkg: any;
          };
        };
      }) => {
        const contractFirstPack = item.value.customAttributes.priceExclVat
          >= Math.max(contract.firstPackage || 0, contract.minPrice || 0, contract.initialPackage || 0);
        const inGroup = contract.inPackage.length > 0 ? contract.inPackage
          .some((inPack: any) => inPack === item.value.customAttributes.productPkg) : true;
        return contractFirstPack && inGroup;
      });
  }

  checkRouteNavigate(promotionsShelves: any): void {
    const action = this.transaction.data.action;
    if (action === TransactionAction.KEY_IN_FBB) {
      // this.router.navigate([ROUTE_DEVICE_ORDER_AIS_GADGET_VALIDATE_CUSTOMER_PI_PAGE]);
    } else {
      // this.router.navigate([ROUTE_DEVICE_ORDER_AIS_GADGET_PAYMENT_DETAIL_PAGE]);
    }
  }
}

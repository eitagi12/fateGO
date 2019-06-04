import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { Transaction, ExistingMobileCare } from 'src/app/shared/models/transaction.model';
import { PromotionShelve, HomeService, PageLoadingService, ShoppingCart, BillingSystemType } from 'mychannel-shared-libs';
import { BsModalRef } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient } from '@angular/common/http';
import { ROUTE_DEVICE_ORDER_AIS_EXISTING_PAYMENT_DETAIL_PAGE,
  ROUTE_DEVICE_ORDER_AIS_EXISTING_EFFECTIVE_START_DATE_PAGE,
  ROUTE_DEVICE_ORDER_AIS_EXISTING_MOBILE_CARE_PAGE,
  ROUTE_DEVICE_ORDER_AIS_EXISTING_MOBILE_CARE_AVAILABLE_PAGE } from '../../constants/route-path.constant';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { PromotionShelveService } from 'src/app/device-order/services/promotion-shelve.service';
import { TranslateService } from '@ngx-translate/core';

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
  selectCurrentPackage: boolean;
  modalRef: BsModalRef;
  shoppingCart: ShoppingCart;

  constructor(
    private router: Router,
    private http: HttpClient,
    private homeService: HomeService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private shoppingCartService: ShoppingCartService,
    private promotionShelveService: PromotionShelveService,
    private translateService: TranslateService,
  ) {
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();

    delete this.transaction.data.mainPackageOneLove;

    if (this.transaction.data.billingInformation) {
      delete this.transaction.data.billingInformation.billCycle;
      delete this.transaction.data.billingInformation.mergeBilling;
    }

  }

  changePackageTitleLanguage(currentPackage: any = {}): string {
    return (this.translateService.currentLang === 'EN') ? currentPackage.titleEng : currentPackage.title;
  }

  changePackageDetailLanguage(currentPackage: any = {}): string {
    return (this.translateService.currentLang === 'EN') ? currentPackage.inStatementEng : currentPackage.inStatementThai;
  }

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    this.callService()
    .then(filterPromotionByContractFirstPack => this.defualtSelected(filterPromotionByContractFirstPack))
    .then(() => this.pageLoadingService.closeLoading());
  }

  defualtSelected(promotion: any): void {
    this.promotionShelves = this.promotionShelveService
      .defaultBySelected(promotion, this.transaction.data.mainPackage);
    if (!this.advancePay && this.showSelectCurrentPackage && this.havePromotions) {
      this.promotionShelves[0].promotions[0].active = false;
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
    delete this.transaction.data.mainPackage;
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_PAYMENT_DETAIL_PAGE]);

  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    const mobileNo = this.transaction.data.simCard.mobileNo;

    this.http.get(`/api/customerportal/get-existing-mobile-care/${mobileNo}`)
    .toPromise()
    .then((response: any) => {
      const exMobileCare = response.data || {};
      this.mappingExistingMobileCare(exMobileCare);
      this.router.navigate([this.checkRouteNavigate(exMobileCare)]);
    })
    .then(() => this.pageLoadingService.closeLoading());
  }

  mappingExistingMobileCare(exMobileCare: any): void {
    if (exMobileCare.hasExistingMobileCare) {
      const existingMobileCare: ExistingMobileCare = exMobileCare.existMobileCarePackage;
      existingMobileCare.handSet = exMobileCare.existHandSet;
      this.transaction.data.existingMobileCare = existingMobileCare;
    }
  }

  checkRouteNavigate(exMobileCare: any = {}): string {
    if (this.selectCurrentPackage) {
      return this.checkRouteByExistingMobileCare(exMobileCare);

    } else {
      return ROUTE_DEVICE_ORDER_AIS_EXISTING_EFFECTIVE_START_DATE_PAGE;
    }
  }

  checkRouteByExistingMobileCare(exMobileCare: any = {}): string {
    if (exMobileCare.hasExistingMobileCare) {
      return ROUTE_DEVICE_ORDER_AIS_EXISTING_MOBILE_CARE_AVAILABLE_PAGE;

    } else {
      return ROUTE_DEVICE_ORDER_AIS_EXISTING_MOBILE_CARE_PAGE;
    }
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  callService(): Promise<any> {
    this.pageLoadingService.openLoading();
    const trade: any = this.priceOption.trade;
    const privilege: any = this.priceOption.privilege;
    const billingSystem = (this.transaction.data.simCard.billingSystem === 'RTBS')
    ? BillingSystemType.IRB : this.transaction.data.simCard.billingSystem || BillingSystemType.IRB;

    return this.callGetPromotionShelveService(trade, billingSystem, privilege);

  }

  callGetPromotionShelveService(trade: any, billingSystem: string, privilege: any): Promise<any> {
    return this.promotionShelveService.getPromotionShelve({
      packageKeyRef: trade.packageKeyRef || privilege.packageKeyRef,
      orderType: `Change Service`,
      billingSystem: billingSystem
    }, +privilege.minimumPackagePrice, +privilege.maximumPackagePrice)
    .then((promotionShelves: any) => {
      const contract = this.transaction.data.contractFirstPack || {};

      return this.filterPromotions(promotionShelves, contract);
    });
  }

  filterPromotions(promotionShelves: any = [], contract: any = {}): any[] {
    (promotionShelves || []).forEach((promotionShelve: any) => {
      promotionShelve.promotions = (promotionShelve.promotions || []).filter((promotion: any) => {
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

  get showSelectCurrentPackage(): boolean {
    const currentPackage = this.transaction.data.currentPackage || {};
    return (+currentPackage.priceExclVat || 0) >= +this.priceOption.privilege.minimumPackagePrice;

  }

  get isContractFirstPack(): number {
    const contract = this.transaction.data.contractFirstPack || {};
    return Math.max(+contract.firstPackage || 0, +contract.minPrice || 0, +contract.initialPackage || 0);

  }

  get advancePay(): boolean {
    return !!(+(this.priceOption.trade.advancePay && this.priceOption.trade.advancePay.amount || 0) > 0);

  }

  get havePromotions(): boolean {
    return this.promotionShelves && this.promotionShelves.some(arr => (arr && arr.promotions.length) > 0);
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

}

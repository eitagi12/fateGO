import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { FlowService, CustomerGroup } from '../../services/flow.service';
import {
  SalesService, TokenService, HomeService, User,
  CampaignSliderInstallment, PromotionShelve,
  PageLoadingService, AlertService
} from 'mychannel-shared-libs';

import { Transaction } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';


import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PromotionShelveService } from 'src/app/device-order/services/promotion-shelve.service';

import { PriceOptionUtils } from 'src/app/shared/utils/price-option-utils';
import { PRODUCT_TYPE, PRODUCT_SUB_TYPE, SUB_STOCK_DESTINATION } from '../../constants/gadget.constant';

@Component({
  selector: 'app-campaign-page',
  templateUrl: './campaign-page.component.html',
  styleUrls: ['./campaign-page.component.scss']
})
export class CampaignPageComponent implements OnInit, OnDestroy {

  @ViewChild('productSpecTemplate')
  productSpecTemplate: TemplateRef<any>;

  @ViewChild('promotionShelveTemplate')
  promotionShelveTemplate: TemplateRef<any>;

  @ViewChild('installmentTemplate')
  installmentTemplate: TemplateRef<any>;

  colorForm: FormGroup;

  user: User;

  // local storage name
  transaction: Transaction;
  priceOption: PriceOption;

  maximumNormalPrice: number;
  thumbnail: string;

  modalRef: BsModalRef;
  params: Params;
  hansetBundle: string;
  productDetail: any;
  productSpec: any;
  selectCustomerGroup: any;

  // campaign
  tabs: any[];

  // campaignSliders: CampaignSlider[];
  promotionShelves: PromotionShelve[];
  installments: CampaignSliderInstallment[];

  // trade
  productDetailService: Promise<any>;
  priceOptionDetailService: Promise<any>;
  packageDetailService: Promise<any>;
  isAdvancePay: boolean;

  constructor(private fb: FormBuilder,
    private modalService: BsModalService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private salesService: SalesService,
    private tokenService: TokenService,
    private homeService: HomeService,
    private flowService: FlowService,
    private priceOptionService: PriceOptionService,
    private pageLoadingService: PageLoadingService,
    private promotionShelveService: PromotionShelveService,
    private alertService: AlertService
  ) {
    this.priceOption = {};
    this.transaction = {};
    this.priceOptionService.remove();
    this.user = this.tokenService.getUser();
  }

  ngOnInit(): void {
    this.createForm();

    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.params = params;
      this.callService(
        params.brand,
        params.model,
        params.productType,
        params.productSubtype
      );
    });
  }

  createForm(): void {
    this.clearPriceOption();
    this.colorForm = this.fb.group({
      'stock': []
    });

    this.colorForm.valueChanges.pipe(debounceTime(1000)).subscribe(obs => {
      const stock = obs.stock;
      this.priceOption.productStock = stock;

      const product = (this.priceOption.productDetail.products || []).find((p: any) => {
        return p.colorName === stock.color;
      });
      this.thumbnail = product && product.images ? product.images.thumbnail : '';

      this.clearPriceOption();
      this.callPriceOptionsService(
        this.params.brand,
        this.params.model,
        stock.color,
        this.params.productType,
        this.params.productSubtype
      );
    });
  }

  onCheckStock($event: any, stock: any): void {
    if (stock && stock.qty <= 0) {
      $event.preventDefault();
    }
  }

  getProductSpecification(brand: string, model: string): void {
    const modalOptions = { class: 'modal-lg' };
    if (this.productSpec) {
      this.modalRef = this.modalService.show(this.productSpecTemplate, modalOptions);
      return;
    }

    const user: User = this.tokenService.getUser();
    this.pageLoadingService.openLoading();
    this.salesService.productSpecification({
      brand: brand || '',
      model: model || '',
      location: user.locationCode
    }).then((resp: any) => {
      const data: any[] = resp.data || [];

      this.productSpec = data.reduce((previousValue: any, currentValue: any) => {
        previousValue[currentValue.name] = currentValue.value;
        return previousValue;
      }, {});

      this.modalRef = this.modalService.show(this.productSpecTemplate, modalOptions);
    })
      .then(() => this.pageLoadingService.closeLoading());
  }

  onProductStockSelected(product: { stock: { qty: number; }; }): void {
    if (product && product.stock && product.stock.qty <= 0) {
      return;
    }
    // clear tabs
    this.tabs = null;
    // clear data local storage
    this.clearPriceOption();

    // keep stock
    this.priceOption.productStock = null;

    // change value form
    this.colorForm.patchValue({
      stock: product.stock
    });
  }

  clearPriceOption(): void {
    this.priceOption.customerGroup = null;
    this.priceOption.campaign = null;
    this.priceOption.trade = null;
  }

  /* กรองค่า campaign ให้แสดงตาม tab, user, etc ที่นี้ */
  filterCampaigns(priceOptions: any[]): any[] {
    return priceOptions.filter((campaign: any) => {
      // Filter here ...
      if (campaign.promotionFlag !== 'Y') {
        return false;
      }
      return true;
    });
  }

  /* กรองค่า privilege ใน campaign ที่ถูก filterCampaigns ให้แสดงตาม tab, user, etc ที่นี้ */
  filterPrivileges(privileges: any[], code: string): any[] {
    return privileges.filter((privilege: any) => {
      return privilege.customerGroups.find(customerGroup => {
        return customerGroup.code === code;
      });
    });
  }

  /* กรองค่า trades ใน privilege ที่ถูก filterPrivileges ให้แสดงตาม tab, user, etc ที่นี้ */
  filterTrades(trades: any[], code: string): any[] {
    return trades.filter((trade: any) => {
      return trade.customerGroups.find(
        customerGroup => customerGroup.code === code
      );
    }).filter((trade: any) => {
      const payment = (trade.payments || []).find(p => p.method !== 'PP') || {};
      if (payment.method !== 'CC') {
        return true;
      } else { // Trade เป็นผ่อนชำระ ต้องมี installment
        return (trade.banks || []).find((bank: any) => bank.installment);
      }
    });
  }

  mapTrades(trades: any[]): any[] {
    return trades.map((trade: any) => {
      if (!trade.payments || trade.payments.length === 0) {
        // Trade for TDM --> payments is []
        trade.payments = [{ cardType: '', method: 'CC/CA', installmentId: '' }];
      } else {
        if (trade.payments[0].installId === null) {
          // console.log('trade', trade);
          if (trade.payments[0].method === 'CC') {
            trade.payments = [{ cardType: '', method: 'CC/CA', installmentId: '' }];
            trade.advancePay.installmentFlag = 'N';
          } else if (trade.payments[0].method === 'CA') {
            trade.advancePay.installmentFlag = 'N';
          }
        }
      }
      return trade;
    });
  }

  getCampaignSliders(priceOptions: any[], code: string): any[] {
    return priceOptions
      .filter((campaign: any) => {
        let allowCampaign: boolean = !!campaign.customerGroups.find(
          group => group.code === code
        );

        const campaignCode: string = campaign.code;
        allowCampaign = allowCampaign && CustomerGroup.EXISTING === code;

        return allowCampaign;
      }).map((campaign: any) => {
        // filter privilege and trades
        const privileges = this.filterPrivileges(
          campaign.privileges, code
        ).map((privilege: any) => {
          privilege.trades = this.filterTrades(privilege.trades, code);
          privilege.trades = this.mapTrades(privilege.trades);
          return privilege;
        }).sort((a, b) =>
          // แพคเกจน้อยไปมาก
          (+a.minimumPromotionPrice) - (+b.minimumPromotionPrice)
        );

        const campaignFromFilter = Object.assign(
          Object.assign({}, campaign),
          { privileges: privileges }
        );

        const campaignSlider: any = {
          thumbnail: campaign.imageUrl,
          name: campaign.campaignName,
          minPromotionPrice: +campaign.minimumPromotionPrice,
          maxPromotionPrice: +campaign.maximumPromotionPrice,
          minAdvancePay: +campaign.minimumAdvancePay,
          maxAdvancePay: +campaign.maximumAdvancePay,
          contract: +campaign.maximumContract,
          // ค่าที่จะเก็บจากการเลือก campaign
          value: campaignFromFilter
        };

        campaignSlider.installments = PriceOptionUtils.getInstallmentsFromCampaign(campaignFromFilter);

        campaignSlider.freeGoods = (campaign.freeGoods || []).map(
          (freeGood: any) => freeGood.name
        );

        campaignSlider.discounts = PriceOptionUtils.getDiscountFromCampaign(campaignFromFilter);
        campaignSlider.mainPackagePrice = +campaign.minimumPackagePrice;
        return campaignSlider;
      });
  }

  getTabsFormPriceOptions(priceOptions: any[]): any[] {
    const tabs = [];
    priceOptions.forEach((priceOption: any) => {
      priceOption.customerGroups.map((customerGroup: any) => {
        return {
          code: customerGroup.code,
          name: customerGroup.name,
          active: false
        };
      }).forEach((group: any) => {
        if (!tabs.find((tab: any) => tab.code === group.code)) {
          tabs.push(group);
        }
      });
    });
    tabs.sort((a: any, b: any) => {
      const aCode = +a.code.replace('MC', '');
      const bCode = +b.code.replace('MC', '');
      return aCode - bCode;
    });

    if (tabs.length > 0) {
      tabs[0].active = true;
    }

    return tabs;
  }

  setActiveTabs(tabCode: any): void {
    this.tabs = this.tabs.map((tabData) => {
      tabData.active = !!(tabData.code === tabCode);
      return tabData;
    });
  }

  onCampaignSelected(campaign: any, code: string): void {
    this.priceOption.customerGroup = campaign.customerGroups.find(
      customerGroup => customerGroup.code === code
    );
    campaign.privileges = this.mapTrades(campaign.privileges);
    this.priceOption.campaign = campaign;
  }

  onViewPromotionShelve(campaign: any): void {
    const tabActive = this.tabs.find(tab => tab.active);
    const params: any = {
      packageKeyRef: campaign.packageKeyRef,
      orderType: this.getOrderTypeFromCustomerGroup(this.tabs.find(tab => tab.active))
    };

    this.pageLoadingService.openLoading();
    this.promotionShelveService.getPromotionShelve(params).then((promotionShelves: any) => {
      this.promotionShelves = promotionShelves;
      this.promotionShelveService.defaultBySelected(this.promotionShelves);
      this.modalRef = this.modalService.show(this.promotionShelveTemplate, {
        class: 'modal-lg'
      });
    }).then(() => this.pageLoadingService.closeLoading());
  }

  getOrderTypeFromCustomerGroup(customerGroup: string): string {
    switch (customerGroup) {
      case CustomerGroup.NEW_REGISTER:
        return 'New Registration';
      case CustomerGroup.PRE_TO_POST:
        return 'Change Charge Type';
      case CustomerGroup.MNP:
        return 'Port - In';
      case CustomerGroup.EXISTING:
        return 'Change Service';
    }
  }

  onViewInstallments(campaign: any): void {
    this.installments = PriceOptionUtils.getInstallmentsFromCampaign(campaign);
    this.modalRef = this.modalService.show(this.installmentTemplate, { class: 'modal-lg' });
    this.isAdvancePay = this.installments.filter(price => price.advancePay.min > 0 || price.advancePay.max > 0).length > 0;
  }

  getSummaryPrivilegePrice(privilege: any): number {
    const advancePay = +(privilege.maximumAdvancePay || privilege.minimumAdvancePay);
    return (+privilege.maximumPromotionPrice) + advancePay;
  }

  onViewInstallmentsFormTrede(trade: any): void {
    this.installments = PriceOptionUtils.getInstallmentsFromTrades([trade]);
    this.modalRef = this.modalService.show(this.installmentTemplate, { class: 'modal-lg' });
  }

  onTradeSelected(privilege: any, trade: any): void {
    this.priceOption.privilege = privilege;
    this.priceOption.trade = trade;
    this.pageLoadingService.openLoading();
    this.flowService.nextUrl(this.priceOption)
      .then((nextUrl: string) => {
        this.router.navigate([nextUrl]);
      })
      .catch((error: string) => this.alertService.error(error))
      .then(() => this.pageLoadingService.closeLoading());
  }

  /* product stock */
  callService(
    brand: string, model: string,
    productType?: string, productSubtype?: string): void {
    const user: User = this.tokenService.getUser();

    // clear
    this.productDetail = {};

    this.productDetailService = this.salesService.productDetail({
      brand: brand,
      location: user.locationCode,
      model: model,
      productType: productType || PRODUCT_TYPE,
      productSubtype: productSubtype || PRODUCT_SUB_TYPE
    });
    this.productDetailService.then((resp: any) => {

      // เก็บข้อมูลไว้ไปแสดงหน้าอื่นโดยไม่เปลี่ยนแปลงค่าข้างใน
      this.priceOption.productDetail = resp.data || {};

      const products: any[] = resp.data.products || [];
      forkJoin(products.map((product: any) => {
        return this.salesService.productStock({
          locationCodeSource: user.locationCode,
          productType: product.productType || PRODUCT_TYPE,
          productSubType: product.productSubtype || PRODUCT_SUB_TYPE,
          model: model,
          color: product.colorName,
          subStockDestination: SUB_STOCK_DESTINATION,
          listLocationCodeDestination: [user.locationCode]
        }).then((respStock: any) => respStock.data.listLocationCodeDestinationOut || []);
      })).subscribe((respStocks: any[]) => {

        this.productDetail = resp.data || {};
        this.productDetail.products = [];

        const productStocks: any[] = respStocks.reduce((previousValue: any[], currentValue: any[]) => {
          return previousValue.concat(currentValue);
        }, [])
          .map((stock: any) => {
            stock.colorCode = (products.find((product: any) => {
              return product.colorName === stock.color;
            }) || {}).colorCode;
            return stock;
          });

        this.productDetail.products = products.map((product: any) => {
          const stock = productStocks.find((productStock: any) => productStock.color === product.colorName) || { qty: 0 };
          product.stock = stock;
          return product;
        }).sort((a, b) => a.stock.qty - b.stock.qty);

        // default selected
        let defaultProductSelected;
        if (this.priceOption.productStock && this.priceOption.productStock.colorName) {
          defaultProductSelected = this.priceOption.productStock;
        } else {
          defaultProductSelected = this.productDetail.products.find((product: any) => {
            return product.stock.qty > 0;
          });
        }

        if (!defaultProductSelected && products.length > 0) {
          defaultProductSelected = products[0];
        }

        this.onProductStockSelected(defaultProductSelected);
      });
    });
  }

  callPriceOptionsService(brand: string, model: string, color: string, productType: string, productSubtype: string): void {
    this.priceOptionDetailService = this.salesService.priceOptions({
      brand: brand,
      model: model,
      color: color,
      productType: productType,
      productSubtype: productSubtype,
      location: this.user.locationCode
    });
    this.priceOptionDetailService.then((resp: any) => {
      const priceOptions = this.filterCampaigns(resp.data.priceOptions || []);
      if (priceOptions && priceOptions.length > 0) {
        this.maximumNormalPrice = priceOptions[0].maximumNormalPrice;
      }
      // generate customer tabs
      this.tabs = this.getTabsFormPriceOptions(priceOptions);
      this.tabs.forEach((tab: any) => {
        tab.campaignSliders = this.getCampaignSliders(priceOptions, tab.code);
      });
    });
  }

  onBack(): void {
    if (this.priceOption && this.priceOption.campaign) {
      this.priceOption.customerGroup = null;
      this.priceOption.campaign = null;
      return;
    }
    const queryParams: any = {
      brand: this.params.brand
    };
    this.router.navigate([''], { queryParams });
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.priceOption.queryParams = Object.assign({}, this.params);
    this.priceOptionService.save(this.priceOption);
  }

}

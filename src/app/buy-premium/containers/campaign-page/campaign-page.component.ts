import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { User, TokenService, SalesService, HomeService } from 'mychannel-shared-libs';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { PriceOptionUtils } from 'src/app/shared/utils/price-option-utils';
import { CustomerGroup } from '../../services/flow.service';
import { PRODUCT_TYPE, PRODUCT_SUB_TYPE, SUB_STOCK_DESTINATION } from '../../constants/premium.constant';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { ROUTE_BUY_PREMIUM_PRODUCT_PAGE } from '../../constants/route-path.constant';

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
  user: User;
  colorForm: FormGroup;

  // local storage name
  transaction: Transaction;
  priceOption: PriceOption;

  maximumNormalPrice: number;
  thumbnail: string;

  priceOptionDetailService: Promise<any>;
  params: Params;
  productDetail: any;

  // campaign
  tabs: any[];

  constructor(
    private priceOptionService: PriceOptionService,
    private tokenService: TokenService,
    private formBuilder: FormBuilder,
    private salesService: SalesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private homeService: HomeService
  ) {
    this.priceOptionService.remove();
    this.user = this.tokenService.getUser();
   }

  ngOnInit(): void {
    this.priceOption = {};
    this.transaction = {};

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

  onBack(): void {
    if (this.priceOption && this.priceOption.campaign) {
      this.priceOption.customerGroup = null;
      this.priceOption.campaign = null;
      return;
    }
    const queryParams: any = {
      brand: this.params.brand
    };
    this.router.navigate([ROUTE_BUY_PREMIUM_PRODUCT_PAGE], { queryParams });
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.priceOption.queryParams = Object.assign({}, this.params);
    this.priceOptionService.save(this.priceOption);
  }

  /* product stock */
  callService(
    brand: string, model: string,
    productType?: string, productSubtype?: string): void {
    const user: User = this.tokenService.getUser();

    // clear
    this.productDetail = {};
    this.salesService.productDetail({
      brand: brand,
      location: user.locationCode,
      model: model,
      productType: productType || PRODUCT_TYPE,
      productSubtype: productSubtype || PRODUCT_SUB_TYPE
    }).then((resp: any) => {

      // เก็บข้อมูลไว้ไปแสดงหน้าอื่นโดยไม่เปลี่ยนแปลงค่าข้างใน
      this.priceOption.productDetail = resp.data || {};
      const products: any[] = resp.data.products || [];
      forkJoin(products.map((product: any) => {
        return this.salesService.productStock({
          locationCodeSource: user.locationCode,
          productType: product.productType || productType,
          productSubType: product.productSubtype || productSubtype,
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

  createForm(): void {
    this.clearPriceOption();
    this.colorForm = this.formBuilder.group({
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

  callPriceOptionsService(brand: string, model: string, color: string, productType: string, productSubtype: string): void {
    this.priceOptionDetailService = this.salesService.priceOptions({
      brand: brand,
      model: model,
      color: color,
      productType: productType,
      productSubtype: productSubtype,
      location: this.user.locationCode
    }).then((resp: any) => {
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

  getCampaignSliders(priceOptions: any[], code: string): any[] {
    return priceOptions
      .filter((campaign: any) => {
        const allowCampaign: boolean = !!campaign.customerGroups.find(
          group => group.code === code
        );

        const campaignCode: string = campaign.code;

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

  /* กรองค่า privilege ใน campaign ที่ถูก filterCampaigns ให้แสดงตาม tab, user, etc ที่นี้ */
  filterPrivileges(privileges: any[], code: string): any[] {
    return privileges.filter((privilege: any) => {
      return privilege.customerGroups.find(customerGroup => {
        return customerGroup.code === code;
      });
    });
  }

  getTabsFormPriceOptions(priceOptions: any[]): any[] {
    const tabs = [];

    const criteriasGroup = this.filterCriteriasGroup(priceOptions);
    criteriasGroup.map((group: any) => {
      const groupDetail: any = this.mapCriteriasCode(group);
      return {
        code: groupDetail.code,
        name: groupDetail.name,
        active: false
      };
    }).forEach((group: any) => {
      if (!tabs.find((tab: any) => tab.code === group.code)) {
        tabs.push(group);
      }
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

  mapCriteriasCode(customerGroup: any): any {
    const groupDetail = {
      'New Registration': {
        code: CustomerGroup.NEW_REGISTER,
        name: 'เครื่องพร้อมเปิดเบอร์ใหม่'
      },
      'Convert Pre to Post': {
        code: CustomerGroup.PRE_TO_POST,
        name: 'เครื่องพร้อมเปลี่ยนเป็นรายเดือน'
      },
      'MNP': {
        code: CustomerGroup.MNP,
        name: 'ลูกค้าย้ายค่าย'
      },
      'Existing': {
        code: CustomerGroup.EXISTING,
        name: 'ลูกค้าปัจจุบัน'
      },
      '': {
        code: CustomerGroup.DEVICE_ONLY,
        name: 'ลูกค้าซื้อเครื่องเปล่า'
      },
    };
    return groupDetail[customerGroup];
  }

  mapCriteriasInTrade(trade: any): any {
    const criteriasObj: any = {
      chargeType: [''],
      criteria: [''],
      instanceName: [''],
      target: [''],
    };
    trade.criterias.map((criteria: any) => {
      if (criteria.chargeType) {
        criteriasObj.chargeType = criteria.chargeType;
      }
      if (criteria.criteria) {
        criteriasObj.criteria = criteria.criteria;
      }
      if (criteria.instanceName) {
        criteriasObj.instanceName = criteria.instanceName;
      }
      if (criteria.target) {
        criteriasObj.target = criteria.target;
      }
    });

    return criteriasObj;
  }

  private filterCriteriasGroup(priceOptions: any[]): any {
    const criteriasGroup = [];
    let arraygroup = [];
    priceOptions.forEach((priceOption: any) => {
      priceOption.privileges.map((privilege: any) => {
        privilege.trades.map((trade: any) => {
          const criteriasObj: any = this.mapCriteriasInTrade(trade);
          // criteriasObj : chargeType: [], criteria: [], instanceName: [], target: []
          criteriasGroup.push(criteriasObj.criteria);
        });
      });
    });
    criteriasGroup.map((group) => {
      arraygroup = arraygroup.concat(group);
    });
    const customerGroup = new Set(arraygroup);
    return Array.from(customerGroup);
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

  clearPriceOption(): void {
    this.priceOption.customerGroup = null;
    this.priceOption.campaign = null;
    this.priceOption.trade = null;
  }

}

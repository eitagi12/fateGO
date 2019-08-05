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
import { ROUTE_BUY_GADGET_PRODUCT_PAGE } from '../../constants/route-path.constant';

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
      case CustomerGroup.DEVICE_ONLY:
        return 'Device Only';
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
      /*mock data test dont remove*/
      // const priceOptions = this.filterCampaigns(this.dataMock());
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
    this.router.navigate([ROUTE_BUY_GADGET_PRODUCT_PAGE], { queryParams });
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.priceOption.queryParams = Object.assign({}, this.params);
    this.priceOptionService.save(this.priceOption);
  }

  dataMock(): any {
    return [
      {
        'campaignId': '99003',
        'campaignName': 'APPLE TV',
        'campaignDesc': 'APPLE TV',
        'imageUrl': 'https://10.104.249.89/CPC-FE-WEB/api/contents/upload/AISHOTDEAL_AISHOTDEAL_03_300.jpg',
        'channels': [
          'AIS',
          'ASP'
        ],
        'minimumPackagePrice': '499',
        'maximumPackagePrice': '499',
        'packageKeyRef': 'b11f089e8f8ce9ec164ec0d369debcbe',
        'conditionCode': 'CONDITION_2',
        'promotionFlag': 'Y',
        'publish': true,
        'allowedAddToCart': true,
        'code': 'APPLETV',
        'priceType': 'PROMOTION',
        'maximumContract': '0',
        'price': '33500',
        'freeGoods': [
          {
            'name': 'KRS APP IPH X MALMO 4 CARD FOLIOCASE BK',
            'code': '33014507',
            'qty': '1'
          },
          {
            'name': 'IPHONE 5S CASE RED-ITS',
            'code': '33007573',
            'qty': '1'
          }
        ],
        'customerGroups': [
          {
            'name': 'ลูกค้าปัจจุบัน',
            'code': 'MC004',
            'flowId': '000'
          }
        ],
        'minimumPromotionPrice': '32500',
        'maximumPromotionPrice': '32500',
        'minimumNormalPrice': '33500',
        'maximumNormalPrice': '33500',
        'minimumAdvancePay': '2140',
        'maximumAdvancePay': '2140',
        'privileges': [
          {
            'privilegeId': '2018-00147',
            'privilegeName': 'Hot Deal New TP19072332__*999*02# - เครื่องโทรศัพท์ราคาพิเศษ AIS Hot Deal สำหรับลูกค้าปัจจุบัน DT (*999*02#)',
            'privilegeDesc': 'Hot Deal New TP19072332__*999*02# - เครื่องโทรศัพท์ราคาพิเศษ AIS Hot Deal สำหรับลูกค้าปัจจุบัน DT (*999*02#)',
            'ussdCode': '*999*04#',
            'minimumPackagePrice': '499',
            'maximumPackagePrice': '499',
            'packageKeyRef': 'b11f089e8f8ce9ec164ec0d369debcbe',
            'channels': [
              'AIS'
            ],
            'customerGroups': [
              {
                'name': 'ลูกค้าปัจจุบัน',
                'code': 'MC004',
                'flowId': '000'
              }
            ],
            'minimumNormalPrice': '33500',
            'maximumNormalPrice': '33500',
            'minimumPromotionPrice': '32500',
            'maximumPromotionPrice': '32500',
            'minimumAdvancePay': '2140',
            'maximumAdvancePay': '2140',
            'maximumContract': '0',
            'trades': [
              {
                'tradeNo': 'TP19072332',
                'tradeName': 'Hot Deal Privilege',
                'tradeDesc': 'Test DeviceSale Privilege',
                'normalPrice': '33500',
                'promotionPrice': '32500',
                'durationContract': '0',
                'advancePay': {
                  'tradeAirtimeId': '15020',
                  'amount': '2140',
                  'installmentFlag': 'N',
                  'matAirtime': 'AIRTIME2000EXVAT_DISC200_10M',
                  'description': 'แพ็กเกจค่าบริการรายเดือน 2,000 บาท (ไม่รวมVAT) รับส่วนลด 200 บาท นาน 10 เดือน',
                  'promotions': [
                    {
                      'month': '10',
                      'promotionCode': 'P16115936',
                      'promotionName': 'MF_Disc_2000B_10M_200',
                      'productType': 'Account Promotion',
                      'billingSystem': 'IRB'
                    }
                  ]
                },
                'priceType': 'PROMOTION',
                'ussdCode': '*999*04#',
                'packageKeyRef': 'b11f089e8f8ce9ec164ec0d369debcbe',
                'priceDiscount': '1000',
                'focCode': '0',
                'productType': 'DEVICE',
                'productSubtype': 'HANDSET',
                'maximumPackage': null,
                'minimumPackage': null,
                'serviceLockHs': null,
                'priceGroups': [
                  {
                    'priceType': 'EUP',
                    'price': '33500'
                  }
                ],
                'discount': {
                  'tradeDiscountId': '136895',
                  'type': 'B',
                  'value': '7',
                  'amount': '1000.0',
                  'specialType': null,
                  'specialAmount': '0'
                },
                'payments': [
                  {
                    'cardType': 'MASTER',
                    'method': 'CC',
                    'installId': 278
                  },
                  {
                    'cardType': 'MASTER',
                    'method': 'CC',
                    'installId': 371
                  },
                  {
                    'cardType': 'MASTER',
                    'method': 'CC',
                    'installId': 390
                  },
                  {
                    'cardType': 'MASTER',
                    'method': 'CC',
                    'installId': 411
                  },
                  {
                    'cardType': 'VISA',
                    'method': 'CC',
                    'installId': 278
                  },
                  {
                    'cardType': 'VISA',
                    'method': 'CC',
                    'installId': 371
                  },
                  {
                    'cardType': 'VISA',
                    'method': 'CC',
                    'installId': 390
                  },
                  {
                    'cardType': 'VISA',
                    'method': 'CC',
                    'installId': 411
                  }
                ],
                'banks': [
                  {
                    'name': 'ไทยพาณิชย์ จำกัด (มหาชน)',
                    'abb': 'SCB',
                    'imageUrl': 'https://10.104.249.89/CPC-FE-WEB/api/contents/upload/SCB_SCB02.png',
                    'installment': '0%  6 เดือน ( 6 M)',
                    'remark': null
                  },
                  {
                    'name': 'ไทยพาณิชย์ จำกัด (มหาชน)',
                    'abb': 'SCB',
                    'imageUrl': 'https://10.104.249.89/CPC-FE-WEB/api/contents/upload/SCB_SCB02.png',
                    'installment': '0% 12 เดือน (12 M)',
                    'remark': null
                  },
                  {
                    'name': 'กสิกรไทย จำกัด (มหาชน)',
                    'abb': 'KBNK',
                    'imageUrl': 'https://10.104.249.89/CPC-FE-WEB/api/contents/upload/KBNK_kBank02.png',
                    'installment': '0% 12 เดือน (12 M)',
                    'remark': null
                  },
                  {
                    'name': 'กสิกรไทย จำกัด (มหาชน)',
                    'abb': 'KBNK',
                    'imageUrl': 'https://10.104.249.89/CPC-FE-WEB/api/contents/upload/KBNK_kBank02.png',
                    'installment': '0%  6 เดือน ( 6 M)',
                    'remark': null
                  }
                ],
                'freeGoods': [
                  {
                    'tradeFreegoodsId': '116619',
                    'code': '33014507',
                    'name': 'KRS APP IPH X MALMO 4 CARD FOLIOCASE BK',
                    'qty': '1'
                  },
                  {
                    'tradeFreegoodsId': '116618',
                    'code': '33007573',
                    'name': 'IPHONE 5S CASE RED-ITS',
                    'qty': '1'
                  }
                ],
                'matCode': 'undefined',
                'channels': [
                  'AIS'
                ],
                'tradeChannels': [
                  {
                    'partnerCode': null,
                    'locationCode': null,
                    'locationCodePartner': null,
                    'region': null,
                    'locType': null,
                    'locSubtype': null,
                    'province': 'ALL'
                  }
                ],
                'customerGroups': [
                  {
                    'name': 'ลูกค้าปัจจุบัน',
                    'code': 'MC004',
                    'flowId': '000'
                  }
                ]
              },
              {
                'tradeNo': 'TP19072332',
                'tradeName': 'Hot Deal Privilege',
                'tradeDesc': 'Test DeviceSale Privilege',
                'normalPrice': '33500',
                'promotionPrice': '32500',
                'durationContract': '0',
                'advancePay': {
                  'tradeAirtimeId': '15020',
                  'amount': '2140',
                  'installmentFlag': 'N',
                  'matAirtime': 'AIRTIME2000EXVAT_DISC200_10M',
                  'description': 'แพ็กเกจค่าบริการรายเดือน 2,000 บาท (ไม่รวมVAT) รับส่วนลด 200 บาท นาน 10 เดือน',
                  'promotions': [
                    {
                      'month': '10',
                      'promotionCode': 'P16115936',
                      'promotionName': 'MF_Disc_2000B_10M_200',
                      'productType': 'Account Promotion',
                      'billingSystem': 'IRB'
                    }
                  ]
                },
                'priceType': 'PROMOTION',
                'ussdCode': '*999*04#',
                'packageKeyRef': 'b11f089e8f8ce9ec164ec0d369debcbe',
                'priceDiscount': '1000',
                'focCode': '0',
                'productType': 'DEVICE',
                'productSubtype': 'HANDSET',
                'maximumPackage': null,
                'minimumPackage': null,
                'serviceLockHs': null,
                'priceGroups': [
                  {
                    'priceType': 'EUP',
                    'price': '33500'
                  }
                ],
                'discount': {
                  'tradeDiscountId': '136895',
                  'type': 'B',
                  'value': '7',
                  'amount': '1000.0',
                  'specialType': null,
                  'specialAmount': '0'
                },
                'payments': [
                  {
                    'cardType': 'OTHER',
                    'method': 'CC',
                    'installId': null
                  }
                ],
                'banks': [
                  {
                    'name': 'อยุธยาคาร์ด เซอร์วิสเซส',
                    'abb': 'ACS',
                    'imageUrl': 'https://10.104.249.89/CPC-FE-WEB/api/contents/upload/ACS_ACS_BAY03.png',
                    'installment': null,
                    'remark': null
                  },
                  {
                    'name': 'บริษัทอิออนธนสินทรัพย์ (ไทยแลนด์) จำกัด (มหาชน)',
                    'abb': 'AEON',
                    'imageUrl': 'https://10.104.249.89/CPC-FE-WEB/api/contents/upload/AEON_AEON-logo.png',
                    'installment': null,
                    'remark': null
                  },
                  {
                    'name': 'กรุงศรีอยุธยา จำกัด (มหาชน)',
                    'abb': 'BAY',
                    'imageUrl': 'https://10.104.249.89/CPC-FE-WEB/api/contents/upload/BAY_BAY.png',
                    'installment': null,
                    'remark': null
                  },
                  {
                    'name': 'กรุงเทพ จำกัด (มหาชน)',
                    'abb': 'BBL',
                    'imageUrl': 'https://10.104.249.89/CPC-FE-WEB/api/contents/upload/BBL_BBL.png',
                    'installment': null,
                    'remark': null
                  },
                  {
                    'name': 'แห่งประเทศจีน',
                    'abb': 'BOC',
                    'imageUrl': 'https://10.104.249.89/CPC-FE-WEB/api/contents/upload/BOC_BOC.png',
                    'installment': null,
                    'remark': null
                  },
                  {
                    'name': 'ซีไอเอ็มบี ไทย จำกัด (มหาชน)',
                    'abb': 'CIMB',
                    'imageUrl': 'https://10.104.249.89/CPC-FE-WEB/api/contents/upload/CIMB_CIMB.png',
                    'installment': null,
                    'remark': null
                  },
                  {
                    'name': 'ซิตี้แบงก์',
                    'abb': 'CITI',
                    'imageUrl': 'https://10.104.249.89/CPC-FE-WEB/api/contents/upload/CITI_CITI.png',
                    'installment': null,
                    'remark': null
                  },
                  {
                    'name': 'ซิตี้แบงก์ เรดดี้เครดิต',
                    'abb': 'CITIREADY',
                    'imageUrl': 'https://10.104.249.89/CPC-FE-WEB/api/contents/upload/CITIREADY_citibank02.jpg',
                    'installment': null,
                    'remark': null
                  },
                  {
                    'name': 'แคปปิตอล โอเค',
                    'abb': 'COK',
                    'imageUrl': 'https://10.104.249.89/CPC-FE-WEB/api/contents/upload/COK_capOK.png',
                    'installment': null,
                    'remark': null
                  },
                  {
                    'name': 'เซ็นทรัล',
                    'abb': 'CT',
                    'imageUrl': 'https://10.104.249.89/CPC-FE-WEB/api/contents/upload/CT_centralThe1.png',
                    'installment': null,
                    'remark': null
                  },
                  {
                    'name': 'บริษัท เซทเทเลม (ประเทศไทย) จำกัด',
                    'abb': 'CTM',
                    'imageUrl': null,
                    'installment': null,
                    'remark': null
                  },
                  {
                    'name': 'Dominion Bank Canada',
                    'abb': 'DBC',
                    'imageUrl': null,
                    'installment': null,
                    'remark': null
                  },
                  {
                    'name': 'บัตรเครดิต เฟิร์สช้อยส์',
                    'abb': 'FCC',
                    'imageUrl': 'https://10.104.249.89/CPC-FE-WEB/api/contents/upload/FCC_FCC.png',
                    'installment': null,
                    'remark': null
                  },
                  {
                    'name': 'Foreign Bank',
                    'abb': 'FRB',
                    'imageUrl': null,
                    'installment': null,
                    'remark': null
                  },
                  {
                    'name': 'ออมสิน',
                    'abb': 'GSB',
                    'imageUrl': 'https://10.104.249.89/CPC-FE-WEB/api/contents/upload/GSB_GSB.png',
                    'installment': null,
                    'remark': null
                  },
                  {
                    'name': 'ฮ่องกงแอนด์เซี่ยงไฮ้',
                    'abb': 'HKSH',
                    'imageUrl': 'https://10.104.249.89/CPC-FE-WEB/api/contents/upload/HKSH_HSBC.png',
                    'installment': null,
                    'remark': null
                  },
                  {
                    'name': 'ธนาคารไอซีบีซี จำกัด (มหาชน)',
                    'abb': 'ICBC',
                    'imageUrl': null,
                    'installment': null,
                    'remark': null
                  },
                  {
                    'name': 'ธนาคารอิสลามแห่งประเทศไทย',
                    'abb': 'ISBT',
                    'imageUrl': null,
                    'installment': null,
                    'remark': null
                  },
                  {
                    'name': 'กสิกรไทย จำกัด (มหาชน)',
                    'abb': 'KBNK',
                    'imageUrl': 'https://10.104.249.89/CPC-FE-WEB/api/contents/upload/KBNK_kBank02.png',
                    'installment': null,
                    'remark': null
                  },
                  {
                    'name': 'กรุงไทย จำกัด (มหาชน)',
                    'abb': 'KTB',
                    'imageUrl': 'https://10.104.249.89/CPC-FE-WEB/api/contents/upload/KTB_KTB.png',
                    'installment': null,
                    'remark': null
                  },
                  {
                    'name': 'ธนชาต จำกัด(มหาชน)',
                    'abb': 'NBNK',
                    'imageUrl': 'https://10.104.249.89/CPC-FE-WEB/api/contents/upload/NBNK_NBNK.png',
                    'installment': null,
                    'remark': null
                  },
                  {
                    'name': 'Other Bank',
                    'abb': 'OTB',
                    'imageUrl': null,
                    'installment': null,
                    'remark': null
                  },
                  {
                    'name': 'เพย์เมนท์ โซลูชั่น',
                    'abb': 'PMS',
                    'imageUrl': null,
                    'installment': null,
                    'remark': null
                  },
                  {
                    'name': 'ไทยพาณิชย์ จำกัด (มหาชน)',
                    'abb': 'SCB',
                    'imageUrl': 'https://10.104.249.89/CPC-FE-WEB/api/contents/upload/SCB_SCB02.png',
                    'installment': null,
                    'remark': null
                  },
                  {
                    'name': 'SCB Speedy Cash',
                    'abb': 'SCBSPEEDY',
                    'imageUrl': 'https://10.104.249.89/CPC-FE-WEB/api/contents/upload/SCBSPEEDY_SCB Speedy.png',
                    'installment': null,
                    'remark': null
                  },
                  {
                    'name': 'สแตนดาร์ดชาร์เตอร์ด (ไทย) จำกัด (มหาชน)',
                    'abb': 'SCN',
                    'imageUrl': 'https://10.104.249.89/CPC-FE-WEB/api/contents/upload/SCN_scn-logo.jpg',
                    'installment': null,
                    'remark': null
                  },
                  {
                    'name': 'SUMITOMO',
                    'abb': 'SUMI',
                    'imageUrl': null,
                    'installment': null,
                    'remark': null
                  },
                  {
                    'name': 'บัตรเครดิต เทสโก้ โลตัส วีซ่า',
                    'abb': 'TCS',
                    'imageUrl': 'https://10.104.249.89/CPC-FE-WEB/api/contents/upload/TCS_TescoLotus-CreditCard.png',
                    'installment': null,
                    'remark': null
                  },
                  {
                    'name': 'ทหารไทย จำกัด (มหาชน)',
                    'abb': 'TMB',
                    'imageUrl': 'https://10.104.249.89/CPC-FE-WEB/api/contents/upload/TMB_TMB02.png',
                    'installment': null,
                    'remark': null
                  },
                  {
                    'name': 'ยูโอบี จำกัด (มหาชน)',
                    'abb': 'UOB',
                    'imageUrl': 'https://10.104.249.89/CPC-FE-WEB/api/contents/upload/UOB_UOB-bank.png',
                    'installment': null,
                    'remark': null
                  },
                  {
                    'name': 'UOB Cash Plus',
                    'abb': 'UOBCASHP',
                    'imageUrl': 'https://10.104.249.89/CPC-FE-WEB/api/contents/upload/UOBCASHP_UOB CashPlus.png',
                    'installment': null,
                    'remark': null
                  }
                ],
                'freeGoods': [
                  {
                    'tradeFreegoodsId': '116619',
                    'code': '33014507',
                    'name': 'KRS APP IPH X MALMO 4 CARD FOLIOCASE BK',
                    'qty': '1'
                  },
                  {
                    'tradeFreegoodsId': '116618',
                    'code': '33007573',
                    'name': 'IPHONE 5S CASE RED-ITS',
                    'qty': '1'
                  }
                ],
                'matCode': 'undefined',
                'channels': [
                  'AIS'
                ],
                'tradeChannels': [
                  {
                    'partnerCode': null,
                    'locationCode': null,
                    'locationCodePartner': null,
                    'region': null,
                    'locType': null,
                    'locSubtype': null,
                    'province': 'ALL'
                  }
                ],
                'customerGroups': [
                  {
                    'name': 'ลูกค้าปัจจุบัน',
                    'code': 'MC004',
                    'flowId': '000'
                  }
                ]
              },
              {
                'tradeNo': 'TP19072332',
                'tradeName': 'Hot Deal Privilege',
                'tradeDesc': 'Test DeviceSale Privilege',
                'normalPrice': '33500',
                'promotionPrice': '32500',
                'durationContract': '0',
                'advancePay': {
                  'tradeAirtimeId': '15020',
                  'amount': '2140',
                  'installmentFlag': 'N',
                  'matAirtime': 'AIRTIME2000EXVAT_DISC200_10M',
                  'description': 'แพ็กเกจค่าบริการรายเดือน 2,000 บาท (ไม่รวมVAT) รับส่วนลด 200 บาท นาน 10 เดือน',
                  'promotions': [
                    {
                      'month': '10',
                      'promotionCode': 'P16115936',
                      'promotionName': 'MF_Disc_2000B_10M_200',
                      'productType': 'Account Promotion',
                      'billingSystem': 'IRB'
                    }
                  ]
                },
                'priceType': 'PROMOTION',
                'ussdCode': '*999*04#',
                'packageKeyRef': 'b11f089e8f8ce9ec164ec0d369debcbe',
                'priceDiscount': '1000',
                'focCode': '0',
                'productType': 'DEVICE',
                'productSubtype': 'HANDSET',
                'maximumPackage': null,
                'minimumPackage': null,
                'serviceLockHs': null,
                'priceGroups': [
                  {
                    'priceType': 'EUP',
                    'price': '33500'
                  }
                ],
                'discount': {
                  'tradeDiscountId': '136895',
                  'type': 'B',
                  'value': '7',
                  'amount': '1000.0',
                  'specialType': null,
                  'specialAmount': '0'
                },
                'payments': [
                  {
                    'cardType': 'OTHER',
                    'method': 'CA',
                    'installId': null
                  }
                ],
                'banks': [
                  {
                    'name': 'อยุธยาคาร์ด เซอร์วิสเซส',
                    'abb': 'ACS',
                    'imageUrl': 'https://10.104.249.89/CPC-FE-WEB/api/contents/upload/ACS_ACS_BAY03.png',
                    'installment': null,
                    'remark': null
                  },
                  {
                    'name': 'บริษัทอิออนธนสินทรัพย์ (ไทยแลนด์) จำกัด (มหาชน)',
                    'abb': 'AEON',
                    'imageUrl': 'https://10.104.249.89/CPC-FE-WEB/api/contents/upload/AEON_AEON-logo.png',
                    'installment': null,
                    'remark': null
                  },
                  {
                    'name': 'กรุงศรีอยุธยา จำกัด (มหาชน)',
                    'abb': 'BAY',
                    'imageUrl': 'https://10.104.249.89/CPC-FE-WEB/api/contents/upload/BAY_BAY.png',
                    'installment': null,
                    'remark': null
                  },
                  {
                    'name': 'กรุงเทพ จำกัด (มหาชน)',
                    'abb': 'BBL',
                    'imageUrl': 'https://10.104.249.89/CPC-FE-WEB/api/contents/upload/BBL_BBL.png',
                    'installment': null,
                    'remark': null
                  },
                  {
                    'name': 'แห่งประเทศจีน',
                    'abb': 'BOC',
                    'imageUrl': 'https://10.104.249.89/CPC-FE-WEB/api/contents/upload/BOC_BOC.png',
                    'installment': null,
                    'remark': null
                  },
                  {
                    'name': 'ซีไอเอ็มบี ไทย จำกัด (มหาชน)',
                    'abb': 'CIMB',
                    'imageUrl': 'https://10.104.249.89/CPC-FE-WEB/api/contents/upload/CIMB_CIMB.png',
                    'installment': null,
                    'remark': null
                  },
                  {
                    'name': 'ซิตี้แบงก์',
                    'abb': 'CITI',
                    'imageUrl': 'https://10.104.249.89/CPC-FE-WEB/api/contents/upload/CITI_CITI.png',
                    'installment': null,
                    'remark': null
                  },
                  {
                    'name': 'ซิตี้แบงก์ เรดดี้เครดิต',
                    'abb': 'CITIREADY',
                    'imageUrl': 'https://10.104.249.89/CPC-FE-WEB/api/contents/upload/CITIREADY_citibank02.jpg',
                    'installment': null,
                    'remark': null
                  },
                  {
                    'name': 'แคปปิตอล โอเค',
                    'abb': 'COK',
                    'imageUrl': 'https://10.104.249.89/CPC-FE-WEB/api/contents/upload/COK_capOK.png',
                    'installment': null,
                    'remark': null
                  },
                  {
                    'name': 'เซ็นทรัล',
                    'abb': 'CT',
                    'imageUrl': 'https://10.104.249.89/CPC-FE-WEB/api/contents/upload/CT_centralThe1.png',
                    'installment': null,
                    'remark': null
                  },
                  {
                    'name': 'บริษัท เซทเทเลม (ประเทศไทย) จำกัด',
                    'abb': 'CTM',
                    'imageUrl': null,
                    'installment': null,
                    'remark': null
                  },
                  {
                    'name': 'Dominion Bank Canada',
                    'abb': 'DBC',
                    'imageUrl': null,
                    'installment': null,
                    'remark': null
                  },
                  {
                    'name': 'บัตรเครดิต เฟิร์สช้อยส์',
                    'abb': 'FCC',
                    'imageUrl': 'https://10.104.249.89/CPC-FE-WEB/api/contents/upload/FCC_FCC.png',
                    'installment': null,
                    'remark': null
                  },
                  {
                    'name': 'Foreign Bank',
                    'abb': 'FRB',
                    'imageUrl': null,
                    'installment': null,
                    'remark': null
                  },
                  {
                    'name': 'ออมสิน',
                    'abb': 'GSB',
                    'imageUrl': 'https://10.104.249.89/CPC-FE-WEB/api/contents/upload/GSB_GSB.png',
                    'installment': null,
                    'remark': null
                  },
                  {
                    'name': 'ฮ่องกงแอนด์เซี่ยงไฮ้',
                    'abb': 'HKSH',
                    'imageUrl': 'https://10.104.249.89/CPC-FE-WEB/api/contents/upload/HKSH_HSBC.png',
                    'installment': null,
                    'remark': null
                  },
                  {
                    'name': 'ธนาคารไอซีบีซี จำกัด (มหาชน)',
                    'abb': 'ICBC',
                    'imageUrl': null,
                    'installment': null,
                    'remark': null
                  },
                  {
                    'name': 'ธนาคารอิสลามแห่งประเทศไทย',
                    'abb': 'ISBT',
                    'imageUrl': null,
                    'installment': null,
                    'remark': null
                  },
                  {
                    'name': 'กสิกรไทย จำกัด (มหาชน)',
                    'abb': 'KBNK',
                    'imageUrl': 'https://10.104.249.89/CPC-FE-WEB/api/contents/upload/KBNK_kBank02.png',
                    'installment': null,
                    'remark': null
                  },
                  {
                    'name': 'กรุงไทย จำกัด (มหาชน)',
                    'abb': 'KTB',
                    'imageUrl': 'https://10.104.249.89/CPC-FE-WEB/api/contents/upload/KTB_KTB.png',
                    'installment': null,
                    'remark': null
                  },
                  {
                    'name': 'ธนชาต จำกัด(มหาชน)',
                    'abb': 'NBNK',
                    'imageUrl': 'https://10.104.249.89/CPC-FE-WEB/api/contents/upload/NBNK_NBNK.png',
                    'installment': null,
                    'remark': null
                  },
                  {
                    'name': 'Other Bank',
                    'abb': 'OTB',
                    'imageUrl': null,
                    'installment': null,
                    'remark': null
                  },
                  {
                    'name': 'เพย์เมนท์ โซลูชั่น',
                    'abb': 'PMS',
                    'imageUrl': null,
                    'installment': null,
                    'remark': null
                  },
                  {
                    'name': 'ไทยพาณิชย์ จำกัด (มหาชน)',
                    'abb': 'SCB',
                    'imageUrl': 'https://10.104.249.89/CPC-FE-WEB/api/contents/upload/SCB_SCB02.png',
                    'installment': null,
                    'remark': null
                  },
                  {
                    'name': 'SCB Speedy Cash',
                    'abb': 'SCBSPEEDY',
                    'imageUrl': 'https://10.104.249.89/CPC-FE-WEB/api/contents/upload/SCBSPEEDY_SCB Speedy.png',
                    'installment': null,
                    'remark': null
                  },
                  {
                    'name': 'สแตนดาร์ดชาร์เตอร์ด (ไทย) จำกัด (มหาชน)',
                    'abb': 'SCN',
                    'imageUrl': 'https://10.104.249.89/CPC-FE-WEB/api/contents/upload/SCN_scn-logo.jpg',
                    'installment': null,
                    'remark': null
                  },
                  {
                    'name': 'SUMITOMO',
                    'abb': 'SUMI',
                    'imageUrl': null,
                    'installment': null,
                    'remark': null
                  },
                  {
                    'name': 'บัตรเครดิต เทสโก้ โลตัส วีซ่า',
                    'abb': 'TCS',
                    'imageUrl': 'https://10.104.249.89/CPC-FE-WEB/api/contents/upload/TCS_TescoLotus-CreditCard.png',
                    'installment': null,
                    'remark': null
                  },
                  {
                    'name': 'ทหารไทย จำกัด (มหาชน)',
                    'abb': 'TMB',
                    'imageUrl': 'https://10.104.249.89/CPC-FE-WEB/api/contents/upload/TMB_TMB02.png',
                    'installment': null,
                    'remark': null
                  },
                  {
                    'name': 'ยูโอบี จำกัด (มหาชน)',
                    'abb': 'UOB',
                    'imageUrl': 'https://10.104.249.89/CPC-FE-WEB/api/contents/upload/UOB_UOB-bank.png',
                    'installment': null,
                    'remark': null
                  },
                  {
                    'name': 'UOB Cash Plus',
                    'abb': 'UOBCASHP',
                    'imageUrl': 'https://10.104.249.89/CPC-FE-WEB/api/contents/upload/UOBCASHP_UOB CashPlus.png',
                    'installment': null,
                    'remark': null
                  }
                ],
                'freeGoods': [
                  {
                    'tradeFreegoodsId': '116619',
                    'code': '33014507',
                    'name': 'KRS APP IPH X MALMO 4 CARD FOLIOCASE BK',
                    'qty': '1'
                  },
                  {
                    'tradeFreegoodsId': '116618',
                    'code': '33007573',
                    'name': 'IPHONE 5S CASE RED-ITS',
                    'qty': '1'
                  }
                ],
                'matCode': 'undefined',
                'channels': [
                  'AIS'
                ],
                'tradeChannels': [
                  {
                    'partnerCode': null,
                    'locationCode': null,
                    'locationCodePartner': null,
                    'region': null,
                    'locType': null,
                    'locSubtype': null,
                    'province': 'ALL'
                  }
                ],
                'customerGroups': [
                  {
                    'name': 'ลูกค้าปัจจุบัน',
                    'code': 'MC004',
                    'flowId': '000'
                  }
                ]
              }
            ],
            'freeGoods': [
              {
                'name': 'KRS APP IPH X MALMO 4 CARD FOLIOCASE BK',
                'code': '33014507',
                'qty': '1'
              },
              {
                'name': 'IPHONE 5S CASE RED-ITS',
                'code': '33007573',
                'qty': '1'
              }
            ]
          }
        ]
      }
    ];
  }
}

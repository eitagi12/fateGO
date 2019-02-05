import { Component, OnInit, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BsModalService, BsModalRef, TabsetComponent } from 'ngx-bootstrap';
import { forkJoin, concat } from 'rxjs';
import { SalesService, TokenService, HomeService, User, CampaignSliderInstallment, CampaignSlider, PromotionShelve, PageLoadingService, PromotionShelveGroup } from 'mychannel-shared-libs';
import { PRODUCT_TYPE, PRODUCT_SUB_TYPE, SUB_STOCK_DESTINATION, PRODUCT_HANDSET_BUNDLE } from 'src/app/buy-product/constants/products.constants';
import { ROUTE_BUY_PRODUCT_PRODUCT_PAGE } from 'src/app/buy-product/constants/route-path.constant';
import { AddToCartService } from 'src/app/buy-product/services/add-to-cart.service';
import { PriceOption, PrivilegeTradeInstallment } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { HttpClient } from '@angular/common/http';


export class PriceOptionPrivilegeTradeBank {
    abb: string;
    name: string;
    imageUrl: string;
    promotion: string;
    installment: string;
    remark: string;
    installmentDatas?: PrivilegeTradeInstallment[];
}


@Component({
    selector: 'app-campaign',
    templateUrl: './campaign-page.component.html',
    styleUrls: ['./campaign-page.component.scss']
})
export class CampaignPageComponent implements OnInit, OnDestroy {

    @ViewChild('productSpecTemplate')
    productSpecTemplate: TemplateRef<any>;

    @ViewChild('selectPackageTemplate')
    selectPackageTemplate: TemplateRef<any>;

    @ViewChild('installmentTemplate')
    installmentTemplate: TemplateRef<any>;

    // local storage name
    priceOption: PriceOption;

    modalRef: BsModalRef;
    params: Params;
    hansetBundle: string;
    productDetail: any;
    productSpec: any;
    selectCustomerGroup: any;

    // campaign
    tabs: any[];
    campaignSliders: CampaignSlider[];
    priceOptions: any;
    priceOptionsData: any;

    promotionShelves: PromotionShelve[];

    groupInstallmentByPercentageAndMonths: any;

    priceWithBankInstallmentAndAdvancePayment = { data: [], isShowAllAdvancePay: false, fromTrade: false };

    private privilegeTradeInstallmentGroup = [];

    // trade
    productDetailService: Promise<any>;
    constructor(
        private modalService: BsModalService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private salesService: SalesService,
        private tokenService: TokenService,
        private homeService: HomeService,
        private addToCartService: AddToCartService,
        private priceOptionService: PriceOptionService,
        private pageLoadingService: PageLoadingService,
        private http: HttpClient
    ) {
        this.priceOption = this.priceOptionService.load();
    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe((params: any) => {
            this.params = params;
            this.callService(
                params.brand, params.model,
                params.productType, params.productSubtype
            );
        });
    }

    onBack() {
        if (this.priceOption && this.priceOption.campaign) {
            this.priceOption.campaign = null;
            return;
        }

        const queryParams: any = {
            brand: this.params.brand
        };
        if (this.params.previous === 'best-seller') {
            queryParams.model = this.params.model;
        }
        if (this.params.previous === 'search') {
            queryParams.commercialName = this.params.commercialName;
        }

        this.router.navigate([ROUTE_BUY_PRODUCT_PRODUCT_PAGE], { queryParams });
    }

    onHome() {
        this.homeService.goToHome();
    }

    /* product stock */
    private callService(
        brand: string, model: string,
        productType?: string, productSubtype?: string) {
        const user: User = this.tokenService.getUser();

        // clear
        this.hansetBundle = `${productSubtype === PRODUCT_HANDSET_BUNDLE ? '(แถมชิม)' : ''}`;
        this.productDetail = {};

        this.productDetailService = this.salesService.productDetail({
            brand: brand,
            location: user.locationCode,
            model: model,
            productType: productType || PRODUCT_TYPE,
            productSubtype: productSubtype || PRODUCT_SUB_TYPE
        });
        this.productDetailService.then((resp: any) => {

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

    getProductSpecification(brand: string, model: string) {
        const modalOptions = { class: 'modal-lg' };
        if (this.productSpec) {
            this.modalRef = this.modalService.show(this.productSpecTemplate, modalOptions);
            return;
        }

        const user: User = this.tokenService.getUser();
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
        });
    }

    onProductStockSelected(product) {
        this.tabs = null;
        if (this.priceOption.productStock &&
            this.priceOption.productStock.colorName !== product.colorName) {
            this.priceOption.campaign = null;
            this.priceOption.trade = null;
        }

        this.priceOption.productStock = product;

        this.callPriceOptionsService(
            this.params.brand, this.params.model,
            product.colorName, this.params.productType,
            this.params.productSubtype
        );
    }

    /* campaign */
    private callPriceOptionsService(brand: string, model: string, color: string, productType: string, productSubtype: string) {
        const user: User = this.tokenService.getUser();
        this.salesService.priceOptions({
            brand: brand,
            model: model,
            color: color,
            productType: productType,
            productSubtype: productSubtype,
            location: user.locationCode
        }).then((resp: any) => {
            this.priceOptions = this.filterPriceOptions(resp.data.priceOptions || []);
            this.priceOptionService.save(this.priceOptions);
            // init tab
            this.initialTabs(this.priceOptions);
        });
    }

    private filterPriceOptions(priceOptions: any[]): any {
        return priceOptions.filter((campaign: any) => {
            // Filter here ...
            if (campaign.promotionFlag !== 'Y') {
                return false;
            }

            let allowPriceOption = true;
            // PREBOOKING === flowId
            if ('PREBOOKING' === campaign.code) {
                allowPriceOption = this.params.campaignCode === 'PREBOOKING';
            }

            if ('LOTUS' === campaign.code) {
                allowPriceOption = this.params.campaignCode === 'AISHOTDEAL_PREPAID_LOTUS';
            }

            return allowPriceOption;
        });
    }

    private initialTabs(priceOptions: any[]) {
        this.tabs = [];

        priceOptions.forEach((priceOption: any) => {
            priceOption.customerGroups.map((customerGroup: any) => {
                return {
                    code: customerGroup.code,
                    name: customerGroup.name,
                    active: false
                };
            }).forEach((group: any) => {
                if (!this.tabs.find((tab: any) => tab.code === group.code)) {
                    this.tabs.push(group);
                }
            });
        });
        // sort by mc001 - mc004
        this.tabs.sort((a: any, b: any) => {
            if (a.code === b.code) {
                return 0;
            } else if (a.code > b.code) {
                return 1;
            } else {
                return -1;
            }
        });

        if (this.tabs.length > 0) {
            this.onCustomerGroupSelected(this.tabs[0]);
            setTimeout(() => {
                this.tabs[0].active = true;
            }, 250);
        }
    }

    private getDiscount(priceOption: any): number {
        const discounts: number[] = (priceOption.privileges || []).map((privilege: any) => {
            return (privilege.trades || []).find((trade: any) => {
                return trade.discount
                    && trade.discount.specialAmount
                    && trade.discount.specialType === 'P'
                    && trade.banks
                    && trade.banks.length > 0;
            });
        }).sort((a, b) => a !== b ? a < b ? -1 : 1 : 0);
        return discounts ? discounts[0] : 0;
    }

    onCustomerGroupSelected(customerGroup: any) {
        this.selectCustomerGroup = customerGroup;
        if (!this.priceOptions) {
            this.campaignSliders = [];
            return;
        }

        // set active tab
        this.tabs.map((val) => {
            if (customerGroup.code === val.code) {
                val.active = true;
                return val;
            } else {
                val.active = false;
                return val;
            }
        });


        this.priceOptions = this.priceOptionService.load();

        this.campaignSliders = this.priceOptions
            .filter((campaign: any) => {
                // filter campaign by tab
                return campaign.customerGroups.find((group: any) => group.code === customerGroup.code);
            }).map((campaign: any) => {
                // check prepaid flow
                const prepaid = campaign.customerGroups.find((group: any) => group.flowId === '102');

                const campaignSlider: CampaignSlider = {
                    thumbnail: campaign.imageUrl,
                    name: campaign.campaignName,
                    minPromotionPrice: +campaign.minimumPromotionPrice,
                    maxPromotionPrice: +campaign.maximumPromotionPrice,
                    minAdvancePay: +campaign.minimumAdvancePay,
                    maxAdvancePay: +campaign.maximumAdvancePay,
                    contract: +campaign.maximumContract,
                    value: campaign
                };
                campaignSlider.installments = this.getInstallments(campaign);
                campaignSlider.discount = this.getDiscount(campaign);
                campaignSlider.freeGoods = (campaign.freeGoods || []).map((freeGood: any) => freeGood.name);
                if (prepaid) {
                    campaignSlider.onTopPackagePrice = +campaign.minimumPackagePrice;
                } else {
                    campaignSlider.mainPackagePrice = +campaign.minimumPackagePrice;
                }

                const campaignByGroup = campaignSlider.value.privileges
                    .filter(privileges => Object.keys(privileges.customerGroups
                    .filter(privilegeGroup => privilegeGroup.code === this.selectCustomerGroup.code)).length > 0)
                    .filter(privileges => Object.keys(privileges.trades.filter(trade => Object.keys(trade.customerGroups
                    .filter(treadGroup => treadGroup.code === this.selectCustomerGroup.code)).length > 0)).length > 0)
                    .filter(chanel => chanel.channels.indexOf('AIS') > -1)
                    .map(privilegesPayment => {

                        // map data Treads in Privilege
                        privilegesPayment.trades = privilegesPayment.trades
                        .filter((trade: any) => trade.channels.indexOf('AIS') > -1)
                        .map((treadData) => {

                            const isPaymentCash = treadData.payments.find((payment) => payment.method === 'CA');
                            const isPaymentCredist = treadData.payments.find((payment) => payment.method === 'CC');

                            if (treadData.payments && treadData.payments.length && treadData.payments[0].installId === null) {
                                const tradePayment = { cardType: '', method: 'CC/CA', installmentId: '' };
                                treadData.payments = (isPaymentCredist  && isPaymentCash) ? [tradePayment] : treadData.payments;
                            }

                            treadData.priority = this.setPriorityByPaymentMethod(treadData);
                            return treadData;

                        })
                        .filter((tread) => {

                            /* Merge Trade Payment
                                เงื่อนไขการรวม Trade จ่ายเงิน
                                1.payments[0].installId === null
                                2.payments[0].method == 'CC'
                            */

                            if (tread.payments && tread.payments.length > 0 && tread.payments[0].installId === null) {
                                if (tread.payments[0].method === 'CC') {
                                    return;
                                }
                            }
                            return tread;
                        })
                        .sort((a, b) => a.priority - b.priority);

                        return privilegesPayment;

                    });

                // Sort Price จากน้อยไปมาก
                const privilege = campaignByGroup
                    .sort((a: any, b: any) =>
                        (Number(a.maximumPromotionPrice) + Number(a.maximumAdvancePay)) -
                        (Number(b.maximumPromotionPrice) + Number(b.maximumAdvancePay))
                    );

                campaignSlider.value.privileges = privilege;
                return campaignSlider;

            }).sort((a: any, b: any) => Number(a.value.price) - Number(b.value.price));

    }

     setPriorityByPaymentMethod(priceOptionPrivilegeTrade: any) {
        const paymentTypes: any[] = priceOptionPrivilegeTrade.payments;
        const banks: any[] = priceOptionPrivilegeTrade.banks;
        const FIRST_PRIORITY = 1;
        const SECOND_PRIORITY = 2;
        const THIRD_PRIORITY = 3;
        let priority = 3;
        if (paymentTypes && paymentTypes.length >= 1) {
            const paymentType: any = (paymentTypes.filter((paymentList: any) => paymentList.method !== 'PP'))[0];
            if (paymentType.method) {
              switch (paymentType.method) {
                case 'CA':
                    priority = THIRD_PRIORITY;
                    break;
                case 'CC':
                    priority = FIRST_PRIORITY;
                    break;
                case 'CC/CA':
                    priority = this.isFullPayment(banks) ? THIRD_PRIORITY : FIRST_PRIORITY;
                    break;
                default:
                    priority = THIRD_PRIORITY;
                    break;
              }
            }
            if (priceOptionPrivilegeTrade.advancePay && priceOptionPrivilegeTrade.advancePay.installmentFlag === 'Y') {
              priority = SECOND_PRIORITY;
            }
            return priority;
          }
    }

    private isFullPayment(banks: PriceOptionPrivilegeTradeBank[]): boolean {
        if (banks && banks.length > 0) {
          const installmentBanks: PriceOptionPrivilegeTradeBank[] = banks
            .filter((bank: PriceOptionPrivilegeTradeBank) => bank.installmentDatas ? bank.installmentDatas.length : false);
            return !!installmentBanks.length;
        } else {
          return true;
        }
      }

    getInstallment(installments: any, campaign: any) {
        const campaignByGroup = campaign.privileges
            .filter(privileges => Object.keys(privileges.customerGroups
                .filter(customerGroup => customerGroup.code === this.selectCustomerGroup.code)).length > 0)
            .filter(privileges => Object.keys(privileges.trades.filter(trade => Object.keys(trade.customerGroups
                .filter(customerGroup => customerGroup.code === this.selectCustomerGroup.code)).length > 0)).length > 0);

        console.log('campaignByGroup', campaignByGroup);
        installments.forEach((installment: any) => {
            const priceList: any[] = [];
            const advancePayList: any[] = [];
            let showAdvancePay = false;
            campaignByGroup.forEach((privilege: any) => {
                privilege.trades.forEach((trade: any) => {
                    const isExist = trade.banks.filter(filterBanks => installment.banks
                        .some(bank => bank.installment === filterBanks.installment && bank.abb === filterBanks.abb) > 0);
                    if (Object.keys(isExist).length > 0) {
                        const keys: string[] = (isExist[0].installment || '').split(/(%|เดือน)/);
                        const groupKey = `${(keys[0] || '').trim()}-${(keys[2] || '').trim()}`;
                        const key: string[] = groupKey.split('-');
                        const price = this.calculatePrice(
                            +trade.promotionPrice,
                            +key[1] || 0,
                            +key[0] || 0
                        );
                        const advancePay = this.calculateAdvancePay(
                            +trade.promotionPrice,
                            +trade.advancePay.amount,
                            +key[1] || 0,
                            +key[0] || 0
                        );
                        showAdvancePay = !!(trade.advancePay.installmentFlag === 'Y'
                            && trade.advancePay.amount !== null && trade.advancePay.amount !== 0 && trade.advancePay.amount);
                        if (price !== 0) {
                            priceList.push(price);
                        }
                        if (advancePay !== 0) {
                            advancePayList.push(advancePay);
                        }
                    }
                });
            });
            const sortPriceList = priceList.sort((a, b) => a !== b ? a < b ? -1 : 1 : 0);
            const sortAdvanceAdvancePayList = advancePayList.sort((a, b) => a !== b ? a < b ? -1 : 1 : 0);
            const priceWithInstallmentBankAndAdvancePayment = {
                priceList: sortPriceList,
                advancePayList: sortAdvanceAdvancePayList,
                showAdvancePay: showAdvancePay
            };
        });
    }

    onCampaignSelected(campaign: any) {
        this.priceOption.campaign = campaign;
    }

    onPromotionShelve(campaign: any) {
        this.callPromotionShelveService(campaign);
    }

    onInstallmentList(campaignSlider: any) {
        const priceList = [];
        const campaign = campaignSlider.value;
        const installments = campaignSlider.installments;

        this.priceWithBankInstallmentAndAdvancePayment.data = this.getInstallments(campaign);
        this.priceWithBankInstallmentAndAdvancePayment.isShowAllAdvancePay = false;
        this.showInstallmentListTemplate();
        this.getInstallment(installments, campaign);
    }

    getInstallments(campaign: any): CampaignSliderInstallment[] {
        const banks: any = [];
        campaign.privileges.forEach((privilege: any) => {
            privilege.trades.forEach((trade: any) => {
                trade.banks.forEach((bank: any) => {
                    banks.push(bank);
                });
            });
        });
        const installmentGroups = banks.reduce((previousValue: any, currentValue: any) => {
            const keys: string[] = (currentValue.installment || '').split(/(%|เดือน)/);
            const groupKey = `${(keys[0] || '').trim()}-${(keys[2] || '').trim()}`;
            if (!previousValue[groupKey]) {
                previousValue[groupKey] = [currentValue];
            } else {
                const bankExist = previousValue[groupKey].find((bank: any) => bank.abb === currentValue.abb);
                if (!bankExist) {
                    previousValue[groupKey].push(currentValue);
                }
            }
            return previousValue;
        }, {});

        const installments: CampaignSliderInstallment[] = [];
        Object.keys(installmentGroups).forEach((key: string) => {
            const keys: string[] = key.split('-');
            installments.push({
                percentage: +keys[0] || 0,
                month: +keys[1] || 0,
                banks: installmentGroups[key]
            });
        });
        // จ่ายน้อยผ่อนนาน
        return installments.sort((a: any, b: any) => {
            return a.month > b.month ? -1 : 1;
        });
    }

    callPromotionShelveService(getCampaign: any) {
        this.pageLoadingService.openLoading();
        const packageKeyRef = getCampaign.packageKeyRef;
        this.http.post('/api/salesportal/promotion-shelves', {
            userId: packageKeyRef
        }).toPromise()
            .then((resp: any) => {
                const data = resp.data.data || [];
                const promotionShelves: PromotionShelve[] = data.map((promotionShelve: any) => {
                    return {
                        title: promotionShelve.title,
                        icon: promotionShelve.icon,
                        promotions: promotionShelve.subShelves
                            .sort((a, b) => a.priority !== b.priority ? a.priority < b.priority ? -1 : 1 : 0)
                            .map((subShelve: any) => {
                                return { // group
                                    id: subShelve.id,
                                    title: subShelve.title,
                                    sanitizedName: subShelve.sanitizedName,
                                    items: []
                                };
                            })
                    };
                });
                return Promise.resolve(promotionShelves);
            })
            .then((promotionShelves: PromotionShelve[]) => {
                const parameter = [{
                    'name': 'orderType',
                    'value': 'New Registration'
                }, {
                    'name': 'billingSystem',
                    'value': 'IRB'
                }];

                const promiseAll = [];
                promotionShelves.forEach((promotionShelve: PromotionShelve) => {
                    const promise = promotionShelve.promotions.map((promotion: PromotionShelveGroup) => {
                        return this.http.post('/api/salesportal/promotion-shelves/promotion', {
                            userId: packageKeyRef,
                            sanitizedName: promotion.sanitizedName,
                            parameters: parameter
                        }).toPromise().then((resp: any) => {
                            const data = resp.data.data || [];
                            const campaign: any = getCampaign;
                            const minimumPackagePrice = +campaign.minimumPackagePrice;
                            const maximumPackagePrice = +campaign.maximumPackagePrice;

                            // reference object
                            promotion.items = data.filter((promotions: any) => {
                                return promotions.customAttributes.chargeType === 'Post-paid' &&
                                    minimumPackagePrice <= +promotions.customAttributes.priceExclVat &&
                                    (maximumPackagePrice > 0 ? maximumPackagePrice >= +promotions.customAttributes.priceExclVat : true);
                            })
                                .sort((a, b) => {
                                    return +a.customAttributes.priceInclVat !== +b.customAttributes.priceInclVat ?
                                        +a.customAttributes.priceInclVat < +b.customAttributes.priceInclVat ? -1 : 1 : 0;
                                }).map((promotions: any) => {
                                    return { // item
                                        id: promotions.id,
                                        title: promotions.title,
                                        detail: promotions.detailTH,
                                        value: promotions
                                    };
                                });
                        });
                    });
                    promiseAll.concat(promise);
                });

                Promise.all(promiseAll).then(() => {
                    this.promotionShelves = promotionShelves;
                    if (this.promotionShelves && this.promotionShelves.length > 0) {
                        this.promotionShelves[0].active = true;
                        if (this.promotionShelves[0].promotions && this.promotionShelves[0].promotions.length > 0) {
                            this.promotionShelves[0].promotions[0].active = true;
                        }
                    }
                });

            })
            .then(() => {
                this.showSelectPackageTemplate();
                this.pageLoadingService.closeLoading();
            });
    }

    /* privilege */
    onTradeSelected(trade: any) {
        this.priceOption.trade = trade;
        this.pageLoadingService.openLoading();
        this.addToCartService.reserveStock().then((nextUrl) => {
            console.log('Next url => ', nextUrl);
            this.router.navigate([nextUrl]).then(() => this.pageLoadingService.closeLoading());
        });
    }

    groupPrivilegeTradeInstallmentByPercentageMonth(campaignSlider: any) {
        const groupByPercentageAndMonths = new Array<PrivilegeTradeInstallment>();
        const priceOptionForFilter = Object.assign({}, campaignSlider);
        const filterPriceOption = this.getFilterPriceOptionByCustomerGroup(priceOptionForFilter);
        try {
            if (filterPriceOption.privileges) {
                filterPriceOption.privileges
                    .map(privilge => {
                        privilge.trades
                            .map(trade => {
                                trade.banks.map(bank => {
                                    bank.installmentDatas.map(installment => {
                                        if (groupByPercentageAndMonths.length === 0) {
                                            groupByPercentageAndMonths.push(installment);
                                        } else {
                                            const isExist = groupByPercentageAndMonths
                                                .filter(
                                                    installmentInGroup =>
                                                        installmentInGroup.installmentMounth === installment.installmentMounth &&
                                                        installmentInGroup.installmentPercentage === installment.installmentPercentage
                                                );
                                            if (isExist.length === 0) {
                                                groupByPercentageAndMonths.push(installment);
                                            }
                                        }
                                    });
                                });
                            });
                    });
            }
        } catch (error) {
            console.error('error', error);
        }
        // sort month desc
        groupByPercentageAndMonths.sort((a, b) => {
            return a.installmentMounth > b.installmentMounth ? -1 : (a.installmentMounth < b.installmentMounth ? 1 : 0);
        });
        // sort percentage asc
        groupByPercentageAndMonths.sort((a, b) => {
            return a.installmentPercentage > b.installmentPercentage ? 1 : (a.installmentPercentage < b.installmentPercentage ? -1 : 0);
        });
        this.groupInstallmentByPercentageAndMonths = groupByPercentageAndMonths;
        this.groupBankByInstallment(filterPriceOption);
    }

    private groupBankByInstallment(priceOption: any) {
        const priceWithInstallmentBankAndAdvancePaymentList = [];
        const groupBankByInstallment = new Array<PrivilegeTradeInstallment>();
        const priceWithInstallmentList = [];
        for (const installmentGroupByMonthAndPercetage of this.groupInstallmentByPercentageAndMonths) {
            const banks = [];
            const priceList = [];
            const advancePayList = [];
            let showAdvancePay = false;
            for (const privilege of priceOption.privileges) {
                for (const trade of privilege.trades) {
                    for (const bank of trade.banks) {
                        const isExist = bank.installmentDatas
                            .filter(
                                installment =>
                                    installment.installmentMounth === installmentGroupByMonthAndPercetage.installmentMounth &&
                                    installment.installmentPercentage === installmentGroupByMonthAndPercetage.installmentPercentage);
                        if (isExist.length > 0) {
                            if (banks.length === 0) {
                                const price = this.calculatePrice(
                                    trade.promotionPrice,
                                    installmentGroupByMonthAndPercetage.installmentMounth,
                                    installmentGroupByMonthAndPercetage.installmentPercentage
                                );
                                const advancePay = this.calculateAdvancePay(
                                    trade.promotionPrice,
                                    trade.advancePay.amount,
                                    installmentGroupByMonthAndPercetage.installmentMounth,
                                    installmentGroupByMonthAndPercetage.installmentPercentage
                                );
                                showAdvancePay =
                                    trade.advancePay.installmentFlag === 'Y' && trade.advancePay.amount !== null
                                        && trade.advancePay.amount !== 0 && trade.advancePay.amount ? true : false;
                                banks.push(bank);
                                priceList.push(price);
                                advancePayList.push(advancePay);
                            } else {
                                const isExistBank = banks
                                    .filter(
                                        (selectBank: PriceOptionPrivilegeTradeBank) =>
                                            selectBank.abb === bank.abb);

                                if (isExistBank.length === 0) {
                                    const price = this.calculatePrice(
                                        trade.promotionPrice,
                                        installmentGroupByMonthAndPercetage.installmentMounth,
                                        installmentGroupByMonthAndPercetage.installmentPercentage
                                    );
                                    const advancePay = this.calculateAdvancePay(
                                        trade.promotionPrice,
                                        trade.advancePay.amount,
                                        installmentGroupByMonthAndPercetage.installmentMounth,
                                        installmentGroupByMonthAndPercetage.installmentPercentage
                                    );
                                    showAdvancePay = trade.advancePay.installmentFlag === 'Y' && trade.advancePay.amount !== null
                                        && trade.advancePay.amount !== 0 && trade.advancePay.amount ? true : false;
                                    banks.push(bank);
                                    priceList.push(price);
                                    advancePayList.push(advancePay);
                                } else {
                                    const price = this.calculatePrice(
                                        trade.promotionPrice,
                                        installmentGroupByMonthAndPercetage.installmentMounth,
                                        installmentGroupByMonthAndPercetage.installmentPercentage
                                    );
                                    const advancePay = this.calculateAdvancePay(
                                        trade.promotionPrice,
                                        trade.advancePay.amount,
                                        installmentGroupByMonthAndPercetage.installmentMounth,
                                        installmentGroupByMonthAndPercetage.installmentPercentage
                                    );
                                    showAdvancePay = trade.advancePay.installmentFlag === 'Y' && trade.advancePay.amount !== null
                                        && trade.advancePay.amount !== 0 && trade.advancePay.amount ? true : false;
                                    priceList.push(price);
                                    advancePayList.push(advancePay);
                                }
                            }
                        }
                    }
                }
            }

            const filterZeroPriceList = priceList.filter(price => price !== 0);
            const filterZeroAdvancePayList = advancePayList.filter(advancePay => advancePay !== 0);
            const sortPriceList = filterZeroPriceList.sort((a, b) => a !== b ? a < b ? -1 : 1 : 0);
            const sortAdvanceAdvancePayList = filterZeroAdvancePayList.sort((a, b) => a !== b ? a < b ? -1 : 1 : 0);
            const priceWithInstallmentBankAndAdvancePayment = {
                banks: banks,
                installment: installmentGroupByMonthAndPercetage,
                priceList: sortPriceList,
                advancePayList: sortAdvanceAdvancePayList,
                showAdvancePay: showAdvancePay
            };
            priceWithInstallmentList.push(priceWithInstallmentBankAndAdvancePayment);
        }



        const isShowAllAdvancePay = priceWithInstallmentList.filter(price => price.showAdvancePay === true);
        if (isShowAllAdvancePay.length > 0) {
            this.priceWithBankInstallmentAndAdvancePayment.isShowAllAdvancePay = true;
        }

        console.log('priceWithInstallmentList', priceWithInstallmentList);

        this.priceWithBankInstallmentAndAdvancePayment.data = priceWithInstallmentList;
    }

    private getFilterPriceOptionByCustomerGroup(campaignSlider: any) {
        if (campaignSlider.value.privileges) {
            const filterPrivileges = campaignSlider.value.privileges
                .filter(privilege => {
                    const isPrivilegeInCustomerGroup =
                        privilege.customerGroups.filter(customerGroup => customerGroup.code !== '5');
                    return isPrivilegeInCustomerGroup.length > 0 ? true : false;
                });

            const filterPrivilegeAndTrade = filterPrivileges
                .map(filterPrivilege => {
                    const filterTrades = filterPrivilege.trades.filter(trade => {
                        const isPrivilegeTradeInCustomerGroup =
                            trade.customerGroups.filter(customerGroup => customerGroup.code === '5');
                        return isPrivilegeTradeInCustomerGroup.length > 0 ? true : false;
                    });
                    filterPrivilege.trades = filterTrades;
                    return filterPrivilege;
                });

            campaignSlider.value.privileges = filterPrivileges;
        }
        return campaignSlider;
    }

    private calculatePrice(priceAmount: number, installmentMonth: number, installmentPercentage: number) {
        let price = 0;
        if (installmentPercentage !== 0) {

        }

        // คำนวนเปอร์เซ็น
        price = installmentPercentage === 0 ? priceAmount / installmentMonth :
            (priceAmount + (installmentMonth * (priceAmount * Math.ceil(installmentPercentage) / 100))) / installmentMonth;
        return Math.round(price);
    }

    private calculateAdvancePay(price: number, advancePayAmount: number, installmentMonth: number, installmentPercentage: number) {
        if (price > 0) {
            let advancePay = 0;
            advancePay = installmentPercentage === 0 ?
                (price + advancePayAmount) / installmentMonth :
                (
                    (price + advancePayAmount + (installmentMonth *
                        (price + advancePayAmount) * Math.ceil(installmentPercentage) / 100)
                    )
                ) / installmentMonth;
            return Math.round(advancePay);
        } else {
            return 0;
        }
    }

    showSelectPackageTemplate(): void {
        const modalOptions = { class: 'modal-lg' };
        this.modalRef = this.modalService.show(this.selectPackageTemplate, modalOptions);
    }

    showInstallmentListTemplate(): void {
        const modalOptions = { class: 'modal-lg' };
        this.modalRef = this.modalService.show(this.installmentTemplate, modalOptions);
    }

    ngOnDestroy(): void {
        const queryParams = {};
        Object.keys(this.params || {}).forEach((key: string) => {
            queryParams[key] = this.params[key];
        });
        this.priceOption.queryParams = queryParams;

        this.priceOptionService.save(this.priceOption);
    }
}

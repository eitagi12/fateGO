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

export enum orderType {
    NEW_REGISTRATION = 'New Registration',
    CHANGE_CHARGE_TYPE = 'Change Charge Type',
    PORT_IN = 'Port - In',
    CHANGE_SERVICE = 'Change Service',
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
    promotionShelves: PromotionShelve[];

    groupInstallmentByPercentageAndMonths: any;

    private privilegeTradeInstallmentGroup = [];

    // trade
    productDetailService: Promise<any>;
    priceOptionDetailService: Promise<any>;
    packageDetailService: Promise<any>;
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
        this.campaignSliders = [];
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
        this.priceOptionDetailService = this.salesService.priceOptions({
            brand: brand,
            model: model,
            color: color,
            productType: productType,
            productSubtype: productSubtype,
            location: user.locationCode
        });
        this.priceOptionDetailService.then((resp: any) => {
            this.priceOptions = this.filterPriceOptions(resp.data.priceOptions || []);
            this.priceOptionService.save(this.priceOptions);
            // init tab
            this.initialTabs(this.priceOptions);
            return ;
        });
    }

    private filterPriceOptions(priceOptions: any[]): any {
        return priceOptions.filter((campaign: any) => {
            // Filter here ...
            if (campaign.promotionFlag !== 'Y') {
                return false;
            }
            if ('AISHOTDEAL_PREPAID_LOTUS' === campaign.code) {
                return false;
            }
            if ('AISHOTDEAL_PREPAID' === campaign.code) {
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
                                    treadData.payments = (isPaymentCredist && isPaymentCash) ? [tradePayment] : treadData.payments;
                                    treadData.advancePay.installmentFlag = 'N';
                                    treadData.conditionCode =
                                        (treadData.advancePay && treadData.advancePay.matAirtime) ? 'CONDITION_2' : 'CONDITION_1';

                                } else {
                                    // Tread for TDM --> payments is []
                                    if (!treadData.payments.length) {
                                        treadData.payments = { cardType: '', method: 'CC/CA', installmentId: '' };
                                    }
                                }
                                treadData.conditionCode = treadData.conditionCode || 'CONDITION_1';
                                treadData.priority = this.setPriorityByPaymentMethod(treadData);
                                return treadData;

                            })
                            .filter((tread) => {

                                /* Merge Trade Payment
                                    เงื่อนไขการรวม Trade จ่ายเงิน (เอา tread ออก)
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
        let priority = 3;
        if (paymentTypes && paymentTypes.length >= 1) {
            const paymentType: any = (paymentTypes.filter((paymentList: any) => paymentList.method !== 'PP'))[0];
            if (paymentType.method) {
                switch (paymentType.method) {
                    case 'CA':
                        priority = 3;
                        break;
                    case 'CC':
                        priority = 1;
                        break;
                    case 'CC/CA':
                        priority = 3;
                        break;
                }
            }
            if (priceOptionPrivilegeTrade.advancePay && priceOptionPrivilegeTrade.advancePay.installmentFlag === 'Y') {
                priority = 2;
            }
        }
        return priority;
    }

    getInstallmentAndPrivileges(installments: any, privileges: any) {
        const priceWithInstallmentList = [];

        const privilegesGroup = privileges
            .filter(privilege => Object.keys(privilege.customerGroups
                .filter(customerGroup => customerGroup.code === this.selectCustomerGroup.code)).length > 0)
            .filter(privilege => Object.keys(privilege.trades.filter(trade => Object.keys(trade.customerGroups
                .filter(customerGroup => customerGroup.code === this.selectCustomerGroup.code)).length > 0)).length > 0);

        installments.forEach((installment: any) => {
            const priceList: any[] = [];
            const advancePayList: any[] = [];
            let showAdvancePay: boolean;
            privilegesGroup.forEach((privilege: any) => {
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
                            +trade.promotionPrice || 0,
                            +trade.advancePay.amount || 0,
                            +key[1] || 0,
                            +key[0] || 0
                        );
                        showAdvancePay = !!(trade.advancePay.installmentFlag === 'Y'
                            && trade.advancePay.amount !== null && trade.advancePay.amount !== 0 && trade.advancePay.amount ? true : false);

                        priceList.push(price);
                        advancePayList.push(advancePay);

                    }
                });
            });
            const filterZeroPriceList = priceList.filter(price => price !== 0);
            const filterZeroAdvancePayList = advancePayList.filter(advancePay => advancePay !== 0);
            const sortPriceList = filterZeroPriceList.sort((a, b) => a !== b ? a < b ? -1 : 1 : 0);
            const sortAdvanceAdvancePayList = filterZeroAdvancePayList.sort((a, b) => a !== b ? a < b ? -1 : 1 : 0);

            if (sortPriceList.length > 0) {
                const priceWithInstallmentBankAndAdvancePayment = {
                    priceList: sortPriceList,
                    advancePayList: sortAdvanceAdvancePayList,
                    showAdvancePay: showAdvancePay,
                    banks: installment.banks,
                    month: installment.month,
                    percentage: installment.percentage
                };
                priceWithInstallmentList.push(priceWithInstallmentBankAndAdvancePayment);
            }

        });

        this.privilegeTradeInstallmentGroup = priceWithInstallmentList;

        if (this.privilegeTradeInstallmentGroup) {
            this.showInstallmentListTemplate();
        }
    }

    onCampaignSelected(campaign: any) {
        this.priceOption.campaign = campaign;
        this.priceOption.campaign.customerGroup = this.tabs.find((val: any) => val.active);
    }

    onPromotionShelve(campaign: any) {
        const modalOptions = { class: 'modal-lg modal-dialog-centered' };
        this.modalRef = this.modalService.show(this.selectPackageTemplate, modalOptions);
        this.packageDetailService = this.callPromotionShelveService(campaign)
        .then((packageList: any) => {
           this.promotionShelves = packageList;
        });
    }

    viewInstallmentList(campaignSlider: any) {
        const tabActive = this.tabs.find(val => {
            return val.active;
        });

        const selectCustomerGroupCode = tabActive.code;
        this.privilegeTradeInstallmentGroup = this.fillterCampaignOrTrade(campaignSlider, false, selectCustomerGroupCode);
        if (this.privilegeTradeInstallmentGroup) {
            this.showInstallmentListTemplate();
        }
    }

    viewInstallment(campaignSlider: any) {
        this.privilegeTradeInstallmentGroup = this.fillterCampaignOrTrade(campaignSlider, true);
        if (this.privilegeTradeInstallmentGroup) {
            this.showInstallmentListTemplate();
        }

    }


    fillterCampaignOrTrade(campaignSlider: any, fromTrade: boolean, selectCustomerGroupCode?: string) {

        const installments = campaignSlider.installments;
        const trade = campaignSlider.value;
        const campaignSliderForFilter = Object.assign({}, campaignSlider);

        if (fromTrade) { // fillter Trade page
            let price: Number;
            let advancePay: Number;
            const priceWithInstallmentList = [];
            let isShowAdvancePay: boolean;
            installments.filter((installment: any) => {
                if (installment.banks.length > 0) {
                    price = this.calculatePrice(
                        +trade.promotionPrice,
                        +installment.month || 0,
                        +installment.percentage || 0
                    );
                    advancePay = this.calculateAdvancePay(
                        +trade.promotionPrice || 0,
                        +trade.advancePay.amount || 0,
                        +installment.month || 0,
                        +installment.percentage || 0
                    );
                    isShowAdvancePay = !!(trade.advancePay.installmentFlag === 'Y'
                        && trade.advancePay.amount !== null && trade.advancePay.amount !== 0 && trade.advancePay.amount ? true : false);
                }
                if (price > 0) {
                    const priceWithInstallmentBankAndAdvancePayment = {
                        priceList: price,
                        advancePayList: advancePay,
                        showAdvancePay: isShowAdvancePay,
                        banks: installment.banks,
                        month: installment.month,
                        percentage: installment.percentage,
                        fromTrade: true
                    };
                    priceWithInstallmentList.push(priceWithInstallmentBankAndAdvancePayment);
                }
            });

            return priceWithInstallmentList;

        } else if (!fromTrade && selectCustomerGroupCode) { // fillter campaign page

            const filterPriceOption = this.getFilterPriceOptionByCustomerGroup(campaignSliderForFilter.value, selectCustomerGroupCode);
            const privileges = filterPriceOption.privileges;
            const priceWithInstallmentList = [];

            const privilegesGroup = privileges
                .filter(privilege => Object.keys(privilege.customerGroups
                    .filter(customerGroup => customerGroup.code === selectCustomerGroupCode)).length > 0)
                .filter(privilege => Object.keys(privilege.trades.filter((trade: any) => Object.keys(trade.customerGroups
                    .filter(customerGroup => customerGroup.code === selectCustomerGroupCode)).length > 0)).length > 0);

            installments.forEach((installment: any) => {
                const priceList: any[] = [];
                const advancePayList: any[] = [];
                let showAdvancePay: boolean;
                privilegesGroup.forEach((privilege: any) => {
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
                                +trade.promotionPrice || 0,
                                +trade.advancePay.amount || 0,
                                +key[1] || 0,
                                +key[0] || 0
                            );
                            showAdvancePay = !!(trade.advancePay.installmentFlag === 'Y'
                                && trade.advancePay.amount !== null && trade.advancePay.amount !== 0
                                && trade.advancePay.amount ? true : false);

                            priceList.push(price);
                            advancePayList.push(advancePay);

                        }
                    });
                });
                const filterZeroPriceList = priceList.filter(price => price !== 0);
                const filterZeroAdvancePayList = advancePayList.filter(advancePay => advancePay !== 0);
                const sortPriceList = filterZeroPriceList.sort((a, b) => a !== b ? a < b ? -1 : 1 : 0);
                const sortAdvanceAdvancePayList = filterZeroAdvancePayList.sort((a, b) => a !== b ? a < b ? -1 : 1 : 0);

                if (sortPriceList.length > 0) {
                    const priceWithInstallmentBankAndAdvancePayment = {
                        priceList: sortPriceList,
                        advancePayList: sortAdvanceAdvancePayList,
                        showAdvancePay: showAdvancePay,
                        banks: installment.banks,
                        month: installment.month,
                        percentage: installment.percentage
                    };
                    priceWithInstallmentList.push(priceWithInstallmentBankAndAdvancePayment);
                }

            });
            return priceWithInstallmentList;
        }
    }

    private getFilterPriceOptionByCustomerGroup(campaignSlider: any, selectCustomerGroupCode: string) {
        if (campaignSlider.privileges) {
            const filterPrivileges = campaignSlider.privileges
                .filter(privilege => {
                    const isPrivilegeInCustomerGroup = privilege.customerGroups.filter(customerGroup =>
                        customerGroup.code === selectCustomerGroupCode
                    );
                    return isPrivilegeInCustomerGroup.length > 0 ? true : false;
                });
            const filterPrivilegeAndTrade = filterPrivileges
                .map(filterPrivilege => {
                    const filterTrades = filterPrivilege.trades.filter(trade => {
                        const isPrivilegeTradeInCustomerGroup = trade.customerGroups.filter(customerGroup =>
                            customerGroup.code === selectCustomerGroupCode);
                        return isPrivilegeTradeInCustomerGroup.length > 0 ? true : false;
                    });
                    filterPrivilege.trades = filterTrades;
                    return filterPrivilege;
                });

            campaignSlider.privileges = filterPrivileges;
        }
        return campaignSlider;
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
            if (+keys[0] === 0 && +keys[1] === 0) {
                return;
            }
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
        return new Promise((resolve, reject) => {
            const packageKeyRef = getCampaign.packageKeyRef;
            let promotionShelvesList = [];

            this.http.post('/api/salesportal/promotion-shelves', { userId: packageKeyRef }).toPromise()
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
                    return promotionShelves;
                })
                .then((promotionShelves: PromotionShelve[]) => {
                    const customerGroup = this.tabs.find((val: any) => val.active);
                    let promise;
                    let parameter;
                    if (customerGroup.code === 'MC002') {
                        parameter = [{ 'name': 'orderType', 'value': orderType.CHANGE_CHARGE_TYPE }];
                    } else
                    if (customerGroup.code === 'MC003') {
                        parameter = [{ 'name': 'orderType', 'value': orderType.PORT_IN }];
                    } else
                    if (customerGroup.code === 'MC004') {
                        parameter = [{ 'name': 'orderType', 'value': orderType.CHANGE_SERVICE }];
                    } else {
                        parameter = [
                            { 'name': 'orderType', 'value': orderType.NEW_REGISTRATION },
                            { 'name': 'billingSystem', 'value': 'IRB' }
                        ];
                    }

                    promotionShelves.forEach((promotionShelve: PromotionShelve) => {
                        promise = promotionShelve.promotions.map((promotion: PromotionShelveGroup) => {
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
                    });

                    promotionShelvesList = promotionShelves;
                    return promise;
                }).then((promise) => {
                    return Promise.all(promise).then(() => {
                        promotionShelvesList.map((promotion) => {
                            promotion.promotions = promotion.promotions.filter((filterPromotion) => {
                                if (filterPromotion.items && filterPromotion.items.length <= 0) {
                                    return false;
                                }
                                return filterPromotion;
                            });
                           return promotion;
                        });
                        if (promotionShelvesList.length) {
                            promotionShelvesList[0].active = true;
                            if (promotionShelvesList[0].promotions && promotionShelvesList[0].promotions.length > 0) {
                                promotionShelvesList[0].promotions[0].active = true;
                            }
                        }
                        resolve(promotionShelvesList);
                    })
                    .catch(() => reject());
            })
            .catch(() => reject());
        });
    }

    /* privilege */
    onTradeSelected(trade: any) {
        this.priceOption.trade = trade;
        this.pageLoadingService.openLoading();
        this.addToCartService.reserveStock().then((nextUrl) => {
            this.router.navigate([nextUrl]).then(() => this.pageLoadingService.closeLoading());
        });
    }

    private calculatePrice(priceAmount: number, installmentMonth: number, installmentPercentage: number) {
        let price = 0;
        // คำนวนเปอร์เซ็น
        if (installmentMonth === 0 && installmentPercentage === 0) {
            return 0;
        }
        price = installmentPercentage === 0 ?
            priceAmount / installmentMonth :
            (priceAmount + (installmentMonth * (priceAmount * Math.ceil(installmentPercentage) / 100))) / installmentMonth;
        return Math.round(price);
    }

    private calculateAdvancePay(price: number, advancePayAmount: number, installmentMonth: number, installmentPercentage: number) {
        // คำนวนผ่อนชำระค่าเครื่องพร้อมค่าแพ็กเกจล่วงหน้า
        if (price > 0) {
            let advancePay = 0;
            if (installmentMonth === 0 && installmentPercentage === 0) {
                return 0;
            }
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
        const modalOptions = { class: 'modal-lg modal-dialog-centered' };
        this.modalRef = this.modalService.show(this.selectPackageTemplate, modalOptions);
        this.packageDetailService = this.callPromotionShelveService(this.priceOption.campaign)
        .then((packageList: any) => {
            this.promotionShelves = packageList;
        });
    }

    showInstallmentListTemplate(): void {
        const modalOptions = { class: 'modal-lg modal-dialog-centered' };
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

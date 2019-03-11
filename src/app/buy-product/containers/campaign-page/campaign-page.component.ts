import { Component, OnInit, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BsModalService, BsModalRef, TabsetComponent } from 'ngx-bootstrap';
import { forkJoin } from 'rxjs';
import { SalesService, TokenService, HomeService, User, CampaignSliderInstallment, CampaignSlider } from 'mychannel-shared-libs';
import { PRODUCT_TYPE, PRODUCT_SUB_TYPE, SUB_STOCK_DESTINATION, PRODUCT_HANDSET_BUNDLE } from 'src/app/buy-product/constants/products.constants';
import { ROUTE_BUY_PRODUCT_PRODUCT_PAGE } from 'src/app/buy-product/constants/route-path.constant';
import { AddToCartService } from 'src/app/buy-product/services/add-to-cart.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';

@Component({
    selector: 'app-campaign',
    templateUrl: './campaign-page.component.html',
    styleUrls: ['./campaign-page.component.scss']
})
export class CampaignPageComponent implements OnInit, OnDestroy {

    @ViewChild('productSpecTemplate')
    productSpecTemplate: TemplateRef<any>;

    // local storage name
    priceOption: PriceOption;

    modalRef: BsModalRef;
    params: Params;
    hansetBundle: string;
    productDetail: any;
    productSpec: any;

    // campaign
    tabs: any[];
    campaignSliders: CampaignSlider[];
    priceOptions: any;

    // trade
    constructor(
        private modalService: BsModalService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private salesService: SalesService,
        private tokenService: TokenService,
        private homeService: HomeService,
        private addToCartService: AddToCartService,
        private priceOptionService: PriceOptionService
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

        this.salesService.productDetail({
            brand: brand,
            location: user.locationCode,
            model: model,
            productType: productType || PRODUCT_TYPE,
            productSubtype: productSubtype || PRODUCT_SUB_TYPE
        }).then((resp: any) => {

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

    private getInstallments(campaign: any): CampaignSliderInstallment[] {
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
        // Object.keys(installmentGroups).forEach((key: string) => {
        //     const keys: string[] = key.split('-');
        //     installments.push({
        //         percentage: +keys[0] || 0,
        //         month: +keys[1] || 0,
        //         banks: installmentGroups[key]
        //     });
        // });

        // จ่ายน้อยผ่อนนาน
        return installments.sort((a: any, b: any) => {
            return a.month > b.month ? -1 : 1;
        });
    }

    onCustomerGroupSelected(customerGroup: any) {
        if (!this.priceOptions) {
            this.campaignSliders = [];
            return;
        }

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

                return campaignSlider;
            }).sort((a: any, b: any) => a.price - b.price);
    }

    onCampaignSelected(campaign: any) {
        this.priceOption.campaign = campaign;
    }

    onPromotionShelve(campaign: any) {
        console.log('Selected campaign ', campaign);
    }

    /* privilege */
    onTradeSelected(trade: any) {
        this.priceOption.trade = trade;

        this.addToCartService.reserveStock().then((nextUrl) => {
            console.log('Next url => ', nextUrl);
            this.router.navigate([nextUrl]);
        });
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

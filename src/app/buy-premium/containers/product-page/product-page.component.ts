import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { User, TokenService, SalesService, ProductStock, ProductStockBrandAndModel, HomeService } from 'mychannel-shared-libs';
import { PRODUCT_TYPE, PRODUCT_SUB_TYPE, SUB_STOCK_DESTINATION } from '../../constants/premium.constant';
import { ROUTE_BUY_PREMIUM_BRAND_PAGE, ROUTE_BUY_PREMIUM_CAMPAIGN_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.scss']
})
export class ProductPageComponent implements OnInit {
  MAX_ROW: number = 10;
  countRow: number = 0;
  totalRow: number = 0;

  params: Params;
  productService: Promise<any>;
  productStocks: ProductStock[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private tokenService: TokenService,
    private salesService: SalesService,
    private router: Router,
    private homeService: HomeService
  ) {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.params = params;

      this.callService(params.brand, params.model, 1);
    });
   }

  ngOnInit(): void {
  }

  callService(brand: string, model: string, offset: number): void {
    const user: User = this.tokenService.getUser();

    const req = {
      brand: 'BRAND-WANSMORM',
      model: model,
      offset: offset,
      maxrow: this.MAX_ROW,
      location: user.locationCode,
      productType: [PRODUCT_TYPE],
      productSubtype: [PRODUCT_SUB_TYPE]
    };

    if (!!model) {
      this.productService = this.salesService.productsByBrandModel(Object.assign({ model: model }, req));
    } else {
      this.productService = this.salesService.modelsOfProduct(req);
    }
    this.productService.then((resp: any) => {
      const data = resp.data;
      this.countRow += +data.countRow;
      this.totalRow = +data.totalRow;
      data.products.map((product: any) => {
        const normalPrice = product.normalPrice || {};
        const promotionPrice = product.promotionPrice || {};
        let subproducts = product.subProducts || [];
        const ribbonType = (product.itemType || '').toLowerCase();
        const ribbon = ['hot', 'new'].find((rib: string) => rib === ribbonType);

        const productStock: ProductStock = {
          ribbon: ribbon,
          thumbnail: product.imageUrl,
          name: `${product.name}`,
          quantity: 0,
          minNormalPrice: this.calMinPrice(subproducts, 'normalPrice') || +normalPrice.min || 0,
          maxNormalPrice: this.calMaxPrice(subproducts, 'normalPrice') || +normalPrice.max || 0,
          minPromotionPrice: this.calMinPrice(subproducts, 'promotionPrice') || +promotionPrice.min || 0,
          maxPromotionPrice: this.calMaxPrice(subproducts, 'promotionPrice') || +promotionPrice.max || 0,
          stocks: []
        };

        if (!subproducts.length) {
          // not sub product
          subproducts = [{
            name: `${product.name}`,
            model: product.model,
            color: product.color,
            imageUrl: product.imageUrl,
            normalPrice: product.normalPrice,
            promotionPrice: product.promotionPrice
          }];
        }

        subproducts.forEach((sub: any) => {
          this.salesService.productStock({
            locationCodeSource: user.locationCode,
            productType: product.productType || PRODUCT_TYPE,
            productSubType: product.productSubtype || PRODUCT_SUB_TYPE,
            model: sub.model,
            color: sub.color,
            subStockDestination: SUB_STOCK_DESTINATION,
            listLocationCodeDestination: [user.locationCode]
          }).then((respStock: any) => {
            const subNormalPrice = sub.normalPrice || {};
            const subPromotionPrice = sub.promotionPrice || {};
            const stocks: any[] = respStock.data.listLocationCodeDestinationOut || [];

            const quantity = stocks.map((stock: any) => {
              return +stock.qty || 0;
            }).reduce((previousValue: number, currentValue: number) => previousValue + currentValue, 0);

            productStock.quantity += quantity;

            productStock.stocks.push({
              commercialName: `${sub.name}`,
              brand: brand,
              model: sub.model,
              productType: product.productType || '',
              productSubtype: product.productSubtype || '',
              quantity: +quantity || 0,
              minNormalPrice: +subNormalPrice.min || 0,
              maxNormalPrice: +subNormalPrice.max || 0,
              minPromotionPrice: +subPromotionPrice.min || 0,
              maxPromotionPrice: +subPromotionPrice.max || 0
            });
          });
        });

        this.productStocks.push(productStock);
      });
    });
  }

  calMinPrice(products: any[], key: string): number {
    const price = products.map((sub: any) => {
      return +((sub[key] || {}).min);
    }).filter(p => p);
    if (price.length > 0) {
      return Math.min(...price);
    }
    return 0;
  }

  calMaxPrice(products: any[], key: string): number {
    const price = products.map((sub: any) => {
      return +((sub[key] || {}).max || 0);
    }).filter(p => p);
    if (price.length > 0) {
      return Math.max(...price);
    }
    return 0;
  }

  onLoadMore(): void {
    this.callService(this.params.brand, this.params.model, this.countRow + 1);
  }

  onView(stock: ProductStockBrandAndModel): void {
    /*
    - brand มาจากหน้า brand
    - model มาจากหน้า best seller
    - commercialName มาจากหน้า search
    */
    const queryParams: any = {
      brand: stock.brand,
      model: stock.model,
      commercialName: this.params.commercialName || '',
      productType: stock.productType,
      productSubtype: stock.productSubtype,
      maxNormalPrice: stock.maxNormalPrice
    };
    this.router.navigate([ROUTE_BUY_PREMIUM_CAMPAIGN_PAGE], { queryParams });
  }

  onCompare(stock: ProductStockBrandAndModel): void {
    stock.compare = !stock.compare;
  }

  onBack(): void {
    const queryParams: any = {};
    if (this.params.commercialName) {
      queryParams.tab = 'search';
    }
    this.router.navigate([ROUTE_BUY_PREMIUM_BRAND_PAGE], { queryParams });
  }

  onHome(): void {
    this.homeService.goToHome();
  }
}

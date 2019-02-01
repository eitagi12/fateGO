import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { TokenService, User, ProductStock, ProductStockBrandAndModel, HomeService, SalesService } from 'mychannel-shared-libs';
import { PRODUCT_TYPE, PRODUCT_SUB_TYPE, SUB_STOCK_DESTINATION, PRODUCT_HANDSET_BUNDLE } from 'src/app/buy-product/constants/products.constants';
import { ROUTE_BUY_PRODUCT_BRAND_PAGE } from 'src/app/buy-product/constants/route-path.constant';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';

@Component({
  selector: 'app-product',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.scss']
})
export class ProductPageComponent implements OnInit {

  MAX_ROW = 10;
  countRow = 0;
  totalRow = 0;

  productService: Promise<any>;
  params: Params;
  productStocks: ProductStock[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private tokenService: TokenService,
    private salesService: SalesService,
    private homeService: HomeService,
    private priceOptionService: PriceOptionService
  ) {
    this.priceOptionService.remove();
    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.params = params;

      this.callService(params.brand, params.model, 1);
    });
  }

  ngOnInit() { }

  private callService(brand: string, model: string, offset: number) {
    const user: User = this.tokenService.getUser();

    const req = {
      brand: brand,
      model: model,
      offset: offset,
      maxrow: this.MAX_ROW,
      location: user.locationCode
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
          // name: `${product.name} ${product.productSubtype === PRODUCT_HANDSET_BUNDLE ? '(แถมชิม)' : ''}`,
          name: product.name,
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
            name: product.name,
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
              // commercialName: `${sub.name} ${product.productSubtype === PRODUCT_HANDSET_BUNDLE ? '(แถมชิม)' : ''}`,
              commercialName: sub.name,
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

  onLoadMore() {
    this.callService(this.params.brand, this.params.model, this.countRow + 1);
  }

  onView(stock: ProductStockBrandAndModel) {
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
      productSubtype: stock.productSubtype
    };

    if (this.params.commercialName) {
      queryParams.previous = 'search';
    } else if (this.params.model) {
      queryParams.previous = 'best-seller';
    }

    this.router.navigate(['buy-product/campaign'], { queryParams });
  }

  onCompare(stock: ProductStockBrandAndModel) {
    stock.compare = !stock.compare;
  }

  onBack() {
    const queryParams: any = {};
    if (this.params.commercialName) {
      queryParams.tab = 'search';
    }
    this.router.navigate([ROUTE_BUY_PRODUCT_BRAND_PAGE], { queryParams });
  }

  onHome() {
    this.homeService.goToHome();
  }

}

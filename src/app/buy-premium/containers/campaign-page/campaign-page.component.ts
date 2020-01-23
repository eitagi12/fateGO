import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { User, TokenService, SalesService, HomeService } from 'mychannel-shared-libs';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { PRODUCT_TYPE, PRODUCT_SUB_TYPE, SUB_STOCK_DESTINATION } from '../../constants/premium.constant';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { ROUTE_BUY_PREMIUM_PRODUCT_PAGE } from '../../constants/route-path.constant';
import { ROUTE_SHOP_PREMIUM_PAYMENT_PAGE } from 'src/app/device-only/ais-shop-premium/constants/route-path.constant';

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

  nextForm: FormGroup;
  isDisableNextButton: boolean = true;

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
    this.transaction = {};
   }

  ngOnInit(): void {
    this.priceOption = {};

    this.createForm();

    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.params = params;
      console.log('params:' + JSON.stringify(this.params));
      this.callService(
        params.brand,
        params.model,
        params.productType,
        params.productSubtype
      );
    });
  }

  onBack(): void {
    const queryParams: any = {
      brand: this.params.brand
    };
    this.router.navigate([ROUTE_BUY_PREMIUM_PRODUCT_PAGE], { queryParams });
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    console.log('params:' + JSON.stringify(this.params));
    this.priceOption.queryParams = Object.assign({}, this.params);
    this.priceOptionService.save(this.priceOption);
  }

  /* product stock */
  callService(
    brand: string, model: string,
    productType?: string, productSubtype?: string): void {
    console.log('callService');
    const user: User = this.tokenService.getUser();

    // clear
    this.productDetail = {};
    this.salesService.productDetail({
      brand: 'BRAND-WANSMORM',
      location: user.locationCode,
      model: model,
      productType: productType || PRODUCT_TYPE,
      productSubtype: productSubtype || PRODUCT_SUB_TYPE
    }).then((resp: any) => {
      console.log('DEBUG productDetail response Info:' + resp);

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

        console.log(`DEBUG after productDetail.products:${JSON.stringify(this.productDetail.products)}`);
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

    // keep stock
    this.priceOption.productStock = null;

    // change value form
    this.colorForm.patchValue({
      stock: product.stock
    });
    this.isDisableNextButton = false;
  }

  createForm(): void {
    this.colorForm = this.formBuilder.group({
      'stock': []
    });

    this.colorForm.valueChanges.pipe(debounceTime(1000)).subscribe(obs => {
      const stock = obs.stock;
      this.priceOption.productStock = stock;
      console.log('DEBUG createForm Info:' + this.priceOption.productDetail.products);
      const product = (this.priceOption.productDetail.products || []).find((p: any) => {
        return p.colorName === stock.color;
      });
      this.thumbnail = product && product.images ? product.images.thumbnail : '';
    });
  }

  onCheckStock($event: any, stock: any): void {
    if (stock && stock.qty <= 0) {
      $event.preventDefault();
    }
  }

  onNext(): void {
    this.priceOption.queryParams = Object.assign({}, this.params);
    this.priceOption.productDetail.price = this.params.maxNormalPrice;
    console.log('DEBUG onNext():' + JSON.stringify(this.priceOption));
    this.priceOptionService.save(this.priceOption);
    this.router.navigate([ROUTE_SHOP_PREMIUM_PAYMENT_PAGE]);
  }
}

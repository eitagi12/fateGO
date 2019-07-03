import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { BannerSlider, SalesService, TokenService, AlertService, HomeService } from 'mychannel-shared-libs';
import { BestSeller } from 'mychannel-shared-libs/lib/service/models/best-seller';
import { BrandsOfProduct } from 'mychannel-shared-libs/lib/service/models/brands-of-product';
import { ROUTE_DEASHBOARD_PROMOTION_PAGE } from 'src/app/dashboard/constants/route-path.constant';
import { ROUTE_BUY_PRODUCT_PRODUCT_PAGE } from 'src/app/buy-product/constants/route-path.constant';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-brand',
  templateUrl: './brand-page.component.html',
  styleUrls: ['./brand-page.component.scss']
})
export class BrandPageComponent implements OnInit {
  bannerSliders: BannerSlider[];
  brands: BrandsOfProduct[];

  keyword: string;
  productSearch: any;
  datasource: Observable<any>;

  bastSellerService: Promise<any>;
  brandsOfProductService: Promise<any>;

  @ViewChild('brandTabs')
  brandTabs: TabsetComponent;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private salesService: SalesService,
    private tokenService: TokenService,
    private alertService: AlertService,
    private homeService: HomeService,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.callService();
    this.defaultTab();
    this.createDataSource();
  }

  defaultTab(): void {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      if (!!params['tab']) {
        this.brandTabs.tabs[0].active = false;
        this.brandTabs.tabs[1].active = true;
      } else {
        this.brandTabs.tabs[0].active = true;
        this.brandTabs.tabs[1].active = false;
      }
    });
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEASHBOARD_PROMOTION_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onClearSearch(): void {
    this.keyword = null;
  }

  onBannerSliderSelected(bestSeller: BestSeller): void {
    this.router.navigate([ROUTE_BUY_PRODUCT_PRODUCT_PAGE], {
      queryParams: {
        brand: bestSeller.brand,
        model: bestSeller.model
      }
    });
  }

  onProductSearch(product: any): void {
    if (product.item && product.item.brand) {
      this.productSearch = product.item;
    }
  }

  onSearch(): void {
    if (!this.productSearch) {
      this.alertService.warning(this.translateService.instant('ไม่มีข้อมูลที่ต้องการค้นหา'));
      return;
    }

    this.router.navigate([ROUTE_BUY_PRODUCT_PRODUCT_PAGE], {
      queryParams: this.productSearch
    });
  }

  onTabSelected(tabName: string): void {
    const queryParams: any = {};
    if ('brand' !== tabName) {
      queryParams.tab = tabName;
    }
    this.router.navigate(['/buy-product/brand'], { queryParams: queryParams });
  }

  private createDataSource(): void {
    this.datasource = Observable.create((observer: any) => {
      observer.next(this.keyword);
    }).pipe(
      mergeMap((keyword: string) => this.queryProducCatalogSearch(keyword))
    );
  }

  private queryProducCatalogSearch(keyword: string): Promise<any> {
    return this.salesService.producCatalogSearch(keyword).then((resp) => {
      return resp.data;
    });
  }

  private callService(): void {
    const locationCode = this.tokenService.getUser().locationCode;

    this.bastSellerService = this.salesService.baseSeller(locationCode);
    this.bastSellerService.then((resp: any) => {
      this.bannerSliders = this.mapBannerSliders(resp.data);
    });

    this.brandsOfProductService = this.salesService.brandsOfProduct(locationCode);
    this.brandsOfProductService.then((resp: any) => {
      this.brands = resp.data || [];
    });
  }

  private mapBannerSliders(bestSellers: BestSeller[]): BannerSlider[] {
    return bestSellers.sort((a: any, b: any) => {
      return a.priority - b.priority;
    }).map((bestSeller: BestSeller) => {
      const ribbonType = (bestSeller.itemType || '').toLowerCase();
      const ribbon = ['hot', 'new'].find((rib: string) => rib === ribbonType);
      return ({
        thumbnail: bestSeller.imageUrl,
        ribbon: ribbon,
        detail: bestSeller.name,
        value: bestSeller
      } as BannerSlider);
    });
  }
}

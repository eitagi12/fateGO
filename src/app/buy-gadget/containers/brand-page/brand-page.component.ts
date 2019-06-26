import { Component, OnInit, ViewChild } from '@angular/core';
import { BannerSlider, SalesService, TokenService, HomeService } from 'mychannel-shared-libs';
import { BrandsOfProduct } from 'mychannel-shared-libs/lib/service/models/brands-of-product';
import { ROUTE_DEASHBOARD_PROMOTION_PAGE } from 'src/app/dashboard/constants/route-path.constant';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { TabsetComponent } from 'ngx-bootstrap';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-brand-page',
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
    private homeService: HomeService
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

  onTabSelected(tabName: string): void {
    const queryParams: any = {};
    if ('brand' !== tabName) {
      queryParams.tab = tabName;
    }
    this.router.navigate(['/buy-gadget/brand'], { queryParams: queryParams });
  }

  createDataSource(): void {
    this.datasource = Observable.create((observer: any) => {
      observer.next(this.keyword);
    }).pipe(
      mergeMap((keyword: string) => this.queryProducCatalogSearch(keyword))
    );
  }

  queryProducCatalogSearch(keyword: string): Promise<any> {
    return this.salesService.producCatalogSearch(keyword).then((resp) => {
      return resp.data;
    });
  }

  callService(): void {
    const locationCode = this.tokenService.getUser().locationCode;
    this.brandsOfProductService = this.salesService.brandsOfProduct(locationCode);
    this.brandsOfProductService.then((resp: any) => {
      this.brands = resp.data || [];
    });
  }
}

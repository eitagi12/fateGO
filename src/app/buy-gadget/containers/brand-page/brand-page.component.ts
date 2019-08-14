import { Component, OnInit, ViewChild } from '@angular/core';
import { BannerSlider, SalesService, TokenService, HomeService } from 'mychannel-shared-libs';
import { BrandsOfProduct } from 'mychannel-shared-libs/lib/service/models/brands-of-product';
import { ROUTE_DEASHBOARD_PROMOTION_PAGE } from 'src/app/dashboard/constants/route-path.constant';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { TabsetComponent } from 'ngx-bootstrap';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

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
    private salesService: SalesService,
    private tokenService: TokenService,
    private homeService: HomeService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.callService();
    this.createDataSource();
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
    const param = {
      location: this.tokenService.getUser().locationCode,
      productType: ['GADGET/IOT'],
      productSubtype: ['N/A']
    };
    this.http.post('/api/salesportal/brands-of-product',
      param
    ).toPromise().then((res: any) => {
      this.brands = res.data || [];
    });
  }
}

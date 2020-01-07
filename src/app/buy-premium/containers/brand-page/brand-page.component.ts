import { Component, OnInit, ViewChild } from '@angular/core';
import { TokenService, SalesService, HomeService } from 'mychannel-shared-libs';
import { PRODUCT_TYPE, PRODUCT_SUB_TYPE } from '../../constants/premium.constant';
import { HttpClient } from '@angular/common/http';
import { BrandsOfProduct } from 'mychannel-shared-libs/lib/service/models/brands-of-product';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { Router } from '@angular/router';
import { ROUTE_DEASHBOARD_PROMOTION_PAGE } from 'src/app/dashboard/constants/route-path.constant';
import { TabsetComponent } from 'ngx-bootstrap';

@Component({
  selector: 'app-brand-page',
  templateUrl: './brand-page.component.html',
  styleUrls: ['./brand-page.component.scss']
})
export class BrandPageComponent implements OnInit {
  brands: BrandsOfProduct[];
  datasource: Observable<any>;
  keyword: string;
  @ViewChild('brandTabs')
  brandTabs: TabsetComponent;

  constructor(
    private tokenService: TokenService,
    private http: HttpClient,
    private salesService: SalesService,
    private router: Router,
    private homeService: HomeService
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
    this.router.navigate(['/buy-premium/brand'], { queryParams: queryParams });
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
      productType: [PRODUCT_TYPE],
      productSubtype: [PRODUCT_SUB_TYPE]
    };
    this.http.post('/api/salesportal/brands-of-product',
      param
    ).toPromise().then((res: any) => {
      this.brands = res.data || [];
    });
  }

}

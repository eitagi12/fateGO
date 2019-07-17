import { Component, OnInit, ElementRef, ViewChild, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_VAS_PACKAGE_LOGIN_WITH_PIN_PAGE, ROUTE_VAS_PACKAGE_MENU_VAS_ROM_PAGE } from '../../constants/route-path.constant';
import { PackageProductsService } from '../../services/package-products.service';
import { HomeService, BannerSlider, SalesService, User } from 'mychannel-shared-libs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { filter } from 'minimatch';

@Component({
  selector: 'app-vas-package-select-vas-package-page',
  templateUrl: './vas-package-select-vas-package-page.component.html',
  styleUrls: ['./vas-package-select-vas-package-page.component.scss']
})
export class VasPackageSelectVasPackagePageComponent implements OnInit {

  mobileForm: FormGroup;
  mobileNo: string;
  bannerSliders: BannerSlider[];
  priceOptionDetailService: Promise<any>;
  salesService: SalesService;
  user: User;
  shelves: any;
  packageBestSaller: Array<any> = [];

  constructor(
    private router: Router,
    private homeService: HomeService,
    private packageProductsService: PackageProductsService,
    private formBuilder: FormBuilder,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    // this.getPackageProducts();
    this.callService();
    this.createForm();
  }

  onBack(): void {
    this.router.navigate([ROUTE_VAS_PACKAGE_MENU_VAS_ROM_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_VAS_PACKAGE_LOGIN_WITH_PIN_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onSelectPackage(): void {
    this.onNext();
  }

  getPackageProducts(): void {
    const userId = 'bMfAlzjKaZSSKY3s6c3farMxbUaEsFnIIAgbjsXKA3cOhnKfvawKb60MITINd04Os73YJBQ5aWypkxFk';
    this.packageProductsService.getPackageProducts(userId);
  }

  createForm(): void {
    this.mobileForm = this.formBuilder.group({
      'mobileNo': ['', Validators.compose([Validators.required, Validators.pattern(/^0[6-9]{1}[0-9]{8}/)])],
    });

    this.mobileForm.valueChanges.subscribe((value) => {
      this.mobileNo = value.mobileNo;
    });
  }

  callService(): any {
    const userId = 'bMfAlzjKaZSSKY3s6c3farMxbUaEsFnIIAgbjsXKA3cOhnKfvawKb60MITINd04Os73YJBQ5aWypkxFk';
    this.http.post('/api/salesportal/promotion-vas', { userId }).toPromise()
      .then((response: any) => {
        // console.log('best_seller_priority', .items[0].customAttributes.best_seller_priority);
        response.data.data.map((data: any) => {
          data.subShelves.map((subShelves: any) => {
            subShelves.items.map((item: any) => {
              if (+item.customAttributes.best_seller_priority > 0) {
                console.log('item ', item);
                item.mainTitle = data.title;
                if (data.title === 'เน็ตและโทร') {
                  item.icon = 'assets/images/icon/Phone_net.png';
                } else if (data.title === 'เน้นคุย') {
                  item.icon = 'assets/images/icon/Call.png';
                } else {
                  item.icon = 'assets/images/icon/Net.png';
                }
                this.packageBestSaller.push(item);
              }

            }).sort((a: any, b: any) => (+a.customAttributes.best_seller_priority) - (b.customAttributes.best_seller_priority));
          });
        });
      }).then(() => {
        console.log('res', this.packageBestSaller);
      });

  }
}

import { Component, OnInit, ElementRef, ViewChild, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_VAS_PACKAGE_LOGIN_WITH_PIN_PAGE, ROUTE_VAS_PACKAGE_MENU_VAS_ROM_PAGE } from '../../constants/route-path.constant';
import { PackageProductsService } from '../../services/package-products.service';
import { HomeService, BannerSlider, SalesService, User} from 'mychannel-shared-libs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

declare var $: any;

@Component({
  selector: 'app-vas-package-select-vas-package-page',
  templateUrl: './vas-package-select-vas-package-page.component.html',
  styleUrls: ['./vas-package-select-vas-package-page.component.scss']
})
export class VasPackageSelectVasPackagePageComponent implements OnInit, OnChanges {

  @ViewChild('slider')
  slider: ElementRef;

  private $owl: any;
   mobileForm: FormGroup;
   mobileNo: string;
   bannerSliders: BannerSlider[];
   priceOptionDetailService: Promise<any>;
   salesService: SalesService;
   user: User;
   data: Object;

   policies: any [] = [
    {id: 0, name: 'policy001'},
    {id: 2, name: 'policy002'},
    {id: 3, name: 'policy003'},
    {id: 4, name: 'policy004'},
    {id: 5, name: 'policy005'}
  ];

  constructor(
    private router: Router,
    private homeService: HomeService,
    private packageProductsService: PackageProductsService,
    private formBuilder: FormBuilder,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.createSlider();
    // this.getPackageProducts();
    this.callService();
    this.createForm();
  }

  ngOnChanges(): void {
    this.slider.nativeElement.style.display = 'none';
    setTimeout(() => {
      this.$owl.trigger('destroy.owl.carousel')
        .removeClass('owl-loaded owl-hidden')
        .find('.owl-stage:empty, .owl-item:empty')
        .remove();
      this.createSlider();
    }, 50);
  }

  private createSlider(): void {
    this.$owl = $(this.slider.nativeElement).owlCarousel({
      dots: true,
      responsive: {
        0: {
          items: 2
        },
        768: {
          items: 3
        },
        1024: {
          items: 3
        },
        1440: {
          items: 4
        }
      }
    });
    this.slider.nativeElement.style.display = 'block';
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
    this.http.post('/api/salesportal/promotion-vas', {userId}).toPromise()
    .then((response) => {
      console.log('res', response);
      console.log('titel', response);
    });
  }
}

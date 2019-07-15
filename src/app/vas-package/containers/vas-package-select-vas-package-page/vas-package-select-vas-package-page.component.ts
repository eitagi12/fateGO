import { Component, OnInit, ElementRef, ViewChild, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from 'mychannel-shared-libs';
import { ROUTE_VAS_PACKAGE_LOGIN_WITH_PIN_PAGE, ROUTE_VAS_PACKAGE_MENU_VAS_ROM_PAGE } from '../../constants/route-path.constant';
import { PackageProductsService } from '../../services/package-products.service';

declare var $: any;

@Component({
  selector: 'app-vas-package-select-vas-package-page',
  templateUrl: './vas-package-select-vas-package-page.component.html',
  styleUrls: ['./vas-package-select-vas-package-page.component.scss']
})
export class VasPackageSelectVasPackagePageComponent implements OnInit, OnChanges {

  @ViewChild('campaignSlider')
  campaignSlider: ElementRef;

  private $owl: any;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private packageProductsService: PackageProductsService
  ) { }

  ngOnInit(): void {
    this.createSlider();
    this.getPackageProducts();
  }

  ngOnChanges(): void {
    this.campaignSlider.nativeElement.style.display = 'none';
    setTimeout(() => {
      this.$owl.trigger('destroy.owl.carousel')
        .removeClass('owl-loaded owl-hidden')
        .find('.owl-stage:empty, .owl-item:empty')
        .remove();
      this.createSlider();
    }, 50);
  }

  private createSlider(): void {
    this.$owl = $(this.campaignSlider.nativeElement).owlCarousel({
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
    this.campaignSlider.nativeElement.style.display = 'block';
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
}

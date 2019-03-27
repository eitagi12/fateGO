import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { BsModalRef, BsModalService, TabsetComponent } from 'ngx-bootstrap';
import { SalesService, TokenService, HomeService } from 'mychannel-shared-libs';
import { Menu } from 'mychannel-shared-libs/lib/service/models/menu';
import { ROUTE_BUY_PRODUCT_BRAND_PAGE } from 'src/app/buy-product/constants/route-path.constant';
import { ROUTE_STOCK_RESERVE_PAGE, ROUTE_STOCK_CHECKING_PAGE } from 'src/app/stock/contstants/route-path.constant';
import { ROUTE_ORDER_PRE_TO_POST_VERIFY_DOCUMENT_PAGE } from 'src/app/order/order-pre-to-post/constants/route-path.constant';
import { ROUTE_ORDER_NEW_REGISTER_VERIFY_DOCUMENT_PAGE } from 'src/app/order/order-new-register/constants/route-path.constant';
import { ROUTE_ORDER_MNP_NETWORK_TYPE_PAGE } from 'src/app/order/order-mnp/constants/route-path.constant';

@Component({
  selector: 'app-promotion-page',
  templateUrl: './promotion-page.component.html',
  styleUrls: ['./promotion-page.component.scss']
})
export class PromotionPageComponent implements OnInit {

  @ViewChild('promotionTabs')
  promotionTabs: TabsetComponent;

  campaigns: any[];

  menus: any[] = [
    {
      icon: 'assets/images/icon/bottom_menu_icon_device.png',
      label: 'เครื่อง',
      disabled: true,
      click: () => {
        this.router.navigate([ROUTE_BUY_PRODUCT_BRAND_PAGE]);
      }
    },
    {
      icon: 'assets/images/icon/bottom_menu_icon_appointment.png',
      label: 'สินค้าจอง',
      disabled: true,
      click: () => {
        this.router.navigate([ROUTE_STOCK_RESERVE_PAGE]);
      }
    },
    {
      icon: 'assets/images/icon/bottom_menu_icon_new_mobile_number.png',
      label: 'เปิดเบอร์ใหม่',
      disabled: true,
      click: () => {
        this.router.navigate([ROUTE_ORDER_NEW_REGISTER_VERIFY_DOCUMENT_PAGE]);
        // this.goToURL('customer-portal/register-number');
      }
    },
    {
      icon: 'assets/images/icon/icon-face-recognition.png',
      label: 'แสดงตนซิมเติมเงิน (AIS FaceRecog)',
      disabled: true,
      click: () => {
        this.goToURL('face-recognition');
      }
    },
    {
      icon: 'assets/images/icon/ic_change_prepaid_to_postpaid.png',
      label: 'เปลี่ยนจากเติมเงินเป็นรายเดือน',
      disabled: true,
      click: () => {
        this.router.navigate([ROUTE_ORDER_PRE_TO_POST_VERIFY_DOCUMENT_PAGE]);
        // this.goToURL('customer-portal/pre-to-post');
      }
    },
    {
      icon: 'assets/images/icon/icon-mnp.png',
      label: 'ย้ายค่าย',
      disabled: true,
      click: () => {
        this.router.navigate([ROUTE_ORDER_MNP_NETWORK_TYPE_PAGE]);
      }
    },
    {
      icon: 'assets/images/icon/bottom_menu_icon_stock_checking.png',
      label: 'เช็คสต็อค',
      disabled: true,
      click: () => {
        this.router.navigate(['/' + ROUTE_STOCK_CHECKING_PAGE]);
      }
    },
    {
      icon: 'assets/images/icon/icon-package-catalog.png',
      label: 'เปลี่ยนโปรซื้อแพ็กเกจเพิ่ม',
      disabled: true,
      click: () => {
        this.goToURL('customer-portal/package-catalog');
      }
    },
    {
      icon: 'assets/images/icon/bottom_menu_icon_new_release.png',
      label: 'สินค้าใหม่',
      disabled: true
    },
    {
      icon: 'assets/images/icon/bottom_menu_icon_best_seller.png',
      label: 'สินค้าขายดี',
      disabled: true
    },
    {
      icon: 'assets/images/icon/bottom_menu_icon_ais_fibre.png',
      label: 'AIS Fibre',
      disabled: true
    },
    {
      icon: 'assets/images/icon/bottom_menu_icon_scan.png',
      label: 'scan',
      disabled: true
    },
    {
      icon: 'assets/images/icon/icon-package-catalog.png',
      label: 'เปลี่ยนโปรซื้อแพ็กเกจเพิ่ม',
      disabled: true
    }
  ];

  modalRef: BsModalRef;
  details: string;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private modalService: BsModalService,
    private salesService: SalesService,
    private tokenService: TokenService,
    private homeService: HomeService
  ) { }

  ngOnInit(): void {
    this.defaultTab();
    this.callService();
  }

  defaultTab(): void {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      if (!!params['tab']) {
        this.promotionTabs.tabs[0].active = false;
        this.promotionTabs.tabs[1].active = true;
      } else {
        this.promotionTabs.tabs[0].active = true;
        this.promotionTabs.tabs[1].active = false;
      }
    });
  }

  onOpenModal(template: TemplateRef<any>, details: string): void {
    this.details = details || '';
    this.modalRef = this.modalService.show(template);
  }

  onBack(): void {
    this.homeService.goToHome();
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onTabSelected(tabName: string): void {
    const queryParams: any = {};
    if ('hit' !== tabName) {
      queryParams.tab = tabName;
    }
    this.router.navigate(['dashboard'], { queryParams: queryParams });
  }

  callService(): void {
    this.salesService.campaigns(
      this.tokenService.getUser().locationCode
    ).then((resp: any) => {
      this.campaigns = resp.data;
    });

    this.salesService.menus()
      .then((resp: any) => {
        this.mapMenus(resp.data);
      });
  }

  private mapMenus(menus: Menu[]): void {
    const saleMenus: any = (menus || []).find((menu: Menu) => {
      return menu.name === 'Sales Portal';
    });

    if (!saleMenus || !saleMenus.menus) {
      this.menus = this.menus.filter((menu: any) => !menu.disabled);
      return;
    }

    const isAspUser = this.tokenService.isAspUser();

    saleMenus.menus.forEach((menu: any) => {
      const current: any = this.menus.find(m => m.label === menu.name) || {};
      current.disabled = !!(current.roles || []).find(role => {
        if ('ASP' === role && isAspUser) {
          return true;
        }
        if ('AIS' === role && !isAspUser) {
          return true;
        }
        return false;
      });
    });

    this.menus = this.menus.filter((menu: any) => !menu.disabled);
  }

  private goToURL(url: string): void {
    window.location.href = url;
  }

}

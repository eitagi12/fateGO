import { Component, OnInit, OnDestroy } from '@angular/core';
import { TokenService, ChannelType, I18nService, HomeService } from 'mychannel-shared-libs';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'ngx-store';

@Component({
  selector: 'app-main-menu-page',
  templateUrl: './main-menu-page.component.html',
  styleUrls: ['./main-menu-page.component.scss']
})
export class MainMenuPageComponent implements OnInit, OnDestroy {

  menus: any = [
    {
      link: '/buy-product/brand',
      icon: 'assets/svg/ico-device.svg',
      text_th: 'ซื้อเครื่อง',
      text_en: 'Device Purchasing'
   },
   {
      link: '/order/new-register',
      icon: 'assets/svg/ico-new-register-1.svg',
      text_th: 'เปิดเบอร์ใหม่',
      text_en: 'Register new number'
   },
   {
      link: '/order/mnp',
      icon: 'assets/svg/ico-mpn.svg',
      text_th: 'ย้ายค่ายมาใช้ AIS',
      text_en: 'Move to AIS'
   },
   {
      link: '/order/pre-to-post',
      icon: 'assets/svg/ico-pre-to-post.svg',
      text_th: 'เปลี่ยนเติมเงินเป็นรายเดือน',
      text_en: 'Switch to Postpaid'
   }
  ];

  currentLanguage: string = 'TH';

  constructor(
    private homeService: HomeService,
    private tokenService: TokenService,
    private localStorageService: LocalStorageService
  ) {
    if (this.localStorageService.get('lang')) {
      this.currentLanguage = this.localStorageService.get('lang');
    }
  }

  ngOnInit(): void {
    this.homeService.callback = () => {
      if (environment.name === 'LOCAL') {
        window.location.href = '/main-menu';
      } else {
        window.location.href = '/smart-digital/main-menu';
      }
    };

    if (this.tokenService.getUser().channelType === ChannelType.SMART_ORDER) {
      this.keepCard(); // กรณีบัตรค้างในเครื่อง
    }
  }

  keepCard(): void {
    const ws = new WebSocket(`${environment.WEB_CONNECT_URL}/VendingAPI`);
    ws.onopen = () => {
      ws.send('KeepCard');
    };

    ws.onmessage = () => {
      ws.close();
    };
  }

  switchLanguage(): void {
    this.currentLanguage = this.currentLanguage === 'TH' ? 'EN' : 'TH';
    this.localStorageService.set('lang', this.currentLanguage);
  }

  ngOnDestroy(): void {
    this.localStorageService.set('lang', this.currentLanguage);
  }

}

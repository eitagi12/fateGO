import { Component, OnInit, OnDestroy } from '@angular/core';
import { TokenService, ChannelType, I18nService } from 'mychannel-shared-libs';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

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
    private tokenService: TokenService,
    private translationService: TranslateService
  ) {
    this.currentLanguage = this.translationService.currentLang || 'TH';
  }

  ngOnInit(): void {
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
  }

  ngOnDestroy(): void {
    this.translationService.use(this.currentLanguage);
  }

}

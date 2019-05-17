import { Component, OnInit } from '@angular/core';
import { TokenService, ChannelType, HomeService, VirtualKeyboardService } from 'mychannel-shared-libs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-menu-page',
  templateUrl: './main-menu-page.component.html',
  styleUrls: ['./main-menu-page.component.scss']
})
export class MainMenuPageComponent implements OnInit {

  menus: any = [
    { link: '/buy-product/brand', icon: 'assets/svg/ico-device.svg', text: 'ซื้อเครื่อง' },
    { link: '/order/new-register', icon: 'assets/svg/ico-new-register-1.svg', text: 'เปิดเบอร์ใหม่' },
    { link: '/order/mnp', icon: 'assets/svg/ico-mpn.svg', text: 'ย้ายค่ายมา AIS' },
    { link: '/order/pre-to-post', icon: 'assets/svg/ico-pre-to-post.svg', text: 'เปลี่ยนเติมเงินเป็นรายเดือน' }
  ];

  constructor(
    private router: Router,
    private virtualKeyboardService: VirtualKeyboardService,
    private homeService: HomeService,
    private tokenService: TokenService
  ) { }

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

  onClick(menu: any): void {
    // if (menu.text === 'เปิดเบอร์ใหม่') {
      // this.virtualKeyboardService.setAllowKeyboard(true);
    // } else {
      // this.virtualKeyboardService.setAllowKeyboard(false);
    // }
    this.router.navigate([menu.link]);
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

}

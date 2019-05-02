import { Component, OnInit } from '@angular/core';
import { TokenService, ChannelType } from 'mychannel-shared-libs';
import { environment } from 'src/environments/environment';

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
    private tokenService: TokenService
  ) { }

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

}

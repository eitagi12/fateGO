import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TokenService, ChannelType } from 'mychannel-shared-libs';

@Component({
  selector: 'app-main-menu-page',
  templateUrl: './main-menu-page.component.html',
  styleUrls: ['./main-menu-page.component.scss']
})
export class MainMenuPageComponent implements OnInit {

  constructor(
    private tokenService: TokenService,
  ) { }

  ngOnInit() {
    if (this.tokenService.getUser().channelType === ChannelType.SMART_ORDER) {
      this.keepCard();
    }
  }

  keepCard() {
    const ws = new WebSocket(environment.WEB_CONNECT_URL + '/VendingAPI');
    ws.onopen = () => {
      ws.send('KeepCard'); // สำหรับบัตรประชาชนค้าง
    };
  }

}

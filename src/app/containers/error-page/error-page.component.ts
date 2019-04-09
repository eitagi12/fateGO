import { Component, OnInit } from '@angular/core';
import { HomeService, TokenService, ChannelType } from 'mychannel-shared-libs';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss']
})
export class ErrorPageComponent implements OnInit {
  constructor(
    private homeService: HomeService,
    private tokenService: TokenService
  ) { }

  ngOnInit(): void {
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  goToHome(): void {
    const channelType = this.tokenService.getUser().channelType;
    if (ChannelType.SMART_ORDER === channelType) {
      window.location.href = '/smart-shop';
    } else {
      window.location.href = '/';
    }
  }

}

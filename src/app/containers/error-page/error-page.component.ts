import { Component, OnInit } from '@angular/core';
import { ChannelType, TokenService, HomeService } from 'mychannel-shared-libs';
import { environment } from 'src/environments/environment';

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
      window.location.href = '/main-menu';
    } else {
      if (this.tokenService.isTelewizUser()) {
        window.location.href = environment.CSP_URL;
      } else {
        window.location.href = '/';
      }
    }
  }

}

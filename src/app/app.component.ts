import { Component } from '@angular/core';
import { TokenService, ErrorsService, AlertService, PageActivityService, HomeService, ChannelType } from 'mychannel-shared-libs';
import { setTheme } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { debounceTime } from 'rxjs/operators';
const { version: version } = require('../../package.json');


declare var Hammer: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  version: string;

  constructor(
    private errorsService: ErrorsService,
    private tokenService: TokenService,
    private alertService: AlertService,
    private pageActivityService: PageActivityService,
    private router: Router,
    private homeService: HomeService,
  ) {
    this.version = (environment.production ? '' : `[${environment.name}] `) + version;
    this.initails();
    this.tokenHandler();
    this.errorHandler();
    this.pageActivityHandler();
    this.homeService.callback = () => {
      window.location.href = '/smart-shop';
    };
    this.supportOptionSelect();
  }

  initails() {
    setTheme('bs4');
  }

  tokenHandler() {
    let devAccessToken = '';
    if (this.isDeveloperMode()) {
      // tslint:disable-next-line:max-line-length
      devAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik1DIiwidGltZXN0YW1wIjoiMjAxODEwMDExNzM3IiwibG9jYXRpb25Db2RlIjoiMTEwMCIsImlhdCI6MTUzODM5MDI2OCwiZXhwIjoyNTQwOTgyMjY4fQ.tMYDOKJf8X3LFuqBD3-gO6HIHMzxQubd9RO0kvSWRXM';
    }
    this.tokenService.checkTokenExpired(devAccessToken);
  }

  errorHandler() {
    this.errorsService.getUnauthorized().subscribe((observer) => {
      this.alertService.error('Unauthorized: Access is denied due to invalid credentials.');
    });

    this.errorsService.getErrorContextInfo().pipe(debounceTime(1000)).subscribe((observer) => {
      let redirectTo = '/error?';
      Object.keys(observer).forEach((key: string, index: number) => {
        if (index > 0) {
          redirectTo += '&';
        }
        redirectTo += `${key}=${observer[key]}`;
      });
      if (!this.isDeveloperMode()) {
        console.error('Error ', observer);
      } else {
        window.location.href = redirectTo;
      }
    });
  }

  pageActivityHandler() {
    const token = this.tokenService.getUser();
    if (token.channelType !== ChannelType.SMART_ORDER) {
      return;
    }

    this.pageActivityService.setTimeout((counter) => {
      const url = this.router.url;
      if (url.indexOf('perso-sim') !== -1) {
        return counter === 300;
      }
      if (url.indexOf('face-confirm') !== -1) {
        return counter === 900;
      }
      if (url.indexOf('validate-customer-id-card') !== -1) {
        return counter === 120;
      }
      return counter === 60;
    }).subscribe(() => {
      this.alertService.question(
        'คุณไม่ได้ทำรายการภายในเวลาที่กำหนด ต้องการทำรายการต่อหรือไม่?',
        'ทำรายการต่อ', 'ยกเลิก'
      ).then((data) => {
        if (!data.value) {
          this.homeService.goToHome();
        }
        this.pageActivityService.resetTimeout();
      });
    });
  }

  isDeveloperMode(): boolean {
    return 'LOCAL' === environment.name;
  }

  supportOptionSelect() {
    this.router.events.subscribe(path => {
      const select_options = window.document.getElementsByTagName('select');
      for (const key in select_options) {
        if (select_options.hasOwnProperty(key)) {
          const option = select_options[key];
          option.addEventListener('click', function (e) {
            e.stopPropagation();
          });
        }
      }
    });
  }


}

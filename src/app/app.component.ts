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

  initails(): void {
    setTheme('bs4');
  }

  tokenHandler(): void {
    let devAccessToken = '';
    if (this.isDeveloperMode()) {
      // tslint:disable-next-line:max-line-length
      devAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik1DIiwidGltZXN0YW1wIjoiMjAxODA4MTUxMTExIiwibG9jYXRpb25Db2RlIjoiMTEwMCIsImlhdCI6MTUzNDMwNjI3NCwiZXhwIjoxNjk5ODk4Mjc0fQ.WZgkH35wUV6S4WElfDBxVc_R74RMhm9Xp3znHD7coM4';
    }
    this.tokenService.checkTokenExpired(devAccessToken);
  }

  errorHandler(): void {
    this.errorsService.getUnauthorized().subscribe((observer) => {
      this.alertService.error('Unauthorized: Access is denied due to invalid credentials.');
    });

    const ONE_SECOND = 1000;
    this.errorsService.getErrorContextInfo().pipe(debounceTime(ONE_SECOND)).subscribe((observer) => {
      let redirectTo = '/error?';
      Object.keys(observer).forEach((key: string, index: number) => {
        if (index > 0) {
          redirectTo += '&';
        }
        redirectTo += `${key}=${observer[key]}`;
      });
      if (this.isDeveloperMode()) {
        console.error('Error ', observer);
      } else {
        window.location.href = redirectTo;
      }
    });
  }

  pageActivityHandler(): void {
    const token = this.tokenService.getUser();
    if (token.channelType !== ChannelType.SMART_ORDER) {
      return;
    }

    this.pageActivityService.setTimeout((counter) => {
      const url = this.router.url;
      const PERSO_SIM = 300;
      const FACE_COMFIRM = 900;
      const VALIDATE_CUSTOMER_IDCARD = 120;
      const OTHER = 60;

      if (url.indexOf('main-menu') !== -1) {
        return false;
      }
      if (url.indexOf('perso-sim') !== -1) {
        return counter === PERSO_SIM;
      }
      if (url.indexOf('face-confirm') !== -1) {
        return counter === FACE_COMFIRM;
      }
      if (url.indexOf('validate-customer-id-card') !== -1) {
        return counter === VALIDATE_CUSTOMER_IDCARD;
      }
      return counter === OTHER;
    }).subscribe(() => {
      this.alertService.notify({
        type: 'question',
        showConfirmButton: true,
        confirmButtonText: 'ทำรายการต่อ',
        cancelButtonText: 'ยกเลิก',
        showCancelButton: true,
        reverseButtons: true,
        allowEscapeKey: false,
        text: 'คุณไม่ได้ทำรายการภายในเวลาที่กำหนด ต้องการทำรายการต่อหรือไม่?',
        timer: 180000
      }).then((data) => {
        if (!data.value) {
          this.homeService.goToHome();
          // this.router.navigate([ROUTE_DEASHBOARD_MAIN_MENU_PAGE]);
        }
        this.pageActivityService.resetTimeout();
      });
    });
  }

  isDeveloperMode(): boolean {
    return 'LOCAL' === environment.name;
  }

  supportOptionSelect(): void {
    this.router.events.subscribe(path => {
      const select_options = window.document.getElementsByTagName('select');
      for (const key in select_options) {
        if (select_options.hasOwnProperty(key)) {
          const option = select_options[key];
          option.addEventListener('click', (e) => {
            e.stopPropagation();
          });
        }
      }
    });
  }
}

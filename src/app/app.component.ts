import { Component } from '@angular/core';
import { TokenService, ErrorsService, AlertService, PageActivityService, HomeService } from 'mychannel-shared-libs';
import { setTheme } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { debounceTime } from 'rxjs/operators';
import { ROUTE_DEASHBOARD_MAIN_MENU_PAGE } from './dashboard/constants/route-path.constant';
import { TranslateService } from '@ngx-translate/core';

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
    private translation: TranslateService
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
      devAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlBLVFRFU1QwMSIsInRpbWVzdGFtcCI6IjIwMTgwNzEzMTQ1MiIsImxvY2F0aW9uQ29kZSI6IjEyMTMiLCJpYXQiOjE1MzE0NjgxOTAsImV4cCI6MjUzNDA2MDE5MH0.u4DpOA_uoF98SXwWzmi5F1sXqOPuPB13tzuNOP1TW9o';
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
        confirmButtonText: this.translation.instant('ทำรายการต่อ'),
        cancelButtonText: this.translation.instant('ยกเลิก'),
        showCancelButton: true,
        reverseButtons: true,
        allowEscapeKey: false,
        text: this.translation.instant('คุณไม่ได้ทำรายการภายในเวลาที่กำหนด ต้องการทำรายการต่อหรือไม่?'),
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

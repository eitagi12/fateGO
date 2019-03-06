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
    // this.pageActivityHandler();
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
      devAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlBLVFRFU1QwMSIsInRpbWVzdGFtcCI6IjIwMTgwNzEzMTQ1MiIsImxvY2F0aW9uQ29kZSI6IjEyMTMiLCJjaGFubmVsVHlwZSI6InNtYXJ0LW9yZGVyIiwiaWF0IjoxNTMxNDY4MTkwLCJleHAiOjI1MzQwNjAxOTB9.PM1KeaDnmVd1BRxloC8SYNjKq1_kEnt51MAfAs67GpE';
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
      if (this.isDeveloperMode()) {
        console.error('Error ', observer);
      } else {
        window.location.href = redirectTo;
      }
    });
  }

  pageActivityHandler() {
    this.pageActivityService.setTimeout((counter) => {
      const url = this.router.url;
      if (url.indexOf('main-menu') !== -1) {
        return false;
      }
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

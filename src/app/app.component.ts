import { Component } from '@angular/core';
import { TokenService, ErrorsService, AlertService, PageActivityService, HomeService, ChannelType, CookieService } from 'mychannel-shared-libs';
import { setTheme } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { debounceTime } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';

const Moment = moment;
const { version: version } = require('../../package.json');

declare var swal: any;
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
    private http: HttpClient,
    private translation: TranslateService,
    private cookieService: CookieService
  ) {
    this.version = this.getVersion();

    this.initails();
    this.homeHandler();
    this.tokenHandler();
    this.errorHandler();

    if (this.tokenService.getUser().channelType === ChannelType.SMART_ORDER) {
      this.pageActivityHandler();
    }
    this.onStopPropagation();
  }

  initails(): void {
    setTheme('bs4');
  }

  getVersion(): any {
    return (environment.production ? '' : `[${environment.name}] `) + version;
  }

  homeHandler(): void {
    this.homeService.callback = () => {
      if (this.tokenService.getUser().channelType !== ChannelType.SMART_ORDER) {
        window.location.href = '/';
        return;
      }
      if (environment.name === 'LOCAL') {
        window.location.href = '/main-menu';
      } else {
        window.location.href = '/smart-digital/main-menu';
      }
    };
  }

  tokenHandler(): void {
    let devAccessToken = '';
    if (this.isDeveloperMode()) {
      // tslint:disable-next-line:max-line-length
      devAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik1DIiwidGltZXN0YW1wIjoiMjAyMDA1MDUwOTA2IiwibG9jYXRpb25Db2RlIjoiNjMyNTkiLCJpYXQiOjE1ODc1MjExOTcsImV4cCI6MTU4NzUyNDc5N30._X1xAC5qGNhYPbMBSz69jgGP2J3cAu_HvL6mJqsUiGU';
    }
    this.tokenService.checkTokenExpired(devAccessToken);
  }

  errorHandler(): void {
    this.errorsService.getUnauthorized().subscribe((observer) => {
      this.alertService.error('Unauthorized: Access is denied due to invalid credentials.')
      .then(() => this.cookieService.deleteAll());
    });

    const ONE_SECOND = 1000;
    this.errorsService.getErrorContextInfo().pipe(debounceTime(ONE_SECOND)).subscribe((observer) => {
      let redirectTo = 'error?';
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
      if (url.indexOf('device-only/kiosk/select-payment') !== -1) {
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
        }
        this.pageActivityService.resetTimeout();
      });
    });
  }

  isDeveloperMode(): boolean {
    return 'LOCAL' === environment.name;
  }

  onStopPropagation(): void {
    this.router.events.subscribe(path => {
      const select_options = window.document.getElementsByTagName('select');
      for (const key in select_options) {
        if (select_options.hasOwnProperty(key)) {
          const option = select_options[key];
          option.addEventListener('click', (e: any) => {
            e.stopPropagation();
          });
        }
      }
    });
  }

  checkServerTime(): void {
    this.http.get('/api/customerportal/currentDate').toPromise()
      .then((resp: any) => {
        const TIME_DIFF_FORMAT = 'YYYY-MM-DD HH:mm:ss';
        const localTime: any = Moment(Moment().format(TIME_DIFF_FORMAT));
        const serverTime = Moment(Moment(resp.data).format(TIME_DIFF_FORMAT));

        const getClock = (ms: number) => {
          return Moment(resp.data).add(ms, 'second').format(TIME_DIFF_FORMAT);
        };

        console.log(serverTime);
        console.log(localTime.subtract(30, 'm'));
        console.log(localTime.add(30, 'm'));
        console.log(serverTime.isBetween(localTime.subtract(1, 'minutes'), localTime.add(1, 'minutes')));
        if (!serverTime.isBetween(
          localTime.subtract(1, 'minutes'),
          localTime.add(1, 'minutes')
        )) {
          let timerInterval;
          this.alertService.notify({
            type: 'warning',
            html: `
            <div>
              <div class="text-center">โปรดตรวจสอบเวลาเครื่องให้ตรงกับเซอร์เวอร์</div>
              <div class="mt-3">SERVER TIME: <strong></strong></div>
            </div>
            `,
            onBeforeOpen: () => {
              let i = 0;
              timerInterval = setInterval(() => {
                i++;
                swal.getContent().querySelector('strong').textContent = getClock(i);
              }, 1000);
            },
            onClose: () => {
              clearInterval(timerInterval);
            }
          });
        }
      });
  }

}

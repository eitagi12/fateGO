import { Component } from '@angular/core';
import {
  TokenService, ErrorsService, AlertService, PageActivityService, HomeService, ChannelType
} from 'mychannel-shared-libs';
import { setTheme } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { debounceTime } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';

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
    private http: HttpClient
  ) {
    this.version = this.getVersion();

    this.initails();
    this.hoemeHandler();
    this.tokenHandler();
    this.errorHandler();
    // this.checkServerTime();

    if (this.tokenService.getUser().channelType === ChannelType.SMART_ORDER) {
      this.onStopPropagation();
      this.pageActivityHandler();
    }
  }

  initails() {
    setTheme('bs4');
  }

  getVersion(): any {
    return (environment.production ? '' : `[${environment.name}] `) + version;
  }

  hoemeHandler() {
    this.homeService.callback = () => {
      if (environment.name === 'LOCAL') {
        window.location.href = '/main-menu';
      } else {
        window.location.href = '/smart-shop/main-menu';
      }
    };
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
        }
        this.pageActivityService.resetTimeout();
      });
    });
  }

  isDeveloperMode(): boolean {
    return 'LOCAL' === environment.name;
  }

  onStopPropagation() {
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

  checkServerTime() {
    this.http.get('/api/customerportal/currentDate').toPromise()
      .then((resp: any) => {
        const TIME_DIFF_FORMAT = 'YYYY-MM-DD HH:mm:ss';
        const localTime = Moment(Moment().format(TIME_DIFF_FORMAT));
        const serverTime = Moment(Moment(resp.data).format(TIME_DIFF_FORMAT));

        const getClock = (ms: number) => {
          return Moment(resp.data).add(ms, 'second').format(TIME_DIFF_FORMAT);
        };

        console.log(serverTime);
        console.log(localTime.subtract('m', 30));
        console.log(localTime.add(30, 'm'));
        console.log(serverTime.isBetween(localTime.subtract('minutes', 1), localTime.add('minutes', 1)));
        if (!serverTime.isBetween(
          localTime.subtract('minutes', 1),
          localTime.add('minutes', 1)
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

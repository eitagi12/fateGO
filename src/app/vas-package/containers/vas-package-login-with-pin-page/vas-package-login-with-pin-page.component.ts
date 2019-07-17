import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, TokenService, AlertService, REGEX_MOBILE } from 'mychannel-shared-libs';
import { ROUTE_VAS_PACKAGE_OTP_PAGE, ROUTE_VAS_PACKAGE_SELECT_PACKAGE_PAGE, ROUTE_VAS_PACKAGE_CURRENT_BALANCE_PAGE } from 'src/app/vas-package/constants/route-path.constant';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import * as moment from 'moment';
import { Transaction } from 'src/app/shared/models/transaction.model';

@Component({
  selector: 'app-vas-package-login-with-pin-page',
  templateUrl: './vas-package-login-with-pin-page.component.html',
  styleUrls: ['./vas-package-login-with-pin-page.component.scss']
})
export class VasPackageLoginWithPinPageComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  transaction: Transaction;
  mobileNoAgent: string;
  isRom: boolean;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private http: HttpClient,
    private fb: FormBuilder,
    private tokenService: TokenService,
    private transactionService: TransactionService,
    private alertService: AlertService
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.getRomByUser();
    this.createForm();
  }

  onBack(): void {
    this.router.navigate([ROUTE_VAS_PACKAGE_SELECT_PACKAGE_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  private getRomByUser(): any {
    const username = this.tokenService.getUser().username;
    this.http.get(`/api/easyapp/get-rom-by-user?username=${username}`).toPromise()
      .then((res: any) => {
        if (res && res.data.mobileNo !== '') {
          this.mobileNoAgent = res.data.mobileNo;
          this.isRom = true;
        } else {
          this.mobileNoAgent = '';
          this.isRom = false;
        }
      });
  }

  private createForm(): void {
    this.loginForm = this.fb.group({
      'mobileNoAgent': [
        { value: this.mobileNoAgent },
        Validators.required
      ],
      'pinAgent': [
        '',
        Validators.required
      ]
    });
  }

  genTransactionId(): any {
    return moment().format('YYYYMMDDHHmmssSSS');
  }

  onNext(): void {
    this.getProfile();
  }

  getProfile(): void {
    const requestGetProfile = {
      transactionid: this.genTransactionId(),
      mobile_no_agent: this.loginForm.value.mobileNoAgent,
      // tslint:disable-next-line: max-line-length
      device_id: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJST00gTW9iaWxlIGFwaSIsImF1ZCI6Imh 0dHBzOi8vbXlyb20uYWlzLmNvLnRoL0FQSS9W MS9zaWdpbiIsInN1YiI6IjA0Ni1iNTc2Mjc4ZC1j MTY4LTQ5YjMtOWYxZi1jODVhYTc4YjgwYzAiL CJtc2lzZG4iOiIwNjIyNDM0MjA4IiwiYWdlbnRpZ CI6IjYyMzgxNDciLCJpYXQiOjE1Mzc0MzE3NjAsI mV4cCI6MTUzNzQzMjY2MH0.kY85wPWDSxy1ll rpejMRJrtKC_PE6F_7fuTMg5y-ZS0'
    };
    this.http.post(`/api/customerportal/rom/get-profile`, requestGetProfile).toPromise()
      .then((res: any) => {
        if (res && res.data.status === 'success') {
          this.signIn(res.data.agent_id);
        } else {
          this.alertService.error(res.data.message);
        }
      })
      .catch(() => {
        this.alertService.error('ระบบไม่สามารถใช้งานได้ในขณะนี้');
      });
  }

  signIn(agentId: any): void {
    const requestSignIn = {
      transactionid: this.genTransactionId(),
      deviceos: 'Android',
      deviceversion: '5.1.1',
      mobile_no_agent: this.loginForm.value.mobileNoAgent,
      // tslint:disable-next-line:max-line-length
      deviceid: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJST00gTW9iaWxlIGFwaSIsImF1ZCI6Imh 0dHBzOi8vbXlyb20uYWlzLmNvLnRoL0FQSS9W MS9zaWdpbiIsInN1YiI6IjA0Ni1iNTc2Mjc4ZC1j MTY4LTQ5YjMtOWYxZi1jODVhYTc4YjgwYzAiL CJtc2lzZG4iOiIwNjIyNDM0MjA4IiwiYWdlbnRpZ CI6IjYyMzgxNDciLCJpYXQiOjE1Mzc0MzE3NjAsI mV4cCI6MTUzNzQzMjY2MH0.kY85wPWDSxy1ll rpejMRJrtKC_PE6F_7fuTMg5y-ZS0 ',
      pin: this.loginForm.value.pinAgent
    };
    this.http.post(`/api/customerportal/rom/sign-in`, requestSignIn).toPromise()
      .then((res: any) => {
        if (res && res.data.status === 'success') {
          this.transaction.data = {
            ...this.transaction.data,
            romAgent: {
              mobileNoAgent: this.loginForm.value.mobileNoAgent,
              agentId: agentId,
              tokenType: res.data.token_type,
              accessToken: res.data.access_token
            }
          };
          // check Rom Agent ที่มีข้อมูลแล้ว
          if (this.isRom === true) {
            this.router.navigate([ROUTE_VAS_PACKAGE_CURRENT_BALANCE_PAGE]);
          } else {
            this.router.navigate([ROUTE_VAS_PACKAGE_OTP_PAGE]);
          }
        } else {
          this.alertService.error('เบอร์โทรศัพท์ หรือ PIN ไม่ถูกต้อง');
        }
      })
      .catch(() => {
        this.alertService.error('ระบบไม่สามารถใช้งานได้ในขณะนี้');
      });
  }

  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
  }
}

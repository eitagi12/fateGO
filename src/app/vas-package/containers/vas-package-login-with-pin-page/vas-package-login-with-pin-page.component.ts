import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, AlertService } from 'mychannel-shared-libs';
import { ROUTE_VAS_PACKAGE_OTP_PAGE, ROUTE_VAS_PACKAGE_SELECT_PACKAGE_PAGE, ROUTE_VAS_PACKAGE_CURRENT_BALANCE_PAGE } from 'src/app/vas-package/constants/route-path.constant';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import * as moment from 'moment';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { AisNativeOrderService } from 'src/app/shared/services/ais-native-order.service';
import { Subscription } from 'rxjs';
declare let window: any;
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
  window: any = window;
  usernameRom: string;
  usernameSub: Subscription;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private http: HttpClient,
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private alertService: AlertService,
    private aisNativeOrderService: AisNativeOrderService
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.getDeviceInfo();
    this.getRomByUser();
    this.createForm();
  }

  onBack(): void {
    this.router.navigate([ROUTE_VAS_PACKAGE_SELECT_PACKAGE_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  getDeviceInfo(): void {
    if (window.aisNative) {
      return JSON.parse(window.aisNative.getDeviceInfo());
    } else if (window.iosNative) {
      return JSON.parse(window.iosNative);
    } else {
      window.location.href = 'IOS://param?Action=getiosnative';
      return window.iosNative;
    }
  }

  private getRomByUser(): any {
    this.aisNativeOrderService.getNativeUsername();
    this.usernameSub = this.aisNativeOrderService.getUsername().subscribe((username: string) => {
      this.usernameRom = username;
      this.http.get(`/api/easyapp/get-rom-by-user?username=${this.usernameRom}`).toPromise()
        .then((res: any) => {
          if (res && res.data.mobileNo !== '') {
            this.mobileNoAgent = res.data.mobileNo;
            this.loginForm.controls.mobileNoAgent.setValue(this.mobileNoAgent);
            this.isRom = true;
          } else {
            this.mobileNoAgent = '';
            this.isRom = false;
          }
        });
    });
  }

  private createForm(): void {
    this.loginForm = this.fb.group({
      'mobileNoAgent': ['', Validators.compose([Validators.required, Validators.pattern(/^0[6-9]{1}[0-9]{8}/)])],
      'pinAgent': ['', Validators.required]
    });
    this.loginForm.controls.mobileNoAgent.setValue(this.mobileNoAgent);
  }

  genTransactionId(): any {
    return moment().format('YYYYMMDDHHmmssSSS');
  }

  onNext(): void {
    this.getProfile(this.getDeviceInfo());
  }

  getProfile(deviceInfo: any): void {
    const requestGetProfile = {
      transactionid: this.genTransactionId(),
      mobile_no_agent: this.loginForm.controls.mobileNoAgent.value,
      device_id: deviceInfo.udid

      // mock data for PC
      // tslint:disable-next-line:max-line-length
      // device_id: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJST00gTW9iaWxlIGFwaSIsImF1ZCI6Imh 0dHBzOi8vbXlyb20uYWlzLmNvLnRoL0FQSS9W MS9zaWdpbiIsInN1YiI6IjA0Ni1iNTc2Mjc4ZC1j MTY4LTQ5YjMtOWYxZi1jODVhYTc4YjgwYzAiL CJtc2lzZG4iOiIwNjIyNDM0MjA4IiwiYWdlbnRpZ CI6IjYyMzgxNDciLCJpYXQiOjE1Mzc0MzE3NjAsI mV4cCI6MTUzNzQzMjY2MH0.kY85wPWDSxy1ll rpejMRJrtKC_PE6F_7fuTMg5y-ZS0'
    };
    this.http.post(`/api/customerportal/rom/get-profile`, requestGetProfile).toPromise()
      .then((res: any) => {
        if (res && res.data.status === 'success') {
          this.signIn(res.data.agent_id, deviceInfo);
        } else {
          this.alertService.error('เบอร์โทรศัพท์นี้ไม่ใช่ ROM Agent กรุณาทำรายการใหม่อีกครั้ง');
        }
      })
      .catch(() => {
        this.alertService.error('ระบบไม่สามารถใช้งานได้ในขณะนี้');
      });
  }

  signIn(agentId: any, deviceInfo: any): void {
    const requestSignIn = {
      transactionid: this.genTransactionId(),
      deviceos: deviceInfo.device_os,
      deviceversion: deviceInfo.device_version,
      mobile_no_agent: this.loginForm.controls.mobileNoAgent.value,
      deviceid: deviceInfo.udid,
      pin: this.loginForm.value.pinAgent,

      // mock data for PC
      // deviceos: 'Android',
      // deviceversion: '5.1.1',
      // tslint:disable-next-line:max-line-length
      // deviceid: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJST00gTW9iaWxlIGFwaSIsImF1ZCI6Imh 0dHBzOi8vbXlyb20uYWlzLmNvLnRoL0FQSS9W MS9zaWdpbiIsInN1YiI6IjA0Ni1iNTc2Mjc4ZC1j MTY4LTQ5YjMtOWYxZi1jODVhYTc4YjgwYzAiL CJtc2lzZG4iOiIwNjIyNDM0MjA4IiwiYWdlbnRpZ CI6IjYyMzgxNDciLCJpYXQiOjE1Mzc0MzE3NjAsI mV4cCI6MTUzNzQzMjY2MH0.kY85wPWDSxy1ll rpejMRJrtKC_PE6F_7fuTMg5y-ZS0 ',
    };
    this.http.post(`/api/customerportal/rom/sign-in`, requestSignIn).toPromise()
      .then((res: any) => {
        if (res && res.data.status === 'success') {
          this.transaction.data = {
            ...this.transaction.data,
            romAgent: {
              mobileNoAgent: this.loginForm.controls.mobileNoAgent.value,
              pinAgent: this.loginForm.value.pinAgent,
              agentId: agentId,
              tokenType: res.data.token_type,
              accessToken: res.data.access_token
            }
          };
          // check Rom Agent ที่มีข้อมูลแล้ว
          const mobileNoAgentCurrent = this.loginForm.controls.mobileNoAgent.value;
          if (this.isRom === true && mobileNoAgentCurrent === this.mobileNoAgent) {
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
    if (this.usernameSub) {
      this.usernameSub.unsubscribe();
    }
  }

}

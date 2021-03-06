import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, AlertService, PageLoadingService } from 'mychannel-shared-libs';
import { ROUTE_VAS_PACKAGE_OTP_PAGE, ROUTE_VAS_PACKAGE_SELECT_PACKAGE_PAGE, ROUTE_VAS_PACKAGE_CURRENT_BALANCE_PAGE } from 'src/app/vas-package/constants/route-path.constant';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import * as moment from 'moment';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { environment } from 'src/environments/environment';
import { AisNativeDeviceService } from 'src/app/shared/services/ais-native-device.service';
declare let window: any;
@Component({
  selector: 'app-vas-package-login-with-pin-page',
  templateUrl: './vas-package-login-with-pin-page.component.html',
  styleUrls: ['./vas-package-login-with-pin-page.component.scss']
})
export class VasPackageLoginWithPinPageComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  transaction: Transaction;
  window: any = window;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private http: HttpClient,
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private alertService: AlertService,
    private pageLoadingService: PageLoadingService,
    private aisNativeDeviceService: AisNativeDeviceService
  ) {
    this.transaction = this.transactionService.load();
    this.getDeviceInfo();
  }

  ngOnInit(): void {
    this.createForm();
  }

  onBack(): void {
    this.router.navigate([ROUTE_VAS_PACKAGE_SELECT_PACKAGE_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  createForm(): void {
    this.loginForm = this.fb.group({
      'mobileNoAgent': ['', Validators.compose([Validators.required, Validators.pattern(/^0[6-9]{1}[0-9]{8}/)])],
      'pinAgent': ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(4)])]
    });
    this.loginForm.controls['mobileNoAgent'].setValue(this.transaction.data.romAgent.mobileNoAgent);
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

  genTransactionId(): any {
    return moment().format('YYYYMMDDHHmmssSSS');
  }

  onNext(): void {
    if (environment.name !== 'PROD' && !this.aisNativeDeviceService.isNativeEasyApp()) {
      this.getProfile(environment.DEVICE);
    } else {
      this.getProfile(this.getDeviceInfo());
    }
  }

  getProfile(deviceInfo: any): void {
    const requestGetProfile = {
      transactionid: this.genTransactionId(),
      mobile_no_agent: this.loginForm.controls.mobileNoAgent.value,
      device_id: deviceInfo.udid
    };
    this.pageLoadingService.openLoading();
    this.http.post(`/api/customerportal/rom/get-profile`, requestGetProfile).toPromise()
      .then((res: any) => {
        if (res && res.data.status === 'success') {
          this.signIn(res.data.agent_id, deviceInfo);
        } else {
          this.alertService.error('เบอร์โทรศัพท์นี้ไม่ใช่ ROM Agent กรุณาทำรายการใหม่อีกครั้ง');
        }
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

    };
    this.http.post(`/api/customerportal/rom/sign-in`, requestSignIn).toPromise()
      .then((res: any) => {
        if (res && res.data.status === 'success') {
          this.pageLoadingService.closeLoading();
          // check Rom Agent ที่มีข้อมูลแล้ว
          const mobileNoAgent = this.transaction.data.romAgent.mobileNoAgent;
          const mobileNoAgentCurrent = this.loginForm.controls.mobileNoAgent.value;
          if (mobileNoAgentCurrent === mobileNoAgent) {
            this.saveTransaction(agentId, res);
            this.router.navigate([ROUTE_VAS_PACKAGE_CURRENT_BALANCE_PAGE]);
          } else {
            this.saveTransaction(agentId, res, mobileNoAgentCurrent);
            this.router.navigate([ROUTE_VAS_PACKAGE_OTP_PAGE]);
          }
        } else {
          this.alertService.error('เบอร์โทรศัพท์ หรือ PIN ไม่ถูกต้อง');
        }
      });
  }

  saveTransaction(agentId: string, token: any, mobileNo?: string): void {
    this.transaction.data.romAgent = {
      ...this.transaction.data.romAgent,
      mobileNoAgent: mobileNo ? mobileNo : this.transaction.data.romAgent.mobileNoAgent,
      pinAgent: this.loginForm.value.pinAgent,
      agentId: agentId,
      tokenType: token.data.token_type,
      accessToken: token.data.access_token
    };
  }

  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
  }

}

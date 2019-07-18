import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, PageLoadingService, AlertService, TokenService } from 'mychannel-shared-libs';
import { ROUTE_VAS_PACKAGE_CURRENT_BALANCE_PAGE, ROUTE_VAS_PACKAGE_LOGIN_WITH_PIN_PAGE, ROUTE_VAS_PACKAGE_RESULT_PAGE, ROUTE_VAS_PACKAGE_SELECT_PACKAGE_PAGE } from 'src/app/vas-package/constants/route-path.constant';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction, TransactionType, TransactionAction } from 'src/app/shared/models/transaction.model';
import { environment } from 'src/environments/environment';

export interface IRequestGetOTP {
  transactionid: string;
  mobile_no_agent: string;
}

export interface IResponseGetOTP {
  status: string;
  message: string;
  response_code: string;
  response_message: string;
  transactionid: string;
  datetime: string;
}

export interface IRequestVerifyOTP {
  transactionid: string;
  mobile_no_agent: string;
  otp: string;
}

export interface IResponseVerifyOTP {
  status: string;
  message: string;
  response_code: string;
  response_message: string;
  transactionid: string;
  datetime: string;
}
@Component({
  selector: 'app-vas-package-otp-page',
  templateUrl: './vas-package-otp-page.component.html',
  styleUrls: ['./vas-package-otp-page.component.scss']
})

export class VasPackageOtpPageComponent implements OnInit, OnDestroy {

  formOTP: FormGroup;
  public otp: string;
  transaction: Transaction;
  public mobileNo: any;
  public isRomAgent: boolean;
  public transactionid: string;
  public mobileNoAgent: string;
  constructor(
    private router: Router,
    private homeService: HomeService,
    private builder: FormBuilder,
    private pageLoadingService: PageLoadingService,
    private alertService: AlertService,
    private http: HttpClient,
    private tokenService: TokenService,
    private transactionService: TransactionService

  ) {
    this.transaction = this.transactionService.load();
    this.mobileNo = this.transaction.data.simCard.mobileNo;
    this.mobileNoAgent = this.transaction && this.transaction.data && this.transaction.data.romAgent
      && this.transaction.data.romAgent.mobileNoAgent ? this.transaction.data.romAgent.mobileNoAgent : '';
  }

  ngOnInit(): void {
    this.checkTransactionType();
    this.buildForm();
    this.getOTP();

  }

  public buildForm(): any {
    this.formOTP = this.builder.group({
      verifyOTP: new FormControl('', [
        Validators.maxLength(4),
        Validators.minLength(4),
        Validators.required
      ])
    });
  }

  public keyPress(event: any): any {
    const charCode: number = (event.which) ? event.which : event.keyCode;
    const charCodeCursorDown: number = 31;
    const charCodePercent: number = 37;
    const charCodeSingleQuote: number = 39;
    const charCodeDot: number = 46;
    const charCodeZero: number = 48;
    const charCodeNine: number = 57;

    if (charCode > charCodeCursorDown && (charCode < charCodeZero || charCode > charCodeNine)
      || charCode === charCodeDot || charCode === charCodePercent || charCode === charCodeSingleQuote) {
      event.preventDefault();
    }
  }

  public genTransactionId(): any {
    return moment().format('YYYYMMDDHHmmssSSS');
  }

  public getOTP(): void {
    this.pageLoadingService.openLoading();
    this.isRomAgent ? this.getRomOTP() : this.getCustomerOTP();
  }

  public getRomOTP(): void {
    const requestGetOTP: IRequestGetOTP = {
      transactionid: this.genTransactionId(),
      mobile_no_agent: this.mobileNoAgent
    };
    this.http.post(`/api/customerportal/rom/get-otp`, requestGetOTP).toPromise().then((res: any) => {
      const responseGetOTP: IResponseGetOTP = res.data;
      this.pageLoadingService.closeLoading();
      if (responseGetOTP.status) {
        this.transactionid = responseGetOTP.transactionid;
        this.pageLoadingService.closeLoading();
      } else {
        this.alertService.error(responseGetOTP.message);
        this.pageLoadingService.closeLoading();
      }
    })
      .catch((error: any) => {
        this.pageLoadingService.closeLoading();
        this.alertError(error);
      });
  }

  public getCustomerOTP(): void {
    if (environment.name !== 'PROD') {
      this.mobileNo = environment.TEST_OTP_MOBILE;
    }
    this.http.post(`/api/customerportal/newRegister/${this.mobileNo}/sendOTP`, { digits: '4' }).toPromise().then((resp: any) => {
      if (resp && resp.data) {
        this.transactionid = resp.data.transactionID;
        this.pageLoadingService.closeLoading();
      }
    }).catch((error) => {
      this.pageLoadingService.closeLoading();
      this.alertError(error);
    });
  }

  public verifyOTP(): void {
    this.pageLoadingService.openLoading();
    this.isRomAgent ? this.verifyRomOTP() : this.verifyCustomerOTP();
  }

  public verifyRomOTP(): void {
    const requestVerifyOTP: IRequestVerifyOTP = {
      transactionid: this.transactionid,
      mobile_no_agent: this.mobileNoAgent,
      otp: this.formOTP.controls.verifyOTP.value
    };
    this.http.post(`/api/customerportal/rom/verify-otp`, requestVerifyOTP).toPromise().then((res: any) => {
      const responseVerifyOTP: IResponseVerifyOTP = res.data;
      if (responseVerifyOTP.status && responseVerifyOTP.status === 'success') {
        this.saveROM();
      } else {
        this.pageLoadingService.closeLoading();
        this.alertService.error(responseVerifyOTP.message);
      }
    })
      .catch((error: any) => {
        this.pageLoadingService.closeLoading();
        this.alertError(error);
      });
  }

  public verifyCustomerOTP(): void {
    const requestVerifyOTP: any = {
      pwd: this.formOTP.controls.verifyOTP.value,
      transactionID: this.transactionid
    };
    this.http.post(`/api/customerportal/newRegister/${this.mobileNo}/verifyOTP`, requestVerifyOTP).toPromise()
      .then((res: any) => {
        this.router.navigate([ROUTE_VAS_PACKAGE_RESULT_PAGE]);
      })
      .catch((error: any) => {
        this.pageLoadingService.closeLoading();
        this.alertService.error('รหัส OTP ไม่ถูกต้อง กรุณาระบุใหม่อีกครั้ง');
      });
  }

  public saveROM(): void {
    const requestSaveROM = {
      mobileNo: this.mobileNoAgent,
      username: this.tokenService.getUser().username
    };
    this.http.post(`/api/easyapp/save-rom-number`, requestSaveROM).toPromise().then((res: any) => {
      if (res.data.isSuccess) {
        this.pageLoadingService.closeLoading();
        this.router.navigate([ROUTE_VAS_PACKAGE_CURRENT_BALANCE_PAGE]);
      } else {
        this.pageLoadingService.closeLoading();
        this.alertService.error('ระบบไม่สามารถใช้งานได้ในขณะนี้');
      }
    }).catch((error) => {
      this.pageLoadingService.closeLoading();
      this.alertError(error);
    });
  }

  public checkTransactionType(): any {
    if (this.transaction.data.transactionType === 'RomAgent') {
      this.isRomAgent = true;
    } else {
      this.isRomAgent = false;
    }
  }

  public ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

  public alertError(error: any): void {
    let errObj: any;
    let errMsg: any;
    let errDetail: any;
    try {
      errObj = error.json();
      errMsg = errObj.resultDescription;
      errDetail = '[Result Code: ' + errObj.resultCode + '] ' + errObj.developerMessage.replace(/\'/g, '');
    } catch (error) {
      errMsg = 'ระบบไม่สามารถแสดงข้อมูลได้ในขณะนี้';
      errDetail = 'Invalid error message';
    }
    this.alertService.error(errMsg);
  }

  public onBack(): void {
    this.isRomAgent ? this.router.navigate([ROUTE_VAS_PACKAGE_LOGIN_WITH_PIN_PAGE])
      : this.router.navigate([ROUTE_VAS_PACKAGE_SELECT_PACKAGE_PAGE]);
  }

  public onHome(): void {
    this.homeService.goToHome();
  }
}

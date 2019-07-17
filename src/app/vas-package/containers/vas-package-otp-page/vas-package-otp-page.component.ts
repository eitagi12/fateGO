import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, PageLoadingService, AlertService, TokenService } from 'mychannel-shared-libs';
import { ROUTE_VAS_PACKAGE_CURRENT_BALANCE_PAGE, ROUTE_VAS_PACKAGE_LOGIN_WITH_PIN_PAGE } from 'src/app/vas-package/constants/route-path.constant';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction, TransactionType, TransactionAction } from 'src/app/shared/models/transaction.model';

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
  public mobile: any = '0618269265';
  public isRomAgent: boolean;

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
  }

  ngOnInit(): void {
    this.checkTransactionType();
    this.buildForm();
    this.getOTP();

  }
  onBack(): void {
    this.router.navigate([ROUTE_VAS_PACKAGE_LOGIN_WITH_PIN_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
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
    const url = `/api/customerportal/rom/get-otp`;
    const requestGetOTP: IRequestGetOTP = {
      transactionid: this.genTransactionId(),
      mobile_no_agent: this.mobile
    };
    this.pageLoadingService.openLoading();
    this.http.post(url, requestGetOTP).toPromise().then((res: any) => {
      console.log('response', res);
      const responseGetOTP: IResponseGetOTP = res.data;
      this.pageLoadingService.closeLoading();
      if (responseGetOTP.status && responseGetOTP.status === 'fail') {
        this.alertService.error(responseGetOTP.message);
      }
    })
      .catch((err: any) => {
        this.pageLoadingService.closeLoading();
        this.alertService.error(err);
      });
  }

  public verifyOTP(): void {
    const url = `/api/customerportal/rom/verify-otp`;
    const requestVerifyOTP: IRequestVerifyOTP = {
      transactionid: this.genTransactionId(),
      mobile_no_agent: this.mobile,
      otp: this.formOTP.controls.verifyOTP.value
    };
    this.pageLoadingService.openLoading();
    this.http.post(url, requestVerifyOTP).toPromise().then((res: any) => {
      const responseVerifyOTP: IResponseVerifyOTP = res.data;
      if (responseVerifyOTP.status && responseVerifyOTP.status === 'success') {
        this.pageLoadingService.closeLoading();
        this.saveROM();
      } else {
        this.pageLoadingService.closeLoading();
        this.alertService.error(responseVerifyOTP.message);
      }
    })
      .catch((err: any) => {
        this.pageLoadingService.closeLoading();
        this.alertService.error(err);
      });
  }

  public saveROM(): void {
    const urlSaveROM = `/api/easyapp/save-rom-number`;
    const requestSaveROM = {
      mobileNo: this.mobile,
      username: this.tokenService.getUser().username
    };
    this.http.post(urlSaveROM, requestSaveROM).toPromise().then((res: any) => {
      console.log('res', res);
      if (res.data.isSuccess) {
        this.router.navigate([ROUTE_VAS_PACKAGE_CURRENT_BALANCE_PAGE]);
        this.transaction = {
          data: {
            ...this.transaction.data,
            action: TransactionAction.VAS_PACKAGE_ROM_OTP,
          },
          transactionId: moment().format('YYYYMMDDHHmmss'),
        };
      } else {
        this.alertService.error('ระบบไม่สามารถใช้งานได้ในขณะนี้');
      }
    });
  }

  checkTransactionType(): any {
    if (this.transaction.data.transactionType === 'RomAgent') {
      this.isRomAgent = true;
    } else {
      this.isRomAgent = false;
    }
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}

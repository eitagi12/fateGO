import { Component, OnInit } from '@angular/core';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Transaction, TransactionAction } from 'src/app/shared/models/transaction.model';
import { Router } from '@angular/router';
import { HomeService, PageLoadingService, AlertService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CUSTOMER_INFO_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CUSTOMER_PROFILE_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CAPTURE_REPI_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_PAYMENT_DETAIL_PAGE } from 'src/app/device-order/ais/device-order-ais-existing-best-buy/constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-existing-best-buy-otp-page',
  templateUrl: './device-order-ais-existing-best-buy-otp-page.component.html',
  styleUrls: ['./device-order-ais-existing-best-buy-otp-page.component.scss']
})
export class DeviceOrderAisExistingBestBuyOtpPageComponent implements OnInit {

  wizards = WIZARD_DEVICE_ORDER_AIS;
  otpForm: FormGroup;
  transaction: Transaction;
  registrationData: any;
  mobileNo: string;
  transactionID: string;
  isOtpValid: boolean;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private pageLoadingService: PageLoadingService,
    private fb: FormBuilder,
    private http: HttpClient,
    private alertService: AlertService,
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit() {
    this.registrationData = this.transaction.data;
    this.mobileNo = this.registrationData.mainMobile;
    this.createForm();
    this.sendOTP();
  }
  private createForm(): void {
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.maxLength(5)]],
    });
  }
  sendOTP() {
    this.pageLoadingService.openLoading();
    let mobile = this.registrationData.simCard.mobileNo;

    if (environment.name !== 'PROD') {
      mobile = environment.TEST_OTP_MOBILE;
    }
    this.http.post(`/api/customerportal/newRegister/${mobile}/sendOTP`, { digits: '5' }).toPromise()
      .then((resp: any) => {
        if (resp && resp.data) {
          this.transactionID = resp.data.transactionID;
          this.pageLoadingService.closeLoading();
        }
      }).catch((error) => {
        this.pageLoadingService.closeLoading();
        this.alertError(error);
      });
  }

  verifyOTP() {
    this.pageLoadingService.openLoading();
    let mobile = this.registrationData.simCard.mobileNo;

    const otp = this.otpForm.value.otp;
    if (environment.name !== 'PROD') {
      mobile = environment.TEST_OTP_MOBILE;
    }
    this.http.post(`/api/customerportal/newRegister/${mobile}/verifyOTP`, { pwd: otp, transactionID: this.transactionID }).toPromise()
      .then((resp: any) => {
        this.navigateNext();
      }).catch((error) => {
        this.pageLoadingService.closeLoading();
        this.alertService.error('รหัส OTP ไม่ถูกต้อง กรุณาระบุใหม่อีกครั้ง');
      });
  }

  navigateNext(): void {
    if (this.transaction.data.action === TransactionAction.READ_CARD_REPI) {
      this.autoPI();
    } else {
      this.pageLoadingService.closeLoading();
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CAPTURE_REPI_PAGE]);
    }
  }

  autoPI(): void {
    this.http.post(`/api/customerportal/newRegister/updatePrepaidIdent`, this.getRequestUpdatePrepaidIdentata()
    ).toPromise()
      .then((response: any) => {
        this.pageLoadingService.closeLoading();
        if (response && response.data && response.data.success) {
          this.transaction.data.action = TransactionAction.READ_CARD;
          this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_PAYMENT_DETAIL_PAGE]);
        } else {
          this.alertService.error('ระบบไม่สามารถแสดงตนได้กรุณาติดต่อเจ้าหน้าที่');
        }
      }).catch((error) => {
        this.pageLoadingService.closeLoading();
        this.alertService.error('รหัส OTP ไม่ถูกต้อง กรุณาระบุใหม่อีกครั้ง');
      }).catch((error) => {
        this.pageLoadingService.closeLoading();
        this.alertService.error('ระบบไม่สามารถแสดงตนได้กรุณาติดต่อเจ้าหน้าที่');
      });
  }

  alertError(error): void {
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
  onBack() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CUSTOMER_PROFILE_PAGE]);
  }
  onHome() {
    this.homeService.goToHome();
  }
  getRequestUpdatePrepaidIdentata() {
    const customer = this.transaction.data.customer;
    const mobileNo = this.transaction.data.simCard.mobileNo;
    const data: any = {
      idCardNo: customer.idCardNo || '-',
      mobileNo: mobileNo || '-',
      birthdate: customer.birthdate || '-',
      firstName: customer.firstName || '-',
      lastName: customer.lastName || '-',
      gender: customer.gender || '-',
      homeNo: customer.homeNo || '-',
      buildingName: customer.buildingName || '-',
      floor: customer.floor || '-',
      room: customer.room || '-',
      moo: customer.moo || '-',
      mooBan: customer.mooBan || '-',
      soi: customer.soi || '-',
      street: customer.street || '-',
      tumbol: customer.tumbol || '-',
      amphur: customer.amphur || '-',
      province: customer.province || '-',
      zipCode: customer.zipCode || '-',
      idCardImage: '-',
      imageReadSmartCard: customer.imageReadSmartCard || '-',
      isSmartCard: 'Y',
      smartCardVersion: 'v1',
      urlPicture: ''
    };
    return data;
  }

}

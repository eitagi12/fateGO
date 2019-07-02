
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, PageLoadingService, AlertService, ShoppingCart } from 'mychannel-shared-libs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { WIZARD_DEVICE_ODER_AIS_DEVICE } from '../../../../constants/wizard.constant';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction, TransactionAction } from 'src/app/shared/models/transaction.model';
import { environment } from 'src/environments/environment';
import { ROUTE_DEVICE_AIS_DEVICE_SUMMARY_PAGE, ROUTE_DEVICE_AIS_DEVICE_PAYMENT_PAGE } from 'src/app/device-order/ais/device-order-ais-device/constants/route-path.constant';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';

@Component({
  selector: 'app-device-order-ais-device-otp-page',
  templateUrl: './device-order-ais-device-otp-page.component.html',
  styleUrls: ['./device-order-ais-device-otp-page.component.scss']
})
export class DeviceOrderAisDeviceOtpPageComponent implements OnInit {
  wizards: string[] = WIZARD_DEVICE_ODER_AIS_DEVICE;
  otpForm: FormGroup;
  transaction: Transaction;
  registrationData: any;
  mobileNo: string;
  transactionID: string;
  isOtpValid: boolean;
  shoppingCart: ShoppingCart;
  chargeType: any;
  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private pageLoadingService: PageLoadingService,
    private fb: FormBuilder,
    private http: HttpClient,
    private alertService: AlertService,
    private shoppingCartService: ShoppingCartService,
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
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
  sendOTP(): void {
    this.pageLoadingService.openLoading();
    const mobileNo: any = this.registrationData.simCard.mobileNo;
    this.mobileNo = '0951000005';
    if (environment.name !== 'PROD') {
      this.http.get(`/api/customerportal/asset/${mobileNo}/profile`).toPromise().then((res: any) => {
        this.chargeType = res && res.data && res.data.chargeType ? res.data.chargeType : {};
      });
      this.mobileNo = this.chargeType === 'Pre-paid' ? environment.TEST_OTP_MOBILE : environment.TEST_OTP_MOBILE_POSTPAID;
      console.log('mobile', mobileNo);
    }
    this.http.post(`/api/customerportal/newRegister/${mobileNo}/sendOTP`, { digits: '5' }).toPromise()
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

  verifyOTP(): void {
    this.pageLoadingService.openLoading();
    let mobile = this.registrationData.simCard.mobileNo;

    const otp = this.otpForm.value.otp;
    if (environment.name !== 'PROD') {
      mobile = environment.TEST_OTP_MOBILE;
    }
    this.http.post(`/api/customerportal/newRegister/${mobile}/verifyOTP`, { pwd: otp, transactionID: this.transactionID }).toPromise()
      .then((resp: any) => {
        this.router.navigate([ROUTE_DEVICE_AIS_DEVICE_SUMMARY_PAGE]);
      }).catch((error) => {
        this.pageLoadingService.closeLoading();
        this.alertService.error('รหัส OTP ไม่ถูกต้อง กรุณาระบุใหม่อีกครั้ง');
      });
  }

  alertError(error: { json: () => void; }): void {
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
  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_AIS_DEVICE_PAYMENT_PAGE]);
  }
  onHome(): void {
    this.homeService.goToHome();
  }
  getRequestUpdatePrepaidIdentata(): void {
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
      urlPicture: '-'
    };
    return data;
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, ShoppingCart, PageLoadingService, AlertService } from 'mychannel-shared-libs';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import {
  ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_ELIGIBLE_MOBILE_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_CUSTOMER_INFO_PAGE
} from '../../constants/route-path.constant';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CustomerInfoService } from 'src/app/device-order/services/customer-info.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction, TransactionAction } from 'src/app/shared/models/transaction.model';
import { environment } from 'src/environments/environment';
import { PrivilegeService } from 'src/app/device-order/services/privilege.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-device-order-ais-existing-prepaid-hotdeal-otp-page',
  templateUrl: './device-order-ais-existing-prepaid-hotdeal-otp-page.component.html',
  styleUrls: ['./device-order-ais-existing-prepaid-hotdeal-otp-page.component.scss']
})
export class DeviceOrderAisExistingPrepaidHotdealOtpPageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;
  shoppingCart: ShoppingCart;
  transaction: Transaction;
  otpForm: FormGroup;
  registrationData: any;
  mobileNo: string;
  transactionID: string;
  isOtpValid: boolean;
  priceOption: PriceOption;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private shoppingCartService: ShoppingCartService,
    private pageLoadingService: PageLoadingService,
    private fb: FormBuilder,
    private http: HttpClient,
    private alertService: AlertService,
    private customerInfoService: CustomerInfoService,
    private transactionService: TransactionService,
    private privilegeService: PrivilegeService,
    private priceOptionService: PriceOptionService,
    private translateService: TranslateService

  ) {
    this.transaction = this.transactionService.load();
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void {
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

  verifyOTP(): void {
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
        this.alertService.error(this.translateService.instant('รหัส OTP ไม่ถูกต้อง กรุณาระบุใหม่อีกครั้ง'));
      });
  }

  navigateNext(): void {
    if (this.transaction.data.action === TransactionAction.READ_CARD_REPI) {
      this.autoPI();
    } else {
      this.pageLoadingService.closeLoading();
      this.onNext();
    }
  }

  autoPI(): void {
    this.pageLoadingService.openLoading();
    this.customerInfoService.callUpdatePrepaidIdentify(this.transaction.data.customer, this.transaction.data.simCard.mobileNo)
      .then((response: any) => {
        this.pageLoadingService.closeLoading();
        if (response && response.data && response.data.success) {
          this.onNext();
        } else {
          this.alertService.error(this.translateService.instant('ระบบไม่สามารถแสดงตนได้กรุณาติดต่อเจ้าหน้าที่'));
        }
      }).catch((error) => {
        this.pageLoadingService.closeLoading();
        this.alertService.error(this.translateService.instant('รหัส OTP ไม่ถูกต้อง กรุณาระบุใหม่อีกครั้ง'));
      }).catch((error) => {
        this.pageLoadingService.closeLoading();
        this.alertService.error(this.translateService.instant('ระบบไม่สามารถแสดงตนได้กรุณาติดต่อเจ้าหน้าที่'));
      });
  }

  alertError(error: any): void {
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
    this.alertService.error(this.translateService.instant(errMsg));
  }

  onNext(): void {
    const ussdCode = this.priceOption.trade.ussdCode;
    const privilege =  this.transaction.data.simCard.privilegeCode;
    const mobile = this.transaction.data.simCard.mobileNo;
    this.pageLoadingService.openLoading();
    this.privilegeService.requestUsePrivilege(mobile, ussdCode, privilege).then((privilegeCode) => {
      this.pageLoadingService.closeLoading();
      this.transaction.data.customer.privilegeCode = privilegeCode;
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_CUSTOMER_INFO_PAGE]);
    });
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_ELIGIBLE_MOBILE_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}

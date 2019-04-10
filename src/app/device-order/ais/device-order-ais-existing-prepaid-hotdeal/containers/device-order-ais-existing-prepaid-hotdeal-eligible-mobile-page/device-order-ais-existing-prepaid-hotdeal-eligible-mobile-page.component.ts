import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, ShoppingCart, EligibleMobile, REGEX_MOBILE, PageLoadingService, ChargeType, AlertService, BillingSystemType } from 'mychannel-shared-libs';
import {
  ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_CUSTOMER_INFO_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_VALIDATE_CUSTOMER_ID_CARD_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_OTP_PAGE
} from '../../constants/route-path.constant';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';

export interface BillingAccount {
  billingName: string;
  mobileNo: string[];
  billCycleFrom: string;
  billCycleTo: string;
  payDate: string;
  billingAddr: string;
  billAcctNo: string;
  bill: string;
  productPkg: string;
  billMedia: string;
}
@Component({
  selector: 'app-device-order-ais-existing-prepaid-hotdeal-eligible-mobile-page',
  templateUrl: './device-order-ais-existing-prepaid-hotdeal-eligible-mobile-page.component.html',
  styleUrls: ['./device-order-ais-existing-prepaid-hotdeal-eligible-mobile-page.component.scss']
})
export class DeviceOrderAisExistingPrepaidHotdealEligibleMobilePageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;
  shoppingCart: ShoppingCart;
  eligibleMobiles: Array<EligibleMobile>;
  selectMobileNo: EligibleMobile;
  addMobileNo: string;
  transaction: Transaction;
  eligibleAddMobile: FormGroup;
  priceOption: PriceOption;

  idCardNo: string;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private http: HttpClient,
    private shoppingCartService: ShoppingCartService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private fb: FormBuilder,
    private pageLoadingService: PageLoadingService,
    private alertService: AlertService,
  ) {
    this.transaction = this.transactionService.load();
    this.shoppingCart = Object.assign(this.shoppingCartService.getShoppingCartData(), {
      mobileNo: ''
    });
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void {
    this.createForm();
    this.getEligibleMobileNo();
  }

  getEligibleMobileNo(): void {
    const idCardNo = this.transaction.data.customer.idCardNo;
    this.idCardNo = idCardNo;
    const ussdCode = this.priceOption.trade.ussdCode;
    this.http.post('/api/customerportal/query-eligible-mobile-list', {
      idCardNo: idCardNo,
      ussdCode: ussdCode,
      mobileType: 'All'
    }).toPromise()
      .then((response: any) => {
        const eMobileResponse = response.data;
        this.eligibleMobiles = eMobileResponse.prepaid;
      });
  }

  createForm(): void {
    this.eligibleAddMobile = this.fb.group({
      mobileAdd: ['', [Validators.pattern(REGEX_MOBILE)]]
    });
    this.eligibleAddMobile.valueChanges.subscribe((value) => {
      if (this.eligibleAddMobile.valid ) {
        this.addMobileNo = value.mobileAdd;
      } else {
        this.addMobileNo = '';
      }
    });
  }

  onComplete(eligibleMobile: EligibleMobile): void {
    this.eligibleAddMobile.controls.mobileAdd.setValue('');
    this.selectMobileNo = eligibleMobile;
  }

  verifyMobileNo(mobileNo: string, ussdCode: string): Promise<any> {
    // tslint:disable-next-line:no-shadowed-variable
    const errMsg = 'ไม่สามารถทำรายการได้ เนื่องจากหมายเลขนี้ยังไม่เปิดใช้บริการในระบบเติมเงิน';
    const errMsgNotPrepaid = 'ไม่สามารถทำรายการได้ เนื่องจากเป็นหมายเลขระบบรายเดือน';
    const verify: any = {
      isVerify: false
    };
    return new Promise((resolve, reject) => {
      this.http.get(`/api/customerportal/asset/${mobileNo}/profile`).toPromise()
      .then((resp: any) => {
        if (!resp) {
          return reject(errMsg);
        }
        const data = resp.data;
        verify.profile = data;
        const status = data.mobileStatus;
        if (data.chargeType !== 'Pre-paid') {
          return reject(errMsgNotPrepaid);
        }
        if (status === '000' || status === '378' || status === 'Active' || status === 'Suspended') {
          return data;
        } else {
          return reject(errMsg);
        }
      })
      .then((req: any) => {
        this.http.post(`/api/customerportal/check-privilege-by-number`, {
          mobileNo: this.addMobileNo,
          ussdCode: ussdCode,
          chkMainProFlg: false
        }).toPromise()
        .then((res: any) => {
          this.http.get(`/api/customerportal/newRegister/verifyPrepaidIdent?idCard=${this.idCardNo}&mobileNo=${this.addMobileNo}`)
          .toPromise()
          .then((respPrepaid: any) => {
            verify.isVerify = !!(respPrepaid.data && respPrepaid.data.success);
            resolve(verify);
          })
          .catch(() => { resolve(verify); });
        })
        .catch((err: any) => {
          const error = err.error;
          const msg = (error && error.resultDescription) ? error.resultDescription : 'ระบบไม่สามารถแสดงข้อมูลได้ในขณะนี้';
          reject(msg);
        });
      })
      .catch((err) => {
        return reject(errMsg);
      });
    });
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    const ussdCode = this.priceOption.trade.ussdCode;
    if (this.addMobileNo) {
      this.verifyMobileNo(this.addMobileNo, ussdCode).then((res: any) => {
        this.pageLoadingService.closeLoading();
        const profile = res.profile;
        this.transaction.data.simCard = {
          mobileNo: this.addMobileNo,
          persoSim: false,
          chargeType: profile.chargeType || ChargeType.PRE_PAID,
          simSerial: profile.simSerialNo,
          billingSystem: (profile.billingSystem === BillingSystemType.BOS) ? BillingSystemType.BOS : BillingSystemType.IRB,
          nType: profile.product,
          mobileNoStatus: 'Active'
        };
        if (res.isVerify) {
          this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_CUSTOMER_INFO_PAGE]);
        } else {
          this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_OTP_PAGE]);
        }
      }).catch((err: any) => {
        console.log('err', err);
        this.pageLoadingService.closeLoading();
        this.alertService.error(err);
      });
    } else {
      this.http.get(`/api/customerportal/asset/${this.selectMobileNo.mobileNo}/profile`).toPromise()
      .then((resp: any) => {
        if (resp && resp.data) {
          const data = resp.data;
          this.transaction.data.simCard = {
            mobileNo: this.selectMobileNo.mobileNo,
            persoSim: false,
            chargeType: data.chargeType || ChargeType.PRE_PAID,
            simSerial: data.simSerialNo,
            billingSystem: (data.billingSystem === BillingSystemType.BOS) ? BillingSystemType.BOS : BillingSystemType.IRB,
            nType: data.product,
            mobileNoStatus: this.selectMobileNo.mobileStatus
          };
          this.pageLoadingService.closeLoading();
          this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_CUSTOMER_INFO_PAGE]);
        } else {
          this.pageLoadingService.closeLoading();
        }
      }).catch(() => {
        this.pageLoadingService.closeLoading();
      });
    }
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_VALIDATE_CUSTOMER_ID_CARD_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

}

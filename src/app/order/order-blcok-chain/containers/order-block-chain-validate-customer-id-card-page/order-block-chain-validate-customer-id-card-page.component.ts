import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, ReadCardProfile, ValidateCustomerIdCardComponent, Utils, TokenService, AlertService, PageLoadingService, ChannelType, KioskControls } from 'mychannel-shared-libs';
import { ROUTE_ORDER_BLOCK_CHAIN_ELIGIBLE_MOBILE_PAGE } from 'src/app/order/order-blcok-chain/constants/route-path.constant';
import { ReserveMobileService } from 'src/app/order/order-shared/services/reserve-mobile.service';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Transaction, Customer, TransactionAction, TransactionType } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
export interface Dopa {
  stCode: string;
  stDesc: string;
}
@Component({
  selector: 'app-order-block-chain-validate-customer-id-card-page',
  templateUrl: './order-block-chain-validate-customer-id-card-page.component.html',
  styleUrls: ['./order-block-chain-validate-customer-id-card-page.component.scss']
})
export class OrderBlockChainValidateCustomerIdCardPageComponent implements OnInit, OnDestroy {

  kioskApi: boolean;

  transaction: Transaction;
  profile: ReadCardProfile;
  zipcode: string;
  readCardValid: boolean;
  progressReadCard: number;
  billDeliveryAddress: Customer;

  @ViewChild(ValidateCustomerIdCardComponent)
  validateCustomerIdcard: ValidateCustomerIdCardComponent;

  validNext: boolean = false;
  isNext: boolean = false;

  constructor(
    private utils: Utils,
    private router: Router,
    private http: HttpClient,
    private homeService: HomeService,
    private tokenService: TokenService,
    private alertService: AlertService,
    private transactionService: TransactionService,
    private pageLoadingService: PageLoadingService,
    private translation: TranslateService,
  ) {
    this.transaction = this.transactionService.load();
    this.kioskApi = this.tokenService.getUser().channelType === ChannelType.SMART_ORDER;
  }

  ngOnInit(): void {
    this.createTransaction();
  }

  onError(valid: boolean): void {
    this.readCardValid = valid;
    this.validNext = false;
    if (!this.profile) {
      this.alertService.error(this.translation.instant('ไม่สามารถอ่านบัตรประชาชนได้ กรุณาติดต่อพนักงาน'));
      if (this.validateCustomerIdcard.koiskApiFn) {
        this.validateCustomerIdcard.koiskApiFn.removedState().subscribe((removed: boolean) => {
          if (removed) {
            this.validateCustomerIdcard.ngOnDestroy();
            this.validateCustomerIdcard.ngOnInit();
          }
        });
      }
    }
  }

  onCompleted(profile: ReadCardProfile): void {
    this.profile = profile;
    console.log('profile', profile);
    this.isNext = false;
    // auto next
    if (!this.isAisNative) {
      this.callService();
    }

  }

  get checkIsNextAisNative(): boolean {
    return !!(this.isAisNative && this.profile && !this.isNext);
  }

  get isAisNative(): boolean {
    return this.utils.isAisNative();
  }

  onProgress(progress: number): void {
    this.progressReadCard = progress;
    this.validNext = false;
    if (progress === 0 && this.checkIsNextAisNative) {
      this.callService();
    }
  }

  progressDoing(): boolean {
    return this.progressReadCard > 0 && this.progressReadCard < 100 ? true : false;
  }

  onBack(): void {
    this.homeService.goToHome();
  }

  onNext(): void {
    this.router.navigate([ROUTE_ORDER_BLOCK_CHAIN_ELIGIBLE_MOBILE_PAGE]);
  }

  callService(): void {
    this.isNext = true;
    this.pageLoadingService.openLoading();
    this.checkCardCid(this.profile.idCardNo, this.profile.chipID, this.profile.requestNo).then((respd: any) => {
      const datad = respd.data;
      const result = datad.result || {};
      const dopaData: Dopa = result.dataInfo || {};
      if (dopaData && dopaData.stCode !== '0') {
        this.alertService.error('บัตรนี้ไม่สามารถดำเนินการได้ <br>กรุณาติดต่อกรมการปกครองเพื่อตรวจสอบ');
        return;
      }

      this.getZipCode(this.profile.province, this.profile.amphur, this.profile.tumbol)
        .then((zipCode: string) => {
          return this.http.get('/api/customerportal/validate-customer-new-register', {
            params: {
              identity: this.profile.idCardNo,
              idCardType: this.profile.idCardType
            }
          }).toPromise()
            .then((resp: any) => {
              const data = resp.data || {};
              return {
                caNumber: data.caNumber,
                mainMobile: data.mainMobile,
                billCycle: data.billCycle,
                zipCode: zipCode
              };
            });
        })
        .then((customer: any) => { // load bill cycle
          console.log('cus', customer);
          this.pageLoadingService.closeLoading();
          this.transaction.data.customer = Object.assign(this.profile, customer);
          this.validNext = true;
        }).catch((resp: any) => {
          this.pageLoadingService.closeLoading();
          this.mapErrorMessage(resp);
        });
    }).catch((err: any) => {
      this.pageLoadingService.closeLoading();
      this.mapErrorMessage(err);
    });

  }

  checkCardCid(idCardNo: string, chipNo: string, bp1no: string): Promise<any> {
    return this.http.post('/api/customerportal/checkcard-cid', {
      pid: idCardNo,
      chipNo: chipNo,
      bp1no: bp1no ? bp1no.split('/')[0] : ''
    }).toPromise();
  }

  mapErrorMessage(resp: any): void {
    const error = resp.error || [];
    if (error && error.errors && error.errors.length > 0 && typeof error.errors === 'object') {
      this.alertService.notify({
        type: 'error',
        html: error.errors.map((err) => {
          return '<li class="text-left">' + this.translation.instant(err ? err.message : err) + '</li>';
        }).join('')
      });
    } else if (error.resultDescription) {
      this.alertService.error(this.translation.instant(error.resultDescription));
    } else {
      this.alertService.error(this.translation.instant('ระบบไม่สามารถแสดงข้อมูลได้ในขณะนี้'));
    }
  }

  get validLogic(): boolean {
    return this.validNext;
  }

  checkBusinessLogic(): boolean {
    const expireDate = this.transaction.data.customer.expireDate;
    const idCardType = this.transaction.data.customer.idCardType;
    // block chain ไม่มีการตรวจสอบบัตรอายุต่ำกว่า 17 ปี เด็กสามารถทำรายการได้ แต่จะมีสิทธิ์จำกัด ตอนใช้งานธุรกรรมต่าง ๆ
    if (this.utils.isIdCardExpiredDate(expireDate)) {
      this.alertService.error(this.translation.instant('ไม่สามารถทำรายการได้ เนื่องจาก' + idCardType + 'หมดอายุ')).then(() => {
        this.onBack();
      });
      return false;
    }
    return true;
  }

  getZipCode(province: string, amphur: string, tumbol: string): Promise<string> {
    province = province.replace(/มหานคร$/, '');
    return this.http.get('/api/customerportal/newRegister/getAllProvinces').toPromise()
      .then((resp: any) => {
        const provinceId = (resp.data.provinces.find((prov: any) => prov.name === province) || {}).id;

        return this.http.get(
          `/api/customerportal/newRegister/queryZipcode?provinceId=${provinceId}&amphurName=${amphur}&tumbolName=${tumbol}`
        ).toPromise();
      })
      .then((resp: any) => {
        if (resp.data.zipcodes && resp.data.zipcodes.length > 0) {
          return resp.data.zipcodes[0];
        } else {
          return Promise.reject('ไม่พบรหัสไปรษณีย์');
        }
      });
  }

  private createTransaction(): void {
    this.transaction = {
      data: {
        transactionType: TransactionType.ORDER_NEW_REGISTER,
        action: TransactionAction.READ_CARD,
      }
    };
    this.transactionService.save(this.transaction);
  }

  ngOnDestroy(): void {
    setTimeout(() => { // รอ webconnect ทำงานเสร็จก่อน
      if (this.validateCustomerIdcard.koiskApiFn) {
        this.validateCustomerIdcard.koiskApiFn.close();
      }
    }, 750);
    this.transactionService.update(this.transaction);
  }

  onHome(): void {
    if (this.validateCustomerIdcard && this.validateCustomerIdcard.koiskApiFn) {
      this.validateCustomerIdcard.koiskApiFn.controls(KioskControls.LED_OFF);
    }
    setTimeout(() => {
      this.homeService.goToHome();
    }, 750);
  }

}

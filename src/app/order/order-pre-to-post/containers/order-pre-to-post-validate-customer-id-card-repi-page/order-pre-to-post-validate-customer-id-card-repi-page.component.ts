import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, ReadCardProfile, PageLoadingService, AlertService, TokenService, ChannelType, Utils, ValidateCustomerIdCardComponent, KioskControls } from 'mychannel-shared-libs';
import { Transaction, TransactionAction } from 'src/app/shared/models/transaction.model';
import { ROUTE_ORDER_PRE_TO_POST_VALIDATE_CUSTOMER_REPI_PAGE, ROUTE_ORDER_PRE_TO_POST_CUSTOMER_INFO_PAGE, ROUTE_ORDER_PRE_TO_POST_CUSTOMER_PROFILE_PAGE, ROUTE_ORDER_PRE_TO_POST_CURRENT_INFO_PAGE, ROUTE_ORDER_PRE_TO_POST_VERIFY_DOCUMENT_REPI_PAGE } from 'src/app/order/order-pre-to-post/constants/route-path.constant';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-order-pre-to-post-validate-customer-id-card-repi-page',
  templateUrl: './order-pre-to-post-validate-customer-id-card-repi-page.component.html',
  styleUrls: ['./order-pre-to-post-validate-customer-id-card-repi-page.component.scss']
})
export class OrderPreToPostValidateCustomerIdCardRepiPageComponent implements OnInit, OnDestroy {

  kioskApi: boolean;
  transaction: Transaction;
  profile: ReadCardProfile;
  zipcode: string;
  readCardValid: boolean;
  mobileNo: string;
  progressReadCard: number;

  @ViewChild(ValidateCustomerIdCardComponent)
  validateCustomerIdcard: ValidateCustomerIdCardComponent;

  constructor(
    private router: Router,
    private utils: Utils,
    private http: HttpClient,
    private homeService: HomeService,
    private alertService: AlertService,
    private tokenService: TokenService,
    private transactionService: TransactionService,
    private pageLoadingService: PageLoadingService,
    public translation: TranslateService
  ) {
    this.transaction = this.transactionService.load();
    this.kioskApi = this.tokenService.getUser().channelType === ChannelType.SMART_ORDER;
  }

  ngOnInit(): void {
    this.transaction.data.action = TransactionAction.READ_CARD_REPI;
  }

  onError(valid: boolean): void {
    this.readCardValid = valid;
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

    this.onNext();
  }

  onProgress(progress: number): void {
    this.progressReadCard = progress;
  }

  progressDoing(): boolean {
    return this.progressReadCard > 0 && this.progressReadCard < 100 ? true : false;
  }

  onBack(): void {
    this.router.navigate([ROUTE_ORDER_PRE_TO_POST_CURRENT_INFO_PAGE]);
  }

  onNext(): void {
    const mobileNo = this.transaction.data.simCard.mobileNo;

    this.pageLoadingService.openLoading();
    this.getZipCode(this.profile.province, this.profile.amphur, this.profile.tumbol)
      .then((zipCode: string) => {
        return this.http.get('/api/customerportal/validate-customer-pre-to-post', {
          params: {
            identity: this.profile.idCardNo,
            idCardType: this.profile.idCardType
          }
        }).toPromise()
          .then((resp: any) => {
            const data = resp.data || {};
            return {
              caNumber: data.caNumber,
              isNewCa: false,
              mainMobile: data.mainMobile,
              billCycle: data.billCycle,
              zipCode: zipCode
            };
          });
      })
      .then((customer: any) => { // load bill cycle
        this.transaction.data.customer = Object.assign(this.profile, customer);

        return this.http.get(`/api/customerportal/newRegister/${this.profile.idCardNo}/queryBillingAccount`).toPromise()
          .then((resp: any) => {
            const data = resp.data || {};
            return this.http.post('/api/customerportal/verify/billingNetExtreme', {
              businessType: '1',
              listBillingAccount: data.billingAccountList
            }).toPromise()
              .then((respBillingNetExtreme: any) => {
                return {
                  billCycles: data.billingAccountList,
                  billCyclesNetExtreme: respBillingNetExtreme.data
                };
              })
              .catch(() => {
                return {
                  billCycles: data.billingAccountList
                };
              });
          });
      })
      .then((billingInformation: any) => {
        this.transaction.data.billingInformation = billingInformation;
      })
      .then(() => {// verify Prepaid Ident
        return this.http.get(`/api/customerportal/newRegister/verifyPrepaidIdent?idCard=${this.profile.idCardNo}&mobileNo=${mobileNo}`)
          .toPromise()
          .then((respPrepaidIdent: any) => {
            if (this.checkBusinessLogic()) {
              if (respPrepaidIdent.data && respPrepaidIdent.data.success) {
                this.transaction.data.action = TransactionAction.READ_CARD;
                this.router.navigate([ROUTE_ORDER_PRE_TO_POST_CUSTOMER_INFO_PAGE]);
              } else {
                this.transaction.data.action = TransactionAction.READ_CARD_REPI;
                this.router.navigate([ROUTE_ORDER_PRE_TO_POST_CUSTOMER_PROFILE_PAGE]);
              }
            }
            this.pageLoadingService.closeLoading();
          });
      })
      .catch((resp: any) => {
        const error = resp.error || [];

        if (error && error.errors && error.errors.length > 0) {
          this.alertService.notify({
            type: 'error',
            html: error.errors.map((err) => {
              return '<li class="text-left">' + this.translation.instant(err) + '</li>';
            }).join('')
          }).then(() => {
            this.onBack();
          });
        } else if (error.resultDescription) {
          this.alertService.error(this.translation.instant(error.resultDescription));
        } else {
          this.alertService.error(this.translation.instant('ระบบไม่สามารถแสดงข้อมูลได้ในขณะนี้'));
        }
      });
  }

  checkBusinessLogic(): boolean {
    const birthdate = this.transaction.data.customer.birthdate;
    const expireDate = this.transaction.data.customer.expireDate;
    const idCardType = this.transaction.data.customer.idCardType;

    if (this.utils.isLowerAge17Year(birthdate)) {
      this.alertService.error(this.translation.instant('ไม่สามารถทำรายการได้ เนื่องจากอายุของผู้ใช้บริการต่ำกว่า 17 ปี')).then(() => {
        this.onBack();
      });
      return false;
    }
    if (this.utils.isIdCardExpiredDate(expireDate)) {
      this.alertService.error(this.translation.instant('ไม่สามารถทำรายการได้ เนื่องจาก' + idCardType + 'หมดอายุ')).then(() => {
        this.onBack();
      });
      return false;
    }
    return true;
  }

  onHome(): void {
    if (this.validateCustomerIdcard && this.validateCustomerIdcard.koiskApiFn) {
      this.validateCustomerIdcard.koiskApiFn.controls(KioskControls.LED_OFF);
    }
    setTimeout(() => {
      this.homeService.goToHome();
    }, 750);
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

  ngOnDestroy(): void {
    setTimeout(() => {
      if (this.validateCustomerIdcard.koiskApiFn) {
        this.validateCustomerIdcard.koiskApiFn.close();
      }
    }, 750);
    this.transactionService.update(this.transaction);
    this.pageLoadingService.closeLoading();
  }
}

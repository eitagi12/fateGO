import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_NEW_SHARE_PLAN_MNP_FACE_CAPTURE_PAGE, ROUTE_NEW_SHARE_PLAN_MNP_VALIDATE_CUSTOMER_PAGE } from '../../constants/route-path.constant';
import { Transaction, Customer, TransactionAction } from 'src/app/shared/models/transaction.model';
import { ReadCardProfile, ValidateCustomerIdCardComponent, Utils, TokenService, AlertService, PageLoadingService, ChannelType, KioskControls } from 'mychannel-shared-libs';
import { HttpClient } from '@angular/common/http';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-new-share-plan-mnp-validate-customer-id-card-page',
  templateUrl: './new-share-plan-mnp-validate-customer-id-card-page.component.html',
  styleUrls: ['./new-share-plan-mnp-validate-customer-id-card-page.component.scss']
})
export class NewSharePlanMnpValidateCustomerIdCardPageComponent implements OnInit, OnDestroy {

  @ViewChild(ValidateCustomerIdCardComponent) validateCustomerIdcard: ValidateCustomerIdCardComponent;
  kioskApi: boolean;
  transaction: Transaction;
  profile: ReadCardProfile;
  zipcode: string;
  readCardValid: boolean;
  progressReadCard: number;
  billDeliveryAddress: Customer;

  constructor(
    private utils: Utils,
    private router: Router,
    private http: HttpClient,
    private tokenService: TokenService,
    private alertService: AlertService,
    private transactionService: TransactionService,
    private pageLoadingService: PageLoadingService,
    private translation: TranslateService
  ) {
    this.transaction = this.transactionService.load();
    this.kioskApi = this.tokenService.getUser().channelType === ChannelType.SMART_ORDER;
  }

  ngOnInit(): void {
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
  }

  onProgress(progress: number): void {
    this.progressReadCard = progress;
  }

  progressDoing(): boolean {
    return this.progressReadCard > 0 && this.progressReadCard < 100 ? true : false;
  }

  onNext(): void {
    this.transaction.data.action = TransactionAction.READ_CARD;
    this.pageLoadingService.openLoading();
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
        this.pageLoadingService.closeLoading();
        if (this.checkBusinessLogic()) {
          this.transaction.data.action = TransactionAction.READ_CARD;
          this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_FACE_CAPTURE_PAGE]);
        }
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

  getErrorMessage(errorList: string[]): string {
    let errMessageListHtml = '';
    errorList.forEach(error => {
      errMessageListHtml += '<li class="text-left">' + this.translation.instant(error) + '</li>';
    });

    return errMessageListHtml;
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
    setTimeout(() => { // รอ webconnect ทำงานเสร็จก่อน
      if (this.validateCustomerIdcard.koiskApiFn) {
        this.validateCustomerIdcard.koiskApiFn.close();
      }
    }, 750);
    this.transactionService.update(this.transaction);
  }

  onBack(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_VALIDATE_CUSTOMER_PAGE]);
  }

}

import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ReadCardProfile, HomeService, PageLoadingService, ApiRequestService, TokenService, ChannelType, Utils, AlertService, ValidateCustomerIdCardComponent, KioskControls, } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { Transaction, TransactionType, TransactionAction, BillDeliveryAddress } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import {
  ROUTE_ORDER_NEW_REGISTER_FACE_CAPTURE_PAGE,
} from 'src/app/order/order-new-register/constants/route-path.constant';
import { HttpClient } from '@angular/common/http';
import { ReserveMobileService, SelectMobileNumberRandom } from 'src/app/order/order-shared/services/reserve-mobile.service';
import { request } from 'https';

@Component({
  selector: 'app-order-new-register-validate-customer-id-card-page',
  templateUrl: './order-new-register-validate-customer-id-card-page.component.html',
  styleUrls: ['./order-new-register-validate-customer-id-card-page.component.scss']
})
export class OrderNewRegisterValidateCustomerIdCardPageComponent implements OnInit, OnDestroy {

  kioskApi: boolean;

  transaction: Transaction;
  profile: ReadCardProfile;
  zipcode: string;
  readCardValid: boolean;
  billDeliveryAddress: BillDeliveryAddress;

  @ViewChild(ValidateCustomerIdCardComponent)
  validateCustomerIdcard: ValidateCustomerIdCardComponent;

  constructor(
    private utils: Utils,
    private router: Router,
    private http: HttpClient,
    private homeService: HomeService,
    private tokenService: TokenService,
    private alertService: AlertService,
    private apiRequestService: ApiRequestService,
    private transactionService: TransactionService,
    private pageLoadingService: PageLoadingService,
    private reserveMobileService: ReserveMobileService,
  ) {

    this.homeService.callback = () => {

      if (this.validateCustomerIdcard.koiskApiFn) {
        this.validateCustomerIdcard.koiskApiFn.controls(KioskControls.LED_OFF);
      }

      this.transaction = this.transactionService.load();

      if (this.transaction.data &&
        this.transaction.data.simCard &&
        this.transaction.data.simCard.mobileNo) {

        const user = this.tokenService.getUser();
        const dataRequest: SelectMobileNumberRandom = {
          userId: user.username,
          mobileNo: this.transaction.data.simCard.mobileNo,
          action: 'Unlock'
        };
        this.reserveMobileService.selectMobileNumberRandom(dataRequest)
          .then(() => {
            this.router.navigate(['']);
            // window.location.href = '/smart-shop';
          })
          .catch(() => {
            this.router.navigate(['']);
            // window.location.href = '/smart-shop';
          });
      } else {
        this.router.navigate(['']);
        // window.location.href = '/smart-shop';
      }

    };
    this.kioskApi = this.tokenService.getUser().channelType === ChannelType.SMART_ORDER;
  }

  ngOnInit() {
    this.createTransaction();
  }

  onError(valid: boolean) {
    this.readCardValid = valid;
    if (!this.profile) {
      this.alertService.error('ไม่สามารถอ่านบัตรประชาชนได้ กรุณาติดต่อพนักงาน');
      this.validateCustomerIdcard.koiskApiFn.removedState().subscribe((removed: boolean) => {
        if (removed) {
          this.validateCustomerIdcard.ngOnDestroy();
          this.validateCustomerIdcard.ngOnInit();
        }
      });

    }
  }

  onCompleted(profile: ReadCardProfile) {
    this.profile = profile;
    // auto next
    this.onNext();
  }

  onHome() {
    this.homeService.goToHome();
  }

  onBack() {
    this.homeService.goToHome();
  }

  onNext() {
    this.pageLoadingService.openLoading();

    this.getZipCode(this.profile.province, this.profile.amphur, this.profile.tumbol)
      .then((zipCode: string) => {
        return this.http.get('/api/customerportal/validate-customer-new-register', {
          params: {
            identity: this.profile.idCardNo
          }
        }).toPromise()
          .then((resp: any) => {
            const data = resp.data || {};
            this.billDeliveryAddress = {
              homeNo: data.homeNo || '',
              moo: data.moo || '',
              mooBan: data.mooBan || '',
              room: data.room || '',
              floor: data.floor || '',
              buildingName: data.buildingName || '',
              soi: data.soi || '',
              street: data.street || '',
              province: data.province || '',
              amphur: data.amphur || '',
              tumbol: data.tumbol || '',
              zipCode: data.zipCode || '',
            };
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
        this.transaction.data.billingInformation.billDeliveryAddress = this.billDeliveryAddress;
        if (this.checkBusinessLogic()) {
          this.router.navigate([ROUTE_ORDER_NEW_REGISTER_FACE_CAPTURE_PAGE]);
        }
      })
      .catch((resp: any) => {
        const error = resp.error || [];
        console.log(resp);

        if (error && error.errors.length > 0) {
          this.alertService.notify({
            type: 'error',
            html: error.errors.map((err) => {
              return '<li class="text-left">' + err + '</li>';
            }).join('')
          }).then(() => {
            this.onBack();
          });
        } else {
          this.alertService.error(error.resultDescription);
        }
      });
  }

  getErrorMessage(errorList: string[]): string {
    let errMessageListHtml = '';
    errorList.forEach(error => {
      errMessageListHtml += '<li class="text-left">' + error + '</li>';
    });

    return errMessageListHtml;
  }

  checkBusinessLogic(): boolean {
    const birthdate = this.transaction.data.customer.birthdate;
    const expireDate = this.transaction.data.customer.expireDate;
    const idCardType = this.transaction.data.customer.idCardType;

    if (this.utils.isLowerAge17Year(birthdate)) {
      this.alertService.error('ไม่สามารถทำรายการได้ เนื่องจากอายุของผู้ใช้บริการต่ำกว่า 17 ปี').then(() => {
        this.onBack();
      });
      return false;
    }
    if (this.utils.isIdCardExpiredDate(expireDate)) {
      this.alertService.error('ไม่สามารถทำรายการได้ เนื่องจาก' + idCardType + 'หมดอายุ').then(() => {
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
    this.transactionService.save(this.transaction);
    this.pageLoadingService.closeLoading();
  }

  private createTransaction() {
    // New x-api-request-id
    this.apiRequestService.createRequestId();

    this.transaction = {
      data: {
        transactionType: TransactionType.ORDER_NEW_REGISTER,
        action: TransactionAction.READ_CARD,
      }
    };
  }
}

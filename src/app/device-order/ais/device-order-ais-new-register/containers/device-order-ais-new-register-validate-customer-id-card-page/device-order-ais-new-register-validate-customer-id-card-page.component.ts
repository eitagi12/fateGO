import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ReadCardProfile, HomeService, PageLoadingService, TokenService, ChannelType, Utils, AlertService, ValidateCustomerIdCardComponent, KioskControls, User, } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { Transaction, TransactionType, TransactionAction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { ROUTE_BUY_PRODUCT_CAMPAIGN_PAGE } from 'src/app/buy-product/constants/route-path.constant';
import { ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_PAYMENT_DETAIL_PAGE } from '../../constants/route-path.constant';
import { PriceOption } from 'src/app/shared/models/price-option.model';
@Component({
  selector: 'app-device-order-ais-new-register-validate-customer-id-card-page',
  templateUrl: './device-order-ais-new-register-validate-customer-id-card-page.component.html',
  styleUrls: ['./device-order-ais-new-register-validate-customer-id-card-page.component.scss']
})
export class DeviceOrderAisNewRegisterValidateCustomerIdCardPageComponent implements OnInit, OnDestroy {
  kioskApi: boolean;

  transaction: Transaction;
  priceOption: PriceOption;

  profile: ReadCardProfile;
  zipcode: string;
  readCardValid: boolean;
  user: User;

  @ViewChild(ValidateCustomerIdCardComponent)
  validateCustomerIdcard: ValidateCustomerIdCardComponent;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private pageLoadingService: PageLoadingService,
    private http: HttpClient,
    private tokenService: TokenService,
    private utils: Utils,
    private alertService: AlertService,
    private priceOptionService: PriceOptionService
  ) {
    this.user = this.tokenService.getUser();

    this.homeService.callback = () => {
      if (this.validateCustomerIdcard.koiskApiFn) {
        this.validateCustomerIdcard.koiskApiFn.controls(KioskControls.LED_OFF);
      }

      // Returns stock todo...

      if (this.transaction.data.simCard
        && this.transaction.data.simCard.mobileNo) {
        this.onResereMobileNo(this.user.username, this.transaction.data.simCard.mobileNo).then(() => {
          this.homeHandler();
        });
      } else {
        this.homeHandler();
      }

    };
    this.kioskApi = this.tokenService.getUser().channelType === ChannelType.SMART_ORDER;
    this.priceOption = this.priceOptionService.load();
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
    this.router.navigate([ROUTE_BUY_PRODUCT_CAMPAIGN_PAGE], { queryParams: this.priceOption.queryParams });
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
            return {
              caNumber: data.caNumber,
              mainMobile: data.mainMobile,
              billCycle: data.billCycle,
              zipCode: zipCode
            };
          }).catch(() => {
            return {
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
        if (this.checkBusinessLogic()) {
          this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_PAYMENT_DETAIL_PAGE]);
        }
      });
  }

  checkBusinessLogic(): boolean {
    const birthdate = this.transaction.data.customer.birthdate;
    const expireDate = this.transaction.data.customer.expireDate;
    const idCardType = this.transaction.data.customer.idCardType;

    if (this.utils.isLowerAge17Year(birthdate)) {
      this.alertService.error('ไม่สามารถทำรายการได้ เนื่องจากอายุของผู้ใช้บริการต่ำกว่า 17 ปี');
      return false;
    }
    if (this.utils.isIdCardExpiredDate(expireDate)) {
      this.alertService.error('ไม่สามารถทำรายการได้ เนื่องจาก' + idCardType + 'หมดอายุ');
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
    this.transaction = {
      data: {
        transactionType: TransactionType.DEVICE_ORDER_NEW_REGISTER_AIS,
        action: TransactionAction.READ_CARD,
      }
    };
  }

  homeHandler() {
    if (environment.name === 'LOCAL') {
      window.location.href = '/main-menu';
    } else {
      window.location.href = '/smart-shop/main-menu';
    }
  }

  onResereMobileNo(mobileNo: string, action: string): Promise<any> {
    return this.http.post('/api/customerportal/newRegister/selectMobileNumberRandom', {
      userId: this.user.username,
      mobileNo: mobileNo,
      action: action
    }).toPromise();
  }

}

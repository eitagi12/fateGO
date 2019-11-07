import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Transaction, TransactionType, TransactionAction } from 'src/app/shared/models/transaction.model';
import { ReadCardProfile, HomeService, TokenService, PageLoadingService, User, ValidateCustomerIdCardComponent, Utils, AlertService, KioskControls, ChannelType } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient } from '@angular/common/http';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { environment } from 'src/environments/environment';
import { SharedTransactionService } from 'src/app/shared/services/shared-transaction.service';
import { TranslateService } from '@ngx-translate/core';
import { ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_PAYMENT_DETAIL_PAGE, ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_VALIDATE_CUSTOMER_KEY_IN_PAGE } from '../../constants/route-path.constant';
import { ValidateCustomerService } from 'src/app/shared/services/validate-customer.service';

@Component({
  selector: 'app-new-register-mnp-validate-customer-id-card-page',
  templateUrl: './new-register-mnp-validate-customer-id-card-page.component.html',
  styleUrls: ['./new-register-mnp-validate-customer-id-card-page.component.scss']
})
export class NewRegisterMnpValidateCustomerIdCardPageComponent implements OnInit, OnDestroy {
  transaction: Transaction;
  priceOption: PriceOption;
  profile: ReadCardProfile;
  zipcode: string;
  readCardValid: boolean;
  user: User;
  progressReadCard: number;
  soId: string;
  @ViewChild(ValidateCustomerIdCardComponent)
  validateCustomerIdcard: ValidateCustomerIdCardComponent;
  constructor(private router: Router,
    private homeService: HomeService,
    private priceOptionService: PriceOptionService,
    private transactionService: TransactionService,
    private sharedTransactionService: SharedTransactionService,
    private pageLoadingService: PageLoadingService,
    private translateService: TranslateService,
    private http: HttpClient,
    private tokenService: TokenService,
    private utils: Utils,
    private alertService: AlertService,
    private validateCustomerService: ValidateCustomerService
  ) {
    this.transaction = this.transactionService.load();
    this.user = this.tokenService.getUser();
    this.priceOption = this.priceOptionService.load();
    this.homeService.callback = () => {
      const url = this.router.url;
      if (url.indexOf('result') !== -1) {
        this.homeHandler();
      } else {
        this.alertService.question(this.translateService.instant('ท่านต้องการยกเลิกการซื้อสินค้าหรือไม่'))
          .then((data: any) => {
            if (!data.value) {
              return false;
            }
            return this.returnStock().then(() => true);
          })
          .then((isNext: boolean) => {
            if (isNext) {
              this.homeHandler();
            }
          });
      }
    };
  }

  ngOnInit(): void {
    this.soId = this.transaction.data.order.soId;
  }

  onProgress(progress: number): void {
    this.progressReadCard = progress;
  }

  progressDoing(): boolean {
    return this.progressReadCard > 0 && this.progressReadCard < 100 ? true : false;
  }

  onRemoveCardState(): void {
    if (this.validateCustomerIdcard && this.validateCustomerIdcard.koiskApiFn) {
      this.validateCustomerIdcard.koiskApiFn.removedState().subscribe((removed: boolean) => {
        if (removed) {
          this.validateCustomerIdcard.ngOnDestroy();
          this.validateCustomerIdcard.ngOnInit();
        }
      });
    }
  }

  onError(valid: boolean): void {
    this.readCardValid = valid;
    if (!this.profile) {
      this.alertService.error(this.translateService.instant('ไม่สามารถอ่านบัตรประชาชนได้ กรุณาติดต่อพนักงาน')).then(() => this.onBack());
    }
  }

  onCompleted(profile: ReadCardProfile): void {
    this.profile = profile;
    console.log(profile);

  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onBack(): void {
    const queryParams = this.priceOption.queryParams;
    this.alertService.question(this.translateService.instant('ท่านต้องการยกเลิกการซื้อสินค้าหรือไม่'))
      .then((data: any) => {
        if (!data.value) {
          return false;
        }
        if (this.validateCustomerIdcard.koiskApiFn) {
          this.validateCustomerIdcard.koiskApiFn.controls(KioskControls.LED_OFF);
        }
        return this.returnStock().then(() => true);
      })
      .then((isNext: boolean) => {
        if (isNext) {
          this.transactionService.remove();
          window.location.href = `/sales-portal/buy-product/brand/${queryParams.brand}/${queryParams.model}`;
        }
      });
  }

  onNext(): any {
    this.pageLoadingService.openLoading();
    this.createTransaction();
    return this.validateCustomerService.queryCustomerInfo(this.profile.idCardNo).then(() => {
      this.getZipCode(this.profile.province, this.profile.amphur, this.profile.tumbol).then((zipCode: string) => {
        const transactionType = TransactionType.DEVICE_ORDER_NEW_REGISTER_AIS; // New
        return this.validateCustomerService.checkValidateCustomer(this.profile.idCardNo, this.profile.idCardType, transactionType)
          .then((resp: any) => {
            const data = resp.data || {};
            return {
              caNumber: data.caNumber,
              mainMobile: data.mainMobile,
              billCycle: data.billCycle,
              zipCode: zipCode
            };
          }).then((customer: any) => {
            this.transaction.data.customer = Object.assign(this.profile, customer);
            return this.validateCustomerService.queryBillingAccount(this.profile.idCardNo)
              .then((resp: any) => {
                const params: any = resp.data || {};
                this.toBillingInformation(params).then((billingInfo: any) => {
                  this.transaction.data.billingInformation = billingInfo;
                });
                return this.conditionIdentityValid()
                  .catch((msg: string) => {
                    return this.alertService.error(this.translateService.instant(msg)).then(() => true);
                  })
                  .then((isError: boolean) => {
                    if (isError) {
                      this.onBack();
                      return;
                    }
                    if (!this.soId) {
                      // tslint:disable-next-line: max-line-length
                      const body: any = this.validateCustomerService.getRequestAddDeviceSellingCart(this.user, this.transaction, this.priceOption, { customer: this.transaction.data.customer });
                      return this.validateCustomerService.addDeviceSellingCart(body).then((response: any) => {
                        this.transaction.data = {
                          ...this.transaction.data,
                          order: { soId: response.data.soId }
                        };
                        return this.sharedTransactionService.createSharedTransaction(this.transaction, this.priceOption);
                      });
                    } else {
                      this.transaction.data = {
                        ...this.transaction.data,
                        order: { soId: this.soId }
                      };
                    }
                  }).then(() => this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_PAYMENT_DETAIL_PAGE]))
                  .then(() => this.pageLoadingService.closeLoading());
              });
          });
      });
    }).catch((e) => {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_VALIDATE_CUSTOMER_KEY_IN_PAGE], {
        queryParams: {
          idCardNo: this.profile.idCardNo
        }
      }).then(() => this.pageLoadingService.closeLoading());
    });
  }

  toBillingInformation(data: any): any {
    return this.validateCustomerService.billingNetExtreme(data).then((respBillingNetExtreme: any) => {
      console.log(respBillingNetExtreme);

      return {
        billCycles: data.billingAccountList,
        billCyclesNetExtreme: respBillingNetExtreme.data
      };
    }).catch(() => {
      return { billCycles: data.billingAccountList };
    });
  }

  createTransaction(): void {
    this.transaction = {
      data: {
        transactionType: TransactionType.DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN, // Share
        action: TransactionAction.READ_CARD,
      },
      transactionId: this.transaction.transactionId ? this.transaction.transactionId : ''
    };
  }

  getZipCode(province: string, amphur: string, tumbol: string): Promise<string> {
    province = province.replace(/มหานคร$/, '');
    return this.http.get('/api/customerportal/newRegister/getAllProvinces').toPromise()
      .then((resp: any) => {
        const provinceId = (resp.data.provinces.find((prov: any) => prov.name === province) || {}).id;

        return this.http.get(`/api/customerportal/newRegister/queryZipcode`, {
          params: {
            provinceId: provinceId,
            amphurName: amphur,
            tumbolName: tumbol
          }
        }).toPromise();

      })
      .then((resp: any) => {
        if (resp.data.zipcodes && resp.data.zipcodes.length > 0) {
          return resp.data.zipcodes[0];
        } else {
          return Promise.reject(this.translateService.instant('ไม่พบรหัสไปรษณีย์'));
        }
      });
  }

  conditionIdentityValid(): Promise<string> {
    return new Promise((resovle, reject) => {

      const birthdate = this.transaction.data.customer.birthdate; // '19/03/2560';
      const expireDate = this.transaction.data.customer.expireDate;
      const idCardType = this.transaction.data.customer.idCardType;

      if (this.utils.isLowerAge17Year(birthdate)) {
        return reject(this.translateService.instant(`ไม่สามารถทำรายการได้ เนื่องจากอายุของผู้ใช้บริการต่ำกว่า 17 ปี`));
      }
      if (this.utils.isIdCardExpiredDate(expireDate)) {
        return reject(
          `${this.translateService.instant('ไม่สามารถทำรายการได้ เนื่องจาก')} ${idCardType} ${this.translateService.instant('หมดอายุ')}`
        );
      }
      resovle(null);
    });
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

  homeHandler(): void {
    if (environment.name === 'LOCAL') {
      window.location.href = '/main-menu';
    } else {
      window.location.href = '/sales-portal/main-menu';
    }
  }

  returnStock(): Promise<void> {
    return new Promise(resolve => {
      const transaction = this.transactionService.load();

      const promiseAll = [];
      if (transaction.data) {
        if (transaction.data.simCard && transaction.data.simCard.mobileNo) {
          const unlockMobile: any = this.validateCustomerService.selectMobileNumberRandom(this.user, transaction)
            .catch(() => Promise.resolve());
          promiseAll.push(unlockMobile);
        }
        if (transaction.data.order && transaction.data.order.soId) {
          const order = this.validateCustomerService.clearTempStock(this.priceOption, transaction)
            .catch(() => Promise.resolve());
          promiseAll.push(order);
        }
      }
      Promise.all(promiseAll).then(() => resolve());
    });
  }

  isDevelopMode(): boolean {
    return environment.name === 'LOCAL';
  }
}

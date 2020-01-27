import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ReadCardProfile, HomeService, TokenService, PageLoadingService, User, ValidateCustomerIdCardComponent, Utils, AlertService, KioskControls, ChannelType } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient } from '@angular/common/http';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { environment } from 'src/environments/environment';
import { SharedTransactionService } from 'src/app/shared/services/shared-transaction.service';
import { TranslateService } from '@ngx-translate/core';
import {
  ROUTE_DEVICE_ORDER_ASP_SHARE_PLAN_NEW_REGISTER_MNP_PAYMENT_DETAIL_PAGE,
  ROUTE_DEVICE_ORDER_ASP_SHARE_PLAN_NEW_REGISTER_MNP_VALIDATE_CUSTOMER_PAGE
} from '../../constants/route-path.constant';
import { ValidateCustomerService } from 'src/app/shared/services/validate-customer.service';
import { Transaction, TransactionType, TransactionAction } from 'src/app/shared/models/transaction.model';
import { RemoveCartService } from '../../services/remove-cart.service';
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

  constructor(
    private router: Router,
    private priceOptionService: PriceOptionService,
    private transactionService: TransactionService,
    private sharedTransactionService: SharedTransactionService,
    private pageLoadingService: PageLoadingService,
    private translateService: TranslateService,
    private http: HttpClient,
    private tokenService: TokenService,
    private utils: Utils,
    private alertService: AlertService,
    private validateCustomerService: ValidateCustomerService,
    private removeCartService: RemoveCartService
  ) {
    this.transaction = this.transactionService.load();
    this.user = this.tokenService.getUser();
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void {
    if (this.transaction.data && this.transaction.data.order && this.transaction.data.order.soId) {
      this.soId = this.transaction.data.order.soId;
    }
  }

  onProgress(progress: number): void {
    this.progressReadCard = progress;
  }

  progressDoing(): boolean {
    return this.progressReadCard > 0 && this.progressReadCard < 100 ? true : false;
  }

  onError(valid: boolean): void {
    this.readCardValid = valid;
    if (!this.profile) {
      this.alertService.error(this.translateService.instant('ไม่สามารถอ่านบัตรประชาชนได้ กรุณาติดต่อพนักงาน')).then(() => this.onBack());
    }
  }

  onCompleted(profile: ReadCardProfile): void {
    if (profile.idCardType === 'บัตรประชาชน' || profile.idCardType === 'ID_CARD') {
      this.profile = profile;
    } else {
      this.alertService.error('ระบบไม่อนุญาตให้กรอกเลขบัตรประจำตัวคนต่างด้าว');
    }
  }

  onHome(): void {
    this.removeCartService.backToReturnStock('/', this.transaction);
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_ASP_SHARE_PLAN_NEW_REGISTER_MNP_VALIDATE_CUSTOMER_PAGE]);
  }

  onNext(): any {
    this.pageLoadingService.openLoading();
    this.createTransaction();
    return this.validateCustomerService.queryCustomerInfo(this.profile.idCardNo).then((res) => {
      this.getZipCode(this.profile.province, this.profile.amphur, this.profile.tumbol).then((zipCode: string) => {
        const transactionType = TransactionType.DEVICE_ORDER_ASP_DEVICE_SHARE_PLAN; // New

        return this.validateCustomerService
          .checkValidateCustomerHandleErrorMessages(this.profile.idCardNo, this.profile.idCardType, transactionType)
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
                  this.transaction.data.billingInformation = billingInfo || {};
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
                      const body: any = this.validateCustomerService.getRequestAddDeviceSellingCartSharePlanASP(
                        this.user,
                        this.transaction,
                        this.priceOption,
                        { customer: this.transaction.data.customer }
                      );
                      return this.validateCustomerService.addDeviceSellingCartSharePlanASP(body).then((response: any) => {
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
                  }).then(() => this.router.navigate([ROUTE_DEVICE_ORDER_ASP_SHARE_PLAN_NEW_REGISTER_MNP_PAYMENT_DETAIL_PAGE]))
                  .then(() => this.pageLoadingService.closeLoading());
              });
          }).catch((err) => {
            this.pageLoadingService.closeLoading();
            const developerMessage = err.error.developerMessage;
            const messageError = err.error.errors;
            if (err.error.resultCode === 'MYCHN00150006') {
              this.alertService.error(developerMessage);
            } else {
              this.alertService.error(messageError[0]);
            }
          });
      });
    }).catch((e) => {
      const mapCustomer = this.mapCustomer(this.profile);
      this.transaction.data.customer = mapCustomer;
      this.getZipCode(this.profile.province, this.profile.amphur, this.profile.tumbol).then((zipCode: string) => {
        const transactionType = TransactionType.DEVICE_ORDER_ASP_DEVICE_SHARE_PLAN; // New
        return this.validateCustomerService.checkValidateCustomer(this.profile.idCardNo, this.profile.idCardType, transactionType)
          .then((res) => {
            const data = res.data || {};
            return {
              caNumber: data.caNumber,
              mainMobile: data.mainMobile,
              billCycle: data.billCycle,
              zipCode: zipCode
            };
          }).then((customer) => {
            this.transaction.data.customer = Object.assign(this.profile, customer);
            return this.validateCustomerService.queryBillingAccount(this.profile.idCardNo)
              .then((resp: any) => {
                const params: any = resp.data || {};
                this.toBillingInformation(params).then((billingInfo: any) => {
                  this.transaction.data.billingInformation = billingInfo || {};
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
                      const body: any = this.validateCustomerService
                        .getRequestAddDeviceSellingCart(this.user, this.transaction, this.priceOption,
                          { customer: this.transaction.data.customer });
                      return this.validateCustomerService.addDeviceSellingCartSharePlan(body).then((response: any) => {
                        this.transaction.data = {
                          ...this.transaction.data,
                          order: { soId: response.data }
                        };
                        return this.sharedTransactionService.createSharedTransaction(this.transaction, this.priceOption);
                      }).then(() => {
                        this.router.navigate([ROUTE_DEVICE_ORDER_ASP_SHARE_PLAN_NEW_REGISTER_MNP_PAYMENT_DETAIL_PAGE]);
                        this.pageLoadingService.closeLoading();
                      });
                    } else {
                      this.transaction.data = {
                        ...this.transaction.data,
                        order: { soId: this.soId }
                      };
                      this.router.navigate([ROUTE_DEVICE_ORDER_ASP_SHARE_PLAN_NEW_REGISTER_MNP_PAYMENT_DETAIL_PAGE]);
                      this.pageLoadingService.closeLoading();
                    }
                  });
              });
          });
      });
    });
  }

  mapCardType(idCardType: string): string {
    idCardType = idCardType ? idCardType : 'ID_CARD';
    const mapCardType: any = {
      CERT_FOUND: 'หนังสือจัดตั้งสมาคม / มูลนิธิ',
      EMB_LET: 'หนังสือออกจากสถานทูต',
      GOV_LET: 'หนังสือออกจากหน่วยราชการ',
      HILL_CARD: 'บัตรประจำตัวคนบนที่ราบสูง',
      ID_CARD: 'บัตรประชาชน',
      IMM_CARD: 'บัตรประจำตัวคนต่างด้าว',
      MONK_CERT: 'ใบสุทธิพระ',
      PASSPORT: 'หนังสือเดินทาง',
      ROY_LET: 'หนังสือออกจากสำนักพระราชวัง',
      STA_LET: 'หนังสือออกจากรัฐวิสาหกิจ',
      TAX_ID: 'เลขที่ประจำตัวผู้เสียภาษีอากร'
    };
    return mapCardType[idCardType];
  }

  mapCustomer(customer: any, transaction?: any): any {
    return {
      idCardNo: customer.idCardNo,
      idCardType: (customer.idCardType === 'บัตรประชาชน') ? 'บัตรประชาชน' : this.mapCardType(customer.idCardType) || '',
      titleName: customer.prefix || customer.titleName || '',
      firstName: customer.firstName || '',
      lastName: customer.lastName || '',
      birthdate: customer.birthdate || customer.birthDay + '/' + customer.birthMonth + '/' + customer.birthYear || '',
      gender: customer.gender || '',
      homeNo: customer.homeNo || '',
      moo: customer.moo || '',
      mooBan: customer.mooban || '',
      buildingName: customer.buildingName || '',
      floor: customer.floor || '',
      room: customer.room || '',
      street: customer.street || '',
      soi: customer.soi || '',
      tumbol: customer.tumbol || '',
      amphur: customer.amphur,
      province: customer.province || customer.provinceName || '',
      firstNameEn: '',
      lastNameEn: '',
      issueDate: customer.birthdate || customer.issueDate || '',
      // tslint:disable-next-line: max-line-length
      expireDate: customer.expireDate || customer.expireDay ? customer.expireDay + '/' + customer.expireMonth + '/' + customer.expireYear : '',
      zipCode: customer.zipCode || '',
      mainMobile: customer.mainMobile || '',
      mainPhone: customer.mainPhone || '',
      billCycle: customer.billCycle || '',
      caNumber: customer.caNumber || '',
      mobileNo: '',
      imageSignature: '',
      imageSmartCard: '',
      imageReadSmartCard: customer.imageReadSmartCard ? customer.imageReadSmartCard : transaction ? transaction.imageReadSmartCard : '',
      imageSignatureWidthCard: ''
    };
  }

  toBillingInformation(data: any): any {
    return this.validateCustomerService.billingNetExtreme(data).then((respBillingNetExtreme: any) => {
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
        transactionType: TransactionType.DEVICE_ORDER_ASP_DEVICE_SHARE_PLAN, // Share
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
          const order = this.clearTempStock(this.priceOption, transaction)
            .catch(() => Promise.resolve());
          promiseAll.push(order);
        }
      }
      Promise.all(promiseAll).then(() => resolve());
    });
  }

  clearTempStock(priceOption: PriceOption, transaction: Transaction): Promise<any> {
    return this.http.post('/api/salesportal/dt/remove-card', {
      location: priceOption.productStock.location,
      soId: transaction.data.order.soId,
      transactionId: transaction.transactionId
    }).toPromise();
  }

  isDevelopMode(): boolean {
    return environment.name === 'LOCAL';
  }
}

import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { HomeService, ReadCardProfile, PageLoadingService, AlertService, ChannelType, TokenService, Utils, ValidateCustomerIdCardComponent, KioskControls, User } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import {
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_VALIDATE_CUSTOMER_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_ELIGIBLE_MOBILE_PAGE
} from 'src/app/device-order/ais/device-order-ais-pre-to-post/constants/route-path.constant';

import { Transaction, TransactionType, TransactionAction } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';

import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { SharedTransactionService } from 'src/app/shared/services/shared-transaction.service';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-device-order-ais-pre-to-post-validate-customer-id-card-page',
  templateUrl: './device-order-ais-pre-to-post-validate-customer-id-card-page.component.html',
  styleUrls: ['./device-order-ais-pre-to-post-validate-customer-id-card-page.component.scss']
})
export class DeviceOrderAisPreToPostValidateCustomerIdCardPageComponent implements OnInit, OnDestroy {

  kioskApi: boolean;

  transaction: Transaction;
  priceOption: PriceOption;

  profile: ReadCardProfile;
  zipcode: string;
  readCardValid: boolean;
  user: User;
  progressReadCard: number;

  @ViewChild(ValidateCustomerIdCardComponent)
  validateCustomerIdcard: ValidateCustomerIdCardComponent;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private priceOptionService: PriceOptionService,
    private transactionService: TransactionService,
    private sharedTransactionService: SharedTransactionService,
    private pageLoadingService: PageLoadingService,
    private http: HttpClient,
    private tokenService: TokenService,
    private utils: Utils,
    private alertService: AlertService,
    private translateService: TranslateService
  ) {
    this.user = this.tokenService.getUser();
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.kioskApi = this.tokenService.getUser().channelType === ChannelType.SMART_ORDER;
  }

  ngOnInit(): void {
    this.onRemoveCardState();
  }

  onProgress(progress: number): void {
    this.progressReadCard = progress;
  }

  progressDoing(): boolean {
    return this.progressReadCard > 0 && this.progressReadCard < 100 ? true : false;
  }

  onRemoveCardState(): void {
    // ปัญหาเกิดจาก ais webconnect เมื่ออ่านบัตรรอบแรกแล้วอ่านรอบ 2 ไม่ได้
    if (this.validateCustomerIdcard && this.validateCustomerIdcard.koiskApiFn) {
      this.validateCustomerIdcard.koiskApiFn.removedState().subscribe((removed: boolean) => {
        if (removed) {
          this.validateCustomerIdcard.ngOnDestroy();
          this.validateCustomerIdcard.ngOnInit();
        }
      });
    }
  }

  // Read card error
  onError(valid: boolean): void {
    this.readCardValid = valid;
    if (!this.profile) {
      this.alertService.error(this.translateService.instant('ไม่สามารถอ่านบัตรประชาชนได้ กรุณาติดต่อพนักงาน')).then(() => this.onBack());
    }
  }

  // Read card success
  onCompleted(profile: ReadCardProfile): void {
    this.profile = profile;
    // auto next
    this.onNext();
  }

  onHome(): void {
    this.KioskLEDoff();
    this.homeService.goToHome();
  }

  onBack(): void {
    this.returnStock().then(() => {
      this.KioskLEDoff();
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_VALIDATE_CUSTOMER_PAGE]);
    });
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    // มี auto next ทำให้ create transaction ช้ากว่า read card
    this.returnStock().then(() => {
      this.getZipCode(this.profile.province, this.profile.amphur, this.profile.tumbol)
        .then((zipCode: string) => {
          return this.http.get('/api/customerportal/validate-customer-pre-to-post', {
            params: {
              identity: this.profile.idCardNo,
              idCardType: this.profile.idCardType,
              transactionType: TransactionType.DEVICE_ORDER_PRE_TO_POST_AIS
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
        .then((customer: any) => {
          // load bill cycle
          this.transaction.data.customer = Object.assign(this.profile, customer);
          return this.http.get(`/api/customerportal/newRegister/${this.profile.idCardNo}/queryBillingAccount`).toPromise()
            .then((resp: any) => {
              const data = resp.data || {};
              // load bill next extreme
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
        }).then((billingInformation: any) => {
          this.transaction.data.billingInformation = billingInformation;

          return this.conditionIdentityValid()
            .catch((msg: string) => {
              return this.alertService.error(this.translateService.instant(msg)).then(() => true);
            })
            .then((isError: boolean) => {
              if (isError) {
                this.onBack();
                return;
              }
              return this.http.post(
                '/api/salesportal/add-device-selling-cart',
                this.getRequestAddDeviceSellingCart()
              ).toPromise()
                .then((resp: any) => {
                  this.transaction.data.order = { soId: resp.data.soId };
                  return this.sharedTransactionService.createSharedTransaction(this.transaction, this.priceOption);
                }).then(() => {
                  this.transaction.data.action = TransactionAction.READ_CARD;
                  this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_ELIGIBLE_MOBILE_PAGE]);
                });
            });
        }).then(() => this.pageLoadingService.closeLoading());
    });
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

  KioskLEDoff(): void {
    if (this.validateCustomerIdcard.koiskApiFn) {
      this.validateCustomerIdcard.koiskApiFn.controls(KioskControls.LED_OFF);
    }
  }

  returnStock(): Promise<void> {
    return new Promise(resolve => {
      const transaction = this.transactionService.load();

      const promiseAll = [];
      if (transaction.data) {
        if (transaction.data.order && transaction.data.order.soId) {
          const order = this.http.post('/api/salesportal/device-sell/item/clear-temp-stock', {
            location: this.priceOption.productStock.location,
            soId: transaction.data.order.soId,
            transactionId: transaction.transactionId
          }).toPromise().catch(() => Promise.resolve());
          promiseAll.push(order);
        }
      }
      Promise.all(promiseAll).then(() => resolve());
    });
  }

  getRequestAddDeviceSellingCart(): any {
    const productStock = this.priceOption.productStock;
    const productDetail = this.priceOption.productDetail;
    const customer = this.transaction.data.customer;
    return {
      soCompany: productStock.company || 'AWN',
      locationSource: this.user.locationCode,
      locationReceipt: this.user.locationCode,
      productType: productDetail.productType || 'DEVICE',
      productSubType: productDetail.productSubType || 'HANDSET',
      brand: productStock.brand,
      model: productDetail.model,
      color: productStock.color,
      priceIncAmt: '',
      priceDiscountAmt: '',
      grandTotalAmt: '',
      userId: this.user.username,
      cusNameOrder: `${customer.firstName || ''} ${customer.lastName || ''}`.trim(),
      preBookingNo: '',
      depositAmt: '',
      reserveNo: ''
    };
  }

}

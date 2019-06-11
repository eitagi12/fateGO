import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ReadCardProfile, HomeService, PageLoadingService, TokenService, ChannelType, Utils, AlertService, ValidateCustomerIdCardComponent, KioskControls, User } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { Transaction, TransactionType, TransactionAction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { ROUTE_BUY_PRODUCT_CAMPAIGN_PAGE } from 'src/app/buy-product/constants/route-path.constant';
import { ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_PAYMENT_DETAIL_PAGE } from '../../constants/route-path.constant';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { SharedTransactionService } from 'src/app/shared/services/shared-transaction.service';

declare var swal: any;

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
    private alertService: AlertService
  ) {
    this.user = this.tokenService.getUser();
    this.priceOption = this.priceOptionService.load();
    this.homeService.callback = () => {

      const url = this.router.url;
      if (url.indexOf('result') !== -1) {
        this.homeHandler();
      } else {
        this.alertService.question('ท่านต้องการยกเลิกการซื้อสินค้าหรือไม่')
          .then((data: any) => {
            if (!data.value) {
              return false;
            }
            if (this.validateCustomerIdcard.koiskApiFn) {
              this.validateCustomerIdcard.koiskApiFn.controls(KioskControls.LED_OFF);
            }
            // Returns stock (sim card, soId) todo...
            return this.returnStock().then(() => true);
          })
          .then((isNext: boolean) => {
            if (isNext) {
              this.homeHandler();
            }
          });
      }
    };

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
      this.alertService.error('ไม่สามารถอ่านบัตรประชาชนได้ กรุณาติดต่อพนักงาน').then(() => this.onBack());
    }
  }

  // Read card success
  onCompleted(profile: ReadCardProfile): void {
    this.profile = profile;
    // auto next
    this.onNext();
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onBack(): void {
    this.alertService.question('ท่านต้องการยกเลิกการซื้อสินค้าหรือไม่')
      .then((data: any) => {
        if (!data.value) {
          return false;
        }
        if (this.validateCustomerIdcard.koiskApiFn) {
          this.validateCustomerIdcard.koiskApiFn.controls(KioskControls.LED_OFF);
        }
        // Returns stock (sim card, soId) todo...
        return this.returnStock().then(() => true);
      })
      .then((isNext: boolean) => {
        if (isNext) {
          this.router.navigate([ROUTE_BUY_PRODUCT_CAMPAIGN_PAGE], { queryParams: this.priceOption.queryParams });
        }
      });
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    // มี auto next ทำให้ create transaction ช้ากว่า read card
    this.returnStock().then(() => {
      this.createTransaction();
      this.getZipCode(this.profile.province, this.profile.amphur, this.profile.tumbol)
        .then((zipCode: string) => {
          return this.http.get('/api/customerportal/validate-customer-new-register', {
            params: {
              identity: this.profile.idCardNo,
              idCardType: this.profile.idCardType,
              transactionType: TransactionType.DEVICE_ORDER_NEW_REGISTER_AIS
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
              return {
                billCycles: data.billingAccountList
              };
            });
        }).then((billingInformation: any) => {
          this.transaction.data.billingInformation = billingInformation;

          return this.conditionIdentityValid()
            .catch((msg: string) => {
              return this.alertService.error(msg).then(() => true);
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
                }).then(() => this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_PAYMENT_DETAIL_PAGE]));
            });
        }).then(() => this.pageLoadingService.closeLoading());
    });
  }

  createTransaction(): void {
    this.transaction = {
      data: {
        transactionType: TransactionType.DEVICE_ORDER_NEW_REGISTER_AIS,
        action: TransactionAction.READ_CARD,
      }
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
          return Promise.reject('ไม่พบรหัสไปรษณีย์');
        }
      });
  }

  conditionIdentityValid(): Promise<string> {
    return new Promise((resovle, reject) => {

      const birthdate = this.transaction.data.customer.birthdate; // '19/03/2560';
      const expireDate = this.transaction.data.customer.expireDate;
      const idCardType = this.transaction.data.customer.idCardType;

      if (this.utils.isLowerAge17Year(birthdate)) {
        return reject(`ไม่สามารถทำรายการได้ เนื่องจากอายุของผู้ใช้บริการต่ำกว่า 17 ปี`);
      }
      if (this.utils.isIdCardExpiredDate(expireDate)) {
        return reject(`ไม่สามารถทำรายการได้ เนื่องจาก ${idCardType} หมดอายุ`);
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
      window.location.href = '/smart-digital/main-menu';
    }
  }

  returnStock(): Promise<void> {
    return new Promise(resolve => {
      const transaction = this.transactionService.load();

      const promiseAll = [];
      if (transaction.data) {
        if (transaction.data.simCard && transaction.data.simCard.mobileNo) {
          const unlockMobile = this.http.post('/api/customerportal/newRegister/selectMobileNumberRandom', {
            userId: this.user.username,
            mobileNo: transaction.data.simCard.mobileNo,
            action: 'Unlock'
          }).toPromise().catch(() => Promise.resolve());
          promiseAll.push(unlockMobile);
        }
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

  isDevelopMode(): boolean {
    return environment.name === 'LOCAL';
  }

}

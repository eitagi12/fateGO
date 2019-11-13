import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, ValidateCustomerIdCardComponent, ReadCardProfile, PageLoadingService, TokenService, AlertService, Utils, KioskControls, ChannelType, ChargeType, User } from 'mychannel-shared-libs';
import { ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_ELIGIBLE_MOBILE_PAGE } from '../../constants/route-path.constant';
import { Transaction, TransactionType, TransactionAction } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { HttpClient } from '@angular/common/http';
import { SharedTransactionService } from 'src/app/shared/services/shared-transaction.service';
import { ROUTE_BUY_PRODUCT_CAMPAIGN_PAGE } from 'src/app/buy-product/constants/route-path.constant';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-device-order-ais-existing-prepaid-hotdeal-validate-customer-id-card-page',
  templateUrl: './device-order-ais-existing-prepaid-hotdeal-validate-customer-id-card-page.component.html',
  styleUrls: ['./device-order-ais-existing-prepaid-hotdeal-validate-customer-id-card-page.component.scss']
})
export class DeviceOrderAisExistingPrepaidHotdealValidateCustomerIdCardPageComponent implements OnInit, OnDestroy {

  kioskApi: boolean;

  transaction: Transaction;
  profile: ReadCardProfile;
  zipcode: string;
  readCardValid: boolean;
  priceOption: PriceOption;
  user: User;
  progressReadCard: number;

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
    private priceOptionService: PriceOptionService,
    private translateService: TranslateService,
    private sharedTransactionService: SharedTransactionService,
  ) {
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
            if (this.validateCustomerIdcard.koiskApiFn) {
              this.validateCustomerIdcard.koiskApiFn.controls(KioskControls.LED_OFF);
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
    this.user = this.tokenService.getUser();
    this.kioskApi = this.tokenService.getUser().channelType === ChannelType.SMART_ORDER;
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void {
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
      this.alertService.error(this.translateService.instant('ไม่สามารถอ่านบัตรประชาชนได้ กรุณาติดต่อพนักงาน'));
      this.validateCustomerIdcard.koiskApiFn.removedState().subscribe((removed: boolean) => {
        if (removed) {
          this.validateCustomerIdcard.ngOnDestroy();
          this.validateCustomerIdcard.ngOnInit();
        }
      });
    }
  }

  onCompleted(profile: ReadCardProfile): void {
    this.profile = profile;
    // auto next
    this.onNext();
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    let isValidate = false;
    this.returnStock().then(() => {
      this.createTransaction();
      this.getZipCode(this.profile.province, this.profile.amphur, this.profile.tumbol)
        .then((zipCode: string) => {
          return this.http.get('/api/customerportal/validate-customer-prepaid-hotdeal', {
            params: {
              identity: this.profile.idCardNo
            }
          }).toPromise()
            .then((resp: any) => {
              const data = resp.data || {};
              isValidate = true;
              return {
                caNumber: data.caNumber,
                mainMobile: data.mainMobile,
                billCycle: data.billCycle,
                zipCode: zipCode
              };
            }).catch((err: any) => {
              this.alertService.notify({
                type: 'error',
                html: 'ไม่สามารถซื้อเครื่องราคาพิเศษ/เปิดเบอร์ใหม่ได้ <br> ' + err.error.errors
              }).then(() => {
                if (this.validateCustomerIdcard.koiskApiFn) {
                  this.validateCustomerIdcard.koiskApiFn.controls(KioskControls.LED_OFF);
                }
                this.router.navigate([ROUTE_BUY_PRODUCT_CAMPAIGN_PAGE], { queryParams: this.priceOption.queryParams });
              });
              return { zipCode: zipCode };
            });
        })
        .then((customer: any) => {
          this.transaction.data.customer = Object.assign(this.profile, customer);
          if (!isValidate) {
            return;
          }
          // load bill cycle
          return this.http.get(`/api/customerportal/newRegister/${this.profile.idCardNo}/queryBillingAccount`).toPromise()
            .then((resp: any) => {
              const data = resp.data || {};
              return {
                billCycles: data.billingAccountList
              };
            });
        }).then((billingInformation: any) => {
          if (!isValidate) {
            return;
          }
          this.transaction.data.billingInformation = billingInformation;
          return this.conditionIdentityValid()
            .then(() => {
              return this.http.post(
                '/api/salesportal/dt/add-cart-list',
                this.getRequestAddDeviceSellingCart()
              ).toPromise()
                .then((resp: any) => resp.data.soId);
            })
            .then((soId: string) => {
              this.transaction.data.order = { soId: soId };

              return this.sharedTransactionService.createSharedTransaction(this.transaction, this.priceOption);
            })
            .then(() => {
              this.pageLoadingService.closeLoading();
              this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_ELIGIBLE_MOBILE_PAGE]);
            });
        });
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

  getRequestAddDeviceSellingCart(): any {
    const productStock = this.priceOption.productStock;
    const productDetail = this.priceOption.productDetail;
    const customer = this.transaction.data.customer;

    const product = {
      productType: productDetail.productType || 'DEVICE',
      soCompany: productStock.company || 'AWN',
      productSubType: productDetail.productSubType || 'HANDSET',
      brand: productStock.brand,
      model: productDetail.model,
      qty: '1',

      color: productStock.color,
      matCode: '',
      priceIncAmt: '',
      priceDiscountAmt: '',
      matAirTime: '',
      listMatFreeGoods: [{
        matCodeFG: '',
        qtyFG: '' // จำนวนของแถม *กรณีส่งค่า matCodeFreeGoods ค่า qty จะต้องมี
      }]
    };

    return {
      locationSource: this.user.locationCode,
      locationReceipt: this.user.locationCode,
      userId: this.user.username,
      cusNameOrder: `${customer.firstName || ''} ${customer.lastName || ''}`.trim(),
      soChannelType: 'MC_KIOSK',
      soDocumentType: 'RESERVED',
      productList: [product],

      grandTotalAmt: '',
      preBookingNo: '',
      depositAmt: '',
      reserveNo: '',
      subStockDestination: 'BRN',
      storeName: ''
    };
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
          return Promise.reject(this.translateService.instant('ไม่พบรหัสไปรษณีย์'));
        }
      });
  }

  onBack(): void {
    this.alertService.question(this.translateService.instant('ท่านต้องการยกเลิกการซื้อสินค้าหรือไม่'))
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
          const order = this.http.post('/api/salesportal/dt/remove-cart', {
            soId: transaction.data.order.soId,
            userId: this.user.username
          }).toPromise().catch(() => Promise.resolve());
          promiseAll.push(order);
        }
      }
      Promise.all(promiseAll).then(() => resolve());
    });
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
    this.pageLoadingService.closeLoading();
  }

  private createTransaction(): void {
    this.transaction = {
      data: {
        transactionType: TransactionType.DEVICE_ORDER_PREPAID_HOTDEAL_AIS,
        action: TransactionAction.READ_CARD,
      }
    };
  }

}

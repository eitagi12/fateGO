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
    private sharedTransactionService: SharedTransactionService,
  ) {
    this.homeService.callback = () => {
      this.alertService.question('ท่านต้องการยกเลิกการซื้อสินค้าหรือไม่')
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
          window.location.href = environment.name === 'LOCAL' ? '/main-menu' : '/smart-digital/main-menu';
        }
      });
    };
    this.user = this.tokenService.getUser();
    this.kioskApi = this.tokenService.getUser().channelType === ChannelType.SMART_ORDER;
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void {
    this.createTransaction();
  }

  onError(valid: boolean): void {
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

  onCompleted(profile: ReadCardProfile): void {
    this.profile = profile;
    // auto next
    this.onNext();
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    let isValidate = false;
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
              '/api/salesportal/add-device-selling-cart',
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

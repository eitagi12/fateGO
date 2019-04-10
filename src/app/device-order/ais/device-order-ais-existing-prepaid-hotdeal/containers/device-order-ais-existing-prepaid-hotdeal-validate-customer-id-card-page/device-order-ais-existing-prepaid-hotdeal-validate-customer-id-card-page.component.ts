import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, ValidateCustomerIdCardComponent, ReadCardProfile, PageLoadingService, TokenService, AlertService, Utils, KioskControls, ChannelType, ChargeType, User } from 'mychannel-shared-libs';
import { ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_ELIGIBLE_MOBILE_PAGE } from '../../constants/route-path.constant';
import { Transaction, TransactionType, TransactionAction } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { HttpClient } from '@angular/common/http';
import { SharedTransactionService } from 'src/app/shared/services/shared-transaction.service';

@Component({
  selector: 'app-device-order-ais-existing-prepaid-hotdeal-validate-customer-id-card-page',
  templateUrl: './device-order-ais-existing-prepaid-hotdeal-validate-customer-id-card-page.component.html',
  styleUrls: ['./device-order-ais-existing-prepaid-hotdeal-validate-customer-id-card-page.component.scss']
})
export class DeviceOrderAisExistingPrepaidHotdealValidateCustomerIdCardPageComponent implements OnInit {

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
      if (this.validateCustomerIdcard.koiskApiFn) {
        this.validateCustomerIdcard.koiskApiFn.controls(KioskControls.LED_OFF);
      }
      window.location.href = '';
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

    // this.getZipCode(this.profile.province, this.profile.amphur, this.profile.tumbol)
    //   .then((zipCode: string) => {
    //     return this.http.get('/api/customerportal/validate-customer-prepaid-hotdeal', {
    //       params: {
    //         identity: this.profile.idCardNo
    //       }
    //     }).toPromise()
    //       .then((resp: any) => {
    //         const data = resp.data || {};
    //         return {
    //           caNumber: data.caNumber,
    //           mainMobile: data.mainMobile,
    //           billCycle: data.billCycle,
    //           zipCode: zipCode
    //         };
    //       }).catch(() => {
    //         return {
    //           zipCode: zipCode
    //         };
    //       });
    //   })
    //   .then((customer: any) => { // load bill cycle
    //     this.transaction.data.customer = Object.assign(this.profile, customer);

    //     return this.http.get(`/api/customerportal/newRegister/${this.profile.idCardNo}/queryBillingAccount`).toPromise()
    //       .then((resp: any) => {
    //         const data = resp.data || {};
    //         return this.http.post('/api/customerportal/verify/billingNetExtreme', {
    //           businessType: '1',
    //           listBillingAccount: data.billingAccountList
    //         }).toPromise()
    //           .then((respBillingNetExtreme: any) => {
    //             return {
    //               billCycles: data.billingAccountList,
    //               billCyclesNetExtreme: respBillingNetExtreme.data
    //             };
    //           })
    //           .catch(() => {
    //             return {
    //               billCycles: data.billingAccountList
    //             };
    //           });
    //       });
    //   })
    //   .then((billingInformation: any) => {
    //     this.transaction.data.billingInformation = billingInformation;
    //     if (this.checkBusinessLogic()) {
    //       this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_ELIGIBLE_MOBILE_PAGE]);
    //     }
    //   });

      this.getZipCode(this.profile.province, this.profile.amphur, this.profile.tumbol)
      .then((zipCode: string) => {
        return this.http.get('/api/customerportal/validate-customer-prepaid-hotdealr', {
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
            return { zipCode: zipCode };
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
          .then(() => this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_ELIGIBLE_MOBILE_PAGE]));

      }).then(() => this.pageLoadingService.closeLoading());
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
    this.homeService.goToHome();
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
    this.pageLoadingService.closeLoading();
  }

  private createTransaction(): void {
    this.transaction = {
      data: {
        transactionType: TransactionType.ORDER_NEW_REGISTER,
        action: TransactionAction.READ_CARD,
      }
    };
  }

}

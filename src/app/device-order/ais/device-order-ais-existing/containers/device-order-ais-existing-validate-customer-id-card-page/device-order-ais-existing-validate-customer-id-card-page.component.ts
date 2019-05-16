import { Component, OnInit, ViewChild, OnDestroy, Injector } from '@angular/core';
import { ValidateCustomerIdCardComponent, HomeService, PageLoadingService, ReadCardProfile, TokenService, Utils, AlertService, KioskControls, ChannelType, User } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction, TransactionType, TransactionAction } from 'src/app/shared/models/transaction.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ROUTE_BUY_PRODUCT_CAMPAIGN_PAGE } from 'src/app/buy-product/constants/route-path.constant';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { ROUTE_DEVICE_ORDER_AIS_EXISTING_CUSTOMER_INFO_PAGE } from '../../constants/route-path.constant';
import { SharedTransactionService } from 'src/app/shared/services/shared-transaction.service';
import { ApiRequestService } from 'mychannel-shared-libs';

declare var swal: any;

@Component({
  selector: 'app-device-order-ais-existing-validate-customer-id-card-page',
  templateUrl: './device-order-ais-existing-validate-customer-id-card-page.component.html',
  styleUrls: ['./device-order-ais-existing-validate-customer-id-card-page.component.scss']
})
export class DeviceOrderAisExistingValidateCustomerIdCardPageComponent implements OnInit, OnDestroy {

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
    private utils: Utils,
    private router: Router,
    private http: HttpClient,
    private homeService: HomeService,
    private tokenService: TokenService,
    private alertService: AlertService,
    private priceOptionService: PriceOptionService,
    private transactionService: TransactionService,
    private pageLoadingService: PageLoadingService,
    private sharedTransactionService: SharedTransactionService,
    private injector: Injector
  ) {
    this.user = this.tokenService.getUser();
    this.priceOption = this.priceOptionService.load();

    this.homeService.callback = () => {
      if (this.validateCustomerIdcard.koiskApiFn) {
        this.validateCustomerIdcard.koiskApiFn.controls(KioskControls.LED_OFF);
      }
      // Returns stock (sim card, soId) todo...
      this.returnStock().then(() => {
        this.homeHandler();
      });
    };
    this.kioskApi = this.tokenService.getUser().channelType === ChannelType.SMART_ORDER;
    this.priceOption = this.priceOptionService.load();
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

  onError(valid: boolean): void {
    this.readCardValid = valid;
    if (!this.profile) {
      this.alertService.error('ไม่สามารถอ่านบัตรประชาชนได้ กรุณาติดต่อพนักงาน');
    }
  }

  onCompleted(profile: ReadCardProfile): void {
    this.profile = profile;
    // auto next
    this.onNext();
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onBack(): void {
    this.returnStock().then(() => {
      this.router.navigate([ROUTE_BUY_PRODUCT_CAMPAIGN_PAGE], { queryParams: this.priceOption.queryParams });
    });
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    let isValidate = true;
    this.returnStock().then(() => {

      this.createTransaction();
      this.getZipCode(this.profile.province, this.profile.amphur, this.profile.tumbol)
        .then((zipCode: string) => {
          return this.http.get('/api/customerportal/validate-customer-existing', {
            params: {
              identity: this.profile.idCardNo,
              idCardType: this.profile.idCardType,
              transactionType: TransactionType.DEVICE_ORDER_EXISTING_AIS
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
            }).catch((error: any) => {
              isValidate = false;
              this.alertService.notify({
                type: 'error',
                onBeforeOpen: () => {
                  const content = swal.getContent();
                  const $ = content.querySelector.bind(content);
                  const errorDetail = $('#error-detail');
                  const errorDetailDisplay = $('#error-detail-display');
                  errorDetail.addEventListener('click', (evt) => {
                    errorDetail.classList.add('d-none');
                    errorDetailDisplay.classList.remove('d-none');
                  });
                },
                html: this.getTemplateServerError(error)
              }).then(() => {
                this.onBack();
              });
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
            .then(() => {
              if (isValidate) {
                this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_CUSTOMER_INFO_PAGE]);
              }
            });

        }).then(() => {
          if (isValidate) {
            this.pageLoadingService.closeLoading();
          }
        });

    });
  }

  private getTemplateServerError(error: HttpErrorResponse): string {
    const apiRequestService = this.injector.get(ApiRequestService);
    const mcError = error.error;

    if (mcError && mcError.resultDescription) {
      let message = '';
      if (mcError.errors) {
        if (Array.isArray(mcError.errors)) {
          mcError.errors.forEach(e => {
            message += `<li>${this.htmlEntities(e.message || e)}</li>`;
          });
        } else {
          message += this.htmlEntities(JSON.stringify(mcError.errors));
        }
        return `
            <div class="text-left mb-2 mx-3">${message}</div>
            <div class="text-right" id="error-detail">
                <i class="fa fa-angle-double-right"></i>
                <small>รายละเอียด</small>
            </div>
            <div class="py-2 text-left d-none" id="error-detail-display">
                <div>REF: ${apiRequestService.getCurrentRequestId() || '-'}</div>
                <div>URL: ${error.url || '-'} - [${error.status}]</div>
            </div>
            `;
      } else {
        return `
            <div class="text-center mb-2"><b>${mcError.resultDescription || 'ระบบไม่สามารถแสดงข้อมูลได้ในขณะนี้'}</b></div>
            <div class="text-right" id="error-detail">
                <i class="fa fa-angle-double-right"></i>
                <small>รายละเอียด</small>
            </div>
            <div class="py-2 text-left d-none" id="error-detail-display">
                <div class="mb-2 mx-3">${message}</div>
                <div>REF: ${apiRequestService.getCurrentRequestId() || '-'}</div>
                <div>URL: ${error.url || '-'} - [${error.status}]</div>
            </div>
            `;
      }
    } else {
      return `
        <div class="text-center mb-2"><b>ระบบไม่สามารถแสดงข้อมูลได้ในขณะนี้<b></div>
        <div class="mb-2">${error.status} - ${error.statusText}</div>
        <div>${error.message}</div>
        `;
    }
  }

  htmlEntities(str: any): any {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
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

  private createTransaction(): void {
    this.transaction = {
      data: {
        transactionType: TransactionType.DEVICE_ORDER_EXISTING_AIS,
        action: TransactionAction.READ_CARD,
      }
    };
  }
}

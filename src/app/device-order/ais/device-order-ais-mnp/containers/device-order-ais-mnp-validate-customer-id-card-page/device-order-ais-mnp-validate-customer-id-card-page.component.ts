import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Transaction, TransactionType, TransactionAction } from 'src/app/shared/models/transaction.model';
import { ReadCardProfile, HomeService, TokenService, PageLoadingService, User, ValidateCustomerIdCardComponent, Utils, AlertService, KioskControls, ChannelType } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ROUTE_DEVICE_ORDER_AIS_MNP_PAYMENT_DETAIL_PAGE, ROUTE_DEVICE_ORDER_AIS_MNP_CUSTOMER_INFO_PAGE } from '../../constants/route-path.constant';
import { HttpClient } from '@angular/common/http';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { TranslateService } from '@ngx-translate/core';
import { ROUTE_BUY_PRODUCT_CAMPAIGN_PAGE } from 'src/app/buy-product/constants/route-path.constant';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';

@Component({
  selector: 'app-device-order-ais-mnp-validate-customer-id-card-page',
  templateUrl: './device-order-ais-mnp-validate-customer-id-card-page.component.html',
  styleUrls: ['./device-order-ais-mnp-validate-customer-id-card-page.component.scss']
})
export class DeviceOrderAisMnpValidateCustomerIdCardPageComponent implements OnInit, OnDestroy {
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
    private priceOptionService: PriceOptionService,
    private translateService: TranslateService
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

  ngOnInit(): void {
    this.translateService.use('TH');
    this.createTransaction();
    this.checkSoIdDuplicate();
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

  onHome(): void {
    this.homeService.goToHome();
  }

  onBack(): void {
    this.router.navigate([ROUTE_BUY_PRODUCT_CAMPAIGN_PAGE], { queryParams: this.priceOption.queryParams });
  }

  onNext(): void {
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
        return this.createAddToCartTrasaction(this.transaction, this.priceOption);
      }).then(() => {
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
      }).catch((error: any) => {
        this.alertService.error(error);
      }).then((billingInformation: any) => {
        this.transaction.data.billingInformation = billingInformation;
        if (this.checkBusinessLogic()) {
          this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_CUSTOMER_INFO_PAGE]);
        }
      });
  }

  // check When Comeback to ValidateIDcardPage and have SoId
  checkSoIdDuplicate(): void {
    const transaction = this.transactionService.load();
    if (transaction && transaction.data && transaction.data.order && transaction.data.order.soId) {
      const _paramSoId = transaction.data.order.soId;
      const _userId = this.tokenService.getUser().username;
      if (_paramSoId) {
        const requestData = {
          soId: _paramSoId,
          userId: _userId
        };
        this.http.post('/api/salesportal/device-sell/item/remove', requestData).toPromise().then((resp: any) => {
          const data = resp.data || {};
          if (data.resultCode === 'S') {
            console.log('Success is RemoveItemBackendCart');
          }
        });
      }
    }
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
        transactionType: TransactionType.DEVICE_ORDER_MNP_AIS,
        action: TransactionAction.READ_CARD,
      }
    };
  }

  homeHandler(): void {
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

  createAddToCartTrasaction(transaction: Transaction, priceOption: PriceOption): Promise<any> {
    return new Promise((resolve, reject) => {
      if (transaction && transaction.data && transaction.data.order && transaction.data.order.soId) {
        resolve(transaction);
      } else {
        this.callAddToCartService(transaction, priceOption).then((response) => {
          if (response.resultCode === 'S') {
            transaction.data.order = {
              orderNo: '',
              soId: response.soId
            };
            this.createTransactionService(transaction, priceOption).then((createTrans) => {
              resolve(createTrans);
            }).catch(resolve);
          } else {
            reject('Cannot add item to the cart');
          }
        });
      }
    });
  }

  private callAddToCartService(transaction: Transaction, priceOption: PriceOption): Promise<any> {
    const productStock = priceOption.productStock;
    const productDetail = priceOption.productDetail;
    const customer = transaction.data.customer;
    const cusNameOrder = customer.firstName && customer.lastName ? `${customer.firstName} ${customer.lastName}` : '-';
    const requestData: any = {
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
      cusNameOrder: cusNameOrder,
      preBookingNo: '',
      depositAmt: '',
      reserveNo: ''
    };
    return this.http.post('/api/salesportal/device-sell/item', requestData).toPromise()
      .then((res: any) => res.data || {});
  }

  private createTransactionService(transaction: Transaction, priceOption: PriceOption): Promise<any> {
    return this.http.post('/api/salesportal/device-order/create-transaction', this.mapCreateTransactionDb(transaction, priceOption))
      .toPromise().then(resp => transaction);
  }

  private mapCreateTransactionDb(transaction: Transaction, priceOption: PriceOption): any {
    const username: any = this.tokenService.getUser().username;
    const transactionDb = {
      transactionId: this.generateTransactionId(),
      data: {
        ...transaction.data,
        main_promotion: { campaign: priceOption.campaign, privilege: priceOption.campaign.privilege, trade: priceOption.trade } || {},
        device: this.getDevice(priceOption),
        status: {
          code: '001',
          description: 'pending'
        },
        contract: priceOption.campaign.conditionCode || {}
      },
      create_by: username,
      issueBy: transaction.createDate || username,
      last_update_by: username
    };
    return transactionDb;
  }

  private getDevice(priceOption: PriceOption): any {
    const product: any = priceOption.productStock;
    const productDetail: any = priceOption.productDetail;
    return {
      model: productDetail.model,
      brand: productDetail.brand,
      amount: 1,
      name: productDetail.productName,
      colorName: product.colorName,
      colorCode: product.colorCode,
      productType: productDetail.productType,
      productSubtype: productDetail.productSubtype
    };
  }

  generateTransactionId(): string {
    let emptyString: string = '';
    const alphabet: string = 'abcdefghijklmnopqrstuvwxyz';
    while (emptyString.length < 2) {
      emptyString += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    const randomAlphabet = emptyString;
    const today: any = moment().format('YYYYMMD');
    const randomNumber = Math.floor(Math.random() * 1000000).toString();
    const transactionId = randomAlphabet + today + randomNumber;
    return transactionId;
  }
}

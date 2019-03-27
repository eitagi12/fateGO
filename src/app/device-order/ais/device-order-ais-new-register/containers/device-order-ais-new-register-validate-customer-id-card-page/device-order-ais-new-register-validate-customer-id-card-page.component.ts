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
import * as moment from 'moment';

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
    this.priceOption = this.priceOptionService.load();

    this.homeService.callback = () => {
      if (this.validateCustomerIdcard.koiskApiFn) {
        this.validateCustomerIdcard.koiskApiFn.controls(KioskControls.LED_OFF);
      }
      // Returns stock todo...
      const transaction = this.transactionService.load();
      if (transaction.data.simCard
        && transaction.data.simCard.mobileNo) {
        this.returnStock(this.user.username, transaction.data.simCard.mobileNo).then(() => {
          this.homeHandler();
        });
      } else {
        this.homeHandler();
      }

    };

    this.kioskApi = this.tokenService.getUser().channelType === ChannelType.SMART_ORDER;
  }

  ngOnInit(): void {
    this.createTransaction();
    this.onRemoveCardState();
  }

  createTransaction(): void {
    this.transaction = {
      data: {
        transactionType: TransactionType.DEVICE_ORDER_NEW_REGISTER_AIS,
        action: TransactionAction.READ_CARD,
      }
    };
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
      this.alertService.error('ไม่สามารถอ่านบัตรประชาชนได้ กรุณาติดต่อพนักงาน');
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
            return { zipCode: zipCode };
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

        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_PAYMENT_DETAIL_PAGE]);
        /*this.conditionIdentityValid()
          .then(() => {
            return this.http.post(
              '/api/salesportal/add-device-selling-cart',
              this.getRequestAddDeviceSellingCart()
            ).toPromise()
            .then((resp: any) => resp.data.soId);
          })
          .then((soId: string) => {
            console.log('So id ', soId);
            this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_PAYMENT_DETAIL_PAGE]);
          }).catch((error: string) => this.alertService.error(error));*/

      }).then(() => this.pageLoadingService.closeLoading());
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
    this.transactionService.save(this.transaction);
  }

  homeHandler(): void {
    if (environment.name === 'LOCAL') {
      window.location.href = '/main-menu';
    } else {
      window.location.href = '/smart-digital/main-menu';
    }
  }

  returnStock(mobileNo: string, action: string): Promise<any> {
    return this.http.post('/api/customerportal/newRegister/selectMobileNumberRandom', {
      userId: this.user.username,
      mobileNo: mobileNo,
      action: action
    }).toPromise();
  }

  createSharedTransactions(soId: string): Promise<any> {
    const params = {
      transactionId: '',
      createDate: this.transaction.createDate,
      createBy: this.transaction.createBy,
      lastUpdateDate: this.transaction.lastUpdateDate,
      lastUpdateBy: this.transaction.lastUpdateBy,
      data: {}
    };
    console.log('Shared :: ', params);
    return Promise.resolve(params);
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














  // ต้องอยู่หน้าถัดไปหรือป่าว
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
      // issueBy: transaction.issueBy || username,
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

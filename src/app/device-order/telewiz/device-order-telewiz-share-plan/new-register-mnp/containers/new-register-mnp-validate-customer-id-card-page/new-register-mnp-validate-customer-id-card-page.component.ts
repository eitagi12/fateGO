import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ChannelType, AlertService, ReadCardProfile, User, ReadCard, ValidateCustomerIdCardComponent, HomeService, PageLoadingService, TokenService, ReadCardService, ReadCardEvent, Utils } from 'mychannel-shared-libs';
import * as moment from 'moment';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { Transaction, Prebooking, Customer, TransactionType, TransactionAction, Order } from 'src/app/shared/models/transaction.model';
import { WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN_TELEWIZ } from 'src/app/device-order/constants/wizard.constant';
import { ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_VALIDATE_CUSTOMER_PAGE, ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_CUSTOMER_INFO_PAGE, ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_PAYMENT_DETAIL_PAGE } from '../../constants/route-path.constant';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CustomerInfoService } from 'src/app/device-order/services/customer-info.service';
import { SharedTransactionService } from 'src/app/shared/services/shared-transaction.service';
import { ValidateCustomerService } from 'src/app/shared/services/validate-customer.service';
import { TranslateService } from '@ngx-translate/core';
import { RemoveCartService } from '../../services/remove-cart.service';
declare let $: any;
declare let window: any;
declare function escape(s: string): string;
@Component({
  selector: 'app-new-register-mnp-validate-customer-id-card-page',
  templateUrl: './new-register-mnp-validate-customer-id-card-page.component.html',
  styleUrls: ['./new-register-mnp-validate-customer-id-card-page.component.scss']
})

export class NewRegisterMnpValidateCustomerIdCardPageComponent implements OnInit, OnDestroy {
  kioskApi: boolean;
  isTelewiz: boolean = this.tokenService.isTelewizUser();

  wizards: any = WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN_TELEWIZ;
  // active: number = this.isTelewiz ? 2 : 1;

  transaction: Transaction;
  profile: ReadCardProfile;
  zipcode: string;
  readCardValid: boolean;
  priceOption: PriceOption;
  user: User;
  billDeliveryAddress: Customer;

  readCard: ReadCard;
  readCardSubscription: Subscription;

  showProgress: boolean;

  @ViewChild(ValidateCustomerIdCardComponent)
  validateCustomerIdcard: ValidateCustomerIdCardComponent;

  progress: number;
  error: any;
  soId: string;

  order: Order;
  transactionId: string;

  constructor(
    private router: Router,
    private http: HttpClient,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private alertService: AlertService,
    private priceOptionService: PriceOptionService,
    private sharedTransactionService: SharedTransactionService,
    private tokenService: TokenService,
    private readCardService: ReadCardService,
    private validateCustomerService: ValidateCustomerService,
    private utils: Utils,
    private translateService: TranslateService,
    private removeCartService: RemoveCartService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.user = this.tokenService.getUser();
  }

  ngOnInit(): void {
    this.readCardflowPC();
    // if (this.isTelewiz) {
    //   console.log('isTelewiz2');
    // }
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

  // onCompleted(profile: ReadCardProfile): void {
  //   this.profile = profile;
  // }

  onNext(): any {
    this.pageLoadingService.openLoading();
    this.createTransaction();
    return this.validateCustomerService.queryCustomerInfo(this.profile.idCardNo).then((res) => {
      this.getZipCode(this.profile.province, this.profile.amphur, this.profile.tumbol).then((zipCode: string) => {
        const transactionType = TransactionType.DEVICE_ORDER_TELEWIZ_DEVICE_SHARE_PLAN; // New
        // if (this.profile.idCardType === 'บัตรประชาชน' || this.profile.idCardType === 'ID_CARD') {
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
                        // return this.sharedTransactionService.createSharedTransaction(this.transaction, this.priceOption);
                      });
                    } else {
                      this.transaction.data = {
                        ...this.transaction.data,
                        order: { soId: this.soId }
                      };
                    }
                  }).then(() => {
                    this.setTransaction(this.transaction.data.customer);
                    this.router.navigate([ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_PAYMENT_DETAIL_PAGE]);
                  }).then(() => this.pageLoadingService.closeLoading());
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
        const transactionType = TransactionType.DEVICE_ORDER_TELEWIZ_DEVICE_SHARE_PLAN; // New
        // tslint:disable-next-line: max-line-length
        return this.validateCustomerService.checkValidateCustomerHandleErrorMessages(this.profile.idCardNo, this.profile.idCardType, transactionType)
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
                      // tslint:disable-next-line: max-line-length
                      const body: any = this.validateCustomerService.getRequestAddDeviceSellingCartSharePlanASP(this.user, this.transaction, this.priceOption, { customer: this.transaction.data.customer });
                      return this.validateCustomerService.addDeviceSellingCartSharePlanASP(body).then((response: any) => {
                        this.transaction.data = {
                          ...this.transaction.data,
                          order: { soId: response.data }
                        };
                        // return this.sharedTransactionService.createSharedTransaction(this.transaction, this.priceOption);
                      }).then(() => {
                        this.setTransaction(this.transaction.data.customer);
                        this.router.navigate([ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_PAYMENT_DETAIL_PAGE]);
                        this.pageLoadingService.closeLoading();
                      });
                    } else {
                      this.transaction.data = {
                        ...this.transaction.data,
                        order: { soId: this.soId }
                      };
                      this.setTransaction(this.transaction.data.customer);
                      this.router.navigate([ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_PAYMENT_DETAIL_PAGE]);
                      this.pageLoadingService.closeLoading();
                    }
                  });
              });
          });
      });
    });
  }

  createTransaction(): void {
    if (this.transaction.data && this.transaction.data.order && this.transaction.data.order.soId) {
      this.transactionId = this.transaction.transactionId;
      this.order = this.transaction.data.order;
      this.transaction.data.action = TransactionAction.READ_CARD;
    } else {
      this.transaction = {
        data: {
          transactionType: TransactionType.DEVICE_ORDER_ASP_DEVICE_SHARE_PLAN, // Share
          action: TransactionAction.READ_CARD,
          order: this.order
        },
        transactionId: this.transaction.transactionId
      };
    }
    delete this.transaction.data.customer;

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
      firstNameEn: customer.firstNameEn || '',
      lastNameEn: customer.lastNameEn || '',
      issueDate: customer.birthdate || customer.issueDate || '',
      // tslint:disable-next-line: max-line-length
      expireDate: customer.expireDate ? customer.expireDate : customer.expireDay ? customer.expireDay + '/' + customer.expireMonth + '/' + customer.expireYear : '',
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

  onHome(): void {
    this.removeCartService.backToReturnStock('/', this.transaction);
  }

  ngOnDestroy(): void {
    if (this.readCardSubscription) {
      this.readCardSubscription.unsubscribe();
    }
    this.transactionService.update(this.transaction);
  }

  getRequestAddDeviceSellingCart(): any {
    const productStock = this.priceOption.productStock;
    const productDetail = this.priceOption.productDetail;
    const customer = this.transaction.data.customer;
    const preBooking: Prebooking = this.transaction.data.preBooking;
    let subStock;
    if (preBooking && preBooking.preBookingNo) {
      subStock = 'PRE';
    }
    return {
      soCompany: productStock.company || 'AWN',
      locationSource: this.user.locationCode,
      locationReceipt: this.user.locationCode,
      productType: productDetail.productType || 'DEVICE',
      productSubType: productDetail.productSubType || 'HANDSET',
      brand: productDetail.brand || productStock.brand,
      model: productDetail.model || productStock.model,
      color: productStock.color || productStock.colorName,
      priceIncAmt: '',
      priceDiscountAmt: '',
      grandTotalAmt: '',
      userId: this.user.username,
      cusNameOrder: `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || '-',
      preBookingNo: preBooking ? preBooking.preBookingNo : '',
      depositAmt: preBooking ? preBooking.depositAmt : '',
      reserveNo: preBooking ? preBooking.reserveNo : '',
      subStockDestination: subStock
    };
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

  readCardflowPC(): void {
    // this.readCard = { progress: 10 };
    this.readCardSubscription = this.readCardService.onReadCard().subscribe((readCard: ReadCard) => {
      this.readCard = readCard;
      this.progress = readCard.progress;
      const valid = !!(readCard.progress >= 100 && readCard.profile);
      if (readCard.error) {
        this.showProgress = false;
        this.profile = null;
      }

      if (readCard.eventName === ReadCardEvent.EVENT_CARD_LOAD_ERROR) {
        this.error = valid;
      }

      if (valid) {
        this.showProgress = true;
        this.profile = readCard.profile;

        if (!this.kioskApi) {
          this.profile = readCard.profile;
        }
      }

    });
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_VALIDATE_CUSTOMER_PAGE]);
  }

  setTransaction(customer: any): void {
    this.transaction.data.customer = this.mapCustomer(customer);
    if (this.transaction.transactionId) {
      this.pageLoadingService.closeLoading();
      this.router.navigate([ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_PAYMENT_DETAIL_PAGE]);
    } else {
      const transactionObject: any = this.validateCustomerService.buildTransaction({
        transaction: this.transaction,
        transactionType: TransactionType.DEVICE_ORDER_ASP_DEVICE_SHARE_PLAN // Share
      });

      this.transaction.transactionId = transactionObject.transactionId;
      this.transaction.issueBy = transactionObject.issueBy;
      this.transaction.createBy = transactionObject.create_by;
      this.transaction.createDate = transactionObject.createDate;
      this.validateCustomerService.createTransaction(transactionObject).then((response: any) => {
        this.pageLoadingService.closeLoading();
        if (response.data.isSuccess) {
          this.transaction = transactionObject;
          // this.createTransaction(transactionObject);
          this.router.navigate([ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_PAYMENT_DETAIL_PAGE]);
        } else {
          this.alertService.error('ระบบไม่สามารถแสดงข้อมูลได้ในขณะนี้');
        }
      }).catch((error: any) => {
        this.pageLoadingService.closeLoading();
        this.alertService.error(error);
      });
    }
  }

}

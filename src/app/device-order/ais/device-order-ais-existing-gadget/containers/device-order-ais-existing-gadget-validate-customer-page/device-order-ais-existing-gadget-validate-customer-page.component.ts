import { Component, OnInit, OnDestroy } from '@angular/core';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { TokenService, User, HomeService, AlertService, Utils, PageLoadingService } from 'mychannel-shared-libs';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { Transaction, TransactionAction, Customer, Order, TransactionType } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { ProfileFbb } from 'src/app/shared/models/profile-fbb.model';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { CustomerInfoService } from 'src/app/device-order/services/customer-info.service';
import { PrivilegeService } from 'src/app/device-order/services/privilege.service';
import { SharedTransactionService } from 'src/app/shared/services/shared-transaction.service';
import { ProfileFbbService } from 'src/app/shared/services/profile-fbb.service';
import { ROUTE_BUY_GADGET_CAMPAIGN_PAGE } from 'src/app/buy-gadget/constants/route-path.constant';
import { TranslateService } from '@ngx-translate/core';
import { ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_VALIDATE_CUSTOMER_ID_CARD_PAGE, ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_CUSTOMER_INFO_PAGE, ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_VALIDATE_IDENTIFY_PAGE, ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_CHANGE_PACKAGE_PAGE } from 'src/app/device-order/ais/device-order-ais-existing-gadget/constants/route-path.constant';
@Component({
  selector: 'app-device-order-ais-existing-gadget-validate-customer-page',
  templateUrl: './device-order-ais-existing-gadget-validate-customer-page.component.html',
  styleUrls: ['./device-order-ais-existing-gadget-validate-customer-page.component.scss']
})
export class DeviceOrderAisExistingGadgetValidateCustomerPageComponent implements OnInit, OnDestroy {

  wizards: any = WIZARD_DEVICE_ORDER_AIS;
  readonly PLACEHOLDER: string = '(หมายเลขโทรศัพท์ / เลขบัตรประชาชน / หมายเลข FBB)';
  readonly PLACEHOLDER_HEADDER: string = 'กรอกเอกสารแสดงตน';

  transaction: Transaction;
  priceOption: PriceOption;
  user: User;
  identityValid: boolean = false;
  identity: string;
  isFbbNo: boolean;

  profileFbb: ProfileFbb;

  constructor(
    private router: Router,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private tokenService: TokenService,
    private homeService: HomeService,
    private alertService: AlertService,
    private http: HttpClient,
    private utils: Utils,
    private pageLoadingService: PageLoadingService,
    private customerInfoService: CustomerInfoService,
    private privilegeService: PrivilegeService,
    private sharedTransactionService: SharedTransactionService,
    private profileFbbService: ProfileFbbService,
    private translateService: TranslateService

  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.profileFbb = this.profileFbbService.load();
    this.user = this.tokenService.getUser();
    if (this.transaction && this.transaction.data && this.transaction.data.order && this.transaction.data.order.soId) {
      this.homeService.callback = () => {
        this.alertService.question('ต้องการยกเลิกรายการขายหรือไม่ การยกเลิก ระบบจะคืนสินค้าเข้าสต๊อคสาขาทันที', 'ตกลง', 'ยกเลิก')
          .then((response: any) => {
            if (response.value === true) {
              this.returnStock().then(() => {
                this.transaction.data.order = {};
                this.transactionService.remove();
                window.location.href = '/';
              });
            }
          });
      };
    }
  }

  ngOnInit(): void {
  }

  private createTransaction(): void {
    this.transaction = {
      data: {
        transactionType: TransactionType.DEVICE_ORDER_EXISTING_GADGET_AIS,
        action: TransactionAction.KEY_IN,
      }
    };
  }

  onReadCard(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_VALIDATE_CUSTOMER_ID_CARD_PAGE]);
  }

  onCompleted(identity: string): void {
    this.identity = identity;
  }

  onError(valid: boolean): void {
    this.identityValid = valid;
  }

  checkFbbNo(identity: string): boolean {
    const REGEX_FBB_MOBILE = /^88[0-9]\d{7}$/;
    return REGEX_FBB_MOBILE.test(identity);
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    this.createTransaction();
    if (this.utils.isMobileNo(this.identity)) {
      // KEY-IN MobileNo
      this.transaction.data.action = TransactionAction.KEY_IN_MOBILE_NO;
      this.customerInfoService.getCustomerProfilePostpaidByMobileNo(this.identity).then((customer: Customer) => {
        return this.privilegeService.checkAndGetPrivilegeCodeAndCriteria(this.identity, this.priceOption.trade.ussdCode)
          .then((privligeCode) => {
            // if (privligeCode.errorMessage && privligeCode.errorMessage === 'MT_INVALID_CRITERIA_MAINPRO') {
            //   this.transaction.data.customer = customer;
            //   this.transaction.data.simCard = { mobileNo: this.identity };
            //   this.pageLoadingService.closeLoading();
            //   this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_CHANGE_PACKAGE_PAGE]);
            // } else {
            customer.privilegeCode = privligeCode;
            this.transaction.data.customer = customer;
            this.transaction.data.simCard = { mobileNo: this.identity };
            this.checkRoutePath();
            // }
          }).catch((error: any) => {
            this.alertService.warning(error);
            console.log('checkAndGetPrivilegeCodeAndCriteria error :', error);
          });
      }).catch((error: any) => {
        this.alertService.warning(error); // alert check mobileNo for postpaid only
        console.log('getCustomerProfilePostpaidByMobileNo error :', error);
      });
    } else if (this.checkFbbNo(this.identity)) {
      // KEY-IN FbbNo
      const body = {
        option: '3',
        mobileNo: this.identity
      };
      this.customerInfoService.queryFbbInfo(body).then((response: any) => {
        this.profileFbb = response;
        const fullName = (this.profileFbb.billingProfiles[0].caName || '').split(' ');
        this.transaction.data.action = TransactionAction.KEY_IN_FBB;
        return this.privilegeService.checkAndGetPrivilegeCode(this.identity, this.priceOption.trade.ussdCode).then((privilegeCode) => {
          this.transaction = {
            ...this.transaction,
            data: {
              ...this.transaction.data,
              customer: {
                ...this.transaction.data.customer,
                privilegeCode: privilegeCode,
                titleName: 'คุณ',
                firstName: fullName[0],
                lastName: fullName[1],
                caNumber: this.profileFbb.billingProfiles[0].caNo
              },
              simCard: {
                ...this.transaction.data.simCard,
                mobileNo: this.identity
              }
            }
          };
          this.checkRoutePath();
        });
      }).catch((error: any) => {
        this.pageLoadingService.closeLoading();
        this.alertService.error(error.error.resultDescription);
      });
    } else {
      const requestBody: any = {
        params: {
          identity: this.identity,
          transactionType: TransactionType.DEVICE_ORDER_EXISTING_AIS
        }
      };
      if (this.priceOption.trade && this.priceOption.trade.limitContract) {
        requestBody.params.limitContract = this.priceOption.trade.limitContract;
      }
      // KEY-IN ID-Card
      this.http.get('/api/customerportal/validate-customer-existing', requestBody).toPromise()
        .then((resp: any) => {
          const data = resp.data || {};
          return Promise.resolve(data);
        })
        .then((customer: Customer) => {
          if (customer && (customer.caNumber || customer.idCardType || customer.idCardNo)) {
            this.transaction.data.billingInformation = {};
            this.http.get(`/api/customerportal/newRegister/${this.identity}/queryBillingAccount`).toPromise()
              .then((resp: any) => {
                const data = resp.data || {};
                this.transaction.data.customer = customer;
                this.transaction.data.action = TransactionAction.KEY_IN;
                this.transaction.data.billingInformation = {
                  billCycles: data.billingAccountList,
                };
              }).then(() => {
                return this.conditionIdentityValid()
                  .catch((msg: string) => {
                    return this.alertService.error(this.translateService.instant(msg)).then(() => true);
                  })
                  .then((isError: boolean) => {
                    if (isError) {
                      this.onBack();
                      return;
                    }
                    this.returnStock().then(() => {
                      this.addDeviceSellingCart();
                    });
                  });
              });
          } else {
            this.pageLoadingService.closeLoading();
            this.alertService.warning('ไม่พบหมายเลขบัตรประชาชนนี้ในระบบ');
          }
        });
    }
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

  public addDeviceSellingCart(): void {
    this.http.post(
      '/api/salesportal/dt/add-cart-list',
      this.getRequestAddDeviceSellingCart()
    ).toPromise()
      .then((resp: any) => {
        if (resp.data && resp.data.resultCode === 'S') {
          this.transaction.data.order = { soId: resp.data.soId };
          this.sharedTransactionService.createSharedTransaction(this.transaction, this.priceOption);
          this.transaction.data.action = TransactionAction.KEY_IN;
          this.checkRoutePath();
        } else {
          const msg = resp.data && resp.data.resultMessage ? resp.data.resultMessage : 'ระบบไม่สามารถทำรายการได้ในขณะนี้';
          this.alertService.error(msg);
        }
      });
  }

  private checkRoutePath(): void {
    this.pageLoadingService.closeLoading();
    if (this.utils.isMobileNo(this.identity) || this.checkFbbNo(this.identity)) {
      // KEY-IN MobileNo or KEY-IN FbbNo
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_VALIDATE_IDENTIFY_PAGE]);
    } else {
      // KEY IN IDCARD
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_CUSTOMER_INFO_PAGE]);
    }
  }

  getRequestAddDeviceSellingCart(): any {
    const productStock = this.priceOption.productStock;
    const productDetail = this.priceOption.productDetail;
    const trade = this.priceOption.trade;
    const customer = this.transaction.data.customer;

    const product = {
      productType: productStock.productType ? productStock.productType : 'N/A',
      soCompany: productStock.company ? productStock.company : 'AWN',
      productSubType: productStock.productSubType ? productStock.productSubType : 'GADGET/IOT',
      brand: productDetail.brand || productStock.brand,
      model: productDetail.model || productStock.model,
      qty: '1',
      color: productStock.color || productStock.colorName,
      matCode: '',
      priceIncAmt: '' + trade.normalPrice,
      priceDiscountAmt: '' + trade.discount.amount,
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
      cusNameOrder: `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || '-',
      soChannelType: 'CSP',
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

  customerValidate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const length: number = control.value.length;
    const REGEX_FBB_MOBILE = /^88[0-9]\d{7}$/;
    const isFbbNo = REGEX_FBB_MOBILE.test(value);
    if (length >= 10) {
      if (length === 10) {
        if (this.utils.isMobileNo(value) || isFbbNo) {
          console.log('validate customer');
          return null;
        } else {
          return {
            message: 'กรุณากรอกหมายเลขโทรศัพท์ให้ถูกต้อง',
          };
        }
      } else if (length === 13) {
        if (this.utils.isThaiIdCard(value)) {
          return null;
        } else {
          return {
            message: 'กรุณากรอกเลขบัตรประชาชนให้ถูกต้อง',
          };
        }
      } else {
        return {
          message: 'กรุณากรอกรูปแบบให้ถูกต้อง',
        };
      }
    } else {
      return {
        message: 'กรุณากรอกรูปแบบให้ถูกต้อง',
      };
    }
  }

  returnStock(): Promise<void> {
    return new Promise(resolve => {
      const transaction = this.transactionService.load();
      const promiseAll = [];
      if (transaction && transaction.data) {
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

  onBack(): void {
    if (this.transaction && this.transaction.data && this.transaction.data.order && this.transaction.data.order.soId) {
      this.alertService.question('ต้องการยกเลิกรายการขายหรือไม่ การยกเลิก ระบบจะคืนสินค้าเข้าสต๊อคสาขาทันที', 'ตกลง', 'ยกเลิก')
        .then((response: any) => {
          if (response.value === true) {
            this.returnStock().then(() => {
              this.transaction.data.order = {};
              this.transactionService.remove();
              this.router.navigate([ROUTE_BUY_GADGET_CAMPAIGN_PAGE], { queryParams: this.priceOption.queryParams });
            });
          }
        });
    } else {
      this.transactionService.remove();
      this.router.navigate([ROUTE_BUY_GADGET_CAMPAIGN_PAGE], { queryParams: this.priceOption.queryParams });
    }
  }

  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
    this.profileFbbService.save(this.profileFbb);
  }
}

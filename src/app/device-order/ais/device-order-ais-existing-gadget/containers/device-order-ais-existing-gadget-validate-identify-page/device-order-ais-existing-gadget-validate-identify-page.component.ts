import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { User, HomeService, AlertService, PageLoadingService, TokenService, Utils } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { CustomerInfoService } from 'src/app/device-order/services/customer-info.service';
import { SharedTransactionService } from 'src/app/shared/services/shared-transaction.service';
import { Transaction, TransactionType } from 'src/app/shared/models/transaction.model';
import { TranslateService } from '@ngx-translate/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_VALIDATE_IDENTIFY_ID_CARD_PAGE, ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_VALIDATE_CUSTOMER_PAGE, ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_CUSTOMER_INFO_PAGE } from 'src/app/device-order/ais/device-order-ais-existing-gadget/constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-existing-gadget-validate-identify-page',
  templateUrl: './device-order-ais-existing-gadget-validate-identify-page.component.html',
  styleUrls: ['./device-order-ais-existing-gadget-validate-identify-page.component.scss']
})
export class DeviceOrderAisExistingGadgetValidateIdentifyPageComponent implements OnInit, OnDestroy {

  wizards: any = WIZARD_DEVICE_ORDER_AIS;
  readonly PLACEHOLDER: string = '(เลขบัตรประชาชน)';
  readonly PLACEHOLDER_HEADDER: string = 'กรอกเอกสารแสดงตน';

  transaction: Transaction;
  identityValid: boolean = false;
  identity: string;
  band: string;
  model: string;
  priceOption: PriceOption;
  user: User;
  constructor(
    private router: Router,
    private http: HttpClient,
    private homeService: HomeService,
    private alertService: AlertService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private customerInfoService: CustomerInfoService,
    private tokenService: TokenService,
    private utils: Utils,
    private sharedTransactionService: SharedTransactionService,
    private translateService: TranslateService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.user = this.tokenService.getUser();
    this.homeService.callback = () => {
      this.alertService.question('ต้องการยกเลิกรายการขายหรือไม่ การยกเลิก ระบบจะคืนสินค้าเข้าสต๊อคสาขาทันที', 'ตกลง', 'ยกเลิก')
        .then((response: any) => {
          if (response.value === true) {
            this.returnStock().then(() => {
              this.transactionService.remove();
              window.location.href = '/';
            });
          }
        });
    };
  }

  ngOnInit(): void {
  }

  onError(valid: boolean): void {
    this.identityValid = valid;
  }

  onCompleted(identity: string): void {
    this.identity = identity;
  }

  onReadCard(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_VALIDATE_IDENTIFY_ID_CARD_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_VALIDATE_CUSTOMER_PAGE]);
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    const mobileNo = this.transaction.data.simCard.mobileNo;
    this.customerInfoService.verifyPrepaidIdent(this.identity, mobileNo).then((verifySuccess: boolean) => {
      if (verifySuccess) {
        const requestBody: any = {
          params: {
            identity: this.identity,
            transactionType: TransactionType.DEVICE_ORDER_EXISTING_AIS,
            limitContract: this.priceOption.trade.limitContract
          }
        };
        if (this.priceOption.trade && this.priceOption.trade.limitContract) {
          requestBody.params.limitContract = this.priceOption.trade.limitContract;
        }
        this.http.get('/api/customerportal/validate-customer-existing', requestBody).toPromise()
          .then((resp: any) => {
            const data = resp.data || {};
            return Promise.resolve(data);
          })
          .then((customerInfo: any) => {
            if (customerInfo.caNumber) {
              this.transaction.data.customer = { ...this.transaction.data.customer, ...customerInfo };
            } else {
              const privilege = this.transaction.data.customer.privilegeCode;
              this.transaction.data.customer = null;
              this.transaction.data.customer = customerInfo;
              this.transaction.data.customer.privilegeCode = privilege;
            }
            this.setShippingInfo(this.transaction.data.customer);
            this.transaction.data.billingInformation = {};
            this.http.get(`/api/customerportal/newRegister/${this.identity}/queryBillingAccount`).toPromise()
              .then((resp: any) => {
                const data = resp.data || {};
                this.transaction.data.billingInformation = {
                  billCycles: data.billingAccountList
                };

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
                      return this.http.post(
                        '/api/salesportal/dt/add-cart-list',
                        this.getRequestAddDeviceSellingCart()
                      ).toPromise()
                        .then((response: any) => {
                          if (response.data && response.data.resultCode === 'S') {
                            this.transaction.data.order = { soId: response.data.soId };
                            this.sharedTransactionService.createSharedTransaction(this.transaction, this.priceOption);
                            this.pageLoadingService.closeLoading();
                            this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_CUSTOMER_INFO_PAGE]);
                          } else {
                            const msg = response.data && response.data.resultMessage ? response.data.resultMessage
                              : 'ระบบไม่สามารถทำรายการได้ในขณะนี้';
                            this.alertService.error(msg);
                          }
                        });
                    });
                  });
              });
          });
      } else {
        this.pageLoadingService.closeLoading();
        this.alertService.error('ไม่สามารถทำรายการได้ ข้อมูลการแสดงตนไม่ถูกต้อง');
      }
    });
  }

  setShippingInfo(customer: any): void {
    this.transaction.data.shippingInfo = {
      titleName: 'คุณ',
      firstName: customer.firstName,
      lastName: customer.lastName,
      homeNo: customer.homeNo || '',
      moo: customer.moo || '',
      mooBan: customer.mooBan || '',
      room: customer.room || '',
      floor: customer.floor || '',
      buildingName: customer.buildingName || '',
      soi: customer.soi || '',
      street: customer.street || '',
      tumbol: customer.tumbol,
      amphur: customer.amphur,
      province: customer.province,
      zipCode: customer.zipCode,
      telNo: ''
    };
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
    const trade = this.priceOption.trade;

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

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

  customerValidate(control: AbstractControl): ValidationErrors {
    const value = control.value;
    const length: number = control.value.length;

    if (length === 13) {
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
}

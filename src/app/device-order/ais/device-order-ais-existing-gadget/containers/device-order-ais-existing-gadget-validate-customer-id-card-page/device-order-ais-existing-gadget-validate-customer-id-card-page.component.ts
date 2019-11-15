import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ValidateCustomerIdCardComponent, ReadCardProfile, User, HomeService, PageLoadingService, AlertService, TokenService, Utils } from 'mychannel-shared-libs';
import { Transaction, Customer, TransactionAction, TransactionType } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { CustomerInfoService } from 'src/app/device-order/services/customer-info.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { SharedTransactionService } from 'src/app/shared/services/shared-transaction.service';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_CUSTOMER_INFO_PAGE, ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_VALIDATE_CUSTOMER_PAGE } from 'src/app/device-order/ais/device-order-ais-existing-gadget/constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-existing-gadget-validate-customer-id-card-page',
  templateUrl: './device-order-ais-existing-gadget-validate-customer-id-card-page.component.html',
  styleUrls: ['./device-order-ais-existing-gadget-validate-customer-id-card-page.component.scss']
})
export class DeviceOrderAisExistingGadgetValidateCustomerIdCardPageComponent implements OnInit, OnDestroy {

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
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private alertService: AlertService,
    private customerInfoService: CustomerInfoService,
    private priceOptionService: PriceOptionService,
    private sharedTransactionService: SharedTransactionService,
    private tokenService: TokenService,
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

  private createTransaction(): void {
    this.transaction = {
      data: {
        transactionType: TransactionType.DEVICE_ORDER_EXISTING_GADGET_AIS,
        action: TransactionAction.READ_CARD,
      }
    };
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
      this.alertService.error('ไม่สามารถอ่านบัตรประชาชนได้ กรุณาติดต่อพนักงาน');
    }
  }

  onCompleted(profile: ReadCardProfile): void {
    this.profile = profile;
  }

  onNext(): void {
    this.createTransaction();
    this.pageLoadingService.openLoading();
    this.returnStock().then(() => {
      this.getZipCode(this.profile.province, this.profile.amphur, this.profile.tumbol)
        .then((zipCode: string) => {
          const requestBody: any = {
            params: {
              identity: this.profile.idCardNo,
              idCardType: this.profile.idCardType,
              transactionType: TransactionType.DEVICE_ORDER_EXISTING_AIS
            }
          };
          if (this.priceOption.trade && this.priceOption.trade.limitContract) {
            requestBody.params.limitContract = this.priceOption.trade.limitContract;
          }
          return this.http.get('/api/customerportal/validate-customer-existing', requestBody).toPromise()
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
        .then((customer: any) => { // load bill cycle
          if (customer && (customer.caNumber || customer.idCardType || customer.idCardNo)) {
            this.transaction.data.customer = Object.assign(this.profile, customer);
            return this.http.get(`/api/customerportal/newRegister/${this.profile.idCardNo}/queryBillingAccount`).toPromise()
              .then((resp: any) => {
                const data = resp.data || {};
                return {
                  billCycles: data.billingAccountList
                };
              }).then((billingInformation: any) => {
                this.transaction.data.billingInformation = billingInformation;
                return this.conditionIdentityValid().catch((msg: string) => {
                  return this.alertService.error(this.translateService.instant(msg)).then(() => true);
                }).then((isError: boolean) => {
                  if (isError) {
                    this.onBack();
                    return;
                  }
                  return this.http.post(
                    '/api/salesportal/dt/add-cart-list',
                    this.getRequestAddDeviceSellingCart()
                  ).toPromise().then((response: any) => {
                    this.transaction.data.order = { soId: response.data.soId };
                    return this.sharedTransactionService.createSharedTransaction(this.transaction, this.priceOption);
                  }).then(() => {
                    this.pageLoadingService.closeLoading();
                    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_CUSTOMER_INFO_PAGE]);
                  });
                });
              });
          } else {
            this.pageLoadingService.closeLoading();
            this.alertService.warning('ไม่พบหมายเลขบัตรประชาชนนี้ในระบบ');
          }
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

  onHome(): void {
    this.homeService.goToHome();
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_VALIDATE_CUSTOMER_PAGE]);
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
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
}

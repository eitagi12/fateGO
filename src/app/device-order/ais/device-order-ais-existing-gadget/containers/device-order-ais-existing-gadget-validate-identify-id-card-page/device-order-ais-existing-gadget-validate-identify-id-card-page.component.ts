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
import {
  ROUTE_DEVICE_ORDER_AIS_GADGET_EXISTING_CUSTOMER_INFO_PAGE,
  ROUTE_DEVICE_ORDER_AIS_GADGET_EXISTING_VALIDATE_IDENTIFY_PAGE
} from 'src/app/device-order/ais/device-order-ais-existing-gadget/constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-existing-gadget-validate-identify-id-card-page',
  templateUrl: './device-order-ais-existing-gadget-validate-identify-id-card-page.component.html',
  styleUrls: ['./device-order-ais-existing-gadget-validate-identify-id-card-page.component.scss']
})

export class DeviceOrderAisExistingGadgetValidateIdentifyIdCardPageComponent implements OnInit, OnDestroy {

  kioskApi: boolean;

  transaction: Transaction;
  profile: ReadCardProfile;
  zipcode: string;
  readCardValid: boolean;
  priceOption: PriceOption;
  user: User;
  billDeliveryAddress: Customer;
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
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    this.transaction.data.action = TransactionAction.READ_CARD;
    this.transaction.data.customer = this.profile;
    this.customerInfoService.getProvinceId(this.profile.province).then((provinceId: string) => {
      return this.customerInfoService.getZipCode(provinceId, this.profile.amphur, this.profile.tumbol)
        .then((zipCode: string) => {
          return this.http.get('/api/customerportal/validate-customer-existing', {
            params: {
              identity: this.profile.idCardNo,
              idCardType: this.profile.idCardType,
              transactionType: TransactionType.DEVICE_ORDER_EXISTING_GADGET_AIS
            }
          }).toPromise()
            .then((resp: any) => {
              const data = resp.data || {};
              return Promise.resolve(data);
            })
            .then((customer: Customer) => {
              console.log('customerd', customer);
              return {
                caNumber: customer.caNumber,
                mainMobile: customer.mainMobile,
                billCycle: customer.billCycle,
                zipCode: zipCode
              };
            }).catch(() => {
              return { zipCode: zipCode };
            });
        }).then((customer: any) => {
          if (customer.caNumber) {
            this.transaction.data.customer = { ...this.profile, ...customer };
          } else {
            this.transaction.data.customer.zipCode = customer.zipCode;
          }
          this.transaction.data.billingInformation = {};
          this.http.get(`/api/customerportal/newRegister/${this.profile.idCardNo}/queryBillingAccount`).toPromise()
            .then((resp: any) => {
              const data = resp.data || {};
              this.transaction.data.billingInformation = {
                billCycles: data.billingAccountList,
                billDeliveryAddress: this.transaction.data.customer
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
                  if (this.transaction.data.order && this.transaction.data.order.soId) {
                    this.pageLoadingService.closeLoading();
                    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_GADGET_EXISTING_CUSTOMER_INFO_PAGE]);
                    return;
                  } else {
                    return this.http.post('/api/salesportal/add-device-selling-cart',
                      this.getRequestAddDeviceSellingCart()
                    ).toPromise().then((response: any) => {
                      this.transaction.data.order = { soId: response.data.soId };
                      return this.sharedTransactionService.createSharedTransaction(this.transaction, this.priceOption);
                    }).then(() => {
                      this.pageLoadingService.closeLoading();
                      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_GADGET_EXISTING_CUSTOMER_INFO_PAGE]);
                    });
                  }
                });
            });
        });
    }).then(() => this.pageLoadingService.closeLoading())
      .catch((e) => this.ErrorMessage());

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
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_GADGET_EXISTING_VALIDATE_IDENTIFY_PAGE]);
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

  getRequestAddDeviceSellingCart(): any {
    const productStock = this.priceOption.productStock;
    const productDetail = this.priceOption.productDetail;
    const customer = this.transaction.data.customer;
    const trade = this.priceOption.trade;
    return {
      soCompany: productStock.company ? productStock.company : 'AWN',
      locationSource: this.user.locationCode,
      locationReceipt: this.user.locationCode,
      productType: productStock.productType ? productStock.productType : 'N/A',
      productSubType: productStock.productSubType ? productStock.productSubType : 'GADGET/IOT',
      brand: productDetail.brand || productStock.brand,
      model: productDetail.model || productStock.model,
      color: productStock.color || productStock.colorName,
      priceIncAmt: '' + trade.normalPrice,
      priceDiscountAmt: '' + trade.discount.amount,
      grandTotalAmt: '',
      userId: this.user.username,
      cusNameOrder: `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || '-',
    };
  }

  ErrorMessage(): (reason: any) => void | PromiseLike<void> {
    return (err: any) => {
      this.handleErrorMessage(err);
    };
  }

  handleErrorMessage(err: any): void {
    this.pageLoadingService.closeLoading();
    const error = err.error || {};
    const developerMessage = (error.errors || {}).developerMessage;
    this.alertService.error((developerMessage && error.resultDescription)
      ? `${developerMessage} ${error.resultDescription}` : `ระบบไม่สามารถแสดงข้อมูลได้ในขณะนี้`);
  }
}

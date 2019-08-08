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
        this.http.get('/api/customerportal/validate-customer-existing', {
          params: {
            identity: this.identity,
            transactionType: TransactionType.DEVICE_ORDER_EXISTING_GADGET_AIS
          }
        }).toPromise()
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
            this.transaction.data.billingInformation = {};
            this.http.get(`/api/customerportal/newRegister/${this.identity}/queryBillingAccount`).toPromise()
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
                    if (!this.transaction.data.order || !this.transaction.data.order.soId) {
                      return this.http.post('/api/salesportal/add-device-selling-cart',
                        this.getRequestAddDeviceSellingCart()
                      ).toPromise()
                        .then((response: any) => {
                          this.transaction.data.order = { soId: response.data.soId };
                          return this.sharedTransactionService.createSharedTransaction(this.transaction, this.priceOption);
                        }).then(() => {
                          this.pageLoadingService.closeLoading();
                          this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_CUSTOMER_INFO_PAGE]);
                        });
                    } else {
                      this.pageLoadingService.closeLoading();
                      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_CUSTOMER_INFO_PAGE]);
                    }
                  });
              });
          });
      } else {
        this.pageLoadingService.closeLoading();
        this.alertService.error('ไม่สามารถทำรายการได้ ข้อมูลการแสดงตนไม่ถูกต้อง');
      }
    }).catch(() => this.ErrorMessage());
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
    const trade = this.priceOption.trade;
    const customer = this.transaction.data.customer;

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

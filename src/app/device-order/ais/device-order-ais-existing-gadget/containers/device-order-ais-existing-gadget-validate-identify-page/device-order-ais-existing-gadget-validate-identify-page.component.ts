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
import { Transaction, TransactionAction } from 'src/app/shared/models/transaction.model';
import { ROUTE_DEVICE_ORDER_AIS_GADGET_VALIDATE_CUSTOMER_ID_CARD_PAGE, ROUTE_DEVICE_ORDER_AIS_GADGET_CUSTOMER_INFO_PAGE } from 'src/app/device-order/ais/device-order-ais-existing-gadget/constants/route-path.constant';
import { AbstractControl, ValidationErrors } from '@angular/forms';

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
    this.transaction.data.action = TransactionAction.READ_CARD_PI;
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_GADGET_VALIDATE_CUSTOMER_ID_CARD_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onBack(): void {
    this.router.navigate([]);
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    const mobileNo = this.transaction.data.simCard.mobileNo;
    this.customerInfoService.verifyPrepaidIdent(this.identity, mobileNo).then((verifySuccess: boolean) => {
      if (verifySuccess) {
        return this.customerInfoService.getCustomerInfoByIdCard(this.identity).then((customerInfo: any) => {
          if (customerInfo.caNumber) {
            this.transaction.data.customer = { ...this.transaction.data.customer, ...customerInfo };
          } else {
            const privilege = this.transaction.data.customer.privilegeCode;
            this.transaction.data.customer = null;
            this.transaction.data.customer = customerInfo;
            this.transaction.data.customer.privilegeCode = privilege;
          }
          this.transaction.data.billingInformation = {};
          this.transaction.data.billingInformation.billDeliveryAddress = this.transaction.data.customer;

          if (!this.transaction.data.order || !this.transaction.data.order.soId) {
            return this.http.post('/api/salesportal/add-device-selling-cart',
              this.getRequestAddDeviceSellingCart()
            ).toPromise()
              .then((resp: any) => {
                this.transaction.data.order = { soId: resp.data.soId };
                return this.sharedTransactionService.createSharedTransaction(this.transaction, this.priceOption);
              }).then(() => {
                this.transaction.data.action = TransactionAction.KEY_IN;
                this.pageLoadingService.closeLoading();
                this.router.navigate([ROUTE_DEVICE_ORDER_AIS_GADGET_CUSTOMER_INFO_PAGE]);
              });
          } else {
            this.pageLoadingService.closeLoading();
            this.router.navigate([ROUTE_DEVICE_ORDER_AIS_GADGET_CUSTOMER_INFO_PAGE]);
          }
        });
      } else {
        this.pageLoadingService.closeLoading();
        this.alertService.error('ไม่สามารถทำรายการได้ ข้อมูลการแสดงตนไม่ถูกต้อง');
      }
    }).catch(() => this.alertService.error('ไม่สามารถทำรายการได้ ข้อมูลการแสดงตนไม่ถูกต้อง'));
  }

  getRequestAddDeviceSellingCart(): any {
    const productStock = this.priceOption.productStock;
    const productDetail = this.priceOption.productDetail;
    const trade = this.priceOption.trade;
    const customer = this.transaction.data.customer;

    return {
      soCompany: productStock.company || 'AWN',
      locationSource: this.user.locationCode,
      locationReceipt: this.user.locationCode,
      productType: productDetail.productType || ' -*',
      productSubType: productDetail.productSubType || 'N/A',
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

}

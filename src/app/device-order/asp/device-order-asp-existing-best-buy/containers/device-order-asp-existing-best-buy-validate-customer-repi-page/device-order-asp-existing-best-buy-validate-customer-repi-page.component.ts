import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { HomeService, PageLoadingService, AlertService, TokenService, User, Utils } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { WIZARD_DEVICE_ORDER_AIS, WIZARD_DEVICE_ORDER_ASP } from 'src/app/device-order/constants/wizard.constant';
import { Transaction, TransactionAction, Prebooking } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { ROUTE_DEVICE_ORDER_ASP_BEST_BUY_VALIDATE_CUSTOMER_ID_CARD_RPI_PAGE, ROUTE_DEVICE_ORDER_ASP_BEST_BUY_MOBILE_DETAIL_PAGE, ROUTE_DEVICE_ORDER_ASP_BEST_BUY_CUSTOMER_INFO_PAGE, ROUTE_DEVICE_ORDER_ASP_BEST_BUY_CUSTOMER_PROFILE_PAGE, ROUTE_DEVICE_ORDER_ASP_BEST_BUY_PAYMENT_DETAIL_PAGE } from '../../constants/route-path.constant';
import { SharedTransactionService } from 'src/app/shared/services/shared-transaction.service';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { CustomerInfoService } from 'src/app/device-order/services/customer-info.service';

@Component({
  selector: 'app-device-order-asp-existing-best-buy-validate-customer-repi-page',
  templateUrl: './device-order-asp-existing-best-buy-validate-customer-repi-page.component.html',
  styleUrls: ['./device-order-asp-existing-best-buy-validate-customer-repi-page.component.scss']
})
export class DeviceOrderAspExistingBestBuyValidateCustomerRepiPageComponent implements OnInit, OnDestroy {

  isTelewiz: boolean = this.tokenService.isTelewizUser();
  wizards: any = this.isTelewiz ? WIZARD_DEVICE_ORDER_ASP : WIZARD_DEVICE_ORDER_AIS;
  active: number = this.isTelewiz ? 3 : 2;
  readonly PLACEHOLDER: string = '(เลขบัตรประชาชน)';
  readonly PLACEHOLDER_HEADDER: string = 'กรอกเอกสารแสดงตน';

  transaction: Transaction;
  identityValid: boolean = false;
  identity: string;
  band: string;
  model: string;
  priceOption: PriceOption;
  user: User;
  validateCustomerForm: FormGroup;

  constructor(
    private router: Router,
    private http: HttpClient,
    private utils: Utils,
    private homeService: HomeService,
    private alertService: AlertService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private customerInfoService: CustomerInfoService,
    private sharedTransactionService: SharedTransactionService,
    private tokenService: TokenService,
    private fb: FormBuilder
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.user = this.tokenService.getUser();
  }

  ngOnInit(): void {
    this.transaction.data.action = TransactionAction.KEY_IN_REPI;
    if (this.isTelewiz) {
      this.createForm();
    }
  }

  onError(valid: boolean): void {
    this.identityValid = valid;
  }

  onCompleted(identity: string): void {
    this.identity = identity;
  }

  onReadCard(): void {
    this.transaction.data.action = TransactionAction.READ_CARD_REPI;
    this.router.navigate([ROUTE_DEVICE_ORDER_ASP_BEST_BUY_VALIDATE_CUSTOMER_ID_CARD_RPI_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_ASP_BEST_BUY_MOBILE_DETAIL_PAGE]);
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    const mobileNo = this.transaction.data.simCard.mobileNo;
    this.transaction.data.customer.repi = true;
    this.customerInfoService.verifyPrepaidIdent(this.identity, mobileNo).then((verifySuccess: boolean) => {
      if (verifySuccess) {
        return this.customerInfoService.getCustomerInfoByIdCard(this.identity).then((customerInfo: any) => {
          if (customerInfo.caNumber) {
            this.transaction.data.customer = { ...this.transaction.data.customer, ...customerInfo };
          } else {
            const privilege = this.transaction.data.customer.privilegeCode;
            const repi = this.transaction.data.customer.repi;
            this.transaction.data.customer = null;
            this.transaction.data.customer = customerInfo;
            this.transaction.data.customer.privilegeCode = privilege;
            this.transaction.data.customer.repi = repi;
          }
          this.transaction.data.billingInformation = {};
          this.transaction.data.billingInformation.billDeliveryAddress = this.transaction.data.customer;

          this.pageLoadingService.closeLoading();
          if (customerInfo.caNumber) {
            this.router.navigate([ROUTE_DEVICE_ORDER_ASP_BEST_BUY_CUSTOMER_INFO_PAGE]);
          } else {
            this.router.navigate([ROUTE_DEVICE_ORDER_ASP_BEST_BUY_PAYMENT_DETAIL_PAGE]);
          }
        });
      } else {
        const simCard = this.transaction.data.simCard;
        if (simCard.chargeType === 'Pre-paid') {
          this.customerInfoService.getCustomerInfoByIdCard(this.identity).then((customerInfo: any) => {
            if (customerInfo.caNumber) {
              this.transaction.data.customer = { ...this.transaction.data.customer, ...customerInfo };
            } else {
              const privilege = this.transaction.data.customer.privilegeCode;
              const repi = this.transaction.data.customer.repi;
              this.transaction.data.customer = null;
              this.transaction.data.customer = customerInfo;
              this.transaction.data.customer.privilegeCode = privilege;
              this.transaction.data.customer.repi = repi;
            }
            this.transaction.data.billingInformation = {};
            this.transaction.data.billingInformation.billDeliveryAddress = this.transaction.data.customer;

            this.pageLoadingService.closeLoading();
            this.router.navigate([ROUTE_DEVICE_ORDER_ASP_BEST_BUY_CUSTOMER_PROFILE_PAGE]);
          });
        } else {
          // .then(() => this.pageLoadingService.closeLoading());
          this.pageLoadingService.closeLoading();
          this.alertService.error('ไม่สามารถทำรายการได้ เบอร์รายเดือน ข้อมูลการแสดงตนไม่ถูกต้อง');
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

  createForm(): void {
    // nobileNo use pattern
    this.validateCustomerForm = this.fb.group({
      identity: ['', [Validators.required, this.customerValidate.bind(this)]],
    });

    this.validateCustomerForm.valueChanges.pipe(debounceTime(750))
      .subscribe((value: any) => {
        this.identityValid = this.validateCustomerForm.valid;
        if (this.validateCustomerForm.valid) {
          this.identity = value.identity;
        }
      });
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

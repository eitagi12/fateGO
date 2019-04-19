import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { HomeService, PageLoadingService, AlertService, User, TokenService, Utils } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { Transaction, Customer, TransactionAction, Prebooking } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { ROUTE_DEVICE_ORDER_AIS_BEST_BUY_MOBILE_DETAIL_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_PAYMENT_DETAIL_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CUSTOMER_INFO_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CUSTOMER_PROFILE_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_VALIDATE_CUSTOMER_ID_CARD_RPI_PAGE } from 'src/app/device-order/ais/device-order-ais-existing-best-buy/constants/route-path.constant';
import { CustomerInfoService } from '../../services/customer-info.service';
import { SharedTransactionService } from 'src/app/shared/services/shared-transaction.service';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-device-order-ais-existing-best-buy-validate-customer-repi-page',
  templateUrl: './device-order-ais-existing-best-buy-validate-customer-repi-page.component.html',
  styleUrls: ['./device-order-ais-existing-best-buy-validate-customer-repi-page.component.scss']
})
export class DeviceOrderAisExistingBestBuyValidateCustomerRepiPageComponent implements OnInit, OnDestroy {

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
    private sharedTransactionService: SharedTransactionService,
    private tokenService: TokenService,
    private utils: Utils
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.user = this.tokenService.getUser();
  }

  ngOnInit(): void {
    this.transaction.data.action = TransactionAction.KEY_IN_REPI;
  }

  onError(valid: boolean): void {
    this.identityValid = valid;
  }

  onCompleted(identity: string): void {
    this.identity = identity;
  }

  onReadCard(): void {
    this.transaction.data.action = TransactionAction.READ_CARD_REPI;
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_VALIDATE_CUSTOMER_ID_CARD_RPI_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_MOBILE_DETAIL_PAGE]);
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
          const addressCustomer = this.transaction.data.customer;
          this.transaction.data.billingInformation.billDeliveryAddress = addressCustomer;

          this.pageLoadingService.closeLoading();
          if (customerInfo.caNumber) {
            this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CUSTOMER_INFO_PAGE]);
          } else {
            this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_PAYMENT_DETAIL_PAGE]);
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
            this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CUSTOMER_PROFILE_PAGE]);
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

import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Transaction, TransactionAction } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { CustomerInfoService } from 'src/app/device-order/services/customer-info.service';
import { User, HomeService, AlertService, PageLoadingService, TokenService, Utils } from 'mychannel-shared-libs';

@Component({
  selector: 'app-device-order-ais-existing-gadget-validate-customer-pi-page',
  templateUrl: './device-order-ais-existing-gadget-validate-customer-pi-page.component.html',
  styleUrls: ['./device-order-ais-existing-gadget-validate-customer-pi-page.component.scss']
})
export class DeviceOrderAisExistingGadgetValidateCustomerPiPageComponent implements OnInit, OnDestroy {

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
    private utils: Utils
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
    this.router.navigate([]);
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
          this.pageLoadingService.closeLoading();
          if (customerInfo.caNumber) {
            this.router.navigate([]);
          } else {
            this.router.navigate([]);
          }
        });
      } else {
        this.pageLoadingService.closeLoading();
        this.alertService.error('ไม่สามารถทำรายการได้ ข้อมูลการแสดงตนไม่ถูกต้อง');
      }
    }).catch(() => this.alertService.error('ไม่สามารถทำรายการได้ ข้อมูลการแสดงตนไม่ถูกต้อง'));
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

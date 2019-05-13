import { Component, OnInit, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { TransactionType, TransactionAction, Transaction, Customer } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { User, ApiRequestService, TokenService, AlertService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { CreateDeviceOrderService } from 'src/app/deposit-summary/services/create-device-order.service';
import { Router } from '@angular/router';
import { DEPOSIT_PAYMENT_SUMMARY_PAGE, DEPOSIT_PAYMENT_DETAIL_KEY_IN } from 'src/app/deposit-summary/constants/route-path.constant';
import { WIZARD_RESERVE_WITH_DEPOSIT } from 'src/app/deposit-summary/constants/wizard.constant';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocalStorageService } from 'ngx-store';
import { BillingAddressService } from 'src/app/deposit-summary/services/billing-address.service';
import { DepositSummaryServicesService } from 'src/app/deposit-summary/services/deposit-summary-services.service';
import { MessageConfigService } from 'src/app/deposit-summary/services/message-config.service';
import { CASH_PAYMENT, CREDIT_CARD_PAYMENT, CASH_AND_CREDIT_CARD_PAYMENT } from '../deposit-payment-page/deposit-payment-page.component';
import { LANGUAGE, RESERVE_STOCK, ERROR_MESSAGE } from 'src/app/deposit-summary/constants/message-config.constant';

@Component({
  selector: 'app-deposit-payment-receipt-page',
  templateUrl: './deposit-payment-receipt-page.component.html',
  styleUrls: ['./deposit-payment-receipt-page.component.scss']
})
export class DepositPaymentReceiptPageComponent implements OnInit {
  @Input() customerInfoTemp: any;
  @Output() completed: EventEmitter<any> = new EventEmitter<any>();
  @Output() error: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() action: EventEmitter<string> = new EventEmitter<string>();
  @Input() clearCustomerAddressForm: any;

  customerInfo: any;
  searchByMobileNoForm: FormGroup;
  receiptInfoForm: FormGroup;
  billingAddressForm: FormGroup;
  customerAddress: any;
  isShowInputForKeyIn: boolean;
  titleName: any;
  provinces: any;
  allZipCodes: any;
  amphurs: any;
  tumbols: any;
  zipCode: any;
  nameText: string;
  billingAddressText: string;
  keyInCustomerAddressTemp: any;
  wizards: any = WIZARD_RESERVE_WITH_DEPOSIT;
  transaction: Transaction;
  priceOption: PriceOption;
  productImage: String;
  formID: String;
  paymentDetail: any;
  selectPaymentDetail: any;
  paymentDetailOption: any;
  paymentForm: FormGroup;
  discountForm: FormGroup;
  paymentMethod: string;
  customer: Customer;
  customerFullName: string;
  customerFullAddress: string;
  idCardNo: string;
  colorCodeStyle: any;
  priceOptionPayment: any;
  priceOptionBank: any;
  selectedMobile: string;
  locationNameTH: string;
  receiptCustomerAddress: string;
  otherPhoneNumber: string;
  isDisabled: boolean;
  isReceiptInformationValid: boolean;

  constructor(
    private localStorageService: LocalStorageService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private billingAddress: BillingAddressService,
    private depositSummaryServicesService: DepositSummaryServicesService,
    private apiRequestService: ApiRequestService,
    private messageConfigService: MessageConfigService,
    private fb: FormBuilder,
    private router: Router,
    private alertService: AlertService,
    private createDeviceOrderService: CreateDeviceOrderService,
    private tokenService: TokenService
  ) {
    this.billingAddress.getTitleName().then(this.responseTitleNames());
   // this.billingAddress.getProvinces().then(this.responseProvinces());
    this.billingAddress.getZipCodes().then(this.responseZipCodes());
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void {
    this.getMessageConfig();
    // this.customerFlag = this.localStorageService.load('CustomerFlag').value;
    // this.formID = this.getRandomNum(10);
    this.transaction = {
      transactionId: this.apiRequestService.getCurrentRequestId(),
      data: {
        transactionType: TransactionType.RESERVE_WITH_DEPOSIT,
        customer: this.localStorageService.load('CustomerProfile').value,
        action: TransactionAction.KEY_IN
      }
    };
    this.priceOption = {
      trade: this.localStorageService.load('reserveProductInfo').value
    };
    // this.createForm();
    this.selectedMobile = this.transaction.data.customer.selectedMobile;
    // this.locationNameTH = this.transaction.data.customer.selectedLocation.locationNameTH;
  // this.onProvince('');
  }

  OnDestroy(): void {
    this.transaction.data.payment = {
      paymentMethod: this.paymentMethod,
      selectPaymentDetail: this.selectPaymentDetail
    };
    this.transaction.data.customer.shipaddress = {
      shipCusAddr: this.customerFullAddress,
      shipCusName: this.customerFullName
    };
    this.transaction.data.customer.otherPhoneNumber = this.otherPhoneNumber;
    this.transactionService.save(this.transaction);
    this.priceOptionService.save(this.priceOption);
  }

  private async getMessageConfig(): Promise<void> {
    await this.messageConfigService.getMsgConfigByModuleName(LANGUAGE.TH, RESERVE_STOCK.MODULE_NAME).then(async(res: any) => {
      await this.messageConfigService.setMessageConfig(res.data);
    },
    (error: any) => {
      this.alertService.error(ERROR_MESSAGE.DEFAULT);
    });
  }

  onProvince(params: any): void {
    const province = this.findProvinceByName(this.transaction.data.customer.province);
    console.log('province==', province);
    const req = {
      provinceId: province.id,
      zipcode: params.zipCode
    };
    if (!params.zipCode) {
      delete req.zipcode;
    }
    this.billingAddress.getAmphurs(req).then(this.responseAmphur());
  }

  onProvinceSelected(params: any): void {
    const province = this.findProvinceByName(params.provinceName);
    const req = {
      provinceId: province.id,
      zipcode: params.zipCode
    };
    if (!params.zipCode) {
      delete req.zipcode;
    }
    this.billingAddress.getAmphurs(req).then(this.responseAmphur());
  }

  onAmphurSelected(params: any): void {
    const province = this.findProvinceByName(params.provinceName);
    const req = {
      provinceId: province.id,
      amphurName: params.amphurName,
      zipcode: params.zipCode
    };
    if (!params.zipCode) {
      delete req.zipcode;
    }
    this.billingAddress.getTumbols(req).then(this.responseTumbols());
  }

  onTumbolSelected(params: any): void {
    const province = this.findProvinceByName(params.provinceName);
    const req = {
      provinceId: province.id,
      amphurName: params.amphurName,
      tumbolName: params.tumbolName
    };
    this.billingAddress.queryZipCode(req).then(this.responseZipCode());
  }

  onZipCodeSelected(zipCode: string): void {
    this.billingAddress.getProvinceIdByZipCode(zipCode).then(provinceId => {
      const province = this.findProvinceByProvinceID(provinceId);
      if (!province) { return; }
      this.assignProvinceAndZipCode(province, zipCode);
    });
  }

  onCompleted(value: any): void {
    this.receiptInfoForm.controls['taxId'].setValue(value.idCardNo);
  }

  onError(error: boolean): void {
    this.isReceiptInformationValid = error;
  }

  isNotFormValid(): boolean {
    return !(this.isReceiptInformationValid);
  }
  private assignProvinceAndZipCode(province: any, zipCode: string): void {
    this.customerAddress = Object.assign(Object.assign({}, this.customerAddress), {
      province: province.name,
      zipCode: zipCode
    });
  }

  private findProvinceByName(provinceName: string): any {
    return (this.provinces || []).find((prov: any) => prov.name === provinceName) || {};
  }

  private findProvinceByProvinceID(provinceId: string): any {
    return this.provinces.find((prov: any) => prov.id === provinceId);
  }

  public getProvinces(): string[] {
    return (this.provinces || []).map((province: any) => province.name);
  }

  private responseTitleNames(): (value: any) => any {
    return (resp: string[]) => this.titleName = resp;
  }

  private responseZipCode(): (value: any) => any {
    return (resp: any) => this.zipCode = resp;
  }

  private responseTumbols(): (value: any) => any {
    return (resp: string[]) => this.tumbols = resp;
  }

  private responseAmphur(): (value: any) => any {
    return (resp: string[]) => this.amphurs = resp;
  }

  private responseZipCodes(): (value: any) => any {
    return (resp: string[]) => this.allZipCodes = resp;
  }

  private responseProvinces(): (value: any) => any {
    return (resp: string[]) => this.provinces = resp;
  }

  onBack(): void {
    this.router.navigate([DEPOSIT_PAYMENT_DETAIL_KEY_IN]);
  }

  onNext(): void {
    this.router.navigate([DEPOSIT_PAYMENT_SUMMARY_PAGE]);
  }

  onHome(): void {
    const url = '/';
  }
}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { Transaction, TransactionAction, TransactionType, Customer } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { User, TokenService, ApiRequestService, AlertService, PageLoadingService, ReceiptInfo, REGEX_MOBILE, PaymentDetail, HomeService } from 'mychannel-shared-libs';
import { CreateDeviceOrderService } from 'src/app/deposit-summary/services/create-device-order.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { BillingAddressService } from 'src/app/deposit-summary/services/billing-address.service';
import { CustomerInformationService } from 'src/app/deposit-summary/services/customer-information.service';
import { debounceTime } from 'rxjs/operators';
import { LocalStorageService } from 'ngx-store';
import { CreateOrderService } from 'src/app/deposit-summary/services/create-order.service';
import { HttpClient } from '@angular/common/http';
import { DEPOSIT_PAYMENT_RECEIPT } from 'src/app/deposit-summary/constants/route-path.constant';
import { WIZARD_RESERVE_WITH_DEPOSIT } from 'src/app/deposit-summary/constants/wizard.constant';
import { DepositSummaryServicesService } from 'src/app/deposit-summary/services/deposit-summary-services.service';
import { MessageConfigService } from 'src/app/deposit-summary/services/message-config.service';
import { CREDIT_CARD_PAYMENT, CASH_AND_CREDIT_CARD_PAYMENT, CASH_PAYMENT } from '../deposit-payment-page/deposit-payment-page.component';
import { LANGUAGE, RESERVE_STOCK, ERROR_MESSAGE } from 'src/app/deposit-summary/constants/message-config.constant';

@Component({
  selector: 'app-deposit-payment-key-in-page',
  templateUrl: './deposit-payment-key-in-page.component.html',
  styleUrls: ['./deposit-payment-key-in-page.component.scss']
})
export class DepositPaymentKeyInPageComponent implements OnInit {

  @Input()
  customerInfoTemp: any;

  @Output()
  completed: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  error: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  action: EventEmitter<string> = new EventEmitter<string>();

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

  constructor(
    private localStorageService: LocalStorageService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private billingAddress: BillingAddressService,
    private depositSummaryServicesService: DepositSummaryServicesService,
    private apiRequestService: ApiRequestService,
    private messageConfigService: MessageConfigService,
    private fb: FormBuilder,
    private alertService: AlertService
  ) {
    this.billingAddress.getTitleName().then(this.responseTitleNames());
    this.billingAddress.getProvinces().then(this.responseProvinces());
    this.billingAddress.getZipCodes().then(this.responseZipCodes());
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void {
    this.getMessageConfig();
    // this.customerFlag = this.localStorageService.load('CustomerFlag').value;
    this.formID = this.getRandomNum(10);
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

    this.productImage = this.priceOption.trade.images.thumbnail ? this.priceOption.trade.images.thumbnail
      : 'assets/images/icon/img-placeholder-gray.png';
    const colorCode = this.priceOption.trade.colorCode ? this.priceOption.trade.colorCode
      : 'white';
    this.colorCodeStyle = {
      'background-color': colorCode,
    };

    if (this.priceOption && this.priceOption.trade && this.priceOption.trade.tradeReserve
      && this.priceOption.trade.tradeReserve.trades[0] && this.priceOption.trade.tradeReserve.trades[0].payments) {
      this.priceOptionPayment = this.priceOption.trade.tradeReserve.trades[0].payments
        .filter(payment => (payment.method === 'CC') || payment.method === 'CA');
      this.priceOptionBank = this.priceOption.trade.tradeReserve.trades[0].payments
        .filter(payment => payment.method === 'CC' && payment.abb !== null);
      this.paymentMethod = this.priceOptionPayment.filter(payment => payment.method === 'CA') ? 'CA' :
        this.priceOptionPayment.filter(payment => payment.method === 'CC') ? 'CC' : 'CA';
    } else {
      this.paymentMethod = 'CA';
    }

    this.onLoadDefaultBankData(this.priceOptionBank).then((banks) => {
      this.priceOption.trade.banks = banks;
      // ############################################## payment detail ##############################################
      this.paymentDetail = {
        banks: this.groupPrivilegeTradeBankByAbb(this.priceOption.trade.banks)
      };
    });
    this.selectPaymentDetail = {
      paymentType: this.getPaymentType()
    };
    this.createForm();
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
  getRandomNum(length: number): string {
    const randomNum =
      (Math.pow(10, length).toString().slice(length - 1) +
        Math.floor((Math.random() * Math.pow(10, length)) + 1).toString()).slice(-length);
    return randomNum;
  }
  getPaymentType(): string {
    if (this.paymentMethod === CASH_PAYMENT) {
      return 'debit';
    }
    if (this.paymentMethod === CREDIT_CARD_PAYMENT) {
      return 'credit';
    }
    return 'debit';
  }
  getPaymentMethod(paymentType: string): string {
    if (paymentType === 'debit') {
      return 'CA';
    }
    if (paymentType === 'credit') {
      return 'CC';
    }
    return '';
  }
  showPaymentMethod(method: string): boolean {
    const paymentMethod = this.priceOptionPayment.filter(payment => payment.method === method);
    if (paymentMethod.length > 0) {
      return null;
    } else {
      return true;
    }
  }

  onLoadDefaultBankData(banks: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      if (banks && banks.length > 0) {
        resolve(banks);
      } else {
        this.depositSummaryServicesService.getBanks().then((bankByLocation) => {
          resolve(bankByLocation);
        }).catch((err: any) => resolve([]));
      }
    });
  }
  onSelectPaymentType(paymentType: string): void {
    this.selectPaymentDetail.paymentType = paymentType;
    this.paymentMethod = this.getPaymentMethod(paymentType);
  }
  onSelectBank(bank: any): void {
    this.selectPaymentDetail.bank = Object.assign({}, bank);
    this.selectPaymentDetail.bank.installments = undefined;
    this.paymentDetail.installments = bank.installments;
    this.checkPaymentFormValid();
  }
  groupPrivilegeTradeBankByAbb(banks: any[]): any[] {
    const newPrivilegTradeBankByAbbs = new Array<any>();
    const grouped = this.groupBy(banks, (bank: any) => bank.abb);
    const groupedKeys = Array.from(grouped.keys());
    for (const groupedKey of groupedKeys) {
      const groupBanks: any[] = grouped.get(groupedKey);
      const privilegTradeBank: any = {
        abb: groupBanks[0].abb,
        name: groupBanks[0].name,
        imageUrl: groupBanks[0].imageUrl,
        promotion: groupBanks[0].promotion,
        installments: null,
        remark: groupBanks[0].remark
      };
      newPrivilegTradeBankByAbbs.push(privilegTradeBank);
    }

    return newPrivilegTradeBankByAbbs;
  }

  groupBy(list: any, keyGetter: any): Map<any, any> {
    const map = new Map();
    list.forEach((item) => {
      const key = keyGetter(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return map;
  }

  private setDataFromCustomerInfoTemp(): void {
    const customer = this.customerInfoTemp.customer;
    const billDeliveryAddress = this.customerInfoTemp.billDeliveryAddress;
    const receiptInfo = this.customerInfoTemp.receiptInfo;
    this.setCustomerInfo({
      customer: { ...customer, ...billDeliveryAddress, ...receiptInfo },
      action: this.customerInfoTemp.action
    });
    if (this.isShowInputForKeyIn) {
      this.keyInCustomerAddressTemp = { ...customer, ...billDeliveryAddress };
    }
    for (const item in receiptInfo) {
      if (receiptInfo.hasOwnProperty(item)) {
        this.receiptInfoForm.controls[item].setValue(receiptInfo[item]);
      }
    }
  }
  checkPaymentFormValid(): boolean {
    const paymentType = this.selectPaymentDetail.paymentType;
    if (this.paymentMethod === CREDIT_CARD_PAYMENT) {
      if (paymentType === 'credit' && (!this.selectPaymentDetail.bank)) {
        return false;
      }
    }
    if (this.paymentMethod === CASH_AND_CREDIT_CARD_PAYMENT) {
      if (paymentType === 'credit' && !this.selectPaymentDetail.bank) {
        return false;
      }
    }
    return true;
  }
  createForm(): void {
    this.discountForm = this.fb.group({
      discountType: [null, Validators.required]
    });
    this.paymentForm = this.fb.group({
      paymentType: [null, Validators.required]
    });
    this.paymentForm.valueChanges.subscribe(observer => {
      this.selectPaymentDetail.paymentType = observer.paymentType;
    });

    if (this.selectPaymentDetail) {
      this.paymentForm.patchValue({ paymentType: this.selectPaymentDetail.paymentType });
    }
  }

  private async getMessageConfig(): Promise<void> {
    await this.messageConfigService.getMsgConfigByModuleName(LANGUAGE.TH, RESERVE_STOCK.MODULE_NAME).then(async(res: any) => {
      await this.messageConfigService.setMessageConfig(res.data);
    },
    (error: any) => {
      this.alertService.error(ERROR_MESSAGE.DEFAULT);
    });
  }

  setCustomerInfo(data: any): void {
    const customer: Customer = {
      idCardNo: data.customer.idCardNo,
      idCardType: data.customer.idCardType || 'บัตรประชาชน',
      titleName: data.customer.titleName,
      firstName: data.customer.firstName,
      lastName: data.customer.lastName,
      birthdate: data.customer.birthdate || '',
      gender: data.customer.gender || '',
      expireDate: data.customer.expireDate || ''
    };
    const billDeliveryAddress: Customer = {
      idCardNo: customer.idCardNo || '',
      idCardType: customer.idCardNo || '',
      titleName: customer.titleName || '',
      firstName: customer.firstName || '',
      lastName: customer.lastName || '',
      birthdate: customer.birthdate || '',
      gender: customer.gender || '',
      homeNo: data.customer.homeNo,
      moo: data.customer.moo || '',
      mooBan: data.customer.mooBan || '',
      room: data.customer.room || '',
      floor: data.customer.floor || '',
      buildingName: data.customer.buildingName || '',
      soi: data.customer.soi || '',
      street: data.customer.street || '',
      province: data.customer.province,
      amphur: data.customer.amphur,
      tumbol: data.customer.tumbol,
      zipCode: data.customer.zipCode
    };
  }

  onBack(): void {
  }

  onNext(): void {
  }

  onHome(): void {
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
    this.setCustomerInfo({
      customer: value,
      action: TransactionAction.KEY_IN
    });
    this.receiptInfoForm.controls['taxId'].setValue(value.idCardNo);
  }

  onError(valid: boolean): void {
    this.error.emit(valid);
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
}

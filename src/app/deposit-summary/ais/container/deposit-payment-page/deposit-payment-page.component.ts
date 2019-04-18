import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_RESERVE_WITH_DEPOSIT } from '../../../constants/wizard.constant';
import { LocalStorageService } from 'ngx-store';
import { ApiRequestService, AlertService, TokenService } from 'mychannel-shared-libs';
import { Transaction, TransactionType, TransactionAction, Customer } from 'src/app/shared/models/transaction.model';
import { PriceOption } from '../../../../shared/models/price-option.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { Router } from '@angular/router';
import { DEPOSIT_PAYMENT_SUMMARY_PAGE } from 'src/app/deposit-summary/constants/route-path.constant';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DepositSummaryServicesService } from 'src/app/deposit-summary/services/deposit-summary-services.service';

export const CASH_PAYMENT = 'CA';
export const CREDIT_CARD_PAYMENT = 'CC';
export const CASH_AND_CREDIT_CARD_PAYMENT = 'CC/CA';
import { DEPOSIT_QUEUE_PAGE } from 'src/app/deposit-summary/constants/route-path.constant';
import { CreateDeviceOrderService } from 'src/app/deposit-summary/services/create-device-order.service';

@Component({
  selector: 'app-deposit-payment-page',
  templateUrl: './deposit-payment-page.component.html',
  styleUrls: ['./deposit-payment-page.component.scss']
})
export class DepositPaymentPageComponent implements OnInit, OnDestroy {

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
  recipientCustomerAddress: string;
  otherPhoneNumber: string;
  constructor(private localStorageService: LocalStorageService,
    private apiRequestService: ApiRequestService,
    private transactionServicet: TransactionService,
    private priceOptionService: PriceOptionService,
    private router: Router,
    private depositSummaryServicesService: DepositSummaryServicesService,
    private createDeviceOrderService: CreateDeviceOrderService,
    private tokenService: TokenService,
    private alertService: AlertService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
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
    this.createProductRecipient();
  }
  ngOnDestroy(): void {
    this.transaction.data.payment = {
      paymentMethod: this.paymentMethod,
      selectPaymentDetail: this.selectPaymentDetail
    };
    this.transaction.data.customer.shipaddress = {
      shipCusAddr: this.customerFullAddress,
      shipCusName: this.customerFullName
    };
    this.transaction.data.customer.otherPhoneNumber = this.otherPhoneNumber;
    this.transactionServicet.save(this.transaction);
    this.priceOptionService.save(this.priceOption);
  }
  onAddrChanges(fullAddress: string): void {
    this.customerFullAddress = fullAddress;
  }

  onchangeOtherPhoneNumber(otherPhoneNumber: string): void {
    this.otherPhoneNumber = otherPhoneNumber;
  }
  onHome(): void {
    const url = '/';
    this.alertRemoveAddCart(url);
  }
  onNext(): void {
    this.router.navigate([DEPOSIT_PAYMENT_SUMMARY_PAGE]);
  }
  onBack(): void {
    const url = '/sales-portal/reserve-stock/list-mobile-no';
    this.alertRemoveAddCart(url);
  }
  alertRemoveAddCart(url: string): void {
    this.alertService.notify({
      type: 'question',
      showConfirmButton: true,
      confirmButtonText: 'CONFIRM',
      cancelButtonText: 'CANCEL',
      showCancelButton: true,
      reverseButtons: true,
      allowEscapeKey: false,
      html: 'ต้องการยกเลิกรายการขายหรือไม่ <br> การยกเลิก ระบบจะคืนสินค้าเข้าสต๊อคสาขาทันที'
    }).then((data) => {
        if (data.value) {
          const userId = this.tokenService.getUser().username;
          const soId = this.localStorageService.load('reserveSoId').value;
          this.createDeviceOrderService.removeAddCart(soId, userId).then( (res) => {
            window.location.href = url;
          });
        }
    });
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
    if (paymentMethod.length > 0)                                              {
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

  createProductRecipient(): void {
    this.customerFullName = this.transaction.data.customer.titleName + ' ' + this.transaction.data.customer.firstName +
      ' ' + this.transaction.data.customer.lastName;
     const transactionLocalStorage = this.localStorageService.load('transaction').value;
    if ( transactionLocalStorage && transactionLocalStorage.data && transactionLocalStorage.data.customer
      && transactionLocalStorage.data.customer.shipaddress
      && transactionLocalStorage.data.customer.shipaddress.shipCusAddr
      && transactionLocalStorage.data.customer.shipaddress.shipCusName === this.customerFullName ) {
        this.customerFullAddress = transactionLocalStorage.data.customer.shipaddress.shipCusAddr;
    } else {
      this.customerFullAddress = this.getFullAddress(this.transaction.data.customer);
    }
    this.recipientCustomerAddress = this.getFullAddress(this.transaction.data.customer);
    this.idCardNo = this.transaction.data.customer.idCardNo;
    if (this.idCardNo) {
      this.idCardNo = this.idCardNo.substring(9);
      this.idCardNo = ('XXXXXXXXX' + this.idCardNo).toUpperCase();
    }
    this.selectedMobile = this.transaction.data.customer.selectedMobile;
    this.locationNameTH = this.transaction.data.customer.selectedLocation.locationNameTH;
  }
  getFullAddress(customer: Customer): string {
    if (!customer) {
      return '-';
    }
    const fullAddress =
      (customer.homeNo ? customer.homeNo + ' ' : '') +
      (customer.moo ? 'หมู่ที่ ' + customer.moo + ' ' : '') +
      (customer.mooBan ? 'หมู่บ้าน ' + customer.mooBan + ' ' : '') +
      (customer.room ? 'ห้อง ' + customer.room + ' ' : '') +
      (customer.floor ? 'ชั้น ' + customer.floor + ' ' : '') +
      (customer.buildingName ? 'อาคาร ' + customer.buildingName + ' ' : '') +
      (customer.soi ? 'ซอย ' + customer.soi + ' ' : '') +
      (customer.street ? 'ถนน ' + customer.street + ' ' : '') +
      (customer.tumbol ? 'ตำบล/แขวง ' + customer.tumbol + ' ' : '') +
      (customer.amphur ? 'อำเภอ/เขต ' + customer.amphur + ' ' : '') +
      (customer.province ? 'จังหวัด ' + customer.province + ' ' : '') +
      (customer.zipCode || '');
    return fullAddress || '-';
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
}

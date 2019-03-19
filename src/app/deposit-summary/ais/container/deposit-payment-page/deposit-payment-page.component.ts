import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_RESERVE_WITH_DEPOSIT } from '../../../constants/wizard.constant';
import { LocalStorageService } from 'ngx-store';
import { ApiRequestService, PaymentDetailInstallment, SelectPaymentDetail, PaymentDetailBank, HomeService, Utils, AlertService, PaymentDetail, PaymentDetailOption } from 'mychannel-shared-libs';
import { Transaction, TransactionType, TransactionAction } from 'src/app/shared/models/transaction.model';
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
  paymentDetail: PaymentDetail;
  selectPaymentDetail: SelectPaymentDetail;
  paymentDetailOption: PaymentDetailOption;
  paymentForm: FormGroup;
  discountForm: FormGroup;
  paymentMethod: string;
  colorCode: any;

  constructor(private localStorageService: LocalStorageService,
              private apiRequestService: ApiRequestService,
              private transactionServicet: TransactionService,
              private priceOptionService: PriceOptionService,
              private router: Router,
              private depositSummaryServicesService: DepositSummaryServicesService,
              private fb: FormBuilder) { }

  ngOnInit(): void {
    this.colorCode = {
      'background-color': 'green',
      'width': '1.5em',
      'height': '1.5em',
      'margin-left': '15px'
    };
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
    this.paymentMethod =  'CA';
    this.onLoadDefaultBankData(this.priceOption.trade.banks).then((banks) => {
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
  ngOnDestroy(): void {
    this.transaction.data.payment = {
      paymentMethod: this.paymentMethod,
      selectPaymentDetail: this.selectPaymentDetail
    };
    this.transactionServicet.save(this.transaction);
    this.priceOptionService.save(this.priceOption);
  }

  onNext(): void {
    this.router.navigate([DEPOSIT_PAYMENT_SUMMARY_PAGE]);
  }
  onBack(): void {
    window.location.href = '';
  }
  getRandomNum(length: number): string {
    const randomNum =
      (Math.pow(10, length).toString().slice(length - 1) +
        Math.floor((Math.random() * Math.pow(10, length)) + 1).toString()).slice(-length);
    return randomNum;
  }
  getPaymentType(): string {
    if (this.paymentMethod === CASH_PAYMENT) {
      return  'debit';
    }
    if (this.paymentMethod === CREDIT_CARD_PAYMENT) {
      return 'credit';
    }
    if (this.paymentMethod === CASH_AND_CREDIT_CARD_PAYMENT) {
      return  'debit';
    }
    return  'debit';
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
  onLoadDefaultBankData(banks: PaymentDetailBank[]): Promise<any> {
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
  onSelectBank( bank: PaymentDetailBank): void {
    this.selectPaymentDetail.bank = Object.assign({}, bank);
    this.selectPaymentDetail.bank.installments = undefined;
    this.paymentDetail.installments = bank.installments;
  }
  groupPrivilegeTradeBankByAbb(banks: PaymentDetailBank[]): PaymentDetailBank[] {
    const newPrivilegTradeBankByAbbs = new Array<PaymentDetailBank>();
    const grouped = this.groupBy(banks, (bank: PaymentDetailBank) => bank.abb);
    const groupedKeys = Array.from(grouped.keys());
    for (const groupedKey of groupedKeys) {
      const groupBanks: PaymentDetailBank[] = grouped.get(groupedKey);
      const privilegTradeBank: PaymentDetailBank = {
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
  private groupBy(list: any, keyGetter: any): Map<any, any> {
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
  checkPaymentFormValid(): boolean {
    const paymentType = this.selectPaymentDetail.paymentType;
    if (this.paymentMethod === CREDIT_CARD_PAYMENT) {
      if (paymentType === 'credit' && (!this.selectPaymentDetail.bank || !this.selectPaymentDetail.bank.installments)) {
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

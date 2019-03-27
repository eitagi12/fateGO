import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { WIZARD_DEVICE_ONLY_AIS } from '../../constants/wizard.constant';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentDetail, SelectPaymentDetail, PaymentDetailOption, PaymentDetailBank, PaymentDetailInstallment } from 'mychannel-shared-libs';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';

export const CASH_PAYMENT = 'CA';
export const CREDIT_CARD_PAYMENT = 'CC';
export const CASH_AND_CREDIT_CARD_PAYMENT = 'CC/CA';
@Component({
  selector: 'app-select-payment',
  templateUrl: './select-payment.component.html',
  styleUrls: ['./select-payment.component.scss']
})
export class SelectPaymentComponent implements OnInit {

  wizards: string[] = WIZARD_DEVICE_ONLY_AIS;
  paymentForm: FormGroup;
  paymentDetail: PaymentDetail;
  selectPaymentDetail: SelectPaymentDetail = {};
  paymentDetailOption: PaymentDetailOption;
  isQrcode: boolean;
  isCredit: boolean;
  isDebit: boolean;
  @Output() isSelectBank: EventEmitter<any> = new EventEmitter<any>();

  paymentMethod: string;
  transaction: Transaction;
  priceOption: PriceOption;
  formID: string;
  showQRCode: boolean;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
  }
  ngOnInit(): void {
    this.formID = this.getRandomNum(10);
    const productDetail = this.priceOption.productDetail;
    const productInfo = this.priceOption.productStock;
    if (this.priceOption.trade.payments.length > 0) {
      this.paymentMethod = this.priceOption.trade.payments.filter(payment => payment.method !== 'PP')[0].method || '';
    } else {
      this.paymentMethod = this.priceOption.trade.payments.method || '';
    }
    this.onLoadDefaultBankData(this.priceOption.trade.banks).then((banks) => {
      this.priceOption.trade.banks = banks;
      this.paymentDetail = {
        title: 'รูปแบบการชำระเงิน',
        header: 'ค่าเครื่อง ' + productDetail.name,
        price: this.priceOption.trade.promotionPrice,
        // qrCodes: this.getQRCode(),
        banks: this.groupPrivilegeTradeBankByAbb(this.priceOption.trade.banks)
      };
    });
    this.selectPaymentDetail = {
      paymentType: this.getPaymentType(),
    };
    this.paymentDetailOption = {
      isInstallment: this.isInstallment(),
      isEnable: this.isEnableForm()
    };

    this.createForm();
  }

  onLoadDefaultBankData(banks: PaymentDetailBank[]): Promise<any> {
    return new Promise((resolve, reject) => {
      if (banks && banks.length > 0) {
        resolve(banks);
      }
    });
  }

  onSelectPaymentType(paymentType: string): void {
    this.selectPaymentDetail.paymentType = paymentType;
  }

  onSelectBank(bank: PaymentDetailBank): void {
    this.isSelectBank.emit(bank);
    this.selectPaymentDetail.bank = Object.assign({}, bank);
    this.selectPaymentDetail.bank.installments = undefined;
    this.paymentDetail.installments = bank.installments; // Object.assign({}, bank.installments);
  }
  onSelectInstallment(installment: PaymentDetailInstallment[]): void {
    this.selectPaymentDetail.bank.installments = Object.assign({}, installment);
  }

  isInstallment(): boolean {
    if (this.paymentMethod === 'CC' && this.selectPaymentDetail.paymentType === 'credit') {
      return true;
    }
    return false;
  }
  isEnableForm(): boolean {
    if (this.paymentMethod === CASH_PAYMENT) {
      return true;
    }
    if (this.paymentMethod === CREDIT_CARD_PAYMENT) {
      return false;
    }
    if (this.paymentMethod === CASH_AND_CREDIT_CARD_PAYMENT) {
      return true;
    }
    return true;
  }

  getPaymentType(): string {
    if (this.paymentMethod === CASH_PAYMENT) {
      return this.showQRCode ? 'qrcode' : 'debit';
    }
    if (this.paymentMethod === CREDIT_CARD_PAYMENT) {
      return 'credit';
    }
    if (this.paymentMethod === CASH_AND_CREDIT_CARD_PAYMENT) {
      return this.showQRCode ? 'qrcode' : 'debit';
    }
    return this.showQRCode ? 'qrcode' : 'debit';

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
        installments: this.getBanksInstallmentDatas(groupBanks),
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

  public getBanksInstallmentDatas(banks: PaymentDetailBank[]): PaymentDetailInstallment[] {
    const installmentDatas = new Array<PaymentDetailInstallment>();
    banks.forEach((bank: any) => {
      const installmentPercentage = this.getBankInstallmentPercentage(bank.installment) ?
        this.getBankInstallmentPercentage(bank.installment) : 0;
      const installmentMonth = this.getBankInstallmentMonth(bank.installment) ? this.getBankInstallmentMonth(bank.installment) : 0;

      const existInstallments = installmentDatas
        .filter(
          installment =>
            (installment.installmentMonth === installmentMonth) &&
            (installment.installmentPercentage === installmentPercentage)
        );

      if (existInstallments.length === 0 && (installmentMonth)) {
        const installmentData: PaymentDetailInstallment = {
          installmentMonth: installmentMonth,
          installmentPercentage: installmentPercentage
        };

        installmentDatas.push(installmentData);
      } else {

      }
    });
    return installmentDatas.sort((a: any, b: any) => {
      return a.installmentMonth > b.installmentMonth ? -1 : 1;
    });
  }
  public getBankInstallmentMonth(installmentRemark: string): number {
    const month = this.getInstallmentFormRemark(installmentRemark)['month'];
    return month !== undefined ? month : 0;
  }

  public getBankInstallmentPercentage(installmentRemark: string): number {
    const percentage = this.getInstallmentFormRemark(installmentRemark)['percentage'];
    return percentage !== undefined ? percentage : 0;
  }

  private getInstallmentFormRemark(installmentRemark: string): any {
    const installment = {
      percentage: 0,
      month: 0
    };
    const monthWord = 'เดือน';
    if (installmentRemark && installmentRemark !== '' && installmentRemark.includes('%') && installmentRemark.includes(monthWord)) {
      const trimInstallmentString = installmentRemark.replace(/\s+/g, '');
      const installmentData = (/^\s?(\d+.?\d*)\s?\%\s?(\d+)/.exec(trimInstallmentString));
      installment.percentage = +installmentData[1];
      installment.month = +installmentData[2];
      return installment;
    } else {
      return installment;
    }
  }

  createForm(): void {
    this.paymentForm = this.fb.group({
      paymentType: [null, Validators.required]
    });
    this.paymentForm.valueChanges.subscribe(observer => {
      this.selectPaymentDetail.paymentType = observer.paymentType;
    });

    if (this.selectPaymentDetail) {
      this.paymentForm.patchValue({ paymentType: this.selectPaymentDetail.paymentType });
    }
    if (this.paymentDetailOption && this.paymentDetailOption.isEnable) {
      this.paymentForm.get('paymentType').enable();
    } else {
      this.paymentForm.get('paymentType').disable();
    }
  }

  getRandomNum(length: number): string {
    const randomNum =
      (Math.pow(10, length).toString().slice(length - 1) +
        Math.floor((Math.random() * Math.pow(10, length)) + 1).toString()).slice(-length);
    return randomNum;
  }
  // onSelectBank(bank: any): void {
  //   this.isSelectBank.emit(bank);
  //   console.log('cdscdscdscdscdsdcsc', bank);
  // }

}

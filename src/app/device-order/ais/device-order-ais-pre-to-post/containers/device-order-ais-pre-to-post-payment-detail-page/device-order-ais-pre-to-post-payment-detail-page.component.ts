import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, ShoppingCart, PaymentDetail, SelectPaymentDetail, PaymentDetailQRCode, PaymentDetailBank, PaymentDetailInstallment, PaymentDetailOption } from 'mychannel-shared-libs';
import { ReceiptInfo } from 'mychannel-shared-libs/lib/component/receipt-info/receipt-info.component';

import {
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_CURRENT_INFO_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_ELIGIBLE_MOBILE_PAGE
} from '../../constants/route-path.constant';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { TransactionAction, Transaction, Customer, Payment } from 'src/app/shared/models/transaction.model';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { from } from 'rxjs/internal/observable/from';
import { groupBy, mergeMap, toArray, distinct } from 'rxjs/operators';

export const CASH_PAYMENT = 'CA';
export const CREDIT_CARD_PAYMENT = 'CC';
export const CASH_AND_CREDIT_CARD_PAYMENT = 'CC/CA';

@Component({
  selector: 'app-device-order-ais-pre-to-post-payment-detail-page',
  templateUrl: './device-order-ais-pre-to-post-payment-detail-page.component.html',
  styleUrls: ['./device-order-ais-pre-to-post-payment-detail-page.component.scss']
})
export class DeviceOrderAisPreToPostPaymentDetailPageComponent implements OnInit, OnDestroy {

  wizards = WIZARD_DEVICE_ORDER_AIS;
  shoppingCart: ShoppingCart;
  priceOption: PriceOption;
  transaction: Transaction;

  receiptInfo: ReceiptInfo;
  receiptInfoValid = true;

  paymentDetail: PaymentDetail;
  selectPaymentDetail: SelectPaymentDetail;
  paymentDetailOption: PaymentDetailOption;

  paymentDetailAdvancePay: PaymentDetail;
  selectPaymentDetailAdvancePay: SelectPaymentDetail;
  paymentDetailAdvancePayOption: PaymentDetailOption;

  paymentMethod: string;

  selectQRCode: PaymentDetailQRCode;
  selectBank: PaymentDetailBank;
  // installments: PaymentDetailInstallment[];

  selectQRCodeAdvancePay: PaymentDetailQRCode;
  selectBankAdvancePay: PaymentDetailBank;

  paymentForm: FormGroup;
  advancePaymentForm: FormGroup;


  constructor(
    private router: Router,
    private fb: FormBuilder,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private shoppingCartService: ShoppingCartService,
    private priceOptionService: PriceOptionService
  ) {
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();
  }

  ngOnInit() {

    this.shoppingCart = this.shoppingCartService.getShoppingCartData();

    if (this.priceOption.trade.payments.length > 0) {
      this.paymentMethod = this.priceOption.trade.payments.filter(payment => payment.method !== 'PP')[0].method || '';
    } else {
      this.paymentMethod = this.priceOption.trade.payments.method || '';
    }

    // this.priceOption.trade.advancePay.amount = 1000;
    // this.priceOption.trade.advancePay.installmentFlag = 'N';
    // this.paymentMethod = 'CC/CA';

    // ############################################## payment detail ##############################################
    this.paymentDetail = {
      title: 'รูปแบบการชำระเงิน',
      header: 'ค่าเครื่อง ' + this.priceOption.queryParams.model + ' สี ' + this.priceOption.productStock.colorName,
      price: this.priceOption.trade.promotionPrice,
      qrCodes: this.getQRCode(),
      banks: this.groupPrivilegeTradeBankByAbb(this.priceOption.trade.banks)
    };
    if (this.transaction.data.payment) {
      this.selectPaymentDetail = {
        paymentType: this.transaction.data.payment.type,
        qrCode: this.transaction.data.payment.qrCode,
        bank: this.transaction.data.payment.bank,
      };
      const bank = this.paymentDetail.banks.find(b => b.abb === this.selectPaymentDetail.bank.abb);
      this.paymentDetail.installments = bank ? bank.installments : [];
    } else {
      this.selectPaymentDetail = {
        paymentType: this.getPaymentType(),
      };
    }

    this.paymentDetailOption = {
      isInstallment: this.isInstallment(),
      isEnable: this.isEnableForm()
    };

    // ############################################## advance payment ##############################################
    this.paymentDetailAdvancePay = {
      qrCodes: this.getQRCode(),
      banks: this.groupPrivilegeTradeBankByAbb(this.priceOption.trade.banks)
    };
    if (this.transaction.data.advancePayment) {
      this.selectPaymentDetailAdvancePay = {
        paymentType: this.transaction.data.advancePayment.type,
        qrCode: this.transaction.data.advancePayment.qrCode,
        bank: this.transaction.data.advancePayment.bank,
      };
      const bank = this.paymentDetailAdvancePay.banks.find(b => b.abb === this.selectPaymentDetailAdvancePay.bank.abb);
      this.paymentDetailAdvancePay.installments = bank ? bank.installments : [];
    } else {
      this.selectPaymentDetailAdvancePay = {
        paymentType: this.getPaymentType(),
      };
    }
    this.paymentDetailAdvancePayOption = {
      isInstallment: false,
      isEnable: true
    };

    if (this.priceOption.trade.advancePay && this.priceOption.trade.advancePay.amount !== 0) {
      const header = 'แพ็กเกจชำระล่วงหน้า';
      const amount = this.priceOption.trade.advancePay.amount;
      if (this.priceOption.trade.advancePay.installmentFlag === 'Y') {
        this.paymentDetail.headerAdvancePay = header;
        this.paymentDetail.priceAdvancePay = amount;
      } else {
        this.paymentDetailAdvancePay.headerAdvancePay = header;
        this.paymentDetailAdvancePay.priceAdvancePay = amount;
      }
    }
    // ############################################## receiptInfo ##############################################
    this.receiptInfo = {
      taxId: this.transaction.data.customer.idCardNo,
      branch: '',
      buyer: this.transaction.data.customer.titleName + ' ' +
        this.transaction.data.customer.firstName + ' ' +
        this.transaction.data.customer.lastName,
      buyerAddress: this.getFullAddress(this.transaction.data.customer),
      telNo: this.transaction.data.receiptInfo ? this.transaction.data.receiptInfo.telNo : ''
    };
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

  onBack() {
    delete this.transaction.data.payment;
    delete this.transaction.data.advancePayment;

    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_ELIGIBLE_MOBILE_PAGE]);
  }

  onNext() {
    const paymentType = this.selectPaymentDetail.paymentType;
    const qrCode = this.selectPaymentDetail.qrCode;
    const bank = this.selectPaymentDetail.bank;

    this.transaction.data.payment = {
      method: this.getPaymentMethod(paymentType, qrCode),
      type: paymentType,
      qrCode: qrCode,
      bank: bank
    };

    const paymentTypeAdvancePay = this.selectPaymentDetailAdvancePay.paymentType;
    const qrCodeAdvancePay = this.selectPaymentDetailAdvancePay.qrCode;
    const bankAdvancePay = this.selectPaymentDetailAdvancePay.bank;

    this.transaction.data.advancePayment = {
      method: this.getPaymentMethod(paymentTypeAdvancePay, qrCodeAdvancePay),
      type: paymentTypeAdvancePay,
      qrCode: qrCodeAdvancePay,
      bank: bankAdvancePay
    };

    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_CURRENT_INFO_PAGE]);
  }

  onHome() {
    this.homeService.goToHome();
  }

  onReceiptInfoCompleted(receiptInfo: ReceiptInfo) {
    this.transaction.data.receiptInfo = receiptInfo;
  }

  onReceiptInfoError(error: boolean) {
    this.receiptInfoValid = error;
  }

  getFullAddress(customer: Customer) {
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

  onSelectPaymentType(paymentType: string) {
    this.selectPaymentDetail.paymentType = paymentType;
  }
  onSelectQRCode(qrCode: PaymentDetailQRCode) {
    this.selectPaymentDetail.qrCode = Object.assign({}, qrCode);
    this.selectPaymentDetailAdvancePay.qrCode = Object.assign({}, qrCode);
  }
  onSelectBank(bank: PaymentDetailBank) {
    this.selectPaymentDetail.bank = Object.assign({}, bank);
    this.selectPaymentDetail.bank.installments = undefined;
    this.paymentDetail.installments = bank.installments; // Object.assign({}, bank.installments);
  }
  onSelectInstallment(installment: PaymentDetailInstallment[]) {
    this.selectPaymentDetail.bank.installments = Object.assign({}, installment);
  }


  onSelectPaymentTypeAdvancePay(paymentType: string) {
    this.selectPaymentDetailAdvancePay.paymentType = paymentType;
  }
  onSelectQRCodeAdvancePay(qrCode: PaymentDetailQRCode) {
    this.selectPaymentDetail.qrCode = Object.assign({}, qrCode);
    this.selectPaymentDetailAdvancePay.qrCode = Object.assign({}, qrCode);
  }
  onSelectBankAdvancePay(bank: PaymentDetailBank) {
    this.selectPaymentDetailAdvancePay.bank = Object.assign({}, bank);
    this.selectPaymentDetailAdvancePay.bank.installments = undefined;
  }

  checkPaymentFormValid(): boolean {
    const paymentType = this.selectPaymentDetail.paymentType;

    if (this.paymentMethod === CASH_PAYMENT) {
      if (paymentType === 'qrcode' && !this.selectPaymentDetail.qrCode) {
        return false;
      }
    }

    if (this.paymentMethod === CREDIT_CARD_PAYMENT) {
      if (paymentType === 'credit' && (!this.selectPaymentDetail.bank || !this.selectPaymentDetail.bank.installments)) {
        return false;
      }
    }

    if (this.paymentMethod === CASH_AND_CREDIT_CARD_PAYMENT) {
      if (paymentType === 'qrcode' && !this.selectPaymentDetail.qrCode) {
        return false;
      }
      if (paymentType === 'credit' && !this.selectPaymentDetail.bank) {
        return false;
      }
    }

    return true;
  }

  checkAdvancePaymentFormValid(): boolean {

    if (this.priceOption.trade.advancePay &&
      (this.priceOption.trade.advancePay.amount === 0 ||
        this.priceOption.trade.advancePay.installmentFlag === 'Y')) {
      return true;
    }

    const paymentType = this.selectPaymentDetailAdvancePay.paymentType;

    if (this.paymentMethod === CASH_PAYMENT) {
      if (paymentType === 'qrcode' && !this.selectPaymentDetailAdvancePay.qrCode) {
        return false;
      }
    }

    if (this.paymentMethod === CREDIT_CARD_PAYMENT) {
      if (paymentType === 'qrcode' && !this.selectPaymentDetailAdvancePay.qrCode) {
        return false;
      }
      if (paymentType === 'credit' && !this.selectPaymentDetailAdvancePay.bank) {
        return false;
      }
    }

    if (this.paymentMethod === CASH_AND_CREDIT_CARD_PAYMENT) {
      if (paymentType === 'qrcode' && !this.selectPaymentDetailAdvancePay.qrCode) {
        return false;
      }
      if (paymentType === 'credit' && !this.selectPaymentDetailAdvancePay.bank) {
        return false;
      }
    }

    return true;
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
      return 'qrcode';
    }
    if (this.paymentMethod === CREDIT_CARD_PAYMENT) {
      return 'credit';
    }
    if (this.paymentMethod === CASH_AND_CREDIT_CARD_PAYMENT) {
      return 'qrcode';
    }
    return 'qrcode';

  }

  getPaymentMethod(paymentType: string, qrCode?: PaymentDetailQRCode): string {
    if (paymentType === 'qrcode' && qrCode) {
      if (qrCode.id === parseInt('002', 8)) { // Rabbit Line Pay
        return 'RL';
      }
      if (qrCode.id === parseInt('003', 8)) { // Thai QR Payment
        return 'PB';
      }
    }
    if (paymentType === 'debit') {
      return 'CA';
    }
    if (paymentType === 'credit') {
      return 'CC';
    }
    return '';
  }

  getQRCode() {
    return [
      {
        id: 1,
        name: 'Thai QR Payment',
        imageUrl: 'assets/images/icon/Thai_Qr_Payment.png',
        qrType: '003'
      },
      {
        id: 2,
        name: 'Rabbit Line Pay',
        imageUrl: 'assets/images/icon/Rabbit_Line_Pay.png',
        qrType: '002'
      }
    ];
  }

  groupPrivilegeTradeBankByAbb(banks: PaymentDetailBank[]) {

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

  private groupBy(list: any, keyGetter: any) {
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

  public getBanksInstallmentDatas(banks: PaymentDetailBank[]) {
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
  public getBankInstallmentMonth(installmentRemark: string) {
    const month = this.getInstallmentFormRemark(installmentRemark)['month'];
    return month !== undefined ? month : 0;
  }

  public getBankInstallmentPercentage(installmentRemark: string) {
    const percentage = this.getInstallmentFormRemark(installmentRemark)['percentage'];
    return percentage !== undefined ? percentage : 0;
  }

  private getInstallmentFormRemark(installmentRemark: string) {
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
}


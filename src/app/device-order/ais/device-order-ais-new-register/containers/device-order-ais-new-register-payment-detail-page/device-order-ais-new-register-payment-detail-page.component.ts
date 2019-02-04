import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, ShoppingCart } from 'mychannel-shared-libs';
import { ReceiptInfo } from 'mychannel-shared-libs/lib/component/receipt-info/receipt-info.component';
import {
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_VALIDATE_CUSTOMER_PAGE,
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_VALIDATE_CUSTOMER_ID_CARD_PAGE,
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_CUSTOMER_INFO_PAGE
} from 'src/app/device-order/ais/device-order-ais-new-register/constants/route-path.constant';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { TransactionAction, Transaction, Customer } from 'src/app/shared/models/transaction.model';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { ShoppingCartService } from 'src/app/device-order/ais/device-order-ais-new-register/service/shopping-cart.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { from } from 'rxjs/internal/observable/from';
import { groupBy, mergeMap, toArray, distinct } from 'rxjs/operators';

export interface PaymentDetail {
  title?: string;
  header?: string;
  price?: string;
}
export interface PaymentDetailQRCode {
  id: number;
  name: string;
  imageUrl: string;
  qrType: string;
}
export interface PaymentDetailAdvancePay {
  amount: number;
  installmentFlag: string;
  matAirtime: string;
  description: string;
  promotions: PaymentDetailAdvancePayPromotion[];
}
export interface PaymentDetailAdvancePayPromotion {
  promotionCode: string;
  promotionName: string;
  productType: string;
  billingSystem: string;
}
export interface PaymentDetailBank {
  abb: string;
  name: string;
  imageUrl: string;
  promotion: string;
  installments: PaymentDetailInstallment[];
  remark: string;
}
export interface PaymentDetailInstallment {
  installmentPercentage: number;
  installmentMounth: number;
}

export const CASH_PAYMENT = 'CA';
export const CREDIT_CARD_PAYMENT = 'CC';
export const CASH_AND_CREDIT_CARD_PAYMENT = 'CA/CC';

@Component({
  selector: 'app-device-order-ais-new-register-payment-detail-page',
  templateUrl: './device-order-ais-new-register-payment-detail-page.component.html',
  styleUrls: ['./device-order-ais-new-register-payment-detail-page.component.scss']
})
export class DeviceOrderAisNewRegisterPaymentDetailPageComponent implements OnInit {

  wizards = WIZARD_DEVICE_ORDER_AIS;
  shoppingCart: ShoppingCart;
  priceOption: PriceOption;
  transaction: Transaction;
  receiptInfo: ReceiptInfo;


  qrCodes: PaymentDetailQRCode[];
  banks: PaymentDetailBank[];
  paymentType: string;

  selectQRCode: PaymentDetailQRCode;
  selectBank: PaymentDetailBank;
  installments: PaymentDetailInstallment[];

  selectQRCodeAdvancePay: PaymentDetailQRCode;
  selectBankAdvancePay: PaymentDetailBank;

  paymentForm: FormGroup;
  advancePaymentForm: FormGroup;

  paymenDetail: PaymentDetail;
  advancePaymenDetail: PaymentDetail;

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
    this.createForm();
    this.qrCodes = this.getQRCode();
    this.banks = this.groupPrivilegeTradeBankByAbb(this.priceOption.trade.banks);
    this.checkPaymentType();

    this.paymenDetail = {
      title: 'รูปแบบการชำระเงิน',
      header: 'ค่าเครื่อง ' + this.priceOption.queryParams.model + ' สี ' + this.priceOption.productStock.colorName,
      price: this.priceOption.trade.promotionPrice
    };

    this.advancePaymenDetail = {
      header: 'แพ็กเกจชำระล่วงหน้า',
      price: this.priceOption.trade.advancePay.amount
    };

    this.receiptInfo = {
      taxId: this.transaction.data.customer.idCardNo,
      branch: '',
      buyer: this.transaction.data.customer.titleName + ' ' +
        this.transaction.data.customer.firstName + ' ' +
        this.transaction.data.customer.lastName,
      buyerAddress: this.getFullAddress(this.transaction.data.customer),
      telNo: ''
    };

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

  createForm() {
    this.paymentForm = this.fb.group({
      paymentTypeRadio: [null, Validators.required]
    });

    this.paymentForm.valueChanges.subscribe(observer => {
    });

    this.advancePaymentForm = this.fb.group({
      paymentTypeRadio: [null, Validators.required]
    });

    this.advancePaymentForm.valueChanges.subscribe(observer => {
      console.log('advancePaymentForm', observer);
    });
  }

  onBack() {
    if (TransactionAction.KEY_IN === this.transaction.data.action) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_VALIDATE_CUSTOMER_PAGE]);
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_VALIDATE_CUSTOMER_ID_CARD_PAGE]);
    }
  }

  onNext() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_CUSTOMER_INFO_PAGE]);
  }

  onHome() {
    this.homeService.goToHome();
  }

  onSelectQRCode(qrCode: PaymentDetailQRCode) {
    this.selectQRCode = Object.assign({}, qrCode);
  }
  onSelectBank(bank: PaymentDetailBank) {
    this.selectBank = Object.assign({}, bank);
    this.selectBank.installments = null;
    this.installments = bank.installments;
  }
  onSelectInstallment(installment: PaymentDetailInstallment[]) {
    this.selectBank.installments = Object.assign({}, installment);
  }


  onSelectQRCodeAdvancePay(qrCode: PaymentDetailQRCode) {
    this.selectQRCodeAdvancePay = Object.assign({}, qrCode);
  }
  onSelectBankAdvancePay(bank: PaymentDetailBank) {
    this.selectBankAdvancePay = Object.assign({}, bank);
    this.selectBankAdvancePay.installments = null;
  }

  checkPaymentType() {
    this.paymentType = this.priceOption.trade.payments.filter(payment => payment.method !== 'PP')[0].method;
    if (this.paymentType === CASH_PAYMENT) {
      this.paymentForm.get('paymentTypeRadio').enable();
      this.paymentForm.patchValue({ paymentTypeRadio: 'qrcode' });
    } else if (this.paymentType === CREDIT_CARD_PAYMENT) {
      this.paymentForm.get('paymentTypeRadio').disable();
      this.paymentForm.patchValue({ paymentTypeRadio: 'credit' });
    } else if (this.paymentType === CASH_AND_CREDIT_CARD_PAYMENT) {
      this.paymentForm.get('paymentTypeRadio').enable();
      this.paymentForm.patchValue({ paymentTypeRadio: 'qrcode' });
    } else {
      this.paymentForm.get('paymentTypeRadio').enable();
      this.paymentForm.patchValue({ paymentTypeRadio: 'qrcode' });
    }

    this.advancePaymentForm.get('paymentTypeRadio').enable();
    this.advancePaymentForm.patchValue({ paymentTypeRadio: 'qrcode' });
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

    // const banks = from(this.priceOption.trade.banks);
    // const resultGroup = banks.pipe(
    //   groupBy(bank => bank.abb),
    //   mergeMap(group => group.pipe(toArray()))
    // );

    // resultGroup.subscribe((data) => {

    //   const myNewList = data.filter((obj, index, array) =>
    //     index === array.findIndex((findTest) =>
    //       findTest.installment === obj.installment
    //     )
    //   );
    //   console.log(myNewList);

    // });

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
            (installment.installmentMounth === installmentMonth) &&
            (installment.installmentPercentage === installmentPercentage)
        );

      if (existInstallments.length === 0 && (installmentMonth)) {
        const installmentData: PaymentDetailInstallment = {
          installmentMounth: installmentMonth,
          installmentPercentage: installmentPercentage
        };

        installmentDatas.push(installmentData);
      } else {

      }
    });
    return installmentDatas.sort((a: any, b: any) => {
      return a.installmentMounth > b.installmentMounth ? -1 : 1;
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

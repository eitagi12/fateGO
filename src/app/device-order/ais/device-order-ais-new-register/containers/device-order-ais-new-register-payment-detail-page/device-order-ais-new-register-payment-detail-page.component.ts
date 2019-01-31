import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, CampaignSliderInstallment } from 'mychannel-shared-libs';
import { ReceiptInfo } from 'mychannel-shared-libs/lib/component/receipt-info/receipt-info.component';
import {
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_VALIDATE_CUSTOMER_PAGE,
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_VALIDATE_CUSTOMER_ID_CARD_PAGE,
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_CUSTOMER_INFO_PAGE
} from 'src/app/device-order/ais/device-order-ais-new-register/constants/route-path.constant';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { TransactionAction, Transaction } from 'src/app/shared/models/transaction.model';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOption, PrivilegeTradeBank, PrivilegeTradeInstallment } from 'src/app/shared/models/price-option.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { from } from 'rxjs/internal/observable/from';
import { groupBy, mergeMap, toArray, distinct } from 'rxjs/operators';

export interface PaymentDetailQRCode {
  id: number;
  name: string;
  imageUrl: string;
  qrType: string;
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

  transaction: Transaction;
  receiptInfo: ReceiptInfo = {
    taxId: '',
    branch: '',
    buyer: '',
    buyerAddress: '',
    telNo: ''
  };
  priceOption: PriceOption;

  // paymentDetail: PaymentDetail;
  qrCodes: PaymentDetailQRCode[];
  selectQRCode: PaymentDetailQRCode;
  isAdvancePayment = false;

  banks: PrivilegeTradeBank[];
  selectBank: PrivilegeTradeBank;

  installments: PrivilegeTradeInstallment[];
  paymentType: string;
  paymentForm: FormGroup;
  error: boolean;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private homeService: HomeService,
    private priceOptionService: PriceOptionService,
    private transactionService: TransactionService
  ) {
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();
  }

  ngOnInit() {
    this.createForm();
    this.qrCodes = this.getQRCode();
    this.banks = this.groupPrivilegeTradeBankByAbb(this.priceOption.trade.banks);
    this.checkPaymentType();

  }
  createForm() {
    this.paymentForm = this.fb.group({
      paymentTypeRadio: [null, Validators.required]
    });

    this.paymentForm.valueChanges.subscribe(observer => {
      // if (observer.paymentType === 'qrcode') {
      //   this.error = this.selectQRCode ? true : false;
      // } else if (observer.paymentType === 'credit') {
      //   if (this.isAdvancePayment) {
      //     this.error = this.selectBank ? true : false;
      //   } else {
      //     this.error = this.selectBank && this.selectBank.installment ? true : false;
      //   }
      // } else {
      //   this.error = true;
      // }
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
    this.paymentForm.patchValue({ paymentTypeRadio: 'qrcode' });
  }
  onSelectBank(bank: PrivilegeTradeBank) {
    this.selectBank = Object.assign({}, bank);
    this.selectBank.installment = null;
    this.installments = bank.installmentDatas;
    this.paymentForm.patchValue({ paymentTypeRadio: 'credit' });
  }
  onSelectInstallment(installment: PrivilegeTradeInstallment) {
    this.selectBank.installment = Object.assign({}, installment);
    this.paymentForm.patchValue({ paymentTypeRadio: 'credit' });
  }

  checkPaymentType() {
    this.paymentType = 'CA/CC'; // this.priceOption.trade.payments.filter(payment => payment.method !== 'PP')[0].method;
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

  groupPrivilegeTradeBankByAbb(banks: PrivilegeTradeBank[]) {

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

    const newPrivilegTradeBankByAbbs = new Array<PrivilegeTradeBank>();
    const grouped = this.groupBy(banks, (bank: PrivilegeTradeBank) => bank.abb);
    const groupedKeys = Array.from(grouped.keys());
    for (const groupedKey of groupedKeys) {
      const groupBanks: PrivilegeTradeBank[] = grouped.get(groupedKey);
      const privilegTradeBank: PrivilegeTradeBank = {
        abb: groupBanks[0].abb,
        name: groupBanks[0].name,
        imageUrl: groupBanks[0].imageUrl,
        promotion: groupBanks[0].promotion,
        installmentDatas: this.getBanksInstallmentDatas(groupBanks),
        installment: null,
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

  public getBanksInstallmentDatas(banks: PrivilegeTradeBank[]) {
    const installmentDatas = new Array<PrivilegeTradeInstallment>();
    try {
      banks.forEach((bank: any) => {
        const installmentPercentage = this.getBankInstallmentPercentage(bank.installment) ? this.getBankInstallmentPercentage(bank.installment) : 0;
        const installmentMonth = this.getBankInstallmentMonth(bank.installment) ? this.getBankInstallmentMonth(bank.installment) : 0;

        const existInstallments = installmentDatas
          .filter(
            installment =>
              (installment.installmentMounth === installmentMonth) &&
              (installment.installmentPercentage === installmentPercentage)
          );

        if (existInstallments.length === 0 && (installmentMonth)) {
          const installmentData: PrivilegeTradeInstallment = {
            installmentMounth: installmentMonth,
            installmentPercentage: installmentPercentage
          };

          installmentDatas.push(installmentData);
        } else {

        }
      });
    } catch (error) {
      console.log(error);
    }
    return installmentDatas.sort((a: any, b: any) => {
      return a.installmentMounth < b.installmentMounth ? -1 : 1;
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

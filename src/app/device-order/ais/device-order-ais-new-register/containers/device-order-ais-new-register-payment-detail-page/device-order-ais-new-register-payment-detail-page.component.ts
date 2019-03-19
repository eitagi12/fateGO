import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {
  HomeService, ShoppingCart, PaymentDetail, SelectPaymentDetail,
  PaymentDetailQRCode, PaymentDetailBank, PaymentDetailInstallment,
  PaymentDetailOption,
  ReceiptInfo,
  Utils
} from 'mychannel-shared-libs';
import {
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_VALIDATE_CUSTOMER_PAGE,
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_VALIDATE_CUSTOMER_ID_CARD_PAGE,
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_CUSTOMER_INFO_PAGE
} from 'src/app/device-order/ais/device-order-ais-new-register/constants/route-path.constant';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { TransactionAction, Transaction, Customer, Payment } from 'src/app/shared/models/transaction.model';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { from } from 'rxjs/internal/observable/from';
import { groupBy, mergeMap, toArray, distinct, debounceTime } from 'rxjs/operators';
import { PriceOptionUtils } from 'src/app/shared/utils/price-option-utils';

// export interface PaymentDetail {
//   title?: string;
//   header?: string;
//   price?: string;
// }
// export interface PaymentDetailQRCode {
//   id: number;
//   name: string;
//   imageUrl: string;
//   qrType: string;
// }
// export interface PaymentDetailAdvancePay {
//   amount: number;
//   installmentFlag: string;
//   matAirtime: string;
//   description: string;
//   promotions: PaymentDetailAdvancePayPromotion[];
// }
// export interface PaymentDetailAdvancePayPromotion {
//   promotionCode: string;
//   promotionName: string;
//   productType: string;
//   billingSystem: string;
// }
// export interface PaymentDetailBank {
//   abb: string;
//   name: string;
//   imageUrl: string;
//   promotion: string;
//   installments: PaymentDetailInstallment[];
//   remark: string;
// }
// export interface PaymentDetailInstallment {
//   installmentPercentage: number;
//   installmentMonth: number;
// }

export const CASH_PAYMENT = 'CA';
export const CREDIT_CARD_PAYMENT = 'CC';
export const CASH_AND_CREDIT_CARD_PAYMENT = 'CC/CA';

@Component({
  selector: 'app-device-order-ais-new-register-payment-detail-page',
  templateUrl: './device-order-ais-new-register-payment-detail-page.component.html',
  styleUrls: ['./device-order-ais-new-register-payment-detail-page.component.scss']
})
export class DeviceOrderAisNewRegisterPaymentDetailPageComponent implements OnInit, OnDestroy {

  wizards = WIZARD_DEVICE_ORDER_AIS;

  shoppingCart: ShoppingCart;
  priceOption: PriceOption;
  transaction: Transaction;

  paymentDetailForm: FormGroup;
  isBankCollapsed = false;
  banks: any[];
  banksPayment: any[];

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
    private utils: Utils,
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
    this.banks = this.priceOption.trade.banks || [];

    this.shoppingCart = this.shoppingCartService.getShoppingCartData();

    const customer: any = this.transaction.data.customer || {};
    const receiptInfo: any = this.transaction.data.receiptInfo || {};


    this.receiptInfo = {
      taxId: customer.idCardNo,
      branch: '',
      buyer: `${customer.titleName} ${customer.firstName} ${customer.lastName}`,
      buyerAddress: this.utils.getCurrentAddress({
        homeNo: customer.homeNo,
        moo: customer.moo,
        mooBan: customer.mooBan,
        room: customer.room,
        floor: customer.floor,
        buildingName: customer.buildingName,
        soi: customer.soi,
        street: customer.street,
        tumbol: customer.tumbol,
        amphur: customer.amphur,
        province: customer.province,
        zipCode: customer.zipCode,
      }),
      telNo: receiptInfo.telNo
    };

    this.createForm();
  }

  createForm(): void {

    const fullPayment = this.isFullPayment();

    this.paymentDetailForm = this.fb.group({
      'paymentQrCodeType': [''],
      'paymentType': ['DEBIT', Validators.required],
      'paymentForm': [''],
      'paymentBank': [''],
      'paymentMethod': ['']
    }, { validator: this.customValidate.bind(this) });

    this.paymentDetailForm.controls['paymentType'].valueChanges.subscribe((type: any) => {
      this.paymentDetailForm.patchValue({
        paymentQrCodeType: '',
        paymentBank: ''
      });
    });

    this.paymentDetailForm.controls['paymentBank'].valueChanges.subscribe((bank: any) => {
      this.paymentDetailForm.patchValue({ paymentMethod: '' });
      if (fullPayment) {
        return;
      }
      this.banksPayment = this.banks
        .filter(b => b.abb === bank.abb)
        .reduce((prev, curr) => {
          const instalmment = curr.installment.split(/เดือน|%/);
          if (instalmment && instalmment.length >= 1) {
            curr.percentage = +instalmment[0];
            curr.month = +instalmment[1];
          } else {
            curr.percentage = 0;
            curr.month = 0;
          }
          if (!prev.find(p => p.month === curr.month && p.percentage === curr.percentage)) {
            prev.push(curr);
          }
          return prev;
        }, [])
        .sort((a, b) => {
          // month + percentage to string and convert to number
          const aMonthAndPercentage = +`${a.month}${a.percentage}`;
          const bMonthAndPercentage = +`${b.month}${b.percentage}`;
          return bMonthAndPercentage - aMonthAndPercentage;
        });
    });

    this.paymentDetailForm.patchValue({
      paymentForm: fullPayment ? 'FULL' : 'INSTALLMENT'
    });
    this.paymentDetailForm.controls['paymentForm'].disable();
  }

  customValidate(group: FormGroup) {
    switch (group.value.paymentType) {
      case 'QR_CODE':
        if (!group.value.paymentQrCodeType) {
          return { field: 'paymentQrCodeType' };
        }
        break;
      case 'CREDIT':
        if (group.value.paymentBank) {
          if (!this.isFullPayment() && !group.value.paymentMethod) {
            return { field: 'paymentMethod' };
          }
        } else {
          return { field: 'paymentBank' };
        }
        break;
    }
    return null;
  }

  isFullPayment(): boolean {
    const trade = this.priceOption.trade || {};
    const payment = (trade.payments || []).find(p => p.method !== 'PP') || {};
    switch (payment.method) {
      case 'CC':
        const installments = PriceOptionUtils.getInstallmentsFromTrades([trade]);
        if (installments) {
          return false;
        } else {
          return true;
        }
      case 'CA':
      case 'CA/CC':
      default:
        return true;
    }
  }

  getBanks(): any[] {
    return this.banks.reduce((prev, curr) => {
      const exists = prev.find(p => p.abb === curr.abb);
      if (!exists) {
        prev.push(curr);
      }
      return prev;
    }, []);
  }

  onSelectBank(bank: any): void {
    this.banks.forEach((b: any) => {
      b.checked = false;
    });
    bank.checked = true;
    this.banksPayment = this.banks
      .filter(b => b.abb === bank.abb)
      .reduce((prev, curr) => {
        const instalmment = curr.installment.split(/เดือน|%/);
        if (instalmment && instalmment.length >= 1) {
          curr.percentage = +instalmment[0];
          curr.month = +instalmment[1];
        } else {
          curr.percentage = 0;
          curr.month = 0;
        }
        prev.push(curr);
        return prev;
      }, [])
      .sort((a, b) => {
        // month + percentage to string and convert to number
        const aMonthAndPercentage = +`${a.month}${a.percentage}`;
        const bMonthAndPercentage = +`${b.month}${b.percentage}`;
        return bMonthAndPercentage - aMonthAndPercentage;
      });
  }

  onBack() {
    if (TransactionAction.KEY_IN === this.transaction.data.action) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_VALIDATE_CUSTOMER_PAGE]);
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_VALIDATE_CUSTOMER_ID_CARD_PAGE]);
    }
  }

  isNext(): boolean {
    return this.paymentDetailForm.valid && this.receiptInfoValid;
  }

  onNext() {
    this.transaction.data.payment = Object.assign({
      paymentForm: this.isFullPayment() ? 'FULL' : 'INSTALLMENT'
    }, this.paymentDetailForm.value);
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_CUSTOMER_INFO_PAGE]);
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


  // getFullAddress(customer: Customer) {
  //   if (!customer) {
  //     return '-';
  //   }
  //   const fullAddress =
  //     (customer.homeNo ? customer.homeNo + ' ' : '') +
  //     (customer.moo ? 'หมู่ที่ ' + customer.moo + ' ' : '') +
  //     (customer.mooBan ? 'หมู่บ้าน ' + customer.mooBan + ' ' : '') +
  //     (customer.room ? 'ห้อง ' + customer.room + ' ' : '') +
  //     (customer.floor ? 'ชั้น ' + customer.floor + ' ' : '') +
  //     (customer.buildingName ? 'อาคาร ' + customer.buildingName + ' ' : '') +
  //     (customer.soi ? 'ซอย ' + customer.soi + ' ' : '') +
  //     (customer.street ? 'ถนน ' + customer.street + ' ' : '') +
  //     (customer.tumbol ? 'ตำบล/แขวง ' + customer.tumbol + ' ' : '') +
  //     (customer.amphur ? 'อำเภอ/เขต ' + customer.amphur + ' ' : '') +
  //     (customer.province ? 'จังหวัด ' + customer.province + ' ' : '') +
  //     (customer.zipCode || '');
  //   return fullAddress || '-';
  // }

  // onSelectPaymentType(paymentType: string) {
  //   this.selectPaymentDetail.paymentType = paymentType;
  // }
  // onSelectQRCode(qrCode: PaymentDetailQRCode) {
  //   this.selectPaymentDetail.qrCode = Object.assign({}, qrCode);
  //   this.selectPaymentDetailAdvancePay.qrCode = Object.assign({}, qrCode);
  // }
  // onSelectBankx(bank: PaymentDetailBank) {
  //   this.selectPaymentDetail.bank = Object.assign({}, bank);
  //   this.selectPaymentDetail.bank.installments = undefined;
  //   this.paymentDetail.installments = bank.installments; // Object.assign({}, bank.installments);
  // }
  // onSelectInstallment(installment: PaymentDetailInstallment[]) {
  //   this.selectPaymentDetail.bank.installments = Object.assign({}, installment);
  // }


  // onSelectPaymentTypeAdvancePay(paymentType: string) {
  //   this.selectPaymentDetailAdvancePay.paymentType = paymentType;
  // }
  // onSelectQRCodeAdvancePay(qrCode: PaymentDetailQRCode) {
  //   this.selectPaymentDetail.qrCode = Object.assign({}, qrCode);
  //   this.selectPaymentDetailAdvancePay.qrCode = Object.assign({}, qrCode);
  // }
  // onSelectBankAdvancePay(bank: PaymentDetailBank) {
  //   this.selectPaymentDetailAdvancePay.bank = Object.assign({}, bank);
  //   this.selectPaymentDetailAdvancePay.bank.installments = undefined;
  // }

  // checkPaymentFormValid(): boolean {
  //   const paymentType = this.selectPaymentDetail.paymentType;

  //   if (this.paymentMethod === CASH_PAYMENT) {
  //     if (paymentType === 'qrcode' && !this.selectPaymentDetail.qrCode) {
  //       return false;
  //     }
  //   }

  //   if (this.paymentMethod === CREDIT_CARD_PAYMENT) {
  //     if (paymentType === 'credit' && (!this.selectPaymentDetail.bank || !this.selectPaymentDetail.bank.installments)) {
  //       return false;
  //     }
  //   }

  //   if (this.paymentMethod === CASH_AND_CREDIT_CARD_PAYMENT) {
  //     if (paymentType === 'qrcode' && !this.selectPaymentDetail.qrCode) {
  //       return false;
  //     }
  //     if (paymentType === 'credit' && !this.selectPaymentDetail.bank) {
  //       return false;
  //     }
  //   }

  //   return true;
  // }

  // checkAdvancePaymentFormValid(): boolean {

  //   if (this.priceOption.trade.advancePay &&
  //     (this.priceOption.trade.advancePay.amount === 0 ||
  //       this.priceOption.trade.advancePay.installmentFlag === 'Y')) {
  //     return true;
  //   }

  //   const paymentType = this.selectPaymentDetailAdvancePay.paymentType;

  //   if (this.paymentMethod === CASH_PAYMENT) {
  //     if (paymentType === 'qrcode' && !this.selectPaymentDetailAdvancePay.qrCode) {
  //       return false;
  //     }
  //   }

  //   if (this.paymentMethod === CREDIT_CARD_PAYMENT) {
  //     if (paymentType === 'qrcode' && !this.selectPaymentDetailAdvancePay.qrCode) {
  //       return false;
  //     }
  //     if (paymentType === 'credit' && !this.selectPaymentDetailAdvancePay.bank) {
  //       return false;
  //     }
  //   }

  //   if (this.paymentMethod === CASH_AND_CREDIT_CARD_PAYMENT) {
  //     if (paymentType === 'qrcode' && !this.selectPaymentDetailAdvancePay.qrCode) {
  //       return false;
  //     }
  //     if (paymentType === 'credit' && !this.selectPaymentDetailAdvancePay.bank) {
  //       return false;
  //     }
  //   }

  //   return true;
  // }
  // isInstallment(): boolean {
  //   if (this.paymentMethod === 'CC' && this.selectPaymentDetail.paymentType === 'credit') {
  //     return true;
  //   }
  //   return false;
  // }
  // isEnableForm(): boolean {
  //   if (this.paymentMethod === CASH_PAYMENT) {
  //     return true;
  //   }
  //   if (this.paymentMethod === CREDIT_CARD_PAYMENT) {
  //     return false;
  //   }
  //   if (this.paymentMethod === CASH_AND_CREDIT_CARD_PAYMENT) {
  //     return true;
  //   }
  //   return true;
  // }

  // getPaymentType(): string {
  //   if (this.paymentMethod === CASH_PAYMENT) {
  //     return 'qrcode';
  //   }
  //   if (this.paymentMethod === CREDIT_CARD_PAYMENT) {
  //     return 'credit';
  //   }
  //   if (this.paymentMethod === CASH_AND_CREDIT_CARD_PAYMENT) {
  //     return 'qrcode';
  //   }
  //   return 'qrcode';

  // }

  // getPaymentMethod(paymentType: string, qrCode?: PaymentDetailQRCode): string {
  //   if (paymentType === 'qrcode' && qrCode) {
  //     if (qrCode.id === parseInt('002', 8)) { // Rabbit Line Pay
  //       return 'RL';
  //     }
  //     if (qrCode.id === parseInt('003', 8)) { // Thai QR Payment
  //       return 'PB';
  //     }
  //   }
  //   if (paymentType === 'debit') {
  //     return 'CA';
  //   }
  //   if (paymentType === 'credit') {
  //     return 'CC';
  //   }
  //   return '';
  // }

  // getQRCode() {
  //   return [
  //     {
  //       id: 1,
  //       name: 'Thai QR Payment',
  //       imageUrl: 'assets/images/icon/Thai_Qr_Payment.png',
  //       qrType: '003'
  //     },
  //     {
  //       id: 2,
  //       name: 'Rabbit Line Pay',
  //       imageUrl: 'assets/images/icon/Rabbit_Line_Pay.png',
  //       qrType: '002'
  //     }
  //   ];
  // }

  // groupPrivilegeTradeBankByAbb(banks: PaymentDetailBank[]) {

  //   const newPrivilegTradeBankByAbbs = new Array<PaymentDetailBank>();
  //   const grouped = this.groupBy(banks, (bank: PaymentDetailBank) => bank.abb);
  //   const groupedKeys = Array.from(grouped.keys());
  //   for (const groupedKey of groupedKeys) {
  //     const groupBanks: PaymentDetailBank[] = grouped.get(groupedKey);
  //     const privilegTradeBank: PaymentDetailBank = {
  //       abb: groupBanks[0].abb,
  //       name: groupBanks[0].name,
  //       imageUrl: groupBanks[0].imageUrl,
  //       promotion: groupBanks[0].promotion,
  //       installments: this.getBanksInstallmentDatas(groupBanks),
  //       remark: groupBanks[0].remark
  //     };
  //     newPrivilegTradeBankByAbbs.push(privilegTradeBank);
  //   }

  //   return newPrivilegTradeBankByAbbs;
  // }

  // private groupBy(list: any, keyGetter: any) {
  //   const map = new Map();
  //   list.forEach((item) => {
  //     const key = keyGetter(item);
  //     const collection = map.get(key);
  //     if (!collection) {
  //       map.set(key, [item]);
  //     } else {
  //       collection.push(item);
  //     }
  //   });
  //   return map;
  // }

  // public getBanksInstallmentDatas(banks: PaymentDetailBank[]) {
  //   const installmentDatas = new Array<PaymentDetailInstallment>();
  //   banks.forEach((bank: any) => {
  //     const installmentPercentage = this.getBankInstallmentPercentage(bank.installment) ?
  //       this.getBankInstallmentPercentage(bank.installment) : 0;
  //     const installmentMonth = this.getBankInstallmentMonth(bank.installment) ? this.getBankInstallmentMonth(bank.installment) : 0;

  //     const existInstallments = installmentDatas
  //       .filter(
  //         installment =>
  //           (installment.installmentMonth === installmentMonth) &&
  //           (installment.installmentPercentage === installmentPercentage)
  //       );

  //     if (existInstallments.length === 0 && (installmentMonth)) {
  //       const installmentData: PaymentDetailInstallment = {
  //         installmentMonth: installmentMonth,
  //         installmentPercentage: installmentPercentage
  //       };

  //       installmentDatas.push(installmentData);
  //     } else {

  //     }
  //   });
  //   return installmentDatas.sort((a: any, b: any) => {
  //     return a.installmentMonth > b.installmentMonth ? -1 : 1;
  //   });
  // }
  // public getBankInstallmentMonth(installmentRemark: string) {
  //   const month = this.getInstallmentFormRemark(installmentRemark)['month'];
  //   return month !== undefined ? month : 0;
  // }

  // public getBankInstallmentPercentage(installmentRemark: string) {
  //   const percentage = this.getInstallmentFormRemark(installmentRemark)['percentage'];
  //   return percentage !== undefined ? percentage : 0;
  // }

  // private getInstallmentFormRemark(installmentRemark: string) {
  //   const installment = {
  //     percentage: 0,
  //     month: 0
  //   };
  //   const monthWord = 'เดือน';
  //   if (installmentRemark && installmentRemark !== '' && installmentRemark.includes('%') && installmentRemark.includes(monthWord)) {
  //     const trimInstallmentString = installmentRemark.replace(/\s+/g, '');
  //     const installmentData = (/^\s?(\d+.?\d*)\s?\%\s?(\d+)/.exec(trimInstallmentString));
  //     installment.percentage = +installmentData[1];
  //     installment.month = +installmentData[2];
  //     return installment;
  //   } else {
  //     return installment;
  //   }
  // }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { HomeService, ShoppingCart, PaymentDetail, SelectPaymentDetail, PaymentDetailOption, PaymentDetailQRCode, PaymentDetailBank, PaymentDetailInstallment, User, TokenService } from 'mychannel-shared-libs';
import { ROUTE_DEVICE_ORDER_AIS_BEST_BUY_MOBILE_DETAIL_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_MOBILE_CARE_AVAILABLE_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_MOBILE_CARE_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_VALIDATE_CUSTOMER_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_VALIDATE_CUSTOMER_REPI_PAGE } from 'src/app/device-order/ais/device-order-ais-existing-best-buy/constants/route-path.constant';
import { Transaction, ExistingMobileCare, Customer } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { ReceiptInfo } from 'mychannel-shared-libs/lib/component/receipt-info/receipt-info.component';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { CreateDeviceOrderBestBuyService } from '../../services/create-device-order-best-buy.service';

export const CASH_PAYMENT = 'CA';
export const CREDIT_CARD_PAYMENT = 'CC';
export const CASH_AND_CREDIT_CARD_PAYMENT = 'CC/CA';
@Component({
  selector: 'app-device-order-ais-existing-best-buy-payment-detail-page',
  templateUrl: './device-order-ais-existing-best-buy-payment-detail-page.component.html',
  styleUrls: ['./device-order-ais-existing-best-buy-payment-detail-page.component.scss']
})
export class DeviceOrderAisExistingBestBuyPaymentDetailPageComponent implements OnInit, OnDestroy {

  wizards: any = WIZARD_DEVICE_ORDER_AIS;

  transaction: Transaction;
  shoppingCart: ShoppingCart;
  priceOption: PriceOption;
  user: User;

  receiptInfo: ReceiptInfo;
  receiptInfoValid: boolean = true;

  paymentDetail: PaymentDetail;
  selectPaymentDetail: SelectPaymentDetail;
  paymentDetailOption: PaymentDetailOption;

  paymentMethod: string;

  selectQRCode: PaymentDetailQRCode;
  selectBank: PaymentDetailBank;
  // installments: PaymentDetailInstallment[];

  selectQRCodeAdvancePay: PaymentDetailQRCode;
  selectBankAdvancePay: PaymentDetailBank;

  paymentForm: FormGroup;
  discountForm: FormGroup;

  formID: string;
  showQRCode: boolean;
  depositOrDiscount: boolean;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private http: HttpClient,
    private shoppingCartService: ShoppingCartService,
    private priceOptionService: PriceOptionService,
    private createDeviceOrderBestBuyService: CreateDeviceOrderBestBuyService,
    private fb: FormBuilder,
    private tokenService: TokenService,
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.user = this.tokenService.getUser();
   }

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    this.formID = this.getRandomNum(10);
    this.depositOrDiscount = this.transaction.data.preBooking
                && this.transaction.data.preBooking.depositAmt
                && this.transaction.data.preBooking.preBookingNo ? true : false;
    // this.transaction.data.preBooking = {
    //   depositAmt: '2000',
    //   preBookingNo: 'BP201903040000001',
    //   deliveryDt: '25/02/2019 08:00'
    // };
    const productDetail = this.priceOption.productDetail;
    const productInfo = this.priceOption.productStock;
    if (this.priceOption.trade.payments.length > 0) {
      this.paymentMethod = this.priceOption.trade.payments.filter(payment => payment.method !== 'PP')[0].method || '';
    } else {
      this.paymentMethod = this.priceOption.trade.payments.method || '';
    }

    this.showQRCode = this.paymentMethod !== 'CC' && this.user.userType !== 'ASP'
              && this.user.channelType !== 'sff-web' && this.priceOption.productStock.company === 'AWN'
              && this.user.username.toLowerCase() === 'duangdat';
    // this.showQRCode = true;

    this.onLoadDefaultBankData(this.priceOption.trade.banks).then((banks) => {
      this.priceOption.trade.banks = banks;
      // ############################################## payment detail ##############################################
      this.paymentDetail = {
        title: 'รูปแบบการชำระเงิน',
        header: 'ค่าเครื่อง ' + productDetail.name + ' สี ' + productInfo.colorName,
        price: this.priceOption.trade.promotionPrice,
        qrCodes: this.getQRCode(),
        banks: this.groupPrivilegeTradeBankByAbb(this.priceOption.trade.banks)
      };
    });

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

    this.createForm();
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

  onHome(): void {
    this.homeService.goToHome();
  }

  onBack(): void {
    const repi = this.transaction.data.customer.repi;
    if (repi) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_VALIDATE_CUSTOMER_REPI_PAGE]);
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_MOBILE_DETAIL_PAGE]);
    }
  }

  onNext(): void {
    const mobileNo = this.transaction.data.simCard.mobileNo;
    this.http.get(`/api/customerportal/get-existing-mobile-care/${mobileNo}`).toPromise().then((response: any) => {
      const exMobileCare = response.data;
      if (exMobileCare.hasExistingMobileCare) {
        const existingMobileCare: ExistingMobileCare = exMobileCare.existMobileCarePackage;
        existingMobileCare.handSet = exMobileCare.existHandSet;
        this.transaction.data.existingMobileCare = existingMobileCare;
        this.transaction.data.payment = {
          method: this.paymentMethod,
          type: this.selectPaymentDetail.paymentType,
          qrCode: this.selectPaymentDetail.qrCode,
          bank: this.selectPaymentDetail.bank
        };
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_MOBILE_CARE_AVAILABLE_PAGE]);
      } else {
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_MOBILE_CARE_PAGE]);
      }
    });
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

  onLoadDefaultBankData(banks: PaymentDetailBank[]): Promise<any> {
    return new Promise((resolve, reject) => {
      if (banks && banks.length > 0) {
        resolve(banks);
      } else {
        this.createDeviceOrderBestBuyService.getBanks().then((bankByLocation) => {
          resolve(bankByLocation);
        }).catch((err: any) => resolve([]));
      }
    });
  }

  onReceiptInfoCompleted(receiptInfo: ReceiptInfo): void {
    this.transaction.data.receiptInfo = receiptInfo;
  }

  onReceiptInfoError(error: boolean): void {
    this.receiptInfoValid = error;
  }

  getFullAddress(customer: Customer): string {
    if (!customer) {
      return '-';
    }
    const fullAddress: string =
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

  onSelectPaymentType(paymentType: string): void {
    this.selectPaymentDetail.paymentType = paymentType;
  }
  onSelectQRCode(qrCode: PaymentDetailQRCode): void {
    this.selectPaymentDetail.qrCode = Object.assign({}, qrCode);
    // this.selectPaymentDetailAdvancePay.qrCode = Object.assign({}, qrCode);
  }
  onSelectBank(bank: PaymentDetailBank): void {
    this.selectPaymentDetail.bank = Object.assign({}, bank);
    this.selectPaymentDetail.bank.installments = undefined;
    this.paymentDetail.installments = bank.installments; // Object.assign({}, bank.installments);
  }
  onSelectInstallment(installment: PaymentDetailInstallment[]): void {
    this.selectPaymentDetail.bank.installments = Object.assign({}, installment);
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

  getQRCode(): any {
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
    this.discountForm = this.fb.group({
      discountType: [null, Validators.required]
    });

    if (this.transaction.data.preBooking && this.transaction.data.preBooking.depositAmt) {
      this.discountForm.controls['discountType'].setValue('preBooking');
    }

    this.discountForm.valueChanges.subscribe(observer => {
      this.transaction.data.discount = { type: observer.paymentType };
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
}

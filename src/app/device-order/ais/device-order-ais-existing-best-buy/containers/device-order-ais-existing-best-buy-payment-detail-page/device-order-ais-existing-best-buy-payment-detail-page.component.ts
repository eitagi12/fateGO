import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';

import { ApiRequestService, PageLoadingService, HomeService, ShoppingCart, PaymentDetail, SelectPaymentDetail, PaymentDetailOption, PaymentDetailQRCode, PaymentDetailBank, PaymentDetailInstallment } from 'mychannel-shared-libs';
import { ROUTE_DEVICE_ORDER_AIS_BEST_BUY_MOBILE_DETAIL_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_MOBILE_CARE_AVAILABLE_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_MOBILE_CARE_PAGE } from 'src/app/device-order/ais/device-order-ais-existing-best-buy/constants/route-path.constant';
import { Transaction, ExistingMobileCare, Customer } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { ReceiptInfo } from 'mychannel-shared-libs/lib/component/receipt-info/receipt-info.component';
import { ShoppingCartService } from 'src/app/device-order/service/shopping-cart.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';


export const CASH_PAYMENT = 'CA';
export const CREDIT_CARD_PAYMENT = 'CC';
export const CASH_AND_CREDIT_CARD_PAYMENT = 'CC/CA';
@Component({
  selector: 'app-device-order-ais-existing-best-buy-payment-detail-page',
  templateUrl: './device-order-ais-existing-best-buy-payment-detail-page.component.html',
  styleUrls: ['./device-order-ais-existing-best-buy-payment-detail-page.component.scss']
})
export class DeviceOrderAisExistingBestBuyPaymentDetailPageComponent implements OnInit, OnDestroy {

  wizards = WIZARD_DEVICE_ORDER_AIS;

  identityValid = true;
  transaction: Transaction;
  shoppingCart: ShoppingCart;
  priceOption: PriceOption;

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
    private homeService: HomeService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private apiRequestService: ApiRequestService,
    private http: HttpClient,
    private shoppingCartService: ShoppingCartService,
    private priceOptionService: PriceOptionService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
   }

  ngOnInit() {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    if (this.priceOption.trade.payments.length > 0) {
      this.paymentMethod = this.priceOption.trade.payments.filter(payment => payment.method !== 'PP')[0].method || '';
    } else {
      this.paymentMethod = this.priceOption.trade.payments.method || '';
    }

    this.priceOption.trade.advancePay.amount = 1000;
    this.priceOption.trade.advancePay.installmentFlag = 'N';
    this.paymentMethod = 'CC/CA';

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

  onHome() {
    this.homeService.goToHome();
  }

  onBack() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_MOBILE_DETAIL_PAGE]);
  }

  onNext() {
    const mobileNo = this.transaction.data.simCard.mobileNo;
    this.http.get(`/api/customerportal/get-existing-mobile-care/${mobileNo}`).toPromise().then((response: any) => {
      const exMobileCare = response.data;
      if (exMobileCare.hasExistingMobileCare) {
        const existingMobileCare: ExistingMobileCare = exMobileCare.existMobileCarePackage;
        existingMobileCare.handSet = exMobileCare.existHandSet;
        this.transaction.data.existingMobileCare = existingMobileCare;
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_MOBILE_CARE_AVAILABLE_PAGE]);
      } else {
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_MOBILE_CARE_PAGE]);
      }
    });
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
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

}

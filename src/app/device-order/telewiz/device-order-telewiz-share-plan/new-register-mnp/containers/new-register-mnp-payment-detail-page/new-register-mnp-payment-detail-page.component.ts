import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import {
  WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN_TELEWIZ,
  WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN_JAYMART
} from 'src/app/device-order/constants/wizard.constant';
import { ShoppingCart, ReceiptInfo, Utils, PaymentDetail, PaymentDetailBank, TokenService, User } from 'mychannel-shared-libs';
import { PriceOption, PrivilegeTradeInstallment } from 'src/app/shared/models/price-option.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOptionUtils } from 'src/app/shared/utils/price-option-utils';
import {
  ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_VALIDATE_CUSTOMER_PAGE,
  ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_CUSTOMER_INFO_PAGE
} from '../../constants/route-path.constant';
import { BanksPromotionService } from 'src/app/device-order/services/banks-promotion.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { RemoveCartService } from '../../services/remove-cart.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-new-register-mnp-payment-detail-page',
  templateUrl: './new-register-mnp-payment-detail-page.component.html',
  styleUrls: ['./new-register-mnp-payment-detail-page.component.scss']
})
export class NewRegisterMnpPaymentDetailPageComponent implements OnInit, OnDestroy {
  wizards: string[];
  wizardTelewiz: string[] = WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN_TELEWIZ;
  wizardJaymart: string[] = WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN_JAYMART;

  shoppingCart: ShoppingCart;
  priceOption: PriceOption;
  transaction: Transaction;

  payementDetail: PaymentDetail;
  banks: PaymentDetailBank[];
  paymentDetailValid: boolean;

  receiptInfo: ReceiptInfo;
  receiptInfoValid: boolean;

  paymentDetailTemp: any;
  receiptInfoTemp: any;
  user: User;

  paymentForm: FormGroup;
  private paymentType: string;
  paymentTypeRadio: any = {
    type: '',
    checked: ''
  };
  public disabledCreditCardRadio: boolean = true;
  public $isFullPayment: string = 'installment';
  private isDiscount: boolean;
  private sortInstallmentList: any = new Array<PrivilegeTradeInstallment>();
  private selectBank: any;
  public selectBankInstallment: PrivilegeTradeInstallment;
  selectBankEvent: EventEmitter<any>;
  invalidSelectBank: boolean = true;
  selectBankInTrade: any;

  constructor(
    private fb: FormBuilder,
    private utils: Utils,
    private router: Router,
    private tokenService: TokenService,
    private transactionService: TransactionService,
    private shoppingCartService: ShoppingCartService,
    private priceOptionService: PriceOptionService,
    private translateService: TranslateService,
    private banksPromotionService: BanksPromotionService,
    private removeCartService: RemoveCartService
  ) {
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();
    this.user = this.tokenService.getUser();
  }

  ngOnInit(): void {
    this.checkJaymart();
    this.createPaymentTypeForm();

    this.shoppingCart = this.shoppingCartService.getShoppingCartDataSuperKhumTelewiz();
    const paymentMethod = this.priceOption.trade.payment ? this.priceOption.trade.payment.method : '';
    const productDetail = this.priceOption.productDetail || {};
    const productStock = this.priceOption.productStock || {};
    const customer: any = this.transaction.data.customer || {};
    const receiptInfo: any = this.transaction.data.receiptInfo || {};
    const showQRCode: boolean = paymentMethod !== 'CC' && this.user.userType !== 'ASP'
      && this.user.channelType !== 'sff-web' && this.priceOption.productStock.company !== 'AWN';

    const trade: any = this.priceOption.trade || {};
    const advancePay: any = trade.advancePay || {};

    let commercialName = productDetail.name;
    if (productStock.color) {
      commercialName += ` ${this.translateService.instant('สี')} ${productStock.color}`;
    }
    this.checkPaymentType(this.priceOption.trade.payments, this.priceOption.trade.banks);
    this.payementDetail = {
      commercialName: commercialName,
      promotionPrice: +(trade.promotionPrice || 0),
      isFullPayment: this.isFullPayment(),
      installmentFlag: advancePay.installmentFlag === 'N' && +(advancePay.amount || 0) > 0,
      advancePay: +(advancePay.amount || 0),
      qrCode: showQRCode
    };
    if (trade.banks && trade.banks.length > 0) {
      if (!this.isFullPayment()) {
        this.banks = (this.priceOption.trade.banks || []).map((b: any) => {
          return b.installmentDatas.map((data: any) => {
            return {
              ...b,
              installment: `${data.installmentPercentage}% ${data.installmentMounth}`
            };
          });
        }).reduce((prev: any, curr: any) => {
          curr.forEach((element: any) => {
            prev.push(element);
          });
          return prev;
        }, []);
      } else {
        this.banks = trade.banks;
      }
    } else {
      this.banksPromotionService.getBanksPromotion(this.tokenService.getUser().locationCode)
        .then((resp: any) => {
          this.banks = resp.data || [];
        });
    }

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
  }

  checkJaymart(): void {
    const retailChain = this.priceOption.queryParams.isRole;
    if (retailChain && retailChain === 'Retail Chain') {
      this.wizards = this.wizardJaymart;
    } else {
      this.wizards = this.wizardTelewiz;
    }
  }

  onPaymentCompleted(payment: any): void {
    this.paymentDetailTemp = payment;
  }

  onPaymentError(valid: boolean): void {
    this.paymentDetailValid = valid;
  }

  onReceiptInfoCompleted(receiptInfo: ReceiptInfo): void {
    this.receiptInfoTemp = receiptInfo;
  }

  onReceiptInfoError(valid: boolean): void {
    this.receiptInfoValid = valid;
  }

  isFullPayment(): boolean {
    const trade = this.priceOption.trade || {};
    const payment = (trade.payments || []).find(p => p.method !== 'PP') || {};
    switch (payment.method) {
      case 'CC':
        if (PriceOptionUtils.getInstallmentsFromTrades([trade])) {
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

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_VALIDATE_CUSTOMER_PAGE]);
  }

  isNext(): boolean {
    return this.paymentDetailValid && this.receiptInfoValid;
  }

  onNext(): void {
    this.transaction.data.payment = this.paymentDetailTemp.payment;
    this.transaction.data.advancePayment = this.paymentDetailTemp.advancePayment;
    this.transaction.data.receiptInfo = this.receiptInfoTemp;
    this.router.navigate([ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_CUSTOMER_INFO_PAGE]);
  }

  onHome(): void {
    this.removeCartService.backToReturnStock('/', this.transaction);
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

  private createPaymentTypeForm(): void {
    this.paymentForm = this.fb.group({
      paymentType: [{ disabled: false }],
      fullPaidAndInstallment: [{ disabled: false }],
      installment: ''
    });

    // this.paymentForm.controls['fullPaidAndInstallment'].valueChanges.subscribe(fullPaidAndInstallment => {
    //   switch (fullPaidAndInstallment) {
    //     case 'full':
    //       this.isFullPayment = 'full';
    //       break;
    //     case 'installment':
    //       this.isFullPayment = 'installment';
    //       break;
    //     default:
    //       this.isFullPayment = 'installment';
    //       break;
    //   }
    // });

    this.paymentForm.controls['paymentType'].valueChanges.subscribe(paymentType => {
      switch (paymentType) {
        case 'cash':
          // this.qrcodePaymentGlobalService.setIsCashQRPayment(true);
          // this.qrcodePaymentGlobalService.setIsSelectQRCodePayment(false);
          this.paymentType = 'CA';
          this.paymentTypeRadio.type = 'cash';
          // this.selectPaymentTypeEvent.emit(this.paymentType);
          break;
        case 'credit':
          // this.qrcodePaymentGlobalService.setIsCashQRPayment(false);
          // this.qrcodePaymentGlobalService.setIsSelectQRCodePayment(false);
          this.paymentType = 'CC';
          this.paymentTypeRadio.type = 'credit';
          // this.selectPaymentTypeEvent.emit(this.paymentType);
          break;
        case 'qrcode':
          // this.qrcodePaymentGlobalService.setIsSelectQRCodePayment(true);
          // this.qrcodePaymentGlobalService.setIsCashQRPayment(false);
          this.paymentType = 'CA';
          this.paymentTypeRadio.type = 'qrcode';
          // this.selectPaymentTypeEvent.emit(this.paymentType);
          break;
        default:
          break;
      }

    });
  }

  private checkPaymentType(paymentTypes: any, banks: any): void {
    console.log('paymentTypes', paymentTypes, 'banks', banks);
    if (!paymentTypes || !paymentTypes.length || paymentTypes.length === 0) {
      this.paymentType = 'CA/CC';
      this.setRadioPayment(this.paymentType);
      return;
    }

    if (paymentTypes.length >= 1) {
      this.isDiscount = false;
      const filterPaymentTypes = paymentTypes.filter(paymentType => paymentType.method !== 'PP');
      const $paymentType = filterPaymentTypes[0];
      if ($paymentType.method === 'CA') {
        this.$isFullPayment = 'full';
        this.paymentType = 'CA';
        console.log('cash paymenttype', this.paymentType);
        this.setRadioPayment(this.paymentType);
      } else if ($paymentType.method === 'CC') {
        this.checkFullPaymentAllBank(banks);
        this.paymentType = 'CC';
        console.log('credit card paymenttype', this.paymentType);
        this.setRadioPayment(this.paymentType);
      } else if (this.checkCashAndCreditCode($paymentType.method)) {
        this.$isFullPayment = 'full';
        this.paymentType = 'CA/CC';
        this.setRadioPayment(this.paymentType);
      } else {
        this.paymentType = 'CA/CC';
        this.setRadioPayment(this.paymentType);
      }
      console.log('this.$isFullPayment', this.$isFullPayment);
    }
  }

  private setRadioPayment(paymentType: string): void {
    console.log('paymentType', paymentType);

    switch (paymentType) {
      case 'CC':
        this.paymentForm.get('paymentType').disable();
        this.paymentForm.get('fullPaidAndInstallment').disable();
        this.paymentForm.controls['paymentType'].setValue('credit');
        break;

      case 'CA':
        this.disabledCreditCardRadio = false;
        this.paymentForm.get('paymentType').enable();
        this.paymentForm.get('fullPaidAndInstallment').disable();
        this.setRadioCash();
        // if (Object.keys(this.updatePaymentDetail).length !== 0) {
        //   this.qrcodePaymentGlobalService.setIsCashQRPayment(false);
        //   this.qrcodePaymentGlobalService.setIsSelectQRCodePayment(true);
        //   this.paymentForm.controls['paymentType'].setValue('qrcode');
        // } else {
        //   this.paymentForm.controls['paymentType'].setValue('cash');
        //   this.qrcodePaymentGlobalService.setIsCashQRPayment(true);
        //   this.qrcodePaymentGlobalService.setIsSelectQRCodePayment(false);
        // }
        // if (this.qrcodePaymentGlobalService.getIsCashQRPayment()) {
        //   this.paymentForm.controls['paymentType'].setValue('cash');
        // } else {
        //   this.paymentForm.controls['paymentType'].setValue('qrcode');
        // }
        break;

      case 'CA/CC':
        this.paymentForm.get('paymentType').enable();
        this.paymentForm.get('fullPaidAndInstallment').disable();
        this.paymentType = 'CA';
        this.setRadioCash();
        break;

      default:
        this.paymentForm.get('paymentType').enable();
        this.paymentForm.get('fullPaidAndInstallment').disable();
        this.paymentForm.controls['paymentType'].setValue('cash');
        // this.qrcodePaymentGlobalService.setIsCashQRPayment(true);
        // this.qrcodePaymentGlobalService.setIsSelectQRCodePayment(false);
        break;
    }
  }

  private checkFullPaymentAllBank(banks: any): void {
    if (banks.length === 0) {
      this.paymentForm.controls['fullPaidAndInstallment'].setValue('full');
    }
  }

  private checkCashAndCreditCode($paymentMethod: string): any {
    const paymentMethodList = $paymentMethod.split('/');
    const cashMethod = 'CC';
    const creditCardMethod = 'CA';

    let isCashAndCreditCode = false;

    for (const _paymentMethod of paymentMethodList) {
      if (_paymentMethod === cashMethod || _paymentMethod === creditCardMethod) {
        isCashAndCreditCode = true;
      } else {
        isCashAndCreditCode = false;
      }
    }
    return isCashAndCreditCode;
  }

  private setRadioCash(): void {
    // let isSelectQRCode: boolean = this.qrcodePaymentGlobalService.getIsSelectQRCodePayment();
    // if (isSelectQRCode) {
      // this.paymentForm.controls['paymentType'].setValue('qrcode');
    // } else {
      this.paymentForm.controls['paymentType'].setValue('cash');
      // this.qrcodePaymentGlobalService.setIsCashQRPayment(true);
    // }
  }

  onSelectBank(bank: any): void {
    if (this.selectBank.abb !== bank.abb) {
      this.selectBankInstallment = {
        installmentPercentage: null,
        installmentMonth: null
      };
    }
    try {
      this.selectBank = bank;
      this.checkFullPaymentFromSelectBank(bank);
      this.sortInstallmentList = this.getSortInstallmentBySelectBank(bank);
      this.selectBankEvent.emit(this.selectBank);
      this.invalidSelectBank = false;
      this.selectBankInTrade = this.selectBank;
      const select: any =  this.selectBank;
      localStorage.setItem('selectBank', JSON.stringify(select));
    } catch (error) {
      console.error('error', error);
    }
  }

  private checkFullPaymentFromSelectBank(bank: any): void {
    if (bank.installmentDatas.length === 0) {
      this.paymentForm.controls['fullPaidAndInstallment'].setValue('full');
    } else {
      this.paymentForm.controls['fullPaidAndInstallment'].setValue('installment');
    }
  }

  private getSortInstallmentBySelectBank(selectBank: any): any {
    const defaultPercentage = 0;
    const defaultMonth = 10;
    const installmentList = new Array<PrivilegeTradeInstallment>();
    const defaultPercentageAndMonthList = selectBank.installmentDatas.filter(
      installmentData => installmentData.installmentPercentage === defaultPercentage && installmentData.installmentMounth === defaultMonth
      );

    if (defaultPercentageAndMonthList.length > 0) {
      const defaultPercentageAndMonth = defaultPercentageAndMonthList[0];
      installmentList.push(defaultPercentageAndMonth);
    }

    const filterInstallmentByNoDefaultInstallmentList = selectBank.installmentDatas.filter(
      installmentData => installmentData.installmentMounth !== defaultMonth || installmentData.installmentPercentage !== defaultPercentage
      );

    if (filterInstallmentByNoDefaultInstallmentList.length > 0) {
      const sortBankInstallmentList = filterInstallmentByNoDefaultInstallmentList
        .sort(
          (a, b) => {
            if (a.installmentPercentage !== b.installmentPercentage) {
              return a.installmentPercentage < b.installmentPercentage ? -1 : 1;
            } else {
              if (a.installmentMounth !== b.installmentMounth) {
                return a.installmentMounth < b.installmentMounth ? -1 : 1;
              } else {
                return 0;
              }
            }
          });
      for (const sortBankInstalment of sortBankInstallmentList) {
        installmentList.push(sortBankInstalment);
      }
    }
    return installmentList;
  }

}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {
  HomeService, ShoppingCart, ReceiptInfo, Utils
} from 'mychannel-shared-libs';
import {
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_VALIDATE_CUSTOMER_PAGE,
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_VALIDATE_CUSTOMER_ID_CARD_PAGE,
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_CUSTOMER_INFO_PAGE
} from 'src/app/device-order/ais/device-order-ais-new-register/constants/route-path.constant';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { TransactionAction, Transaction } from 'src/app/shared/models/transaction.model';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PriceOptionUtils } from 'src/app/shared/utils/price-option-utils';

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
  paymentAdvancePayForm: FormGroup;
  isBankCollapsed: boolean;
  isBankAdvancePayCollapsed: boolean;
  fullPayment: boolean;
  banks: any[];
  banksPayment: any[];

  receiptInfo: ReceiptInfo;
  receiptInfoValid = true;

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
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();

    this.banks = this.priceOption.trade.banks || [];
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

    this.fullPayment = this.isFullPayment();

    this.paymentDetailForm = this.fb.group({
      'paymentQrCodeType': [''],
      'paymentType': ['', Validators.required],
      'paymentForm': [''],
      'paymentBank': [''],
      'paymentMethod': ['']
    }, { validator: this.customValidate.bind(this) });

    // Advance pay
    this.paymentAdvancePayForm = this.fb.group({
      'paymentQrCodeType': [''],
      'paymentType': ['DEBIT', Validators.required],
      'paymentBank': ['']
    }, { validator: this.customValidate.bind(this) });

    // Events
    this.paymentDetailForm.controls['paymentType'].valueChanges.subscribe((obs: any) => {
      this.changePaymentType(obs, this.paymentDetailForm, this.paymentAdvancePayForm);
    });

    this.paymentAdvancePayForm.controls['paymentType'].valueChanges.subscribe((obs: any) => {
      this.changePaymentType(obs, this.paymentAdvancePayForm, this.paymentDetailForm);
    });

    this.paymentDetailForm.controls['paymentQrCodeType'].valueChanges.subscribe((obs: any) => {
      this.changePaymentQrCodeType(obs, this.paymentDetailForm, this.paymentAdvancePayForm);
    });

    this.paymentAdvancePayForm.controls['paymentQrCodeType'].valueChanges.subscribe((obs: any) => {
      this.changePaymentQrCodeType(obs, this.paymentAdvancePayForm, this.paymentDetailForm);
    });

    this.paymentDetailForm.controls['paymentBank'].valueChanges.subscribe((bank: any) => {
      this.paymentDetailForm.patchValue({ paymentMethod: '' });
      if (this.fullPayment) {
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
      paymentType: this.fullPayment ? 'DEBIT' : 'CREDIT',
      paymentForm: this.fullPayment ? 'FULL' : 'INSTALLMENT'
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
          if (!this.isFullPayment()
            // Advance pay จะไม่มี paymentMethod ไม่ต้อง check
            && group.controls['paymentMethod']
            && !group.value.paymentMethod) {
            return { field: 'paymentMethod' };
          }
        } else {
          return { field: 'paymentBank' };
        }
        break;
    }
    return null;
  }

  changePaymentType(paymentType: string, sourceControl: any, targetControl: any) {
    let paymentQrCodeType;
    if (paymentType === 'QR_CODE'
      && targetControl.value.paymentType === 'QR_CODE') {
      paymentQrCodeType = targetControl.value.paymentQrCodeType;
    }
    sourceControl.patchValue({
      paymentQrCodeType: paymentQrCodeType,
      paymentBank: ''
    }, { emitEvent: false });
  }

  changePaymentQrCodeType(qrCodeType: string, sourceControl: any, targetControl: any) {
    const value = targetControl.value;
    if (!(qrCodeType && value.paymentType === 'QR_CODE')) {
      return;
    }
    targetControl.patchValue({
      paymentQrCodeType: qrCodeType
    }, { emitEvent: false });
    sourceControl.patchValue({
      paymentQrCodeType: qrCodeType
    }, { emitEvent: false });
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

  isAdvancePay(): boolean {
    const trade = this.priceOption.trade;
    const advancePay = trade.advancePay || {};
    // Y = ผ่อนรวมค่าเครื่อง
    // N = ...
    return advancePay.installmentFlag === 'N' && (+advancePay.amount) > 0;
  }

  isNext(): boolean {
    let valid = this.receiptInfoValid && this.paymentDetailForm.valid;
    if (this.isAdvancePay()) {
      valid = valid && this.paymentAdvancePayForm.valid;
    }
    return valid;
  }

  onNext() {
    this.transaction.data.payment = Object.assign({
      paymentForm: this.isFullPayment() ? 'FULL' : 'INSTALLMENT'
    }, this.paymentDetailForm.value);

    if (this.isAdvancePay()) {
      this.transaction.data.advancePayment = Object.assign({}, this.paymentAdvancePayForm.value);
    }
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

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}

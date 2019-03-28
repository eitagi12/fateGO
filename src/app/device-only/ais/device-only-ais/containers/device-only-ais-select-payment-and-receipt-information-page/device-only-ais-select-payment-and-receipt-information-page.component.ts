import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { ROUTE_DEVICE_ONLY_AIS_SELECT_MOBILE_CARE_PAGE } from '../../constants/route-path.constant';
import { HomeService, ApiRequestService, AlertService, PageLoadingService, SelectPaymentDetail, PaymentDetailOption, PaymentDetailQRCode } from '../../../../../../../node_modules/mychannel-shared-libs';
import { Transaction, TransactionType, TransactionAction, Customer, Receipt } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { CreateOrderService } from '../../services/create-order.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { Product } from 'src/app/device-only/ais/device-only-ais/models/product.model';
import { HomeButtonService } from '../../services/home-button.service';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PriceOptionUtils } from 'src/app/shared/utils/price-option-utils';
@Component({
  selector: 'app-device-only-ais-select-payment-and-receipt-information-page',
  templateUrl: './device-only-ais-select-payment-and-receipt-information-page.component.html',
  styleUrls: ['./device-only-ais-select-payment-and-receipt-information-page.component.scss']
})
export class DeviceOnlyAisSelectPaymentAndReceiptInformationPageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;

  transaction: Transaction;
  public priceOption: PriceOption;
  isSuccess: boolean;
  public product: Product;
  isSelectBank: any;
  fullPayment: boolean;

  paymentDetailForm: FormGroup;

  banks: any[];
  banksPayment: any[];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private homeService: HomeService,
    private apiRequestService: ApiRequestService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private createOrderService: CreateOrderService,
    private alertService: AlertService,
    private homeButtonService: HomeButtonService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void {
    this.createForm();
    this.homeButtonService.initEventButtonHome();
    this.apiRequestService.createRequestId();
    if (!this.transaction.data) {
      this.transaction = {
        data: {
          action: TransactionAction.KEY_IN,
          transactionType: TransactionType.DEVICE_ORDER_DEVICE_ONLY
        },
        transactionId: this.createOrderService.generateTransactionId(this.apiRequestService.getCurrentRequestId())
      };
    }
    this.banks = this.priceOption.trade.banks || [];

  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onBack(): void {
    this.transactionService.remove();
    this.product = this.priceOption.queryParams;
    const brand: string = encodeURIComponent(this.product.brand ? this.product.brand : '').replace(/\(/g, '%28').replace(/\)/g, '%29');
    const model: string = encodeURIComponent(this.product.model ? this.product.model : '').replace(/\(/g, '%28').replace(/\)/g, '%29');
    // replace '%28 %29' for() case url refresh error
    const url: string = `/sales-portal/buy-product/brand/${brand}/${model}`;
    const queryParams: string =
      '?modelColor=' + this.product.color +
      '&productType' + this.product.productType +
      '&productSubType' + this.product.productSubtype;

    window.location.href = url + queryParams;
  }

  onNext(): void {
    this.transaction.data.payment = Object.assign({
      paymentForm: this.isFullPayment() ? 'FULL' : 'INSTALLMENT'
    }, this.paymentDetailForm.value);

    this.createAddToCartTrasaction();
  }

  onComplete(customerInfo: any): void {
    this.transaction.data.customer = customerInfo.customer;
    this.transaction.data.billingInformation = {
      billDeliveryAddress: customerInfo.billDeliveryAddress
    };
    this.transaction.data.receiptInfo = customerInfo.receiptInfo;
    console.log('data', customerInfo);
  }

  onError(error: boolean): void {
    this.isSuccess = error;
  }

  checkAction(action: string): void {
    if (action === 'READ_CARD') {
      this.transaction.data.action = TransactionAction.READ_CARD;
    } else {
      this.transaction.data.action = TransactionAction.KEY_IN;
    }
  }

  createAddToCartTrasaction(): void {
    this.createOrderService.createAddToCartTrasaction(this.transaction, this.priceOption).then((transaction) => {
      this.transaction = transaction;
      this.router.navigate([ROUTE_DEVICE_ONLY_AIS_SELECT_MOBILE_CARE_PAGE]);
    }).catch((e) => {
      this.alertService.error(e);
    });
  }

  // public selectBank(isselectbank: any): void {
  //   this.isSelectBank = isselectbank;
  //   console.log('this.isSelectBank ==>', this.isSelectBank);
  //   if (!this.transaction.data.payment) {
  //     console.log('111');
  //   this.transaction.data.payment = this.isSelectBank;
  //   } else {
  //     console.log('222');
  //     this.transaction.data.payment = this.isSelectBank;
  //   }
  // }

  getBanks(): any[] {
    return this.banks.reduce((prev, curr) => {
      const exists = prev.find(p => p.abb === curr.abb);
      if (!exists) {
        prev.push(curr);
      }
      return prev;
    }, []);
  }

  createForm(): void {

    this.fullPayment = this.isFullPayment();

    this.paymentDetailForm = this.fb.group({
      'paymentQrCodeType': [''],
      'paymentType': ['', Validators.required],
      'paymentForm': [''],
      'paymentBank': [''],
      'paymentMethod': ['']
    }, { validator: this.customValidate.bind(this) }
    );

    // Events
    this.paymentDetailForm.controls['paymentType'].valueChanges.subscribe((obs: any) => {
      this.changePaymentType(obs, this.paymentDetailForm);
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

  customValidate(group: FormGroup): any {
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

  changePaymentType(paymentType: string, sourceControl: any): void {
    sourceControl.patchValue({
      paymentBank: ''
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

  ngOnDestroy(): void {

    this.transactionService.save(this.transaction);
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { ROUTE_DEVICE_ONLY_AIS_SELECT_MOBILE_CARE_PAGE } from '../../constants/route-path.constant';
import { Transaction, TransactionType, TransactionAction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOptionUtils } from 'src/app/shared/utils/price-option-utils';
import { HomeService, ApiRequestService, AlertService, PaymentDetail, User, TokenService, PaymentDetailBank } from 'mychannel-shared-libs';
import { HttpClient } from '@angular/common/http';
import { WIZARD_DEVICE_ONLY_AIS } from 'src/app/device-only/constants/wizard.constant';
import { CreateOrderService } from 'src/app/device-only/services/create-order.service';
import { HomeButtonService } from 'src/app/device-only/services/home-button.service';
import { Product } from 'src/app/device-only/models/product.model';
import { CustomerInformationService } from 'src/app/device-only/services/customer-information.service';

@Component({
  selector: 'app-device-only-ais-select-payment-and-receipt-information-page',
  templateUrl: './device-only-ais-select-payment-and-receipt-information-page.component.html',
  styleUrls: ['./device-only-ais-select-payment-and-receipt-information-page.component.scss']
})
export class DeviceOnlyAisSelectPaymentAndReceiptInformationPageComponent implements OnInit, OnDestroy {
  wizards: string[] = WIZARD_DEVICE_ONLY_AIS;
  transaction: Transaction;
  public priceOption: PriceOption;
  isReceiptInformationValid: boolean;
  public product: Product;
  isSelectBank: any;
  fullPayment: boolean;
  banks: any[];
  paymentDetail: PaymentDetail;
  paymentDetailTemp: any;
  paymentDetailValid: boolean;
  paymentDetailWarehouseValid: boolean;
  customerInfoTemp: any;
  user: User;
  localtion: any;
  addessValid: boolean;
  mobileNo: any;
  warehouse: string = '63259';

  constructor(
    private router: Router,
    private http: HttpClient,
    private homeService: HomeService,
    private apiRequestService: ApiRequestService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private createOrderService: CreateOrderService,
    private alertService: AlertService,
    private homeButtonService: HomeButtonService,
    private tokenService: TokenService,
    private customerInfoService: CustomerInformationService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.user = this.tokenService.getUser();
  }

  ngOnInit(): void {
    this.homeButtonService.initEventButtonHome();
    this.apiRequestService.createRequestId();

    let commercialName = this.priceOption.productDetail.name;
    if (this.priceOption.productStock.colorName) {
      commercialName += ` สี ${this.priceOption.productStock.colorName}`;
    }
    // REFACTOR IT'S
    if (this.user.locationCode !== this.warehouse) {
      this.paymentDetail = {
        commercialName: commercialName,
        // tslint:disable-next-line:max-line-length
        promotionPrice: this.priceOption.trade.priceType === 'NORMAL' ? +(this.priceOption.trade.normalPrice) : +(this.priceOption.trade.promotionPrice),
        isFullPayment: this.isFullPayment(),
        installmentFlag: false,
        advancePay: 0,
        qrCode: true
      };
    } else {
      this.paymentDetail = {
        commercialName: commercialName,
        promotionPrice: this.priceOption.trade.priceType === 'NORMAL' ? +(this.priceOption.trade.normalPrice)
          : +(this.priceOption.trade.promotionPrice),
        isFullPayment: this.isFullPayment(),
        installmentFlag: false,
        advancePay: 0,
        qrCode: true,
        omisePayment: this.isFullPayment() && this.priceOption.productStock.company !== 'WDS'
      };
    }

    if (this.priceOption.trade.banks && this.priceOption.trade.banks.length > 0) {
      if (this.isFullPayment()) {
        this.banks = this.priceOption.trade.banks || [];
      } else {
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
      }
    } else {
      // this.localtion = this.tokenService.getUser();
      this.localtion = this.user.locationCode;
      this.http.post('/api/salesportal/banks-promotion', {
        localtion: this.localtion
      }).toPromise().then((response: any) => this.banks = response.data || '');
    }

    if (!this.transaction.data) {
      this.transaction = {
        data: {
          action: TransactionAction.KEY_IN,
          transactionType: TransactionType.DEVICE_ONLY_AIS
        },
        transactionId: this.createOrderService.generateTransactionId(this.apiRequestService.getCurrentRequestId())
      };
    } else if (this.transaction.data.customer && this.transaction.data.billingInformation) {
      this.customerInfoTemp = {
        customer: this.transaction.data.customer,
        billDeliveryAddress: this.transaction.data.billingInformation.billDeliveryAddress,
        receiptInfo: this.transaction.data.receiptInfo,
        action: this.transaction.data.action
      };
    }
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  clearstock(): any {
    this.alertService.question('ต้องการยกเลิกรายการขายหรือไม่ การยกเลิก ระบบจะคืนสินค้าเข้าสต๊อคสาขาทันที', 'ตกลง', 'ยกเลิก')
      .then((response: any) => {
        if (response.value === true) {
          this.createOrderService.cancelOrder(this.transaction).then((isSuccess: any) => {
            this.transactionService.remove();
            window.location.href = this.setPath();
          });
        }
      }).catch((err: any) => {
        this.transactionService.remove();
      });
  }

  onBack(): any {
    this.transactionService.remove();
    if (this.transaction.data && this.transaction.data.order && this.transaction.data.order.soId) {
      this.clearstock();
    } else {
      window.location.href = this.setPath();
    }
  }

  setPath(): any {
    this.product = this.priceOption.queryParams;
    const brand: string = encodeURIComponent(this.product.brand ? this.product.brand : '').replace(/\(/g, '%28').replace(/\)/g, '%29');
    const model: string = encodeURIComponent(this.product.model ? this.product.model : '').replace(/\(/g, '%28').replace(/\)/g, '%29');
    // replace '%28 %29' for() case url refresh error
    const url: string = `/sales-portal/buy-product/brand/${brand}/${model}`;
    const queryParams: string =
      '?modelColor=' + this.product.color +
      '&productType' + this.product.productType +
      '&productSubType' + this.product.productSubtype;
    return url + queryParams;
  }

  onNext(): void {
    this.transaction.data.payment = this.paymentDetailTemp.payment;
    this.createAddToCartTrasaction();
  }

  onComplete(customerInfo: any): void {
    this.transaction.data.customer = customerInfo.customer;
    this.transaction.data.billingInformation = {
      billDeliveryAddress: customerInfo.billDeliveryAddress
    };
    this.transaction.data.receiptInfo = customerInfo.receiptInfo;
    this.mobileNo = this.customerInfoService.getSelectedMobileNo();
    if (this.mobileNo) {
      this.transaction.data.simCard = {
        mobileNo: this.mobileNo
      };
    } else {
      this.transaction.data.simCard = {
        mobileNo: customerInfo.receiptInfo.telNo
      };
    }
  }

  onError(error: boolean): void {
    this.isReceiptInformationValid = error;
  }

  public onErrorAddessValid(err: boolean): void {
    this.addessValid = err;
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
      this.transaction = { ...transaction };
      this.transaction.data.device = this.createOrderService.getDevice(this.priceOption);
      this.router.navigate([ROUTE_DEVICE_ONLY_AIS_SELECT_MOBILE_CARE_PAGE]);
    }).catch((e) => {
      this.alertService.error(e);
    });
  }

  onPaymentDetailCompleted(payment: any): void {
    this.paymentDetailTemp = payment;
  }

  onPaymentDetailError(valid: boolean): void {
    this.paymentDetailValid = valid;
  }

  onPaymentDetailWarehouseError(valid: boolean): void {
    this.paymentDetailWarehouseValid = valid;
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

  isNotFormValid(): boolean {
    if (this.user.locationCode === this.warehouse) {
      return !(this.isReceiptInformationValid && this.paymentDetailValid && this.addessValid);
    } else {
      return !(this.isReceiptInformationValid && this.paymentDetailWarehouseValid && this.addessValid);
    }
  }

  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
  }

}

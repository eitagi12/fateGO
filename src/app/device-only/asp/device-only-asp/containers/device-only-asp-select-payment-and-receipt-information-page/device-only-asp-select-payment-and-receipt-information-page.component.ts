import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_DEVICE_ONLY_AIS } from 'src/app/device-only/constants/wizard.constant';
import { PaymentDetail, User, TokenService, HomeService, ApiRequestService, AlertService } from 'mychannel-shared-libs';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionUtils } from 'src/app/shared/utils/price-option-utils';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ROUTE_DEVICE_ONLY_ASP_SELECT_MOBILE_CARE_PAGE } from '../../constants/route-path.constant';
import { HomeButtonService } from 'src/app/device-only/services/home-button.service';
import { Transaction, TransactionAction, TransactionType } from 'src/app/shared/models/transaction.model';
import { CreateOrderService } from 'src/app/device-only/services/create-order.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Product } from 'src/app/device-only/models/product.model';

@Component({
  selector: 'app-device-only-asp-select-payment-and-receipt-information-page',
  templateUrl: './device-only-asp-select-payment-and-receipt-information-page.component.html',
  styleUrls: ['./device-only-asp-select-payment-and-receipt-information-page.component.scss']
})
export class DeviceOnlyAspSelectPaymentAndReceiptInformationPageComponent implements OnInit, OnDestroy {
  public wizards: string[] = WIZARD_DEVICE_ONLY_AIS;
  public banks: any[];
  public paymentDetail: PaymentDetail;
  private priceOption: PriceOption;
  private transaction: Transaction;
  private user: User;
  private product: Product;
  private commercialName: any;
  private localtion: any;
  private isReceiptInformationValid: boolean;
  private paymentDetailValid: boolean;
  public customerInfoTemp: any;
  private paymentDetailTemp: any;
  private addessValid: boolean = true;

  constructor(
    private router: Router,
    private http: HttpClient,
    private homeService: HomeService,
    private homeButtonService: HomeButtonService,
    private apiRequestService: ApiRequestService,
    private alertService: AlertService,
    private createOrderService: CreateOrderService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private tokenService: TokenService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.user = this.tokenService.getUser();
  }

  ngOnInit(): void {
    this.homeButtonService.initEventButtonHome();
    this.apiRequestService.createRequestId();
    this.getProductStock();
    this.getPaymentDetail();
    this.getBanks();
    this.createTransaction();

  }

  private getProductStock(): void {
    this.commercialName = this.priceOption.productDetail.name;
    if (this.priceOption.productStock.colorName) {
      this.commercialName += ` สี ${this.priceOption.productStock.colorName}`;
    }
  }

  private getPaymentDetail(): void {
    this.paymentDetail = {
      commercialName: this.commercialName,
      // tslint:disable-next-line:max-line-length
      promotionPrice: this.priceOption.trade.priceType === 'NORMAL' ? +(this.priceOption.trade.normalPrice) : +(this.priceOption.trade.promotionPrice),
      isFullPayment: this.isFullPayment(),
      installmentFlag: false,
      advancePay: 0,
      qrCode: false
    };
  }

  private isFullPayment(): boolean {
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

  private getBanks(): void {
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
      this.localtion = this.user.locationCode;
      this.http.post('/api/salesportal/banks-promotion', {
        localtion: this.localtion
      }).toPromise().then((response: any) => this.banks = response.data || '');
    }
  }

  private createTransaction(): void {
    if (!this.transaction.data) {
      this.transaction = {
        data: {
          action: TransactionAction.KEY_IN,
          transactionType: TransactionType.DEVICE_ONLY_ASP
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

  public onComplete(customerInfo: any): void {
    this.transaction.data.customer = customerInfo.customer;
    this.transaction.data.billingInformation = {
      billDeliveryAddress: customerInfo.billDeliveryAddress
    };
    this.transaction.data.receiptInfo = customerInfo.receiptInfo;
  }

  public checkAction(action: string): void {
    if (action === 'READ_CARD') {
      this.transaction.data.action = TransactionAction.READ_CARD;
    } else {
      this.transaction.data.action = TransactionAction.KEY_IN;
    }
  }

  private createAddToCartTrasaction(): void {
    this.createOrderService.createAddToCartTrasaction(this.transaction, this.priceOption).then((transaction) => {
      this.transaction = { ...transaction };
      this.transaction.data.device = this.createOrderService.getDevice(this.priceOption);
      this.router.navigate([ROUTE_DEVICE_ONLY_ASP_SELECT_MOBILE_CARE_PAGE]);
    }).catch((e) => {
      this.alertService.error(e);
    });
  }

  public onPaymentDetailCompleted(payment: any): void {
    this.paymentDetailTemp = payment;
  }

  public onPaymentDetailError(valid: boolean): void {
    this.paymentDetailValid = valid;
  }

  public onError(error: boolean): void {
    this.isReceiptInformationValid = error;
  }

  public onErrorAddessValid(err: boolean): void {
    this.addessValid = err;
  }

  public onHome(): void {
    this.homeService.goToHome();
  }

  public onBack(): void {
      this.alertService.info(this.user.channelType);
    if (this.user.channelType === 'sff-web') {
      if (this.transaction.data && this.transaction.data.order && this.transaction.data.order.soId) {
        this.homeService.goToHome();
        return;
      }
      this.transactionService.remove();
      this.product = this.priceOption.queryParams;
      const brand: string = encodeURIComponent(this.product.brand ? this.product.brand : '').replace(/\(/g, '%28').replace(/\)/g, '%29');
      const model: string = encodeURIComponent(this.product.model ? this.product.model : '').replace(/\(/g, '%28').replace(/\)/g, '%29');
      const imei: any = JSON.parse(localStorage.getItem('device'));

      // replace '%28 %29' for() case url refresh error
      const url: string = `/sales-portal/buy-product/brand/${brand}/${model}`;
      const queryParams: string =
        '?modelColor=' + this.product.color +
        '&productType=' + this.product.productType +
        '&productSubtype=' + this.product.productSubtype +
        '&imei=' + imei.imei +
        '&customerGroup=' + this.priceOption.customerGroup.code;
      window.location.href = url + queryParams;
      this.alertService.warning(url + queryParams);

    } else {
      if (this.transaction.data && this.transaction.data.order && this.transaction.data.order.soId) {
        this.homeService.goToHome();
        return;
      }
      this.transactionService.remove();
      this.product = this.priceOption.queryParams;
      const brand: string = encodeURIComponent(this.product.brand ? this.product.brand : '').replace(/\(/g, '%28').replace(/\)/g, '%29');
      const model: string = encodeURIComponent(this.product.model ? this.product.model : '').replace(/\(/g, '%28').replace(/\)/g, '%29');
      // replace '%28 %29' for() case url refresh error
      const url: string = `/sales-portal/buy-product/brand/${brand}/${model}`;
      const queryParams: string =
        '?modelColor=' + this.product.color +
        '&productType=' + this.product.productType +
        '&productSubtype=' + this.product.productSubtype;
      window.location.href = url + queryParams;
      this.alertService.warning(url + queryParams);
    }

  }

  public onNext(): void {
    this.transaction.data.payment = this.paymentDetailTemp.payment;
    this.createAddToCartTrasaction();
  }

  public isNotFormValid(): boolean {
    return !(this.isReceiptInformationValid && this.paymentDetailValid && this.addessValid);
  }

  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
  }

}

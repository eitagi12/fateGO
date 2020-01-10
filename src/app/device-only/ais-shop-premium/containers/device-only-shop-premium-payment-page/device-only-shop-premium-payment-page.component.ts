import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { WIZARD_DEVICE_ONLY_AIS } from 'src/app/device-only/constants/wizard.constant';
import { Transaction, TransactionAction, TransactionType } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Product } from 'src/app/device-only/models/product.model';
import { PaymentDetail, PaymentDetailBank, HomeService, ApiRequestService, AlertService, TokenService, User } from 'mychannel-shared-libs';
import { HttpClient } from '@angular/common/http';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { CreateOrderService } from 'src/app/device-only/services/create-order.service';
import { HomeButtonService } from 'src/app/device-only/services/home-button.service';
import { ROUTE_BUY_PREMIUM_BRAND_PAGE, ROUTE_BUY_PREMIUM_CAMPAIGN_PAGE } from 'src/app/buy-premium/constants/route-path.constant';
import { ROUTE_SHOP_PREMIUM_SUMMARY_PAGE } from '../../constants/route-path.constant';
import { PriceOptionUtils } from 'src/app/shared/utils/price-option-utils';

@Component({
  selector: 'app-device-only-shop-premium-payment-page',
  templateUrl: './device-only-shop-premium-payment-page.component.html',
  styleUrls: ['./device-only-shop-premium-payment-page.component.scss']
})
export class DeviceOnlyShopPremiumPaymentPageComponent implements OnInit, OnDestroy {

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
  customerInfoTemp: any;
  user: User;
  localtion: any;
  addessValid: boolean;
  omiseBanks: PaymentDetailBank[];
  phoneNumber: string;

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
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.user = this.tokenService.getUser();
  }

  ngOnInit(): void {
    this.homeButtonService.initEventButtonHome();
    this.apiRequestService.createRequestId();

    let commercialName = this.priceOption.productDetail.name;
    if (this.priceOption.productStock.color) {
      commercialName += ` สี ${this.priceOption.productStock.color}`;
    }
    // REFACTOR IT'S
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
    this.http.get('/api/salesportal/omise/get-bank').toPromise()
      .then((res: any) => {
        const data = res.data || [];
        this.omiseBanks = data;
      });

    if (this.priceOption.trade.banks && this.priceOption.trade.banks.length > 0) {
      this.banks = (this.priceOption.trade.banks || []);
    } else {
      this.localtion = this.tokenService.getUser();
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
          this.createOrderService.cancelOrderDT(this.transaction).then((isSuccess: any) => {
            this.transactionService.remove();
            this.router.navigate([ROUTE_BUY_PREMIUM_BRAND_PAGE], { queryParams: this.priceOption.queryParams });
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
      this.router.navigate([ROUTE_BUY_PREMIUM_CAMPAIGN_PAGE], { queryParams: this.priceOption.queryParams });
    }
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
      this.router.navigate([ROUTE_SHOP_PREMIUM_SUMMARY_PAGE]);
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

  inputPhoneNumber(phoneNumber: string): void {
    this.phoneNumber = phoneNumber;
  }

  isNotFormValid(): boolean {
    return !(this.isReceiptInformationValid && this.paymentDetailValid && this.addessValid);
  }

  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
  }

}

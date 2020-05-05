import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, Utils, TokenService, PageLoadingService, ShoppingCart, PaymentDetail, PaymentDetailBank, ReceiptInfo, AlertService, User } from 'mychannel-shared-libs';
import { HttpClient } from '@angular/common/http';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { FormBuilder } from '@angular/forms';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { PriceOptionUtils } from 'src/app/shared/utils/price-option-utils';
import { ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_MOBILE_DETAIL_PAGE, ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_SELECT_PACKAGE_PAGE, ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_SUMMARY_PAGE } from 'src/app/device-order/ais/device-order-ais-existing-gadget/constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-existing-gadget-payment-detail-page',
  templateUrl: './device-order-ais-existing-gadget-payment-detail-page.component.html',
  styleUrls: ['./device-order-ais-existing-gadget-payment-detail-page.component.scss']
})

export class DeviceOrderAisExistingGadgetPaymentDetailPageComponent implements OnInit, OnDestroy {

  wizards: any = WIZARD_DEVICE_ORDER_AIS;

  shoppingCart: ShoppingCart;
  priceOption: PriceOption;
  transaction: Transaction;

  paymentDetail: PaymentDetail;
  banks: PaymentDetailBank[];
  paymentDetailValid: boolean;

  receiptInfo: ReceiptInfo;
  receiptInfoValid: boolean;

  paymentDetailTemp: any;
  receiptInfoTemp: any;
  depositOrDiscount: boolean;
  user: User;
  warehouse: boolean;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private utils: Utils,
    private http: HttpClient,
    private tokenService: TokenService,
    private transactionService: TransactionService,
    private shoppingCartService: ShoppingCartService,
    private priceOptionService: PriceOptionService,
    private pageLoadingService: PageLoadingService,
    private fb: FormBuilder,
    private alertService: AlertService
  ) {
    this.user = this.tokenService.getUser();
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.warehouse = this.user.locationCode === '63259';
    if (this.transaction && this.transaction.data && this.transaction.data.order && this.transaction.data.order.soId) {
      this.homeService.callback = () => {
        this.alertService.question('ต้องการยกเลิกรายการขายหรือไม่ การยกเลิก ระบบจะคืนสินค้าเข้าสต๊อคสาขาทันที', 'ตกลง', 'ยกเลิก')
          .then((response: any) => {
            if (response.value === true) {
              this.returnStock().then(() => {
                this.transaction.data.order = {};
                this.transactionService.remove();
                window.location.href = '/';
              });
            }
          });
      };
    }
  }

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();

    const productDetail = this.priceOption.productDetail || {};
    const productStock = this.priceOption.productStock || {};
    const customer: any = this.transaction.data.customer || {};
    const receiptInfo: any = this.transaction.data.receiptInfo || {};

    const trade: any = this.priceOption.trade || {};
    const advancePay: any = trade.advancePay || {};

    let commercialName = productDetail.name;
    if (productStock.color) {
      commercialName += ` สี ${productStock.color}`;
    }

    this.paymentDetail = this.mappingPatmentDetail(commercialName, trade, advancePay);
    this.banks = trade.banks || [];
    this.receiptInfo = this.mappingReceiptInfo(customer, receiptInfo);

  }

  mappingReceiptInfo(customer: any, receiptInfo: any): ReceiptInfo {
    return {
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

  mappingPatmentDetail(commercialName: any, trade: any, advancePay: any): PaymentDetail {
    const productStock = this.priceOption.productStock || {};
    return {
      commercialName: commercialName,
      promotionPrice: +(trade.promotionPrice || 0),
      isFullPayment: this.isFullPayment(),
      installmentFlag: advancePay.installmentFlag === 'N' && +(advancePay.amount || 0) > 0,
      advancePay: +(advancePay.amount || 0),
      qrCode: !!(productStock.company && productStock.company !== 'WDS'),
      omisePayment: this.warehouse ? true : false,
    };
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

  isNext(): boolean {
    return this.paymentDetailValid && this.receiptInfoValid;
  }

  onNext(): void {
    this.transaction.data.payment = this.paymentDetailTemp.payment;
    this.transaction.data.advancePayment = this.paymentDetailTemp.advancePayment;
    this.transaction.data.receiptInfo = this.receiptInfoTemp;
    this.transaction.data.shippingInfo.telNo = this.receiptInfoTemp.telNo;
    if (this.warehouse && !this.receiptInfoTemp.telNo) {
      this.alertService.warning('กรุณากรอกเบอร์ติดต่อ');
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_SUMMARY_PAGE]);
    }

    /* ยกเลิกเปลี่ยน main pro รอคุย solution การเปลี่ยน main pro ที่ MC
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_SELECT_PACKAGE_PAGE]);
    */
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_MOBILE_DETAIL_PAGE]);
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

  returnStock(): Promise<void> {
    return new Promise(resolve => {
      const transaction = this.transactionService.load();
      const promiseAll = [];
      if (transaction.data) {
        if (transaction.data.order && transaction.data.order.soId) {
          const order = this.http.post('/api/salesportal/dt/remove-cart', {
            soId: transaction.data.order.soId,
            userId: this.user.username
          }).toPromise().catch(() => Promise.resolve());
          promiseAll.push(order);
        }
      }
      Promise.all(promiseAll).then(() => resolve());
    });
  }
}

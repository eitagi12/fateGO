import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { ApiRequestService, PageLoadingService, HomeService, TokenService, User, AlertService, Utils, ShoppingCart } from 'mychannel-shared-libs';
import { Transaction, TransactionType, TransactionAction, Customer, Prebooking, Seller, Payment } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { WIZARD_DEVICE_ORDER_AIS, WIZARD_DEVICE_ORDER_ASP } from 'src/app/device-order/constants/wizard.constant';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { ROUTE_DEVICE_ORDER_ASP_BEST_BUY_MOBILE_CARE_PAGE, ROUTE_DEVICE_ORDER_ASP_BEST_BUY_MOBILE_CARE_AVAILABLE_PAGE, ROUTE_DEVICE_ORDER_ASP_BEST_BUY_CHECK_OUT_PAGE } from '../../constants/route-path.constant';
import { SharedTransactionService } from 'src/app/shared/services/shared-transaction.service';

@Component({
  selector: 'app-device-order-asp-existing-best-buy-summary-page',
  templateUrl: './device-order-asp-existing-best-buy-summary-page.component.html',
  styleUrls: ['./device-order-asp-existing-best-buy-summary-page.component.scss']
})
export class DeviceOrderAspExistingBestBuySummaryPageComponent implements OnInit, OnDestroy {

  wizards: any = this.tokenService.isTelewizUser() ? WIZARD_DEVICE_ORDER_ASP : WIZARD_DEVICE_ORDER_AIS;
  active: number = this.tokenService.isTelewizUser() ? 5 : 4;

  transaction: Transaction;
  priceOption: PriceOption;
  shoppingCart: ShoppingCart;
  user: User;

  @ViewChild('detailTemplate')
  detailTemplate: any;
  modalRef: BsModalRef;
  detail: string;

  customerAddress: string;
  deposit: number;
  sellerCode: string;
  checkSellerForm: FormGroup;
  seller: Seller;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private tokenService: TokenService,
    private http: HttpClient,
    private priceOptionService: PriceOptionService,
    public fb: FormBuilder,
    private alertService: AlertService,
    private modalService: BsModalService,
    private utils: Utils,
    private shoppingCartService: ShoppingCartService,
    private sharedTransactionService: SharedTransactionService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.user = this.tokenService.getUser();
  }

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    const customer = this.transaction.data.customer;
    this.sellerCode = this.user.ascCode;
    this.customerAddress = this.utils.getCurrentAddress({
      homeNo: customer.homeNo,
      moo: customer.moo,
      room: customer.room,
      floor: customer.floor,
      buildingName: customer.buildingName,
      soi: customer.soi,
      street: customer.street,
      tumbol: customer.tumbol,
      amphur: customer.amphur,
      province: customer.province,
      zipCode: customer.zipCode
    });

    this.deposit = this.transaction.data.preBooking
      && this.transaction.data.preBooking.depositAmt ? -Math.abs(+this.transaction.data.preBooking.depositAmt) : 0;

    this.http.get(`/api/salesportal/location-by-code?code=${this.user.locationCode}`).toPromise().then((response: any) => {
      this.seller = {
        sellerName: this.user.firstname && this.user.lastname ? `${this.user.firstname} ${this.user.lastname}` : this.user.username,
        locationName: response.data.displayName,
        locationCode: this.user.locationCode
      };
    });
    this.createForm();

  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onBack(): void {
    const mobileCare = this.transaction.data.mobileCarePackage;
    if (mobileCare) {
      this.router.navigate([ROUTE_DEVICE_ORDER_ASP_BEST_BUY_MOBILE_CARE_PAGE]);
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_ASP_BEST_BUY_MOBILE_CARE_AVAILABLE_PAGE]);
    }
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    if (this.sellerCode) {
      this.http.get(`/api/customerportal/checkSeller/${this.sellerCode}`).toPromise()
        .then((shopCheckSeller: any) => {
          if (shopCheckSeller.data.condition) {
            this.transaction.data.seller = this.seller;
            this.transaction.data.seller.sellerNo = this.sellerCode;
            if (!this.tokenService.isTelewizUser()) {
              this.pageLoadingService.closeLoading();
              this.router.navigate([ROUTE_DEVICE_ORDER_ASP_BEST_BUY_CHECK_OUT_PAGE]);
            } else {
              this.redirectToFlowWeb();
            }
          } else {
            this.alertService.error(shopCheckSeller.data.message);
          }
        }).catch((error: any) => {
          this.pageLoadingService.closeLoading();
          this.alertService.error('ระบบไม่สามารถแสดงข้อมูลได้ในขณะนี้');
        });
    } else {
      this.transaction.data.seller = this.seller;
      this.transaction.data.seller.sellerNo = this.sellerCode;
      if (!this.tokenService.isTelewizUser()) {
        this.pageLoadingService.closeLoading();
        this.router.navigate([ROUTE_DEVICE_ORDER_ASP_BEST_BUY_CHECK_OUT_PAGE]);
      } else {
        this.redirectToFlowWeb();
      }
    }

  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

  createForm(): void {
    this.checkSellerForm = this.fb.group({
      checkSeller: ['', Validators.compose([Validators.required, Validators.pattern(/^[0-9]+$/)])]
    });

    if (this.user.ascCode) {
      this.sellerCode = this.user.ascCode;
    }

    this.checkSellerForm.valueChanges.subscribe((value) => {
      if (value.checkSeller) {
        this.sellerCode = value.checkSeller;
      }
    });
  }

  onOpenDetail(detail: string): void {
    this.detail = detail;
    this.modalRef = this.modalService.show(this.detailTemplate);
  }

  summary(amount: number[]): number {
    return amount.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
  }

  redirectToFlowWeb(): void {
    this.http.get('/api/salesportal/device-sell/gen-queue', { params: { locationCode: this.user.locationCode } }).toPromise()
      .then((resp: any) => {
        const queueNo = resp.data.queue;
        this.transaction.data.queue = { queueNo: queueNo };
        this.http.post('/api/salesportal/create-device-selling-order',
          this.getRequestCreateOrder(this.transaction, this.priceOption)).toPromise()
          .then(() => {
            return this.sharedTransactionService.updateSharedTransaction(this.transaction, this.priceOption);
          }).then(() => {
            this.pageLoadingService.closeLoading();
            window.location.href = `/web/sales-order/pay-advance?transactionId=${this.transaction.transactionId}`;
          });
      });
  }

  getRequestCreateOrder(transaction: Transaction, priceOption: PriceOption, transId?: string): any {

    const customer = transaction.data.customer;
    const productStock = priceOption.productStock;
    const productDetail = priceOption.productDetail;
    const trade = priceOption.trade;
    const payment = transaction.data.payment;
    const simCard = transaction.data.simCard;
    const queue = transaction.data.queue;
    const seller = transaction.data.seller;
    const prebooking = transaction.data.preBooking;
    const mobileCare = transaction.data.mobileCarePackage;
    const order = transaction.data.order;
    const paymentTrade = trade.payments[0];

    let qrAmt;
    if (payment.paymentType === 'QR_CODE' && transId) {
      qrAmt = this.getQrAmount(trade.normalPrice, trade.discount);
    }

    const paymentMethod = (payment.paymentType === 'QR_CODE' && transId) ?
      this.replacePaymentMethodForQRCodeWithOutAirtime(payment.paymentQrCodeType) : paymentTrade.method;

    const data: any = {
      soId: order.soId,
      soCompany: productStock.company,
      locationSource: this.user.locationCode,
      locationReceipt: this.user.locationCode,
      productType: productDetail.productType || 'DEVICE',
      productSubType: productDetail.productSubtype || 'HANDSET',
      brand: productDetail.brand,
      model: productDetail.model,
      color: productStock.color,
      matCode: '',
      priceIncAmt: (+trade.normalPrice).toFixed(2),
      priceDiscountAmt: (+trade.discount.amount || 0).toFixed(2),
      grandTotalAmt: this.getGrandTotalAmt(trade, prebooking),
      userId: this.user.username,
      saleCode: seller && seller.sellerNo ? seller.sellerNo : '',
      queueNo: queue.queueNo || '',
      cusNameOrder: `${customer.titleName || ''}${customer.firstName || ''} ${customer.lastName || ''}`.trim() || '-',
      taxCardId: customer && customer.idCardNo || '',
      cusMobileNoOrder: simCard && simCard.mobileNo || '',
      customerAddress: this.getCustomerAddress(customer),
      tradeNo: trade && trade.tradeNo || '',
      ussdCode: trade && trade.ussdCode || '',
      returnCode: customer.privilegeCode || '',
      cashBackFlg: '',
      matAirTime: '',
      matCodeFreeGoods: '',
      paymentRemark: this.getOrderRemark(trade, payment, mobileCare, queue.queueNo, transaction),
      installmentTerm: payment.paymentMethod.month, // this.getInstallmentTerm(payment),
      installmentRate: payment.paymentMethod.percentage, // this.getInstallmentRate(payment),
      mobileAisFlg: 'Y',
      paymentMethod: paymentMethod,
      bankCode: payment && payment.paymentBank ? payment.paymentBank.abb : '',
      tradeFreeGoodsId: trade.freeGoods[0] ? trade.freeGoods[0].tradeFreegoodsId : '',
      matairtimeId: '',
      tradeDiscountId: trade.discount ? trade.discount.tradeAirtimeId : '',
      tradeAirtimeId: trade.advancePay ? trade.advancePay.tradeAirtimeId : '',
      focCode: '',
      bankAbbr: payment && payment.paymentBank ? payment.paymentBank.abb : '',
      preBookingNo: prebooking ? prebooking.preBookingNo : '',
      depositAmt: prebooking ? prebooking.depositAmt : '',
      qrTransId: transId ? transId : '',
      qrAmt: qrAmt
    };

    return data;
  }

  // private getInstallmentTerm(payment: Payment): any {
  //   return payment && payment.paymentBank && payment.paymentBank.installments ?
  //     payment.paymentBank.installments[0].installmentMonth : 0;
  // }

  // private getInstallmentRate(payment: Payment): any {
  //   return payment && payment.paymentBank && payment.paymentBank.installments ?
  //     payment.paymentBank.installments[0].installmentPercentage : 0;
  // }

  private getGrandTotalAmt(trade: any, prebooking: Prebooking): string {

    const normalPrice: number = trade.normalPrice;
    const advancePay: number = +trade.advancePay.amount;
    const discount: number = +trade.discount.amount || 0;
    const depositAmt: number = prebooking && prebooking.depositAmt ? +prebooking.depositAmt : 0;

    let result: any = normalPrice;
    result += advancePay;
    result -= discount;
    result -= depositAmt;
    return result.toFixed(2) || '';
  }

  getCustomerAddress(customer: Customer): any {
    return {
      addrNo: customer.homeNo || '-',
      moo: customer.moo || '-',
      mooban: customer.mooBan || '-',
      buildingName: customer.buildingName || '-',
      floor: customer.floor || '-',
      room: customer.room || '-',
      soi: customer.soi || '-',
      streetName: customer.street || '-',
      tumbon: customer.tumbol || '-',
      amphur: customer.amphur || '-',
      province: customer.province || '-',
      postCode: customer.zipCode || '-',
      country: '',
    };
  }

  getOrderRemark(
    trade: any,
    payment: Payment,
    mobileCare: any,
    queueNo: string,
    transaction: Transaction): string {
    const customer = transaction.data.customer;
    const newLine = '\n';
    const comma = ',';
    const space = ' ';

    // campaign REMARK_PROMOTION_NAME'[PM]'
    let remarkDesc = '[PM]' + space + '' + newLine;

    // advancePay
    const advancePay = '';
    remarkDesc += advancePay + newLine;

    // tradeAndInstallment
    let tradeAndInstallment = '';

    if (trade.advancePay.installmentFlag === 'Y') {
      tradeAndInstallment = '[AD]';
    } else {
      // REMARK_DEVICE
      tradeAndInstallment = '[DV]';
    }

    if (payment) {
      if (payment.paymentType === 'QR_CODE') {
        if (payment.paymentQrCodeType === 'THAI_QR') {
          tradeAndInstallment += '[PB]' + comma + space;
        } else {
          tradeAndInstallment += '[RL]' + comma + space;
        }
      } else if (payment.paymentType === 'CREDIT' && payment.paymentForm !== 'FULL') {
        tradeAndInstallment += '[CC]' + comma + space;
        tradeAndInstallment += '[B]' + payment.paymentBank.abb + comma + space;
        if (payment.paymentMethod) {
          tradeAndInstallment += '[I]' + payment.paymentMethod.percentage +
            '%' + space + payment.paymentMethod.month + 'เดือน' + comma + space;
        }
      } else {
        tradeAndInstallment += '[CA]' + comma + space;
      }
    }
    tradeAndInstallment += '[T]' + trade.tradeNo;
    remarkDesc += tradeAndInstallment + newLine;

    // otherInformation
    const summaryPoint = 0;
    const summaryDiscount = 0;
    let otherInformation = '';
    otherInformation += '[SP]' + space + summaryPoint + comma + space;
    otherInformation += '[SD]' + space + summaryDiscount + comma + space;
    otherInformation += '[D]' + space + (+trade.discount.amount).toFixed(2) + comma + space;
    otherInformation += '[RC]' + space + customer.privilegeCode + comma + space;
    otherInformation += '[OT]' + space + 'MC004' + comma + space;
    if (mobileCare && !(typeof mobileCare === 'string' || mobileCare instanceof String)) {
      otherInformation += '[PC]' + space + 'remark.mainPackageCode' + comma + space;
      otherInformation += '[MCC]' + space + mobileCare.customAttributes.promotionCode + comma + space;
      otherInformation += '[MC]' + space + mobileCare.customAttributes.shortNameThai + comma + space;
    }
    otherInformation += '[PN]' + space + 'remark.privilegeDesc' + comma + space;
    otherInformation += '[Q]' + space + queueNo;

    remarkDesc += otherInformation + newLine;

    return remarkDesc;

  }

  private replacePaymentMethodForQRCodeWithOutAirtime(paymentQrCodeType: string): string {
    let paymentMethod;
    if (paymentQrCodeType) {
      if (paymentQrCodeType === 'THAI_QR') {
        paymentMethod = 'PB';
        return paymentMethod;
      } else {
        paymentMethod = 'RL';
        return paymentMethod;
      }
    }
    return paymentMethod;
  }

  getQrAmount(normalPrice: number, discount: any): string {
    const qrAmt: number = normalPrice - discount.amount;
    return qrAmt.toFixed(2);
  }

}

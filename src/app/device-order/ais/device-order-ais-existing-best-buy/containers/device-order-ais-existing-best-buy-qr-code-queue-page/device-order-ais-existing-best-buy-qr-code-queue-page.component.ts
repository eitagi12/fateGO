import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AlertService, PageLoadingService, User, TokenService } from 'mychannel-shared-libs';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { Transaction, Prebooking, Customer, Payment } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ROUTE_DEVICE_ORDER_AIS_BEST_BUY_QR_CODE_QUEUE_SUMMARY_PAGE } from '../../constants/route-path.constant';
import { HttpClient } from '@angular/common/http';
import { QRCodePaymentService } from 'src/app/shared/services/qrcode-payment.service';
import { SharedTransactionService } from 'src/app/shared/services/shared-transaction.service';

@Component({
  selector: 'app-device-order-ais-existing-best-buy-qr-code-queue-page',
  templateUrl: './device-order-ais-existing-best-buy-qr-code-queue-page.component.html',
  styleUrls: ['./device-order-ais-existing-best-buy-qr-code-queue-page.component.scss']
})
export class DeviceOrderAisExistingBestBuyQrCodeQueuePageComponent implements OnInit, OnDestroy {

  transaction: Transaction;
  priceOption: PriceOption;
  queueFrom: FormGroup;
  mobileFrom: FormGroup;
  queue: string;
  transId: string;
  deposit: number;
  mobileNo: string;
  isAutoGenQueue: boolean;
  user: User;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private pageLoadingService: PageLoadingService,
    private alertService: AlertService,
    private tokenService: TokenService,
    private qrCodeService: QRCodePaymentService,
    private sharedTransactionService: SharedTransactionService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.user = this.tokenService.getUser();
  }

  ngOnInit(): void {
    this.isAutoGenQueue = true;
    this.deposit = this.transaction.data.preBooking
      && this.transaction.data.preBooking.depositAmt ? -Math.abs(+this.transaction.data.preBooking.depositAmt) : 0;
    this.getTransactionId();
    this.createForm();
  }

  getTransactionId(): void {
    const order = this.transaction.data.order || {};
    this.qrCodeService.getInquiryCallbackMpay({ orderId: order.soId }).then((transId: any) => {
      if (transId && transId.data && transId.data.DATA && transId.data.DATA.mpay_payment) {
        this.transId = transId.data.DATA.mpay_payment.tranId;
        // this.transaction.data.mpayPayment.tranId = this.transId;
      } else {
        this.alertService.error('เกิดข้อผิดพลาด ระบบไม่สามารถเรียก orderID(soID) มาใช้งานได้');
      }
    });
  }

  createForm(): void {
    this.mobileFrom = this.fb.group({
      'mobileNo': ['', Validators.compose([Validators.required, Validators.pattern(/^0[6-9]{1}[0-9]{8}/)])],
    });

    if (this.transaction.data.simCard.mobileNo) {
      this.mobileFrom.controls.mobileNo.setValue(this.transaction.data.simCard.mobileNo);
      this.mobileNo = this.transaction.data.simCard.mobileNo;
    } else {
      this.mobileFrom.valueChanges.subscribe((value) => {
        this.mobileNo = value.mobileNo;
      });
    }

    this.queueFrom = this.fb.group({
      'queue': ['', Validators.compose([Validators.required, Validators.pattern(/([A-Y]{1}[0-9]{3})/)])],
    });

    this.queueFrom.valueChanges.subscribe((value) => {
      this.queue = value.queue;
    });
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    if (this.isAutoGenQueue) {
      this.onSendSMSQueue(this.mobileNo).then((queue) => {
        if (queue) {
          this.transaction.data.queue = { queueNo: this.queue };
          this.http.post('/api/salesportal/create-device-selling-order',
           this.getRequestCreateOrder(this.transaction, this.priceOption)).toPromise()
            .then(() => {
              return this.sharedTransactionService.updateSharedTransaction(this.transaction, this.priceOption);
            }).then(() => {
              this.pageLoadingService.closeLoading();
              this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_QR_CODE_QUEUE_SUMMARY_PAGE]);
            });
        } else {
          this.isAutoGenQueue = false;
          this.pageLoadingService.closeLoading();
          this.alertService.error('ขออภัยค่ะ ระบบไม่สามารถ กดรับบัตรคิวอัตโนมัติได้ \n กรุณาระบุหมายเลขคิว');
          return;
        }
      }).catch(() => {
        this.isAutoGenQueue = false;
        this.pageLoadingService.closeLoading();
        this.alertService.error('ขออภัยค่ะ ระบบไม่สามารถ กดรับบัตรคิวอัตโนมัติได้ \n กรุณาระบุหมายเลขคิว');
        return;
      });
    } else {
      this.transaction.data.queue = { queueNo: this.queue };
      this.http.post('/api/salesportal/create-device-selling-order',
       this.getRequestCreateOrder(this.transaction, this.priceOption)).toPromise()
        .then(() => {
          return this.sharedTransactionService.updateSharedTransaction(this.transaction, this.priceOption);
        }).then(() => {
          this.pageLoadingService.closeLoading();
          this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_QR_CODE_QUEUE_SUMMARY_PAGE]);
        });
    }
    // this.transaction.data.queue = { queueNo: this.queue };
    // this.createBestBuyService.createDeviceOrder(this.transaction, this.priceOption, this.transId).then((response: any) => {
    //   if (response) {
    //     this.pageLoadingService.closeLoading();
    //     this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_QR_CODE_QUEUE_SUMMARY_PAGE]);
    //   }
    // }).catch((e) => {
    //   this.pageLoadingService.closeLoading();
    //   this.alertService.error(e);
    // });
  }

  summary(amount: number[]): number {
    return amount.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

  isLocationPhuket(): boolean {
    return this.user.locationCode === '1213' && this.tokenService.isAisUser();
  }

  onSendSMSQueue(mobileNo: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.isLocationPhuket()) {
        return this.http.post('/api/salesportal/device-order/transaction/get-queue-qmatic', {
          mobileNo: mobileNo
        }).toPromise()
          .then((respQueue: any) => {
            const data = respQueue.data && respQueue.data.result ? respQueue.data.result : {};
            resolve(data.queueNo);
          });
      } else {
        return this.http.post('/api/salesportal/device-order/transaction/auto-gen-queue', {
          mobileNo: mobileNo
        }).toPromise()
          .then((response: any) => {
            if (response && response.data && response.data.data && response.data.data.queueNo) {
              resolve(response.data.data.queueNo);
            } else {
              reject(null);
            }
          });
      }
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
      priceIncAmt: +trade.normalPrice.toFixed(2),
      priceDiscountAmt: (+trade.discount.amount).toFixed(2),
      grandTotalAmt: this.getGrandTotalAmt(trade, prebooking),
      userId: this.user.username,
      saleCode: seller && seller.sellerNo ? seller.sellerNo : '',
      queueNo: queue.queueNo || '',
      cusNameOrder: `${customer.titleName || ''}${customer.firstName || ''} ${customer.lastName || ''}`.trim(),
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
      installmentTerm: payment.paymentMethod.month,
      installmentRate: payment.paymentMethod.percentage,
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

    return Promise.resolve(data);
  }

  private getGrandTotalAmt(trade: any, prebooking: Prebooking): string {

    const normalPrice: number = trade.normalPrice;
    const advancePay: number = +trade.advancePay.amount;
    const discount: number = +trade.discount.amount || 0;
    const depositAmt: number = prebooking ? +prebooking.depositAmt : 0;

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
      } else if (payment.paymentType === 'CREDIT') {
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
    if (mobileCare && !mobileCare.reason) {
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

  checkValid(): boolean {
    if (!this.isAutoGenQueue) {
      return !this.queueFrom.invalid;
    } else {
      return !this.mobileFrom.invalid;
    }
  }

}

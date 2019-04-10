import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, TokenService, PageLoadingService, REGEX_MOBILE, User } from 'mychannel-shared-libs';
import { ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_AGGREGATE_PAGE, ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_RESULT_PAGE } from '../../constants/route-path.constant';
import { Transaction, Customer, Payment, Prebooking, TransactionData, MainPackage } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';

@Component({
  selector: 'app-device-order-ais-existing-prepaid-hotdeal-queue-page',
  templateUrl: './device-order-ais-existing-prepaid-hotdeal-queue-page.component.html',
  styleUrls: ['./device-order-ais-existing-prepaid-hotdeal-queue-page.component.scss']
})
export class DeviceOrderAisExistingPrepaidHotdealQueuePageComponent implements OnInit, OnDestroy {

  transaction: Transaction;
  priceOption: PriceOption;
  mobileFrom: FormGroup;
  queueFrom: FormGroup;
  queue: string;
  user: User;
  mobileNo: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private homeService: HomeService,
    private tokenService: TokenService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.queueFrom = this.fb.group({
      'mobileNo': ['', Validators.compose([Validators.required, Validators.pattern(REGEX_MOBILE)])],
    });
  }

  onSendSMSQueue(mobileNo: string): Promise<any> {
    return new Promise((resolve, reject) => {
        return this.http.post('/api/salesportal/device-order/transaction/get-queue-qmatic', {
          mobileNo: mobileNo
        }).toPromise()
          .then((respQueue: any) => {
            const data = respQueue.data && respQueue.data.result ? respQueue.data.result : {};
            resolve(data.queueNo);
          });
    });
  }

  getRequestDeviceSellOrder(): any {
    const user = this.tokenService.getUser();
    const productStock = this.priceOption.productStock;
    const trade = this.priceOption.trade;
    const data = this.transaction.data;
    const customerGroup = this.priceOption.customerGroup;
    const discount = trade.discount;
    const customer = data.customer;
    const simCard = data.simCard;
    const order = data.order;
    const queue = data.queue;
    const payment = data.payment;
    const advancePay = data.advancePayment;
    const paymentMethod = payment.paymentMethod;
    const mobileCare = this.transaction.data.mobileCarePackage;

    return {
      userId: user.username,
      locationSource: user.locationCode,
      locationReceipt: user.locationCode,
      soCompany: productStock.company,
      productType: productStock.productType,
      productSubType: productStock.productSubType,
      brand: productStock.brand,
      model: productStock.model,
      color: productStock.color,
      matCode: '',
      priceIncAmt: Number((+trade.normalPrice || 0)),
      tradeNo: trade.tradeNo || '',
      ussdCode: trade.ussdCode || '',
      priceDiscountAmt: Number((+discount.amount || 0)),
      grandTotalAmt: Number((+trade.normalPrice || 0)),
      soId: order.soId,
      queueNo: queue.queueNo || '',
      cusNameOrder: `${customer.titleName || ''} ${customer.firstName || ''} ${customer.lastName || ''}`.trim(),
      taxCardId: customer.idCardNo || '',
      customerAddress: {
        addrNo: customer.homeNo,
        amphur: customer.amphur,
        buildingName: customer.buildingName,
        country: 'ประเทศไทย',
        floor: customer.floor,
        moo: customer.moo,
        mooban: customer.mooBan,
        postCode: customer.zipCode,
        province: customer.province.replace(/มหานคร$/, ''),
        room: customer.room,
        soi: customer.soi,
        streetName: customer.street,
        tumbon: customer.tumbol
      },
      cusMobileNoOrder: simCard.mobileNo || '',
      returnCode: simCard.privilegeCode || '4GEYYY',
      // cashBackFlg: cashBackFlg,
      matAirTime: trade.matAirtime || '',
      // matCodeFreeGoods: matCodeFreeGoods,
      paymentRemark: this.getOrderRemark(trade, payment, mobileCare, queue.queueNo, this.transaction),
      installmentTerm: paymentMethod && paymentMethod.month ? paymentMethod.month : 0,
      installmentRate: paymentMethod && paymentMethod.percentage ? paymentMethod.percentage : 0,
      mobileAisFlg: 'Y',
      paymentMethod: this.getPaymentMethod(trade, advancePay),
      bankCode: this.getBankCode(trade, payment, advancePay),
      tradeFreeGoodsId: trade.freeGoods[0] && trade.freeGoods[0].tradeFreegoodsId ? trade.freeGoods[0].tradeFreegoodsId : '',
      tradeDiscountId: trade.discount.tradeDiscountId || '',
      tradeAirtimeId: trade.advancePay.tradeAirtimeId || '',
      bankAbbr: this.getBankCode(trade, payment, advancePay),
      convertToNetwotkType: customerGroup.code === 'MC002' ? '3G POSTPAID' : undefined
    };
  }

  getPaymentMethod(trade: any, advancePay: Payment): string {
    let paymentMethod;
    if (trade && trade.payments && trade.payments.length > 0) {
      paymentMethod = trade.payments[0].method;

      if (trade.advancePay.installmentFlag === 'Y') {
        return paymentMethod;
      }

      if (trade.amount > 0) {
        if (advancePay.paymentType !== 'CREDIT') {
          paymentMethod = paymentMethod + '|CA';
        }
      }

    }
    return paymentMethod;
  }

  getBankCode(trade: any, payment: Payment, advancePay: Payment): string {

    let bankCode: string = payment.paymentBank.abb;

    if (trade.advancePay.installmentFlag === 'Y') { // ผ่อนรวม
      return bankCode;
    }
    if (trade.amount > 0) {
      if (advancePay.paymentType === 'CREDIT') {
        bankCode = payment.paymentBank.abb + '|' + advancePay.paymentBank.abb;
      } else {
        bankCode = payment.paymentBank.abb;
      }
    }
    return bankCode;
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
        if (payment.paymentBank.installments && payment.paymentBank.installments.length > 0) {
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

  onNext(): void {
    this.pageLoadingService.openLoading();
    this.http.post('/api/salesportal/device-order/transaction/get-queue-qmatic', {
      mobileNo: this.queueFrom.value.mobileNo
    }).toPromise()
    .then((respQueue: any) => {
        const data = respQueue.data && respQueue.data.result ? respQueue.data.result : {};
        return data.queueNo;
    })
    .then((queueNo: string) => {
      return  this.transaction.data.queue = {
        queueNo: queueNo
      };
    })
    .then(() => {
      return this.http.post('/api/salesportal/device-sell/order', this.getRequestDeviceSellOrder()).toPromise()
      .then(() => {
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_RESULT_PAGE]);
      });
    })
    .then(() => {
      this.pageLoadingService.closeLoading();
    });
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_AGGREGATE_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

}

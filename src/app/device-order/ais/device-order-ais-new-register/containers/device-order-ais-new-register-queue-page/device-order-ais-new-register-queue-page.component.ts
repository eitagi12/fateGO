import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  HomeService, PageLoadingService, REGEX_MOBILE, TokenService
} from 'mychannel-shared-libs';
import { Transaction, TransactionData, MainPackage, Payment } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_AGGREGATE_PAGE, ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_RESULT_PAGE } from 'src/app/device-order/ais/device-order-ais-new-register/constants/route-path.constant';
import { HttpClient } from '@angular/common/http';
import { Token } from '@angular/compiler';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';

@Component({
  selector: 'app-device-order-ais-new-register-queue-page',
  templateUrl: './device-order-ais-new-register-queue-page.component.html',
  styleUrls: ['./device-order-ais-new-register-queue-page.component.scss']
})
export class DeviceOrderAisNewRegisterQueuePageComponent implements OnInit, OnDestroy {

  transaction: Transaction;
  priceOption: PriceOption;
  queueFrom: FormGroup;

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

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_AGGREGATE_PAGE]);
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

    return {
      userId: user.username,
      locationSource: user.locationCode,
      locationReceipt: user.locationCode,
      soCompany: productStock.company,
      productType: productStock.productType,
      productSubType: productStock.productSubtype,
      brand: productStock.brand,
      model: productStock.model,
      color: productStock.color,
      matCode: '',
      priceIncAmt: (+trade.normalPrice || 0).toFixed(2),
      tradeNo: trade.tradeNo || '',
      ussdCode: trade.ussdCode || '',
      priceDiscountAmt: (+discount.amount || 0).toFixed(2),
      // grandTotalAmt: this.getGrandTotalAmt(normalPrice, advancePay, discount, depositAmt, useDeposit),
      soId: order.soId,
      // saleCode: seller && seller.sellerNo || '',
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
      paymentRemark: this.getOrderRemark(trade, data),
      installmentTerm: payment.paymentBank.paymentMethod.month,
      installmentRate: payment.paymentBank.paymentMethod.percentage,
      mobileAisFlg: 'Y',
      paymentMethod: this.getPaymentMethod(trade, advancePay),
      bankCode: this.getBankCode(trade, payment, advancePay),
      tradeFreeGoodsId: trade.freeGoods[0].tradeFreegoodsId || '',
      // matairtimeId: '',
      tradeDiscountId: trade.discount.tradeDiscountId || '',
      tradeAirtimeId: trade.advancePay.tradeAirtimeId || '',
      // focCode: '',
      bankAbbr: this.getBankCode(trade, payment, advancePay),
      // preBookingNo: preBookingNo,
      // depositAmt: depositAmt,
      convertToNetwotkType: customerGroup.code === 'MC002' ? '3G POSTPAID' : undefined
    };
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    this.http.post('/api/salesportal/device-sell/order', {}).toPromise()
      .then(() => {
        return this.http.post('/api/salesportal/device-order/transaction/get-queue-qmatic', {
          mobileNo: this.queueFrom.value.mobileNo
        }).toPromise()
          .then((respQueue: any) => {
            const data = respQueue.data && respQueue.data.result ? respQueue.data.result : {};
            return data.queueNo;
          });
      })
      .then((queueNo: string) => {
        this.transaction.data.queue = {
          queueNo: queueNo
        };
        // update transaction
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_RESULT_PAGE]);
      })
      .then(() => this.pageLoadingService.closeLoading());

  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
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
  getOrderRemark(trade: any, data: TransactionData): string {
    const NEW_LINE = '\n';

    const remark = this.getRemarkCampaignName(data.mainPackage) + NEW_LINE
      + this.getRemarkAdvancePay(trade, data.advancePayment) + NEW_LINE
      + this.getRemarkTradeAndInstallment(trade, data.payment) + NEW_LINE
      + this.getRemarkOtherInfomation(data) + NEW_LINE;

    return remark;
  }
  getRemarkCampaignName(mainPackage: MainPackage): string {
    const promotionName = '[PM]';
    return promotionName + ' ' + mainPackage.customAttributes.shortNameThai;
  }
  getRemarkAdvancePay(trade: any, advancePay: Payment): string {
    let airTime = '';
    if (trade.advancePay.installmentFlag !== 'Y' && +trade.advancePay.amount !== 0) {
      airTime += '[AT]';
      if (advancePay.paymentType !== 'CREDIT') {
        if (advancePay.paymentType === 'QR_CODE') {
          if (advancePay.paymentQrCodeType === 'THAI_QR') {
            airTime += '[PB]'; // Thai QRcode
          } else {
            airTime += '[RL]'; // Rabbit line pay
          }
        } else {
          airTime += '[CA]';
        }

        return airTime;
      } else {
        airTime += '[AT]';
        airTime += '[CC]' + ',' + ' ';
        airTime += '[B]' + advancePay.paymentBank.abb;
        return airTime;
      }
    } else {
      return airTime;
    }
  }
  getRemarkTradeAndInstallment(trade: any, payment: Payment): string {

    let tradeAndInstallment = '';
    if (+trade.advancePay.amount !== 0) {
      if (trade.advancePay.installmentFlag === 'Y') {
        tradeAndInstallment = '[AD]';
      } else {
        tradeAndInstallment = '[DV]';
        if (payment.paymentType !== 'CREDIT') {
          if (payment.paymentType === 'QR_CODE') {
            if (payment.paymentQrCodeType === 'THAI_QR') {
              tradeAndInstallment += '[PB]' + ',' + ' '; // Thai QRcode
            } else {
              tradeAndInstallment += '[RL]' + ',' + ' '; // Rabbit line pay
            }
          }
        }
      }
    } else {
      tradeAndInstallment = '[AD]';
      if (payment.paymentType !== 'CREDIT') {
        if (payment.paymentType === 'QR_CODE') {
          if (payment.paymentQrCodeType === 'THAI_QR') {
            tradeAndInstallment += '[PB]' + ',' + ' '; // Thai QRcode
          } else {
            tradeAndInstallment += '[RL]' + ',' + ' '; // Rabbit line pay
          }
        }
        tradeAndInstallment += '[CA]' + ',' + ' ';
      } else {
        tradeAndInstallment += '[CC]' + ',' + ' ';
        tradeAndInstallment += '[B]' + ',' + ' ';
        if (payment.paymentBank.installmentMonth > 0) {
          tradeAndInstallment += '[I]' + payment.paymentBank.percentage + '%' + ' ' + payment.paymentBank.month + 'เดือน' + ',' + ' ';
        }
      }
    }
    tradeAndInstallment += '[T]' + trade.tradeNo;
    return tradeAndInstallment;
  }
  getRemarkOtherInfomation(data: TransactionData): string {
    let otherInformation = '';
    otherInformation += '[SP]' + ' ' + 0 + ',' + ' ';
    otherInformation += '[SD]' + ' ' + 0 + ',' + ' ';
    // otherInformation += '[D]' + ' ' + this.getDiscountAmount(remark.discount) + ',' + ' ';
    // otherInformation += '[RC]' + ' ' + privilegeCode + ',' + ' ';
    // otherInformation += '[OT]' + ' ' + this.getCustomerType(remark.customerGroupCode) + ',' + ' ';
    // otherInformation += '[PC]' + ' ' + remark.mainPackageCode + ',' + ' ';
    // otherInformation += '[MCC]' + ' ' + remark.mobileCare + ',' + ' ';
    // otherInformation += '[MC]' + ' ' + remark.mobileCareName + ',' + ' ';
    // otherInformation += '[PN]' + ' ' + remark.privilegeDesc + ',' + ' ';
    // otherInformation += '[Q]' + ' ' + remark.queueNumber;
    return otherInformation;
  }
}

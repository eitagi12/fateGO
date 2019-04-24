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
import { QueuePageService } from 'src/app/device-order/services/queue-page.service';
import { SharedTransactionService } from 'src/app/shared/services/shared-transaction.service';

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

  private readonly CASH_PAYMENT: string = '[CA]';
  private readonly CREDIT_CARD_PAYMENT: string = '[CC]';
  private readonly BANK: string = '[B]';
  private readonly INSTALLMENT: string = '[I]';
  private readonly POINT: string = '[P]';
  private readonly DISCOUNT: string = '[D]';
  private readonly TRADE_NO: string = '[T]';
  private readonly REMARK: string = '[RM]';
  private readonly SUMMARY_POINT: string = '[SP]';
  private readonly SUMMARY_DISCOUNT: string = '[SD]';
  private readonly RETURN_CODE: string = '[RC]';
  private readonly PROMOTION_NAME: string = '[PM]';
  private readonly MOBILE_CARE_CODE: string = '[MCC]';
  private readonly MOBILE_CARE: string = '[MC]';
  private readonly QUEUE_NUMBER: string = '[Q]';
  private readonly AIR_TIME: string = '[AT]';
  private readonly DEVICE: string = '[DV]';
  private readonly AIR_TIME_AND_DEVICE: string = '[AD]';
  private readonly DEVICE_AND_ADVANCE_PAYMENT: string = '[DP]';
  private readonly PRMOTION_CODE: string = '[PC]';
  private readonly PRIVILEGE_DESC: string = '[PN]';
  private readonly ORDER_TYPE: string = '[OT]';
  private readonly SPACE: string = ' ';
  private readonly NEW_LINE: string = '\n';
  private readonly COMMA: string = ',';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private homeService: HomeService,
    private tokenService: TokenService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private queuePageService: QueuePageService,
    private sharedTransactionService: SharedTransactionService
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
      grandTotalAmt: Number((+trade.promotionPrice || 0)),
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
      returnCode: customer.privilegeCode || '4GEYYY',
      // cashBackFlg: cashBackFlg,
      matAirTime: trade.matAirtime || '',
      matCodeFreeGoods: '',
      paymentRemark: this.getOrderRemark(this.transaction,  this.priceOption),
      installmentTerm: paymentMethod && paymentMethod.month ? paymentMethod.month : 0,
      installmentRate: paymentMethod && paymentMethod.percentage ? paymentMethod.percentage : 0,
      mobileAisFlg: 'Y',
      reqMinimumBalance: this.getReqMinimumBalance(data.onTopPackage, mobileCare),
      // paymentMethod: this.getPaymentMethod(trade, advancePay),
      // bankCode: this.getBankCode(trade, payment, advancePay),
      // tradeFreeGoodsId: trade.freeGoods[0] && trade.freeGoods[0].tradeFreegoodsId ? trade.freeGoods[0].tradeFreegoodsId : '',
      // tradeDiscountId: trade.discount.tradeDiscountId || '',
      // tradeAirtimeId: trade.advancePay.tradeAirtimeId || '',
      // bankAbbr: this.getBankCode(trade, payment, advancePay),
      convertToNetwotkType: customerGroup.code === 'MC002' ? '3G POSTPAID' : undefined
    };
  }

  getPaymentMethod(trade: any, advancePay: any): string {
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

  private getOrderRemark(transaction: Transaction, priceOption: PriceOption): string {
    const onTopPackage = transaction.data.onTopPackage || {};
    const airTime: string = this.getAirTime(priceOption.trade);
    const installment = this.getInstallment(transaction, priceOption);
    const information = this.getInformation(transaction, priceOption);

    return `
    ${this.PROMOTION_NAME}${this.SPACE}${onTopPackage.shortNameThai || ''}${this.NEW_LINE}
    ${airTime}${this.NEW_LINE}${installment}${this.NEW_LINE}${information}${this.NEW_LINE}
    `;
  }

  private getAirTime(trade: any): string {
    let message = '';

    if (trade && trade.advancePay) {
      const advancePay = trade.advancePay;
      if (advancePay.installmentFlag !== 'Y' && +advancePay.amount > 0) {
        message = `${this.AIR_TIME}${this.CREDIT_CARD_PAYMENT}`;
      }
    }
    return message;
  }

  private getInstallment(transaction: Transaction, priceOption: PriceOption): string {
    let message = '';

    const trade = priceOption.trade;
    const payment = transaction.data.payment;

    const advancePay = trade.advancePay || {};
    if (advancePay.installmentFlag === 'Y' && +advancePay.amount > 0) {
      message += this.AIR_TIME_AND_DEVICE;
    } else {
      message += this.DEVICE;
    }
    if (payment.paymentForm === 'INSTALLMENT') { // ผ่อนชำระ
      message += this.CREDIT_CARD_PAYMENT + this.COMMA + this.SPACE;
      message += this.BANK + payment.paymentMethod.abb + this.COMMA + this.SPACE;
      message += this.INSTALLMENT + payment.paymentMethod.percentage + '%' + this.SPACE + payment.paymentMethod.month;
    } else { // ชำระเต็มจำนวน
      message += this.CASH_PAYMENT + this.COMMA + this.SPACE;
      message += this.BANK + this.COMMA + this.SPACE;
      message += this.INSTALLMENT + '0%' + this.SPACE + '0';
    }
    message += 'เดือน' + this.COMMA + this.SPACE;
    message += this.TRADE_NO + trade.tradeNo;
    return message;
  }

  private getInformation(transaction: Transaction, priceOption: PriceOption): string {
    let message = '';

    const customerGroup = priceOption.customerGroup;
    const privilege = priceOption.privilege;
    const trade = priceOption.trade;
    const onTopPackage = transaction.data.onTopPackage || {};
    const mobileCarePackage = transaction.data.mobileCarePackage || {};
    const simCard = transaction.data.simCard;
    const customer = transaction.data.customer;
    const queue = transaction.data.queue;
    const campaign = priceOption.campaign;

    let customerGroupName = '';
    if ('MC001' === customerGroup.code) {
      customerGroupName = 'New Register';
    } else if ('MC002' === customerGroup.code) {
      customerGroupName = 'Convert Pre to Post';
    }
    const customAttributes = mobileCarePackage.customAttributes || {};
    // trade.ussdCode || privilege.ussdCode
    // newPrivilegeDesc = `${priceOption.campaignName} ${customerGroup.name} ${newussdCode}`Hot Deal Prepaid ลูกค้าปัจจุบัน ( *999*022*2# )
    const privilegeDesc = (campaign.campaignName || '') + this.SPACE +
    (customerGroup.name || '') + ` ( ${( privilege.ussdCode || trade.ussdCode || '')} )`;

    message += this.SUMMARY_POINT + this.SPACE + 0 + this.COMMA + this.SPACE;
    message += this.SUMMARY_DISCOUNT + this.SPACE + 0 + this.COMMA + this.SPACE;
    message += this.DISCOUNT + this.SPACE + (trade.discount ? +trade.discount.amount : 0) + this.COMMA + this.SPACE;
    message += this.RETURN_CODE + this.SPACE + (customer.privilegeCode || '') + this.COMMA + this.SPACE;
    message += this.ORDER_TYPE + this.SPACE + customerGroupName + this.COMMA + this.SPACE;
    message += this.PRMOTION_CODE + this.SPACE + (onTopPackage.promotionCode || '') + this.COMMA + this.SPACE;
    message += this.MOBILE_CARE_CODE + this.SPACE + (customAttributes.promotionCode || '') + this.COMMA + this.SPACE;
    message += this.MOBILE_CARE + this.SPACE + (customAttributes.shortNameThai || '') + this.COMMA + this.SPACE;
    message += this.PRIVILEGE_DESC + this.SPACE + privilegeDesc + this.COMMA + this.SPACE;
    message += this.QUEUE_NUMBER + this.SPACE + queue.queueNo;
    return message;
  }

  private getReqMinimumBalance(onTopPackage: any, mobileCarePackage: any): number { // Package only
    let total: number = 0;

    if (onTopPackage) {
      total += +(onTopPackage.priceIncludeVat || 0);
    }

    if (mobileCarePackage && mobileCarePackage.customAttributes ) {
      const customAttributes = mobileCarePackage.customAttributes;
      total += +(customAttributes.priceInclVat || 0);
    }
    return total;
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    this.queuePageService.getQueueQmatic(this.queueFrom.value.mobileNo)
      .then((resp: any) => {
        const data = resp.data && resp.data.result ? resp.data.result : {};
        return data.queueNo;
      })
      .then((queueNo: string) => {
        this.transaction.data.queue = {
          queueNo: queueNo
        };
        return this.http.post('/api/salesportal/device-sell/order', this.getRequestDeviceSellOrder()).toPromise()
          .then(() => {
            delete this.transaction.data.mainPackage;
            return this.sharedTransactionService.updateSharedTransaction(this.transaction, this.priceOption);
          });
      })
      .then(() => {
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_RESULT_PAGE]);
      })
      .then(() => this.pageLoadingService.closeLoading());
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_AGGREGATE_PAGE]);
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

}

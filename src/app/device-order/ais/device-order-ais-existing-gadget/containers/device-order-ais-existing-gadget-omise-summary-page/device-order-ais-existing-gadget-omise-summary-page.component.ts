import { Component, OnInit } from '@angular/core';
import { Transaction, ReceiptInfo } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User, HomeService, TokenService, PageLoadingService, AlertService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { SummaryPageService } from 'src/app/device-order/services/summary-page.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { QrCodeOmisePageService } from 'src/app/device-order/services/qr-code-omise-page.service';
import { HttpClient } from '@angular/common/http';
import { ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_AGGREGATE_PAGE, ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_OMISE_GENERATOR_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-existing-gadget-omise-summary-page',
  templateUrl: './device-order-ais-existing-gadget-omise-summary-page.component.html',
  styleUrls: ['./device-order-ais-existing-gadget-omise-summary-page.component.scss']
})
export class DeviceOrderAisExistingGadgetOmiseSummaryPageComponent implements OnInit {
  transaction: Transaction;
  priceOption: PriceOption;
  orderList: any;
  locationCode: string;
  mobileNoForm: FormGroup;
  mobileNoValid: boolean;
  receiptInfo: ReceiptInfo;
  user: User;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private homeService: HomeService,
    public summaryPageService: SummaryPageService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private qrCodeOmisePageService: QrCodeOmisePageService,
    private tokenService: TokenService,
    private pageLoadingService: PageLoadingService,
    private alertService: AlertService,
    private http: HttpClient
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.locationCode = this.tokenService.getUser().locationCode;
    this.receiptInfo = this.transaction.data.receiptInfo;
    this.user = this.tokenService.getUser();
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
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
    this.createMobileNoform();
  }

  createMobileNoform(): void {
    this.mobileNoForm = this.fb.group({
      mobileNo: [this.receiptInfo.telNo || '', [
        Validators.maxLength(10),
        Validators.minLength(10),
        Validators.pattern('^(0)(6|8|9)[0-9]*$|^((88)(6|8|9)[0-9]*)$')]],
    });
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

  createOmiseStatus(): void {
    const company = this.priceOption.productStock.company;
    const trade = this.priceOption.trade;
    const advancePay = trade.advancePay || {};

    let amountDevice: string;
    let amountAirTime: string;

    if (this.qrCodeOmisePageService.isPaymentOnlineCredit(this.transaction, 'payment')) {
      amountDevice = trade.promotionPrice;
    }
    if (this.qrCodeOmisePageService.isPaymentOnlineCredit(this.transaction, 'advancePayment')) {
      amountAirTime = advancePay.amount;
    }

    this.transaction.data.omise = {
      companyStock: company,
      omiseStatus: {
        amountDevice: amountDevice,
        amountAirTime: amountAirTime,
        amountTotal: String(this.getTotal()),
        statusDevice: amountDevice ? 'WAITING' : null,
        statusAirTime: amountAirTime ? 'WAITING' : null,
        installmentFlag: advancePay.installmentFlag
      }
    };
  }

  getStatusPay(): string {
    const company = this.priceOption.productStock.company;
    const omise = this.transaction.data.omise;
    if (company === 'AWN') {
      if (this.qrCodeOmisePageService.isPaymentOnlineCredit(this.transaction, 'payment') &&
        this.qrCodeOmisePageService.isPaymentOnlineCredit(this.transaction, 'advancePayment')) {
        return 'DEVICE&AIRTIME';
      } else {
        return omise.omiseStatus.statusDevice === 'WAITING' ? 'DEVICE' : 'AIRTIME';
      }
    } else {
      return omise.omiseStatus.statusDevice === 'WAITING' ? 'DEVICE' : 'AIRTIME';
    }
  }

  onCancel(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_AGGREGATE_PAGE]);
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    const user = this.tokenService.getUser();
    const simCard = this.transaction.data && this.transaction.data.simCard;
    const customer = this.transaction.data && this.transaction.data.customer;
    const priceOption = this.priceOption.productDetail;
    const productStock = this.priceOption.productStock;
    const trade = this.priceOption && this.priceOption.trade;
    const description = trade && trade.advancePay && trade.advancePay.description;
    console.log('this.telNo1>>>>>', this.receiptInfo.telNo);
    if (!this.mobileNoForm.value.mobileNo) {
      this.alertService.warning('กรุณากรอกหมายเลขโทรศัพท์');
      return;
    }
    this.receiptInfo.telNo = this.mobileNoForm.value.mobileNo;
    console.log('this.telNo2>>>>>', this.receiptInfo.telNo);
    if (this.qrCodeOmisePageService.isPaymentOnlineCredit(this.transaction, 'payment') &&
      this.qrCodeOmisePageService.isPaymentOnlineCredit(this.transaction, 'advancePayment')) {
      this.orderList = [{
        name: priceOption.name + 'สี' + productStock.color,
        price: +trade.promotionPrice
      }, {
        name: description,
        price: +trade.advancePay.amount
      }];
    } else if ((this.qrCodeOmisePageService.isPaymentOnlineCredit(this.transaction, 'payment')) ||
      (this.qrCodeOmisePageService.isPaymentOnlineCredit(this.transaction, 'advancePayment'))) {
      if (this.qrCodeOmisePageService.isPaymentOnlineCredit(this.transaction, 'payment')) {
        this.orderList = [{
          name: priceOption.name + 'สี' + productStock.color,
          price: +trade.promotionPrice
        }];
      } else {
        this.orderList = [{
          name: description,
          price: +trade.advancePay.amount
        }];
      }
    }
    const params: any = {
      companyCode: 'AWN',
      companyName: 'บริษัท แอดวานซ์ ไวร์เลส เน็ทเวอร์ค จำกัด',
      locationCode: user.locationCode,
      locationName: this.receiptInfo.branch,
      mobileNo: simCard.mobileNo,
      customer: customer.firstName + ' ' + customer.lastName,
      orderList: this.orderList,
    };
    this.qrCodeOmisePageService.createOrder(params).then((res) => {
      const data = res && res.data;
      this.transaction.data.omise.qrCodeStr = data.redirectUrl;
      this.transaction.data.omise.orderId = data.orderId;
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_OMISE_GENERATOR_PAGE]);
    }).catch((err) => {
      this.alertService.error('ระบบไม่สามารถทำรายการได้ขณะนี้ กรุณาทำรายการอีกครั้ง');
    }).then(() => {
      this.pageLoadingService.closeLoading();
    });
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  summary(amount: number[]): number {
    return amount.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

  getTotal(): number {
    const trade = this.priceOption.trade;
    let total: number = 0;
    const advancePay = trade.advancePay || {};

    if (trade.advancePay.installmentFlag === 'Y') {
      return this.summary([+trade.promotionPrice, +advancePay.amount]);
    }

    if (this.qrCodeOmisePageService.isPaymentOnlineCredit(this.transaction, 'payment')) {
      total += +trade.promotionPrice;
    }
    if (this.qrCodeOmisePageService.isPaymentOnlineCredit(this.transaction, 'advancePayment')) {
      total += +advancePay.amount;
    }
    return total;
  }

  keyPress(event: any): void {
    const charCode: number = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
    }
  }
}

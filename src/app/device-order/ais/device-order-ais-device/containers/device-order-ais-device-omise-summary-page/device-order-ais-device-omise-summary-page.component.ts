import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, TokenService, PageLoadingService, AlertService, User } from 'mychannel-shared-libs';
import { SummaryPageService } from 'src/app/device-order/services/summary-page.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { QrCodeOmisePageService } from 'src/app/device-order/services/qr-code-omise-page.service';
import { Transaction, ReceiptInfo } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { ROUTE_DEVICE_AIS_DEVICE_OMISE_GENERATOR_PAGE } from '../../constants/route-path.constant';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-device-order-ais-device-omise-summary-page',
  templateUrl: './device-order-ais-device-omise-summary-page.component.html',
  styleUrls: ['./device-order-ais-device-omise-summary-page.component.scss']
})
export class DeviceOrderAisDeviceOmiseSummaryPageComponent implements OnInit, OnDestroy {
  transaction: Transaction;
  priceOption: PriceOption;
  orderList: any;
  mobileNoForm: FormGroup;
  mobileNoValid: boolean;
  receiptInfo: ReceiptInfo;
  user: User;
  warehouse: boolean;

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
    this.receiptInfo = this.transaction.data.receiptInfo;
    this.user = this.tokenService.getUser();
    this.warehouse =   this.user.locationCode === '63259';
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
    if (!this.transaction.data.omise) {
      this.createOmiseStatus();
    }
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

    this.transaction.data.omise = {
      companyStock: company,
      omiseStatus: {
        amountDevice: trade.promotionPrice,
        amountAirTime: '0',
        amountTotal: String(this.getTotal()),
        statusDevice: 'WAITING',
        statusAirTime: null,
        installmentFlag: 'N'
      }
    };
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    const seller = this.transaction.data.seller;
    const shippingInfo = this.transaction.data.shippingInfo;
    const customer = this.transaction.data.customer;
    const priceOption = this.priceOption.productDetail;
    const productStock = this.priceOption.productStock;
    const trade = this.priceOption && this.priceOption.trade;

    if (!this.mobileNoForm.value.mobileNo) {
      this.alertService.warning('กรุณากรอกหมายเลขโทรศัพท์เพื่อส่ง SMS');
      return;
    }

    this.orderList = [{
      name: priceOption.name + 'สี' + productStock.color,
      price: +trade.promotionPrice
    }];

    const params: any = {
      companyCode: 'AWN',
      companyName: 'บริษัท แอดวานซ์ ไวร์เลส เน็ทเวอร์ค จำกัด',
      locationCode: seller.locationCode,
      locationName: seller.locationName,
      mobileNo: shippingInfo.telNo,
      customer: customer.firstName + ' ' + customer.lastName,
      orderList: this.orderList,
    };
    this.qrCodeOmisePageService.createOrder(params).then((res) => {
      const data = res && res.data;
      this.transaction.data.omise.qrCodeStr = data.redirectUrl;
      this.transaction.data.omise.orderId = data.orderId;
      this.pageLoadingService.closeLoading();
      this.router.navigate([ROUTE_DEVICE_AIS_DEVICE_OMISE_GENERATOR_PAGE]);
    }).catch((err) => {
      this.alertService.error('ระบบไม่สามารถทำรายการได้ขณะนี้ กรุณาทำรายการอีกครั้ง');
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

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

  getTotal(): number {
    const trade = this.priceOption.trade;
    let total: number = 0;

    if (trade.advancePay.installmentFlag === 'Y') {
      return this.summary([+trade.promotionPrice, 0]);
    }

    if (this.qrCodeOmisePageService.isPaymentOnlineCredit(this.transaction, 'payment')) {
      total += +trade.promotionPrice;
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

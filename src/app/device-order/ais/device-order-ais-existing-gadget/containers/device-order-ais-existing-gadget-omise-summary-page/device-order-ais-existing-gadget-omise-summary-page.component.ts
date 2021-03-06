import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_OMISE_GENERATOR_PAGE } from '../../constants/route-path.constant';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-device-order-ais-existing-gadget-omise-summary-page',
  templateUrl: './device-order-ais-existing-gadget-omise-summary-page.component.html',
  styleUrls: ['./device-order-ais-existing-gadget-omise-summary-page.component.scss']
})
export class DeviceOrderAisExistingGadgetOmiseSummaryPageComponent implements OnInit, OnDestroy {
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
    this.warehouse = this.user.locationCode === '63259';
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
    const { mobileNo } = this.transaction.data.simCard;
    const customer = this.transaction.data.customer;
    const priceOption = this.priceOption.productDetail;
    const productStock = this.priceOption.productStock;
    const trade = this.priceOption && this.priceOption.trade;
    const order = this.transaction.data.order;

    if (!this.mobileNoForm.value.mobileNo) {
      this.alertService.warning('กรุณากรอกหมายเลขโทรศัพท์เพื่อส่ง SMS');
      return;
    }
    this.transaction.data.shippingInfo.sms = this.mobileNoForm.value.mobileNo;
    this.orderList = [{
      name: priceOption.name + 'สี' + productStock.color,
      price: +trade.promotionPrice
    }];

    const params: any = {
      companyCode: 'AWN',
      companyName: 'บริษัท แอดวานซ์ ไวร์เลส เน็ทเวอร์ค จำกัด',
      locationCode: seller.locationCode,
      locationName: seller.locationName,
      mobileNo: mobileNo || this.receiptInfo.telNo,
      customer: customer.firstName + ' ' + customer.lastName,
      orderList: this.orderList,
      soId: order.soId
    };
    this.qrCodeOmisePageService.createOrder(params).then((res) => {
      const data = res && res.data ? res.data : {};
      this.transaction.data.omise.qrCodeStr = data.redirectUrl;
      this.transaction.data.omise.orderId = data.orderId;
      this.generateShortLink((data.redirectUrl || ''), this.mobileNoForm.value.mobileNo);
      this.pageLoadingService.closeLoading();
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_OMISE_GENERATOR_PAGE]);
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

  generateShortLink(url: string, mobileNo: string): Promise<any> {
    let urlLink: string = url;
    if (environment.ENABLE_SHORT_LINK) {
      const splitUrl: any = url.split('?');
      urlLink = `${environment.PREFIX_SHORT_LINK}?${splitUrl[1]}`;
      this.transaction.data.omise.shortUrl = urlLink;
    }
    return this.sendSMSUrl({ mobileNo: mobileNo, urlPayment: urlLink }).then(() => {
    });
  }

  sendSMSUrl(params: any): Promise<any> {
    const requestBody: any = {
      recipient: {
        recipientIdType: '0',
        recipientIdData: (params.mobileNo).replace(/^0+/, '66')
      },
      content: `สำหรับการชำระเงินค่าสินค้าผ่านบัตรเครดิตออนไลน์ คลิก ${params.urlPayment}`,
      sender: 'AIS'
    };
    return this.http.post('/api/customerportal/newregister/send-sms', requestBody).toPromise()
      .then(() => {
      });
  }
}

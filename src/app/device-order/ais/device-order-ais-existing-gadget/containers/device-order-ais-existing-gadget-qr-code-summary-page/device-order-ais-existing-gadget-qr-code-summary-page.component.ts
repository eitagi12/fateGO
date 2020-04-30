import { Component, OnInit, OnDestroy } from '@angular/core';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { HomeService, AlertService, TokenService, User } from 'mychannel-shared-libs';
import { HttpClient } from '@angular/common/http';
import { ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_QR_CODE_GENERATOR_PAGE, ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_AGGREGATE_PAGE } from 'src/app/device-order/ais/device-order-ais-existing-gadget/constants/route-path.constant';
import { Router } from '@angular/router';
import { SummaryPageService } from 'src/app/device-order/services/summary-page.service';

@Component({
  selector: 'app-device-order-ais-existing-gadget-qr-code-summary-page',
  templateUrl: './device-order-ais-existing-gadget-qr-code-summary-page.component.html',
  styleUrls: ['./device-order-ais-existing-gadget-qr-code-summary-page.component.scss']
})
export class DeviceOrderAisExistingGadgetQrCodeSummaryPageComponent implements OnInit, OnDestroy {
  transaction: Transaction;
  priceOption: PriceOption;
  color: string;
  deposit: number;
  user: User;
  constructor(
    private router: Router,
    private http: HttpClient,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private homeService: HomeService,
    private alertService: AlertService,
    private tokenService: TokenService,
    public summaryPageService: SummaryPageService,

  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.user = this.tokenService.getUser();
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
    if (!this.transaction.data.mpayPayment) {
      this.createMpayStatus();
    }
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_QR_CODE_GENERATOR_PAGE]);
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

  createMpayStatus(): void {
    const company = this.priceOption.productStock.company;
    const trade = this.priceOption.trade;
    const payment: any = this.transaction.data.payment || {};
    const advancePayment: any = this.transaction.data.advancePayment || {};
    const advancePay = trade.advancePay || {};

    let amountDevice: string;
    let amountAirTime: string;

    if (payment.paymentType === 'QR_CODE') {
      amountDevice = trade.promotionPrice;
    }
    if (advancePayment.paymentType === 'QR_CODE') {
      amountAirTime = advancePay.amount;
    }

    this.transaction.data.mpayPayment = {
      companyStock: company,
      mpayStatus: {
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
    const mpayPayment = this.transaction.data.mpayPayment;
    const payment: any = this.transaction.data.payment || {};
    const advancePayment: any = this.transaction.data.advancePayment || {};
    if (company === 'AWN') {
      if (payment.paymentType === 'QR_CODE' && advancePayment.paymentType === 'QR_CODE') {
        return 'DEVICE&AIRTIME';
      } else {
        return mpayPayment.mpayStatus.statusDevice === 'WAITING' ? 'DEVICE' : 'AIRTIME';
      }
    } else {
      return mpayPayment.mpayStatus.statusDevice === 'WAITING' ? 'DEVICE' : 'AIRTIME';
    }
  }

  getTotal(): number {
    const trade = this.priceOption.trade;
    const payment: any = this.transaction.data.payment || {};
    const advancePayment: any = this.transaction.data.advancePayment || {};
    let total: number = 0;
    const advancePay = trade.advancePay || {};

    if (trade.advancePay.installmentFlag === 'Y') {
      return this.summary([+trade.promotionPrice, +advancePay.amount]);
    }

    if (payment.paymentType === 'QR_CODE') {
      total += +trade.promotionPrice;
    }
    if (advancePayment.paymentType === 'QR_CODE') {
      total += +advancePay.amount;
    }
    return total;
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_AGGREGATE_PAGE]);
  }
}

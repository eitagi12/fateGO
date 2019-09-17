import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, AlertService } from 'mychannel-shared-libs';
import { SummaryPageService } from 'src/app/device-order/services/summary-page.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { ROUTE_DEVICE_AIS_DEVICE_QR_CODE_GENERATOR_PAGE, ROUTE_DEVICE_AIS_DEVICE_AGGREGATE_PAGE } from 'src/app/device-order/ais/device-order-ais-device/constants/route-path.constant';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-device-order-ais-device-qr-code-summary-page',
  templateUrl: './device-order-ais-device-qr-code-summary-page.component.html',
  styleUrls: ['./device-order-ais-device-qr-code-summary-page.component.scss']
})
export class DeviceOrderAisDeviceQrCodeSummaryPageComponent implements OnInit, OnDestroy {

  transaction: Transaction;
  priceOption: PriceOption;

  constructor(
    private router: Router,
    private homeService: HomeService,
    public summaryPageService: SummaryPageService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private http: HttpClient,
    private alertService: AlertService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.homeService.callback = () => {
      this.alertService.question('ต้องการยกเลิกรายการขายหรือไม่ การยกเลิก ระบบจะคืนสินค้าเข้าสต๊อคสาขาทันที', 'ตกลง', 'ยกเลิก')
        .then((response: any) => {
          if (response.value === true) {
            this.returnStock().then(() => {
              this.transactionService.remove();
              window.location.href = '/';
            });
          }
        });
    };
  }

  ngOnInit(): void {
    if (!this.transaction.data.mpayPayment) {
      this.createMpayStatus();
  }
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

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_AIS_DEVICE_AGGREGATE_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_AIS_DEVICE_QR_CODE_GENERATOR_PAGE]);
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
    const payment: any = this.transaction.data.payment || {};
    let total: number = 0;

    if (payment.paymentType === 'QR_CODE') {
      total += +trade.promotionPrice;
    }
    return total;
  }

  returnStock(): Promise<void> {
    return new Promise(resolve => {
      const transaction = this.transactionService.load();

      const promiseAll = [];
      if (transaction.data) {
        if (transaction.data.order && transaction.data.order.soId) {
          const order = this.http.post('/api/salesportal/device-sell/item/clear-temp-stock', {
            location: this.priceOption.productStock.location,
            soId: transaction.data.order.soId,
            transactionId: transaction.transactionId
          }).toPromise().catch(() => Promise.resolve());
          promiseAll.push(order);
        }
      }
      Promise.all(promiseAll).then(() => resolve());
    });
  }

}

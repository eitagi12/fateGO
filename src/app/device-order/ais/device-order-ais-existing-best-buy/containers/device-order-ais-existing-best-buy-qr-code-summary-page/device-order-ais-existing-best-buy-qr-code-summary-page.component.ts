import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { HomeService, AlertService } from 'mychannel-shared-libs';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { ROUTE_DEVICE_ORDER_AIS_BEST_BUY_QR_CODE_GENERATOR_PAGE } from '../../constants/route-path.constant';
import { Transaction, Payment } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ImageBrannerQRCode, QRCodePaymentService } from 'src/app/shared/services/qrcode-payment.service';

@Component({
  selector: 'app-device-order-ais-existing-best-buy-qr-code-summary-page',
  templateUrl: './device-order-ais-existing-best-buy-qr-code-summary-page.component.html',
  styleUrls: ['./device-order-ais-existing-best-buy-qr-code-summary-page.component.scss']
})
export class DeviceOrderAisExistingBestBuyQrCodeSummaryPageComponent implements OnInit, OnDestroy {

  transaction: Transaction;
  priceOption: PriceOption;
  deposit: number;
  color: string;

  brannerImagePaymentQrCode: ImageBrannerQRCode;

  constructor(
    private router: Router,
    private http: HttpClient,
    private homeService: HomeService,
    private alertService: AlertService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private qrcodePaymentService: QRCodePaymentService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.brannerImagePaymentQrCode = this.qrcodePaymentService.getBrannerImagePaymentQrCodeType(
      this.transaction.data.payment.paymentQrCodeType);
  }

  ngOnInit(): void {
    this.color = this.priceOption.productStock.color ? this.priceOption.productStock.color : this.priceOption.productStock.colorName || '';
    this.deposit = this.transaction.data.preBooking
                    && this.transaction.data.preBooking.depositAmt ? -Math.abs(+this.transaction.data.preBooking.depositAmt) : 0;
  }

  onBack(): void {
    this.alertService.question('ต้องการยกเลิกรายการขายหรือไม่ การยกเลิก ระบบจะคืนสินค้าเข้าสต๊อคสาขาทันที', 'ตกลง', 'ยกเลิก')
      .then((response: any) => {
        if (response.value === true) {
          const queryParams = this.priceOption.queryParams;
          this.returnStock().then(() => {
            window.location.href = `/sales-portal/buy-product/brand/${queryParams.brand}/${queryParams.model}`;
          });
        }
      });
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_QR_CODE_GENERATOR_PAGE]);
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

  getTotal(): number {
    const trade = this.priceOption.trade;
    const payment: any = this.transaction.data.payment || {};
    const advancePayment: any = this.transaction.data.advancePayment || {};

    let total: number = 0;
    if (payment.paymentType === 'QR_CODE') {
      total += +trade.promotionPrice;
    }
    if (advancePayment.paymentType === 'QR_CODE') {
      const advancePay = trade.advancePay || {};
      total += +advancePay.amount;
    }

    if (this.deposit) {
      total += this.deposit;
    }
    return total;
  }
}

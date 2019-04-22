import { Component, OnInit } from '@angular/core';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Router } from '@angular/router';
import { HomeService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { ROUTE_DEVICE_ORDER_AIS_MNP_AGGREGATE_PAGE, ROUTE_DEVICE_ORDER_AIS_MNP_QR_CODE_GENERATOR_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-mnp-qr-code-summary-page',
  templateUrl: './device-order-ais-mnp-qr-code-summary-page.component.html',
  styleUrls: ['./device-order-ais-mnp-qr-code-summary-page.component.scss']
})
export class DeviceOrderAisMnpQrCodeSummaryPageComponent implements OnInit {
  transaction: Transaction;
  priceOption: PriceOption;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void {
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_AGGREGATE_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_QR_CODE_GENERATOR_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  summary(amount: number[]): number {
    return amount.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
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
    return total;
  }

}

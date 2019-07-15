import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_DEVICE_ONLY_KIOSK_RESULT_QUEUE_PAGE } from '../../constants/route-path.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PageLoadingService } from 'mychannel-shared-libs';

@Component({
  selector: 'app-device-only-kiosk-result-queue-page',
  templateUrl: './device-only-kiosk-result-queue-page.component.html',
  styleUrls: ['./device-only-kiosk-result-queue-page.component.scss']
})
export class DeviceOnlyKioskResultQueuePageComponent implements OnInit , OnDestroy {

  paymentQr: any;
  transaction: Transaction;
  priceOption: PriceOption;
  price: string;

  constructor(
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private pageLoadingService: PageLoadingService
    ) {
      this.transaction = this.transactionService.load();
      this.priceOption = this.priceOptionService.load();
    }

  ngOnInit(): void {
    this.checkPaymentType();
    this.price = this.priceOption.trade.priceType === 'NORMAL' ? this.priceOption.trade.normalPrice : this.priceOption.trade.promotionPrice;
    this.pageLoadingService.closeLoading();
  }

  onHome(): void {
    window.location.href = '/smart-digital/main-menu';
  }

  checkPaymentType(): void {
    if (this.transaction.data.payment.paymentType === 'QR_CODE') {
      this.paymentQr = 'รวมยอดชำระ';
    } else {
      this.paymentQr = 'ยอดชำระ';
    }
  }

  mainMenu(): void {
    window.location.href = '/smart-digital/main-menu';
  }

  ngOnDestroy(): void {
    this.transactionService.remove();
    this.priceOptionService.remove();
  }

}

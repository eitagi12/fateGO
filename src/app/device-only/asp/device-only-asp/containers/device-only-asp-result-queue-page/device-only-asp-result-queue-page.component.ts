import { Component, OnInit, OnDestroy } from '@angular/core';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PageLoadingService } from 'mychannel-shared-libs';

@Component({
  selector: 'app-device-only-asp-result-queue-page',
  templateUrl: './device-only-asp-result-queue-page.component.html',
  styleUrls: ['./device-only-asp-result-queue-page.component.scss']
})
export class DeviceOnlyAspResultQueuePageComponent implements OnInit, OnDestroy {
  public transaction: Transaction;
  public priceOption: PriceOption;
  public price: any;
  public paymentQr: any;

  constructor(
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void {
    this.checkPaymentType();
    this.getPriceOption();
    this.pageLoadingService.closeLoading();
  }

  private getPriceOption(): void {
    this.price = this.priceOption.trade.priceType === 'NORMAL' ? this.priceOption.trade.normalPrice : this.priceOption.trade.promotionPrice;
  }

  private checkPaymentType(): void {
    if (this.transaction.data.payment.paymentType === 'QR_CODE') {
      this.paymentQr = 'รวมยอดชำระ';
    } else {
      this.paymentQr = 'ยอดค้างชำระ';
    }
  }

  public onHome(): void {
    window.location.href = '/';
  }

  public mainMenu(): void {
    const baseMyChannelWebURL: any = 'http://10.137.16.46:8080/web';
    window.location.href = baseMyChannelWebURL + '/' + 'sales-order/save-sales-order?transactionId=' + this.transaction.transactionId;
    // window.location.href = '/';
  }

  ngOnDestroy(): void {
    this.transactionService.remove();
    this.priceOptionService.remove();
  }

}

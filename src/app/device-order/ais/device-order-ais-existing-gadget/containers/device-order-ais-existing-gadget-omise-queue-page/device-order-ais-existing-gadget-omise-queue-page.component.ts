import { Component, OnInit, OnDestroy } from '@angular/core';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { User, HomeService, TokenService, PageLoadingService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { SharedTransactionService } from 'src/app/shared/services/shared-transaction.service';
import { QrCodeOmisePageService } from 'src/app/device-order/services/qr-code-omise-page.service';
import { QueuePageService } from 'src/app/device-order/services/queue-page.service';
import { ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_RESULT_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-existing-gadget-omise-queue-page',
  templateUrl: './device-order-ais-existing-gadget-omise-queue-page.component.html',
  styleUrls: ['./device-order-ais-existing-gadget-omise-queue-page.component.scss']
})
export class DeviceOrderAisExistingGadgetOmiseQueuePageComponent implements OnInit, OnDestroy {

  transaction: Transaction;
  priceOption: PriceOption;
  user: User;

  constructor(
    private router: Router,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private tokenService: TokenService,
    private queuePageService: QueuePageService,
    private pageLoadingService: PageLoadingService,
    private sharedTransactionService: SharedTransactionService,
    public qrCodeOmisePageService: QrCodeOmisePageService,
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.user = this.tokenService.getUser();
  }

  ngOnInit(): void {
  }

  onAutoQ(): void {
    this.queuePageService.getQueueL(this.user.locationCode).then((respQueue: any) => {
      this.pageLoadingService.openLoading();
      const data = respQueue.data ? respQueue.data : {};
      this.transaction.data.queue = { queueNo: data.queue };
      this.createOrderAndupdateTransaction();
    });
  }

  createOrderAndupdateTransaction(): void {
    this.queuePageService.createDeviceSellingOrderList(this.transaction, this.priceOption).then(() => {
      return this.sharedTransactionService.updateSharedTransaction(this.transaction, this.priceOption).then(() => {
        this.pageLoadingService.closeLoading();
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_RESULT_PAGE]);
      });
    });
  }

  getPaymentBalance(): number {
    const trade = this.priceOption.trade;
    let summary = 0;

    if (this.qrCodeOmisePageService.isPaymentOnlineCredit(this.transaction, 'payment')) {
      summary += +trade.promotionPrice;
    }
    return summary;
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

}

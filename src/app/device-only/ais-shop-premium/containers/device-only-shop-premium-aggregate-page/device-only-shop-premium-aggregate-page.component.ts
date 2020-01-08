import { Component, OnInit } from '@angular/core';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { CreateOrderService } from 'src/app/device-only/services/create-order.service';
import { QueueService } from 'src/app/device-only/services/queue.service';
import { PageLoadingService, TokenService, User } from 'mychannel-shared-libs';
import { SharedTransactionService } from 'src/app/shared/services/shared-transaction.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { ROUTE_SHOP_PREMIUM_RESULT_PAGE, ROUTE_SHOP_PREMIUM_QR_CODE_SUMMARY_PAGE, ROUTE_SHOP_PREMIUM_SUMMARY_PAGE } from 'src/app/device-only/ais-shop-premium/constants/route-path.constant';

@Component({
  selector: 'app-device-only-shop-premium-aggregate-page',
  templateUrl: './device-only-shop-premium-aggregate-page.component.html',
  styleUrls: ['./device-only-shop-premium-aggregate-page.component.scss']
})
export class DeviceOnlyShopPremiumAggregatePageComponent implements OnInit {
  transaction: Transaction;
  priceOption: PriceOption;
  user: User;
  btnNext: any;

  constructor(
    private router: Router,
    private http: HttpClient,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private createOrderService: CreateOrderService,
    private queueService: QueueService,
    private pageLoadingService: PageLoadingService,
    private sharedTransactionService: SharedTransactionService,
    private tokenService: TokenService) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.user = this.tokenService.getUser();
  }

  ngOnInit(): void {
    this.setfunctionNext();
  }

  setfunctionNext(): void {
    const qrCodePayment = this.transaction.data.payment.paymentType === 'QR_CODE';
    this.btnNext = {
      function: qrCodePayment ? this.qrCodeSummary.bind(this) : this.genQueue.bind(this),
      message: qrCodePayment ? 'PAYMENT' : 'CHECK OUT'
    };
  }

  genQueue(): void {
    this.queueService.getQueueZ(this.user.locationCode)
      .then((resp: any) => {
        const queueNo = resp.data.queue;
        this.transaction.data.queue = { queueNo: queueNo };
        this.createOrderAndupdateTransaction();
      });
  }

  createOrderAndupdateTransaction(): void {
      this.createOrderService.createDeviceSellingOrderList(this.transaction, this.priceOption).then(() => {
        return this.sharedTransactionService.updateSharedTransaction(this.transaction, this.priceOption).then(() => {
          this.pageLoadingService.closeLoading();
          this.router.navigate([ROUTE_SHOP_PREMIUM_RESULT_PAGE]);
        });
      });
  }

  qrCodeSummary(): void {
    this.router.navigate([ROUTE_SHOP_PREMIUM_QR_CODE_SUMMARY_PAGE]);
  }

  onBack(): void {
    this.router.navigate([ROUTE_SHOP_PREMIUM_SUMMARY_PAGE]);
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { CreateOrderService } from 'src/app/device-only/services/create-order.service';
import { QueueService } from 'src/app/device-only/services/queue.service';
import { PageLoadingService, TokenService, User, HomeService, AlertService } from 'mychannel-shared-libs';
import { SharedTransactionService } from 'src/app/shared/services/shared-transaction.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { ROUTE_SHOP_PREMIUM_RESULT_PAGE, ROUTE_SHOP_PREMIUM_QR_CODE_SUMMARY_PAGE, ROUTE_SHOP_PREMIUM_SUMMARY_PAGE } from 'src/app/device-only/ais-shop-premium/constants/route-path.constant';

@Component({
  selector: 'app-device-only-shop-premium-aggregate-page',
  templateUrl: './device-only-shop-premium-aggregate-page.component.html',
  styleUrls: ['./device-only-shop-premium-aggregate-page.component.scss']
})
export class DeviceOnlyShopPremiumAggregatePageComponent implements OnInit, OnDestroy {
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
    private tokenService: TokenService,
    private homeService: HomeService,
    private alertService: AlertService,
    ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.user = this.tokenService.getUser();
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

  getThumbnail(): string {
    const product = (this.priceOption.productDetail.products || []).find((p: any) => {
      return p.colorName === this.priceOption.productStock.color;
    });
    return product && product.images ? product.images.thumbnail : '';
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
    this.createOrderService.createDeviceSellingOrderShopPremium(this.transaction, this.priceOption).then(() => {
      this.sharedTransactionService.updateSharedTransaction(this.transaction, this.priceOption, true).then(() => {
        this.pageLoadingService.closeLoading();
        this.router.navigate([ROUTE_SHOP_PREMIUM_RESULT_PAGE]);
      });
    });
  }

  returnStock(): Promise<void> {
    return new Promise(resolve => {
      const transaction = this.transactionService.load();
      const promiseAll = [];
      if (transaction && transaction.data) {
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

  qrCodeSummary(): void {
    this.router.navigate([ROUTE_SHOP_PREMIUM_QR_CODE_SUMMARY_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onBack(): void {
    this.router.navigate([ROUTE_SHOP_PREMIUM_SUMMARY_PAGE]);
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}

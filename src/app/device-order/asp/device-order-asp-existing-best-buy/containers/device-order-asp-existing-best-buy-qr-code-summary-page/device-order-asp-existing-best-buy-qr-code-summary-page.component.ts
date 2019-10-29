import { Component, OnInit, OnDestroy } from '@angular/core';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { HomeService, AlertService, TokenService, User } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { Router } from '@angular/router';
import { ROUTE_DEVICE_ORDER_ASP_BEST_BUY_QR_CODE_GENERATOR_PAGE } from '../../constants/route-path.constant';
import { ImageBrannerQRCode, QRCodePaymentService } from 'src/app/shared/services/qrcode-payment.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-device-order-asp-existing-best-buy-qr-code-summary-page',
  templateUrl: './device-order-asp-existing-best-buy-qr-code-summary-page.component.html',
  styleUrls: ['./device-order-asp-existing-best-buy-qr-code-summary-page.component.scss']
})
export class DeviceOrderAspExistingBestBuyQrCodeSummaryPageComponent implements OnInit , OnDestroy {

  transaction: Transaction;
  priceOption: PriceOption;
  deposit: number;
  user: User;

  brannerImagePaymentQrCode: ImageBrannerQRCode;

  constructor(
    private router: Router,
    private http: HttpClient,
    private homeService: HomeService,
    private alertService: AlertService,
    private tokenService: TokenService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private qrcodePaymentService: QRCodePaymentService
  ) {
    this.user = this.tokenService.getUser();
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.brannerImagePaymentQrCode = this.qrcodePaymentService.getBrannerImagePaymentQrCodeType(
      this.transaction.data.payment.paymentQrCodeType);
  }

  ngOnInit(): void {
    // QrCode ของ ASP ยังไม่ได้ทำ
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
    this.router.navigate([ROUTE_DEVICE_ORDER_ASP_BEST_BUY_QR_CODE_GENERATOR_PAGE]);
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

}

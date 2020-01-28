import { Component, OnInit } from '@angular/core';
import { Transaction, Payment } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { ImageBrannerQRCode, QRCodePaymentService } from 'src/app/shared/services/qrcode-payment.service';
import { Router } from '@angular/router';
import { HomeService, AlertService, TokenService, User } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { ROUTE_SHOP_PREMIUM_QR_CODE_GENERATE_PAGE, ROUTE_SHOP_PREMIUM_AGGREGATE } from '../../constants/route-path.constant';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-device-only-shop-premium-qr-code-summary-page',
  templateUrl: './device-only-shop-premium-qr-code-summary-page.component.html',
  styleUrls: ['./device-only-shop-premium-qr-code-summary-page.component.scss']
})
export class DeviceOnlyShopPremiumQrCodeSummaryPageComponent implements OnInit {

  transaction: Transaction;
  priceOption: PriceOption;
  brannerImagePaymentQrCode: ImageBrannerQRCode;
  payment: Payment;
  price: any;
  user: User;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private qrcodePaymentService: QRCodePaymentService,
    private alertService: AlertService,
    private tokenService: TokenService,
    private http: HttpClient,
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.payment = this.transaction.data.payment;
    this.brannerImagePaymentQrCode = this.qrcodePaymentService.getBrannerImagePaymentQrCodeType(this.payment.paymentQrCodeType);
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
    this.price = this.priceOption.productDetail.price;
  }

  summary(amount: number[]): number {
    return amount.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
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

  onBack(): void {
    this.router.navigate([ROUTE_SHOP_PREMIUM_AGGREGATE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_SHOP_PREMIUM_QR_CODE_GENERATE_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

}

import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Transaction, Seller } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { ROUTE_SHOP_PREMIUM_PAYMENT_PAGE, ROUTE_SHOP_PREMIUM_AGGREGATE } from '../../constants/route-path.constant';
import { Router } from '@angular/router';
import { SummarySellerCodeComponent } from 'src/app/device-only/components/summary-seller-code/summary-seller-code.component';
import { HomeService, AlertService, TokenService, PageLoadingService, User } from 'mychannel-shared-libs';
import { SellerService } from 'src/app/device-only/services/seller.service';
import { HttpClient } from '@angular/common/http';
import { ShopCheckSeller } from 'src/app/device-only/models/shopCheckSeller.model';

@Component({
  selector: 'app-device-only-shop-premium-summary-page',
  templateUrl: './device-only-shop-premium-summary-page.component.html',
  styleUrls: ['./device-only-shop-premium-summary-page.component.scss']
})
export class DeviceOnlyShopPremiumSummaryPageComponent implements OnInit, OnDestroy {

  @ViewChild(SummarySellerCodeComponent) summarySellerCode: SummarySellerCodeComponent;

  // wizards: string[] = WIZARD_DEVICE_ONLY_SHOP_PREMIUM;
  wizards: string[] = [
    'ข้อมูลชำระเงิน', 'สินค้าและบริการอื่น', 'สรุปรายการ'
  ];

  transaction: Transaction;
  priceOption: PriceOption;
  price: any;
  user: User;

  constructor(
    private http: HttpClient,
    private router: Router,
    private homeService: HomeService,
    private alertService: AlertService,
    private tokenService: TokenService,
    private sellerService: SellerService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.user = this.tokenService.getUser();
  }

  ngOnInit(): void {
    this.price = this.priceOption.productDetail.price;
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    const seller: Seller = this.summarySellerCode.getSeller();
    this.checkSeller(seller);
  }

  summary(amount: number[]): number {
    return amount.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
  }

  checkSeller(seller: Seller): void {
    if (!seller.sellerNo) {
      this.alertService.warning('กรุณากรอกข้อมูลให้ถูกต้อง');
      return;
    }
    this.sellerService.checkSeller(seller.sellerNo).then((shopCheckSeller: ShopCheckSeller) => {
      if (shopCheckSeller.condition) {
        if (!this.transaction.data.seller) {
          this.transaction.data.seller = {
            sellerNo: seller.sellerNo,
            locationCode: this.tokenService.getUser().locationCode
          };
        } else {
          this.transaction.data.seller.sellerNo = seller.sellerNo;
        }
        this.pageLoadingService.closeLoading();
        this.router.navigate([ROUTE_SHOP_PREMIUM_AGGREGATE]);
      } else {
        this.alertService.warning(shopCheckSeller.message);
      }
    })
      .catch(() => {
        this.alertService.warning('ระบบไม่สามารถแสดงข้อมูลได้ในขณะนี้');
      });
  }

  onBack(): void {
    this.router.navigate([ROUTE_SHOP_PREMIUM_PAYMENT_PAGE]);
  }

  onHome(): void {
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

  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
  }
}

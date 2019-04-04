import { Component, OnInit, OnDestroy } from '@angular/core';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { HomeService, AlertService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { Router } from '@angular/router';
import { ROUTE_DEVICE_ORDER_ASP_BEST_BUY_QR_CODE_GENERATOR_PAGE } from '../../constants/route-path.constant';

////////////////////////  ดึง Service จาก flow ais  /////////////////////////
import { CreateDeviceOrderBestBuyService } from 'src/app/device-order/ais/device-order-ais-existing-best-buy/services/create-device-order-best-buy.service';

@Component({
  selector: 'app-device-order-asp-existing-best-buy-qr-code-summary-page',
  templateUrl: './device-order-asp-existing-best-buy-qr-code-summary-page.component.html',
  styleUrls: ['./device-order-asp-existing-best-buy-qr-code-summary-page.component.scss']
})
export class DeviceOrderAspExistingBestBuyQrCodeSummaryPageComponent implements OnInit , OnDestroy {

  transaction: Transaction;
  priceOption: PriceOption;
  deposit: number;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private alertService: AlertService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private createDeviceOrderBestBuyService: CreateDeviceOrderBestBuyService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void {
    this.deposit = this.transaction.data.preBooking
                    && this.transaction.data.preBooking.depositAmt ? -Math.abs(+this.transaction.data.preBooking.depositAmt) : 0;
  }

  onBack(): void {
    this.alertService.question('ต้องการยกเลิกรายการขายหรือไม่ การยกเลิก ระบบจะคืนสินค้าเข้าสต๊อคสาขาทันที', 'ตกลง', 'ยกเลิก')
        .then((response: any) => {
          if (response.value === true) {
            const productDetail = this.priceOption.productDetail;
            this.createDeviceOrderBestBuyService.cancelOrder(this.transaction)
                .then((isSuccess: any) => {
                  window.location.href = `/sales-portal/buy-product/brand/${productDetail.brand}/${productDetail.model}`;
             }).catch(() => window.location.href = `/sales-portal/buy-product/brand/${productDetail.brand}/${productDetail.model}`);
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

}

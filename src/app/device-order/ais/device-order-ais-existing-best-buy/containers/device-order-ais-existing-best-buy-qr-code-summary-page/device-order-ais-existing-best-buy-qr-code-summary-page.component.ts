import { Component, OnInit } from '@angular/core';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { HomeService, AlertService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { Router } from '@angular/router';
import { CreateDeviceOrderBestBuyService } from '../../services/create-device-order-best-buy.service';
import { ROUTE_DEVICE_ORDER_AIS_BEST_BUY_QR_CODE_GENERATOR_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-existing-best-buy-qr-code-summary-page',
  templateUrl: './device-order-ais-existing-best-buy-qr-code-summary-page.component.html',
  styleUrls: ['./device-order-ais-existing-best-buy-qr-code-summary-page.component.scss']
})
export class DeviceOrderAisExistingBestBuyQrCodeSummaryPageComponent implements OnInit {

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
            this.createDeviceOrderBestBuyService.cancelOrderAndRedirect(this.transaction
                , `/sales-portal/buy-product/brand/${productDetail.brand}/${productDetail.model}`)
                .then((url: string) => {
                  window.location.href = url;
             });
          }
        });
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_QR_CODE_GENERATOR_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  summary(amount: number[]): number {
    return amount.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
  }

}

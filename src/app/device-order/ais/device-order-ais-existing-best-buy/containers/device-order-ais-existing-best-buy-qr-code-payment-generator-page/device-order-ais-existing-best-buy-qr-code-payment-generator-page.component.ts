import { Component, OnInit } from '@angular/core';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { HomeService, AlertService, PageActivityService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-device-order-ais-existing-best-buy-qr-code-payment-generator-page',
  templateUrl: './device-order-ais-existing-best-buy-qr-code-payment-generator-page.component.html',
  styleUrls: ['./device-order-ais-existing-best-buy-qr-code-payment-generator-page.component.scss']
})
export class DeviceOrderAisExistingBestBuyQrCodePaymentGeneratorPageComponent implements OnInit {

  transaction: Transaction;
  priceOption: PriceOption;
 
  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private alertService: AlertService,
    private pageActivityService: PageActivityService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
 
  }
 
  ngOnInit() {
    // this.onRefresh();
    this.pageActivityHandler();
  }
 
  onBack() {
    // this.router.navigate([ROUTE_DEVICE_ONLY_AIS_QR_CODE_SUMMARY_PAGE]);
  }
 
  onNext() {
    // this.router.navigate([ROUTE_DEVICE_ONLY_AIS_QR_CODE_QUEUE_PAGE]);
  }
 
  onHome() {
    this.homeService.goToHome();
  }
 
  summary(amount: number[]) {
    return amount.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
  }
 
  pageActivityHandler() {
    this.pageActivityService.setTimeout((counter) => {
      return counter === 5;
    }).subscribe(() => {
      this.alertService.notify({
        type: 'question',
        cancelButtonText: 'CANCLE',
        confirmButtonText: 'REFRESH',
        showCancelButton: true,
        showConfirmButton: true,
        reverseButtons: true,
        allowEscapeKey: false,
        text: 'สิ้นสุดระยะเวลาชำระเงินกรุณากดปุ่ม "REFRESH - ltestl" เพื่อทำรายการใหม่',
        timer: 180000
      }).then((data) => {
        if (!data.value) {
          this.homeService.goToHome();
        }
        this.pageActivityService.resetTimeout();
      });
    });
  }

}

import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService, PageActivityService, HomeService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { ROUTE_DEVICE_ONLY_AIS_QR_CODE_SUMMARY_PAGE, ROUTE_DEVICE_ONLY_AIS_QR_CODE_QUEUE_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-device-only-ais-qr-code-generate-page',
  templateUrl: './device-only-ais-qr-code-generate-page.component.html',
  styleUrls: ['./device-only-ais-qr-code-generate-page.component.scss']
})
export class DeviceOnlyAisQrCodeGeneratePageComponent implements OnInit {

  transaction: Transaction;
  priceOption: PriceOption;
  refreshQRCode: EventEmitter<boolean>;

  constructor(
    private router: Router,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private alertService: AlertService,
    private pageActivityService: PageActivityService,
    private homeService: HomeService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.refreshQRCode = new EventEmitter<boolean>();
  }

  ngOnInit(): void {
    this.pageActivityHandler();
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ONLY_AIS_QR_CODE_SUMMARY_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ONLY_AIS_QR_CODE_QUEUE_PAGE]);
  }

  onRefresh(): void {
    location.reload();
    this.refreshQRCode.emit(true);
  }

  summary(amount: number[]): number {
    return amount.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
  }

  pageActivityHandler(): void {
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
        text: 'สิ้นสุดระยะเวลาชำระเงินกรุณากดปุ่ม "REFRESH" เพื่อทำรายการใหม่'
      }).then((data) => {
        if (data) {
          this.onNext();
        } else {
          this.onRefresh();
        }
      });
    });
  }
}

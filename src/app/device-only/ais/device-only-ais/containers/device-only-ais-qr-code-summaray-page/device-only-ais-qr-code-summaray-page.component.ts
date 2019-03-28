import { Component, OnInit } from '@angular/core';
import { ROUTE_DEVICE_ONLY_AIS_CHECKOUT_PAYMENT_QR_CODE_PAGE, ROUTE_DEVICE_ONLY_AIS_QR_CODE_GENERATE_PAGE } from '../../constants/route-path.constant';
import { Router } from '@angular/router';
import { HomeService, AlertService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { CreateOrderService } from '../../services/create-order.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { HomeButtonService } from '../../services/home-button.service';

@Component({
  selector: 'app-device-only-ais-qr-code-summaray-page',
  templateUrl: './device-only-ais-qr-code-summaray-page.component.html',
  styleUrls: ['./device-only-ais-qr-code-summaray-page.component.scss']
})
export class DeviceOnlyAisQrCodeSummarayPageComponent implements OnInit {

  transaction: Transaction;
  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private homeButtonService: HomeButtonService
    ) {
      this.transactionService.load();
    }

    ngOnInit(): void {
      this.homeButtonService.initEventButtonHome();
    }

    onBack(): void {
      this.router.navigate([ROUTE_DEVICE_ONLY_AIS_CHECKOUT_PAYMENT_QR_CODE_PAGE]);
    }

    onNext(): void {
      this.router.navigate([ROUTE_DEVICE_ONLY_AIS_QR_CODE_GENERATE_PAGE]);
    }

    onHome(): void {
      this.homeService.goToHome();
  }
}

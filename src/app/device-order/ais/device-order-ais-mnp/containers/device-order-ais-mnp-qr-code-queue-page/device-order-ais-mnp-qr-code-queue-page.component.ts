import { Component, OnInit } from '@angular/core';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { ROUTE_DEVICE_ORDER_AIS_MNP_RESULT_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-mnp-qr-code-queue-page',
  templateUrl: './device-order-ais-mnp-qr-code-queue-page.component.html',
  styleUrls: ['./device-order-ais-mnp-qr-code-queue-page.component.scss']
})
export class DeviceOrderAisMnpQrCodeQueuePageComponent implements OnInit {

  transaction: Transaction;
  priceOption: PriceOption;

  constructor(
    private router: Router,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
   }

  ngOnInit(): void {
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_RESULT_PAGE]);
  }

  summary(amount: number[]): number {
    return amount.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
  }

}

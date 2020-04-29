import { Component, OnInit } from '@angular/core';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction, Seller } from 'src/app/shared/models/transaction.model';
import { environment } from 'src/environments/environment';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';

@Component({
  selector: 'app-device-order-ais-device-result-page',
  templateUrl: './device-order-ais-device-result-page.component.html',
  styleUrls: ['./device-order-ais-device-result-page.component.scss']
})
export class DeviceOrderAisDeviceResultPageComponent implements OnInit {
  transaction: Transaction;
  priceOption: PriceOption;
  isSuccess: boolean;
  seller: Seller;

  constructor(
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.seller = this.transaction.data.seller;
  }

  ngOnInit(): void {
    this.isSuccess = true;
  }

  onMainMenu(): void {
    this.transactionService.remove();
    window.location.href = '/';
  }

  get checkAppleTvWording(): boolean {
    const checkAppleTv: string = 'APTV';
    return this.priceOption.productDetail.model.slice(0, 4) === checkAppleTv;
  }

}

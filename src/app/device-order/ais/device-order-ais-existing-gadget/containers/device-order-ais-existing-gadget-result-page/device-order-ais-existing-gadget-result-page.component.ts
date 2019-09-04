import { Component, OnInit } from '@angular/core';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';

@Component({
  selector: 'app-device-order-ais-existing-gadget-result-page',
  templateUrl: './device-order-ais-existing-gadget-result-page.component.html',
  styleUrls: ['./device-order-ais-existing-gadget-result-page.component.scss']
})
export class DeviceOrderAisExistingGadgetResultPageComponent implements OnInit {

  transaction: Transaction;
  isSuccess: boolean;
  priceOption: PriceOption;

  constructor(
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService
  ) {
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();
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

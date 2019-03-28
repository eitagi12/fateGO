import { Component, OnInit, OnDestroy } from '@angular/core';
import { HomeService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { HomeButtonService } from '../../services/home-button.service';

@Component({
  selector: 'app-device-only-ais-queue-page',
  templateUrl: './device-only-ais-queue-page.component.html',
  styleUrls: ['./device-only-ais-queue-page.component.scss']
})
export class DeviceOnlyAisQueuePageComponent implements OnInit, OnDestroy {

  transaction: Transaction;
  constructor(
    private homeService: HomeService,
    private transactionService: TransactionService,
    private homeButtonService: HomeButtonService
    ) {
      this.transaction = this.transactionService.load();
    }

  ngOnInit(): void {
    this.homeButtonService.initEventButtonHome();
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  mainMenu(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
  }

}

import { Component, OnInit } from '@angular/core';
import { WIZARD_ORDER_MNP } from 'src/app/order/constants/wizard.constant';
import { Router } from '@angular/router';
import { HomeService, PageLoadingService } from 'mychannel-shared-libs';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { CreateMnpService } from 'src/app/shared/services/create-mnp.service';

@Component({
  selector: 'app-order-mnp-result-page',
  templateUrl: './order-mnp-result-page.component.html',
  styleUrls: ['./order-mnp-result-page.component.scss']
})
export class OrderMnpResultPageComponent implements OnInit {

  wizards = WIZARD_ORDER_MNP;
  transaction: Transaction;
  isSerSuccess: boolean;
  messageStatus: string;

  constructor(private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private createMnpService: CreateMnpService,
    private pageLoadingService: PageLoadingService
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit() {
    this.pageLoadingService.openLoading();
    this.createMnpService.createMnp(this.transaction).then((resp: any) => {
      const data = resp.data || {};
      this.transaction.data.order = {
        orderNo: data.orderNo,
        orderDate: data.orderDate
      };
      this.transactionService.update(this.transaction);
      if (this.transaction.data.order.orderNo) {
        this.isSerSuccess = true;
        this.messageStatus = 'ทำรายการสำเร็จ';
      } else {
        this.isSerSuccess = false;
        this.messageStatus = 'ทำรายการไม่สำเร็จ';
      }
      this.pageLoadingService.closeLoading();
    }).catch(() => {
      this.pageLoadingService.closeLoading();
    });
  }

  onMainMenu() {
    this.homeService.goToHome();
  }

  onHome() {
    this.homeService.goToHome();
  }

}

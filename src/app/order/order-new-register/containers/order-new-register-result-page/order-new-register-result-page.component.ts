import { Component, OnInit } from '@angular/core';
import { WIZARD_ORDER_NEW_REGISTER } from 'src/app/order/constants/wizard.constant';
import { HomeService, PageLoadingService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { CreateNewRegisterService } from 'src/app/shared/services/create-new-register.service';


@Component({
  selector: 'app-order-new-register-result-page',
  templateUrl: './order-new-register-result-page.component.html',
  styleUrls: ['./order-new-register-result-page.component.scss']
})
export class OrderNewRegisterResultPageComponent implements OnInit {

  wizards = WIZARD_ORDER_NEW_REGISTER;
  transaction: Transaction;

  constructor(
    private homeService: HomeService,
    private transactionService: TransactionService,
    private createNewRegisterService: CreateNewRegisterService,
    private pageLoadingService: PageLoadingService
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit() {
    this.pageLoadingService.openLoading();
    this.createNewRegisterService.createNewRegister(this.transaction).then((resp: any) => {
      const data = resp.data || {};
      this.transaction.data.order = {
        orderNo: data.orderNo,
        orderDate: data.orderDate
      };
      this.transactionService.update(this.transaction);
      this.pageLoadingService.closeLoading();
    }).catch(() => {
      this.pageLoadingService.closeLoading();
    });
  }

  onMainMenu() {
    this.homeService.goToHome();
  }

}

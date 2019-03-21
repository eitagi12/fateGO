import { Component, OnInit } from '@angular/core';
import { WIZARD_ORDER_PRE_TO_POST } from 'src/app/order/constants/wizard.constant';
import { HomeService, PageLoadingService, AlertService } from 'mychannel-shared-libs';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { CreatePreToPostService } from 'src/app/shared/services/create-pre-to-post.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-order-pre-to-post-result-page',
  templateUrl: './order-pre-to-post-result-page.component.html',
  styleUrls: ['./order-pre-to-post-result-page.component.scss']
})
export class OrderPreToPostResultPageComponent implements OnInit {

  wizards = WIZARD_ORDER_PRE_TO_POST;

  transaction: Transaction;
  serviceChange: any;
  isSuccess = false;

  constructor(
    private homeService: HomeService,
    private alertService: AlertService,
    private transactionService: TransactionService,
    private createPreToPostService: CreatePreToPostService,
    private pageLoadingService: PageLoadingService,
    private http: HttpClient
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit() {
    this.pageLoadingService.openLoading();
    this.createPreToPostService.createPreToPost(this.transaction)
      .then(resp => {
        const data = resp.data || {};
        this.transaction.data.order = {
          orderNo: data.orderNo,
          orderDate: data.orderDate
        };
        if (this.transaction.data.order.orderNo) {
          this.isSuccess = true;
        } else {
          this.isSuccess = false;
        }
        this.transactionService.update(this.transaction);

        return this.http.get(`/api/customerportal/newRegister/${this.transaction.data.simCard.mobileNo}/queryCurrentServices`).toPromise();
      })
      .then((resp: any) => {
        this.pageLoadingService.closeLoading();
        const currentServices = resp.data || [];
        this.serviceChange = currentServices.services.filter(service => service.canTransfer);
      })
      .catch((errors: any) => {
        const error = errors.error || [];
        this.isSuccess = false;
        this.pageLoadingService.closeLoading();
        this.alertService.error(error.resultDescription);

      });
  }

  onMainMenu() {
    this.homeService.goToHome();
  }

}

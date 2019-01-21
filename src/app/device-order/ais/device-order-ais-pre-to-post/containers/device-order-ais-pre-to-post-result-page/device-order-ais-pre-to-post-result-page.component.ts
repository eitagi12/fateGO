import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HomeService, PageLoadingService, AlertService } from 'mychannel-shared-libs';

import { WIZARD_ORDER_PRE_TO_POST } from 'src/app/order/constants/wizard.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { CreatePreToPostService } from 'src/app/shared/services/create-pre-to-post.service';

@Component({
  selector: 'app-device-order-ais-pre-to-post-result-page',
  templateUrl: './device-order-ais-pre-to-post-result-page.component.html',
  styleUrls: ['./device-order-ais-pre-to-post-result-page.component.scss']
})
export class DeviceOrderAisPreToPostResultPageComponent implements OnInit {

  wizards = WIZARD_ORDER_PRE_TO_POST;

  transaction: Transaction;
  serviceChange: any;
  isSerSuccess: boolean;
  messageStatus: string;
  SUCCESS_MSG = 'ทำรายการสำเร็จ';
  ERROR_MSG = 'ไม่สามารถให้บริการได้<br>กรุณาติดต่อพนักงานเพื่อดำเนินการ<br><br>ขออภัยในความไม่สะดวก';

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
          this.isSerSuccess = true;
          this.messageStatus = this.SUCCESS_MSG;
        } else {
          this.isSerSuccess = false;
          this.messageStatus = this.ERROR_MSG;
        }
        this.transactionService.update(this.transaction);

        return this.http.get(`/api/customerportal/newRegister/${this.transaction.data.simCard.mobileNo}/queryCurrentServices`).toPromise();
      })
      .then((resp: any) => {
        const currentServices = resp.data || [];
        this.serviceChange = currentServices.services.filter(service => service.canTransfer);
        this.pageLoadingService.closeLoading();
      })
      .catch((error: any) => {
        this.isSerSuccess = false;
        this.messageStatus = this.ERROR_MSG;
        this.alertService.error(error);
        this.pageLoadingService.closeLoading();
      });
  }

  onMainMenu() {
    this.homeService.goToHome();
  }

}

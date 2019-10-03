import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_NEW_SHARE_PLAN_MNP_VALIDATE_CUSTOMER_PAGE } from '../../constants/route-path.constant';
import { WIZARD_ORDER_NEW_REGISTER } from 'src/app/order/constants/wizard.constant';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { CreateNewRegisterService } from 'src/app/shared/services/create-new-register.service';
import { PageLoadingService } from 'mychannel-shared-libs';

@Component({
  selector: 'app-new-share-plan-mnp-result-page',
  templateUrl: './new-share-plan-mnp-result-page.component.html',
  styleUrls: ['./new-share-plan-mnp-result-page.component.scss']
})

export class NewSharePlanMnpResultPageComponent implements OnInit {
  public isSuccess: boolean = true;
  public transaction: Transaction;
  public mobileNo: string;
  public mobileNo1: string;
  public simSerial: string;
  public simSerial1: string;
  wizards: string[] = WIZARD_ORDER_NEW_REGISTER;
  createTransactionService: Promise<any>;

  constructor(
    private router: Router,
    private transactionService: TransactionService,
    private createNewRegisterService: CreateNewRegisterService,
    private pageLoadingService: PageLoadingService
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.mobileNo = this.transaction.data.simCard.mobileNo;
    // this.simSerial = this.transaction.data.simCard.simSerial;
    // this.simSerial = '1234567891011';
    // this.mobileNo = '0646244645';
    // this.mobileNo1 = '0646244546';
    // this.simSerial1 = '1234567891112';

    this.pageLoadingService.openLoading();
    this.createTransactionService = this.createNewRegisterService.createNewRegister(this.transaction)
      .then((resp: any) => {
        console.log('resp', resp);

        const data = resp.data || {};
        this.transaction.data.order = {
          orderNo: data.orderNo,
          orderDate: data.orderDate
        };
        this.transactionService.update(this.transaction);
        if (this.transaction.data.order.orderNo) {
          this.isSuccess = true;
        } else {
          this.isSuccess = false;
        }
        this.pageLoadingService.closeLoading();

      }).catch(() => {
        this.isSuccess = false;
        this.pageLoadingService.closeLoading();
      });
  }

  onMainMenu(): void {
    // bug gotohome จะ unlock เบอร์ ทำให้ออก orderไม่สำเร็จ
    window.location.href = '/smart-digital/main-menu';
    // this.homeService.goToHome();
  }

  nextprint(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_VALIDATE_CUSTOMER_PAGE]);
  }

}

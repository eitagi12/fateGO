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

  wizards: string[] = WIZARD_ORDER_NEW_REGISTER;
  transaction: Transaction;
  isSuccess: boolean;
  createTransactionService: Promise<any>;
  constructor(
    private homeService: HomeService,
    private transactionService: TransactionService,
    private createNewRegisterService: CreateNewRegisterService,
    private pageLoadingService: PageLoadingService
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.pageLoadingService.openLoading();
    this.createTransactionService = this.createNewRegisterService.createNewRegister(this.transaction)
      .then((resp: any) => {
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

  getMessage5G(): string {
    if (this.isPackage5G()) {
      return 'แนะนำใช้เครื่องที่รองรับ 5G เพื่อประสิทธิภาพในการใช้งาน';
    } else {
      return '';
    }
  }

  isPackage5G(): boolean {
    const REGEX_PACKAGE_5G = /5[Gg]/;
    const mainPackage = this.transaction.data.mainPackage;
    if (mainPackage && REGEX_PACKAGE_5G.test(mainPackage.productPkg)) {
      return true;
    } else {
      return false;
    }
  }

}

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

  wizards: string[] = WIZARD_ORDER_MNP;
  transaction: Transaction;
  isSuccess: boolean;
  createTransactionService: Promise<any>;
  checkOrderService: boolean;

  constructor(private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private createMnpService: CreateMnpService,
    private pageLoadingService: PageLoadingService
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.pageLoadingService.openLoading();
    setTimeout(() => {
      this.createTransactionService = this.createMnpService.createMnp(this.transaction).then((resp: any) => {
        this.checkOrderService = true;
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
        this.checkOrderService = true;
        this.isSuccess = false;
        this.pageLoadingService.closeLoading();
      });
      this.isSuccess = false;
    }, 3000);

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

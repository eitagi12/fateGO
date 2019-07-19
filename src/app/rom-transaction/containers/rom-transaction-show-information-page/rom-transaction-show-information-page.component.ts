import { Component, OnInit } from '@angular/core';
import { Transaction, Customer } from 'src/app/shared/models/transaction.model';
import { CustomerInfo, HomeService, AlertService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { 
  ROUTE_ROM_TRANSACTION_RESULT_PAGE,
  ROUTE_ROM_TRANSACTION_LIST_MOBILE_PAGE
 } from 'src/app/rom-transaction/constants/route-path.constant';

@Component({
  selector: 'app-rom-transaction-show-information-page',
  templateUrl: './rom-transaction-show-information-page.component.html',
  styleUrls: ['./rom-transaction-show-information-page.component.scss']
})
export class RomTransactionShowInformationPageComponent implements OnInit {

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private alertService: AlertService,
  ) {
  }

  ngOnInit(): void {

  }

  onBack(): void {
    this.router.navigate([ROUTE_ROM_TRANSACTION_LIST_MOBILE_PAGE]);
  }

  onNext(): void {
    this.alertService.notify({
      type: 'question',
      showConfirmButton: true,
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก',
      showCancelButton: true,
      reverseButtons: true,
      allowEscapeKey: false,
      html: `
      <div class="container">
        <h5>ยกเลิกเติมเงิน</h5>
        <div class="text-left">
        <small>เบอร์มือถือ</small>
        <h4 class="text-green">094-895-0963</h4>
        <hr>
        <small>ประเภทรายการ</small>
        <h4 class="text-green">เติมเงิน</h4>
        <hr>
        <small>จำนวนเงิน</small>
        <h4 class="text-green">10 บาท</h4>
        </div>
      </div>
      `
    }).then((confirm) => {
      if (confirm.value) {
        this.router.navigate([ROUTE_ROM_TRANSACTION_RESULT_PAGE]);
      }
    });
  }

  onHome(): void {
    this.homeService.goToHome();
  }
}

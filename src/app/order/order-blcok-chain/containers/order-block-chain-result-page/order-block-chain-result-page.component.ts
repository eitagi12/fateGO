import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, PageLoadingService } from 'mychannel-shared-libs';
import { ROUTE_ORDER_BLOCK_CHAIN_FACE_CONFIRM_PAGE } from 'src/app/order/order-blcok-chain/constants/route-path.constant';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-order-block-chain-result-page',
  templateUrl: './order-block-chain-result-page.component.html',
  styleUrls: ['./order-block-chain-result-page.component.scss']
})
export class OrderBlockChainResultPageComponent implements OnInit {

  isSuccess: boolean = true;
  transaction: Transaction;
  message: string;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private pageLoadingService: PageLoadingService,
    private http: HttpClient,
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.pageLoadingService.openLoading();
    const param = {
      mobile_no: this.transaction.data.simCard.mobileNo,
      person_id: this.transaction.data.customer.idCardNo
    };
    this.http.post(`/api/customerportal/newRegister/registerApp3Steps`, param).toPromise()
      .then((resp: any) => {
        this.message = 'หมายเลข' + this.transaction.data.simCard.mobileNo + 'ได้สมัคร Main Mobile สำเร็จแล้ว แจ้งลูกค้ารอรับ OTP ผ่าน SMS';
      }).catch((err) => {
        this.message = 'ระบบการสมัครขัดข้อง กรุณาดำเนินการใหม่ภายหลัง';
      }).then(() => {
        this.pageLoadingService.closeLoading();
      });
  }
  onBack(): void {
    this.router.navigate([ROUTE_ORDER_BLOCK_CHAIN_FACE_CONFIRM_PAGE]);
  }

  onNext(): void {
    // this.router.navigate([ROUTE_ORDER_BLOCK_CHAIN_RESULT_PAGE]);
  }
  onHome(): void {
    this.homeService.goToHome();
  }

}

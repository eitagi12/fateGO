import { Component, OnInit, OnDestroy } from '@angular/core';
import { Transaction, Customer, RomTransactionData } from 'src/app/shared/models/transaction.model';
import { CustomerInfo, HomeService, AlertService, MobileNoPipe, PageLoadingService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import {
  ROUTE_ROM_TRANSACTION_RESULT_PAGE,
  ROUTE_ROM_TRANSACTION_LIST_MOBILE_PAGE
} from 'src/app/rom-transaction/constants/route-path.constant';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-rom-transaction-show-information-page',
  templateUrl: './rom-transaction-show-information-page.component.html',
  styleUrls: ['./rom-transaction-show-information-page.component.scss']
})
export class RomTransactionShowInformationPageComponent implements OnInit, OnDestroy {

  transaction: Transaction;
  romTransaction: RomTransactionData;
  pinForm: FormGroup;
  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private alertService: AlertService,
    private fb: FormBuilder,
    private mobileNoPipe: MobileNoPipe,
    private http: HttpClient,
    private pageLoadingService: PageLoadingService,
  ) {
    this.transaction = this.transactionService.load();
    this.romTransaction = this.transaction.data.romTransaction;
  }

  ngOnInit(): void {
    this.createForm();
  }

  validatePIN(): void {
    if (this.pinForm.valid) {
      this.alertService.notify({
        type: 'question',
        showConfirmButton: true,
        confirmButtonText: 'ยืนยัน',
        cancelButtonClass: 'button-easyApp cancel',
        confirmButtonClass: 'button-easyApp confirm',
        cancelButtonText: 'ยกเลิก',
        showCancelButton: true,
        reverseButtons: true,
        allowEscapeKey: false,
        html: `
        <style>
            .button-easyApp {
              height: 40px;
              font-size: 20px;
              border-radius: 5px;
              border: 0;
              padding-left: 1.5rem;
              padding-right: 1.5rem;
              margin-left:10px;
              color: #4E4E4E;
          }
          .cancel{
            border: 1px solid;
            border-color: #B2D234;
            background-color: #fff;
          }
          .confirm{
            background-color: #B2D234;
          }
        </style>
        <div class="container">
          <h5>ยกเลิกเติมเงิน</h5>
          <div class="text-left">
          <h5>เบอร์มือถือ</h5>
          <h4 style="color: #00A296;">${ this.mobileNoPipe.transform(this.romTransaction.romTransaction.cusMobileNo)}</h4>
          <hr>
          <h5>ประเภทรายการ</h5>
          <h4 style="color: #00A296;">${
          this.romTransaction.romTransaction.transactionType === 'VAS'
            ? 'โปรเสริมออนไลน์'
            : 'เติมเงินออนไลน์'
          }</h4>
          <hr>
          <h5>จำนวนเงิน</h5>
          <h4 style="color: #00A296;">${this.romTransaction.romTransaction.price} บาท</h4>
          </div>
        </div>
        `
      }).then((confirm) => {
        if (confirm.value) {
          const pinNo = this.pinForm.controls.pin.value;
          const refNo = this.pinForm.controls.ref.value;
          this.pageLoadingService.openLoading();
          this.http.post(('/api/customerportal/rom/aisrom-ussdadapter'), {
            ssid: this.romTransaction.romTransaction.ssid,
            from: this.romTransaction.romTransaction.romNo,
            content: this.romTransaction.romTransaction.romNo,
            romPinCode: pinNo,
            lastCustomerMobile: this.romTransaction.romTransaction.cusMobileNo.substring(6, 10),
            romRefNo: refNo
          }).toPromise()
            .then((respone: any) => {
              this.pageLoadingService.closeLoading();
              this.transaction.data.romTransaction.pin = pinNo;
              this.transaction.data.romTransaction.refNo = refNo;
              this.onNext();
            });
        }
      });
    }
  }

  createForm(): void {
    this.pinForm = this.fb.group({
      'pin': ['', Validators.compose([Validators.required, Validators.pattern(/^[0-9]{4}/)])],
      'ref': ['', Validators.compose([Validators.required, Validators.pattern(/^[0-9]{9}/)])]
    });
  }

  onBack(): void {
    this.router.navigate([ROUTE_ROM_TRANSACTION_LIST_MOBILE_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_ROM_TRANSACTION_RESULT_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}

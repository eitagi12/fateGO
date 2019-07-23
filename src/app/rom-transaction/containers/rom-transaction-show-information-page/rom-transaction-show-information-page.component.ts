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
      const pinNo = this.pinForm.controls.pin.value;
      const refNo = this.pinForm.controls.ref.value;
      this.pageLoadingService.openLoading();
      this.http.post(('/api/customerportal/rom/aisrom-ussdadapter'), {
        from: this.romTransaction.romTransaction.romNo,
        content: this.romTransaction.romTransaction.romNo,
        romPinCode: pinNo,
        lastCustomerMobile: this.romTransaction.romTransaction.cusMobileNo,
        romRefNo: refNo
      }).toPromise()
      .then((respone: any) => {
        this.pageLoadingService.closeLoading();
        this.transaction.data.romTransaction.pin = pinNo;
        this.transaction.data.romTransaction.refNo = refNo;
        this.onNext();
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
        <h4 class="text-green">${ this.mobileNoPipe.transform(this.romTransaction.romTransaction.cusMobileNo) }</h4>
        <hr>
        <small>ประเภทรายการ</small>
        <h4 class="text-green">${
          this.romTransaction.romTransaction.transactionType === 'VAS'
          ? 'โปรเสริมออนไลน์'
          : 'เติมเงินออนไลน์'
        }</h4>
        <hr>
        <small>จำนวนเงิน</small>
        <h4 class="text-green">${this.romTransaction.romTransaction.price} บาท</h4>
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

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}

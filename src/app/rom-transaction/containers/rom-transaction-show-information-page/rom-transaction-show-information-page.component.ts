import { Component, OnInit, OnDestroy } from '@angular/core';
import { Transaction, Customer, RomTransaction } from 'src/app/shared/models/transaction.model';
import { CustomerInfo, HomeService, AlertService, MobileNoPipe } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import {
  ROUTE_ROM_TRANSACTION_RESULT_PAGE,
  ROUTE_ROM_TRANSACTION_LIST_MOBILE_PAGE
 } from 'src/app/rom-transaction/constants/route-path.constant';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-rom-transaction-show-information-page',
  templateUrl: './rom-transaction-show-information-page.component.html',
  styleUrls: ['./rom-transaction-show-information-page.component.scss']
})
export class RomTransactionShowInformationPageComponent implements OnInit, OnDestroy {

  transaction: Transaction;
  romTransaction: RomTransaction;
  pinForm: FormGroup;
  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private alertService: AlertService,
    private fb: FormBuilder,
  ) {
    this.transaction = this.transactionService.load();
    this.romTransaction = this.transaction.data.romTransaction;
  }

  ngOnInit(): void {
   this.createForm();
  }

  validatePIN(): void {
    if (this.pinForm.valid) {
      this.transaction.data.romTransaction.pin = this.pinForm.controls.pin.value;
      this.transaction.data.romTransaction.refNo = this.pinForm.controls.ref.value;
      this.onNext();
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
        <h4 class="text-green">${ this.romTransaction.romTransaction.cusMobileNo}</h4>
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
    this.transactionService.save(this.transaction);
  }
}

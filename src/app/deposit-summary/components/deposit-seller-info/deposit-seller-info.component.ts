import { Component, OnInit, Input } from '@angular/core';
import { Seller, Transaction } from 'src/app/shared/models/transaction.model';
import { TokenService, UserType } from 'mychannel-shared-libs';
import { HttpClient } from '@angular/common/http';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-deposit-seller-info',
  templateUrl: './deposit-seller-info.component.html',
  styleUrls: ['./deposit-seller-info.component.scss']
})
export class DepositSellerInfoComponent implements OnInit {
  seller: Seller;
  transaction: Transaction;
  sellerCode: string;
  checkSellerForm: FormGroup;
  constructor(
    private tokenService: TokenService,
    private http: HttpClient,
    private transactionService: TransactionService,
    public fb: FormBuilder
  ) {
    this.seller = this.seller || {};
    this.transaction = this.transactionService.load();
  }
  ngOnInit(): void {
  }

  isUserASPType(): boolean {
    return true;
  }
}

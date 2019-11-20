import { Component, OnInit, Input } from '@angular/core';
import { Transaction, Seller } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { TokenService, User } from 'mychannel-shared-libs';
@Component({
  selector: 'app-summary-seller-code',
  templateUrl: './summary-seller-code.component.html',
  styleUrls: ['./summary-seller-code.component.scss']
})
export class SummarySellerCodeComponent implements OnInit {
  public username: string;
  @Input() seller: Seller;
  transaction: Transaction;
  locationCode: string;
  public user: User;
  public setSellerTemp: any;
  public setAscCode: any;

  constructor(
    private transacService: TransactionService,
    private tokenService: TokenService
  ) {
    this.transaction = this.transacService.load();
    this.username = this.tokenService.getUser().username;
    this.user = this.tokenService.getUser();
  }

  ngOnInit(): void {
    if (!this.seller) {
      this.seller = {};
    }
    this.checkSellerDeviceOnlyASP();
  }

  private checkSellerDeviceOnlyASP(): void {
    if (this.transaction.data.transactionType === 'DeviceOnlyASP') {
      this.getSellerDeviceOnlyASP();
    }
  }

  setSellerDeviceOnlyASP(): void {
    this.setSellerTemp = {
      ascCode: this.user.ascCode
    };
    localStorage.setItem('seller', JSON.stringify(this.setSellerTemp));
  }

  getSellerDeviceOnlyASP(): Seller {
    if (!localStorage.getItem('seller')) {
      this.setAscCode = this.tokenService.getUser().ascCode;
      return Object.assign(this.seller, {
        sellerNo: this.setAscCode
      });
    } else {
      this.setAscCode = JSON.parse(localStorage.getItem('seller'));
      return Object.assign(this.seller, {
        sellerNo: this.setAscCode.ascCode
      });
    }
  }

  setSeller(seller: Seller): void {
    this.seller = seller;
  }

  getSeller(): Seller {
    return Object.assign(this.seller, {
      sellerNo: this.seller.sellerNo || ''
    });
  }

  keyPress(event: any): void {
    const charCode: number = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
    }
  }

}

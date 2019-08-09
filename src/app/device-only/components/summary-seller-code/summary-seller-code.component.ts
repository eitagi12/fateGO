import { Component, OnInit, Input } from '@angular/core';
import { Transaction, Seller } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { TokenService } from 'mychannel-shared-libs';
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
  private setLocationCode: string;

  constructor(
    private transacService: TransactionService,
    private tokenService: TokenService
  ) {
    this.transaction = this.transacService.load();
    this.username = this.tokenService.getUser().username;
  }

  ngOnInit(): void {
    if (!this.seller) {
      this.seller = {};
    }
    this.setSellerDeviceOnlyASP();
  }

  setSellerDeviceOnlyASP(): Seller {
    if (this.tokenService.getUser().userType === 'ASP') {
      this.setLocationCode = this.tokenService.getUser().locationCode;
      return Object.assign(this.seller, {
        sellerNo: this.setLocationCode
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

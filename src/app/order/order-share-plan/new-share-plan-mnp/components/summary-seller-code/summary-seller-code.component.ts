import { Component, OnInit, Input } from '@angular/core';
import { Seller, Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { TokenService } from 'mychannel-shared-libs';
import { HttpClient } from '@angular/common/http';

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

  constructor(
    private transacService: TransactionService,
    private tokenService: TokenService,
    private http: HttpClient,
  ) {
    this.transaction = this.transacService.load();
    this.username = this.tokenService.getUser().username;
   }

   ngOnInit(): void {
     this.getLocation();
    if (!this.seller) {
      this.seller = {};
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

  getLocation(): void {
    const user = this.tokenService.getUser();
    this.http.get(`/api/salesportal/location-by-code?code=${user.locationCode}`).toPromise().then((response: any) => {
      this.seller = {
        // sellerName: user.firstname && user.lastname ? `${user.firstname} ${user.lastname}` : user.username,
        locationName: response.data.displayName,
        // locationCode: user.locationCode,
        // sellerNo: user.ascCode
      };
    });
  }

  keyPress(event: any): void {
    const charCode: number = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
    }
  }
}

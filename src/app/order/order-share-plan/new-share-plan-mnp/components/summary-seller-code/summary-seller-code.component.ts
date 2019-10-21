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

  username: string;
  transaction: Transaction;
  locationName: string;
  locationCode: string;
  ascCode: string;

  constructor(
    private transacService: TransactionService,
    private tokenService: TokenService,
    private http: HttpClient,
  ) {
    this.transaction = this.transacService.load();
  }

  ngOnInit(): void {
    this.getLocation();
    this.getASCCode();
  }

  getLocation(): void {
    this.locationCode = this.tokenService.getUser().locationCode;
    this.http.get(`/api/salesportal/location-by-code?code=${this.locationCode}`).toPromise().then((response: any) => {
      this.locationName = response.data.displayName;
    });
  }

  getASCCode(): any {
    this.username = this.tokenService.getUser().username;
    this.http.get(`/api/customerportal/newRegister/getEmployeeDetail/${'username'}/${this.username}`).toPromise().then((response: any) => {
      this.ascCode = response.data.pin;
    });
  }

  setASCCode(): Seller {
    return Object.assign({
      locationName: this.locationName,
      locationCode: this.locationCode,
      ascCode: this.ascCode
    });
  }

  keyPress(event: any): void {
    const charCode: number = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
    }
  }

}

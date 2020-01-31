import { Component, OnInit, Input } from '@angular/core';
import { TokenService, User } from 'mychannel-shared-libs';
import { HttpClient } from '@angular/common/http';
import { TransactionService } from 'src/app/omni/omni-shared/services/transaction.service';
import { Transaction, Seller } from 'src/app/omni/omni-shared/models/transaction.model';
@Component({
  selector: 'app-omni-new-register-summary-seller-code',
  templateUrl: './omni-new-register-summary-seller-code.component.html',
  styleUrls: ['./omni-new-register-summary-seller-code.component.scss']
})
export class OmniNewRegisterSummarySellerCodeComponent implements OnInit {
  username: string;
  transaction: Transaction;
  locationName: string;
  locationCode: string;
  ascCode: string;

  constructor(
    private transacService: TransactionService,
    private tokenService: TokenService,
    private http: HttpClient
  ) {
    this.transaction = this.transacService.load();
  }

  ngOnInit(): void {
    this.getLocation();
    this.getASCCode();
  }

  getLocation(): void {
    this.locationCode = 'this.tokenService.getUser().locationCode';
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
      locationDestName: this.locationName,
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

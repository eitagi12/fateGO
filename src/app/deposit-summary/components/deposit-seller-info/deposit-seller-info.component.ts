import { Component, OnInit, Input } from '@angular/core';
import { Seller } from 'src/app/shared/models/transaction.model';
import { TokenService, UserType } from 'mychannel-shared-libs';

@Component({
  selector: 'app-deposit-seller-info',
  templateUrl: './deposit-seller-info.component.html',
  styleUrls: ['./deposit-seller-info.component.scss']
})
export class DepositSellerInfoComponent implements OnInit {
  @Input() seller: Seller;
  constructor(
    private tokenServie: TokenService
  ) {
    this.seller = this.seller || new Seller();
  }
  ngOnInit(): void {
  }

  isUserASPType(): boolean {
    return this.tokenServie.getUser().userType === 'ASP';
  }
  setSeller(seller: Seller): void {
    this.seller = seller;
  }
  getSeller(): Seller {
    return Object.assign(this.seller, {
      sellerNo: this.seller.sellerNo || ''
    });
  }
}

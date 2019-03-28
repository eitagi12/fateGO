import { Component, OnInit, Input } from '@angular/core';
import { Transaction, Seller } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ShopCheckSeller } from 'src/app/device-only/ais/device-only-ais/models/ShopCheckSeller.model';

@Component({
  selector: 'app-summary-seller-code',
  templateUrl: './summary-seller-code.component.html',
  styleUrls: ['./summary-seller-code.component.scss']
})
export class SummarySellerCodeComponent implements OnInit {

  @Input() seller: Seller;
  transaction: Transaction;
  locationCode: string;

  constructor(
    private transacService: TransactionService,
  ) {
    this.transaction = this.transacService.load();
  }

  ngOnInit(): void {
    if (!this.seller) {
      this.seller = {};
    }
    // this.locationCode = this.transaction.data.seller.locationCode ? this.transaction.data.seller.locationCode : '';
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

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { ApiRequestService, PageLoadingService, HomeService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';

@Component({
  selector: 'app-device-order-ais-existing-best-buy-validate-customer-key-in-page',
  templateUrl: './device-order-ais-existing-best-buy-validate-customer-key-in-page.component.html',
  styleUrls: ['./device-order-ais-existing-best-buy-validate-customer-key-in-page.component.scss']
})
export class DeviceOrderAisExistingBestBuyValidateCustomerKeyInPageComponent implements OnInit {

  constructor(
    private router: Router,
    private homeService: HomeService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private apiRequestService: ApiRequestService,
    private http: HttpClient
  ) { }

  ngOnInit() {
  }

}

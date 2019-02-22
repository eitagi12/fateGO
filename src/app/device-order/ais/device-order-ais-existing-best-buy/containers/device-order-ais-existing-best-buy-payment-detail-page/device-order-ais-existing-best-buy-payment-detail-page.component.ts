import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { ApiRequestService, PageLoadingService, HomeService } from 'mychannel-shared-libs';
import { ROUTE_DEVICE_ORDER_AIS_BEST_BUY_MOBILE_DETAIL_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_MOBILE_CARE_AVAILABLE_PAGE } from 'src/app/device-order/ais/device-order-ais-existing-best-buy/constants/route-path.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { ReceiptInfo } from 'mychannel-shared-libs/lib/component/receipt-info/receipt-info.component';

@Component({
  selector: 'app-device-order-ais-existing-best-buy-payment-detail-page',
  templateUrl: './device-order-ais-existing-best-buy-payment-detail-page.component.html',
  styleUrls: ['./device-order-ais-existing-best-buy-payment-detail-page.component.scss']
})
export class DeviceOrderAisExistingBestBuyPaymentDetailPageComponent implements OnInit, OnDestroy {

  wizards = WIZARD_DEVICE_ORDER_AIS;

  identityValid = true;
  transaction: Transaction;

  receiptInfo: ReceiptInfo = {
    taxId: '',
    branch: '',
    buyer: '',
    buyerAddress: '',
    telNo: ''
  };
  grandTotal: String;
  productDetail: String;
  priceOptionPrivilegeTrade: String;
  constructor(
    private router: Router,
    private homeService: HomeService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private apiRequestService: ApiRequestService,
    private http: HttpClient
  ) {
    this.transaction = this.transactionService.load();
   }

  ngOnInit() {
    this.grandTotal = '44000';
    this.productDetail = 'APPLE iPhone X 256GB สี SPACE GREY ';
    this.priceOptionPrivilegeTrade = '1070 ';
  }

  onHome() {
    this.homeService.goToHome();
  }

  onBack() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_MOBILE_DETAIL_PAGE]);
  }

  onNext() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_MOBILE_CARE_AVAILABLE_PAGE]);
  }

  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
  }

}

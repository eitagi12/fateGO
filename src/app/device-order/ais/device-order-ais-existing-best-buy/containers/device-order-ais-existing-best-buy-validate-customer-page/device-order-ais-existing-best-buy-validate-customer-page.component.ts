import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { ApiRequestService, PageLoadingService, HomeService } from 'mychannel-shared-libs';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { ROUTE_BUY_PRODUCT_CAMPAIGN_PAGE } from 'src/app/buy-product/constants/route-path.constant';
import { ROUTE_DEVICE_ORDER_AIS_BEST_BUY_VALIDATE_CUSTOMER_ID_CARD_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CUSTOMER_INFO_PAGE } from 'src/app/device-order/ais/device-order-ais-existing-best-buy/constants/route-path.constant';
import { Transaction, TransactionType, TransactionAction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';

@Component({
  selector: 'app-device-order-ais-existing-best-buy-validate-customer-page',
  templateUrl: './device-order-ais-existing-best-buy-validate-customer-page.component.html',
  styleUrls: ['./device-order-ais-existing-best-buy-validate-customer-page.component.scss']
})
export class DeviceOrderAisExistingBestBuyValidateCustomerPageComponent implements OnInit, OnDestroy {

  readonly PLACEHOLDER = '(หมายเลขโทรศัพท์ / เลขบัตรประชาชน)';
  readonly PLACEHOLDER_HEADDER = 'กรอกเอกสารแสดงตน';

  transaction: Transaction;
  identityValid = false;
  identity: string;
  band: string;
  model: string;
  priceOption: PriceOption;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private apiRequestService: ApiRequestService,
    private http: HttpClient
  ) {
    // this.homeService.callback = () => {
    //   window.location.href = `/sales-portal/buy-product/brand/${this.band}/${this.model}`;
    // };
   }

  ngOnInit() {
    this.createTransaction();
  }

  onError(valid: boolean) {
    this.identityValid = valid;
  }

  onCompleted(identity: string) {
    this.identity = identity;
  }

  onReadCard() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_VALIDATE_CUSTOMER_ID_CARD_PAGE]);
  }

  onHome() {
    this.homeService.goToHome();
  }

  onBack() {
    // this.homeService.goToHome();
    // this.homeService.callback = () => {
    //   window.location.href = `/sales-portal/buy-product/brand/${this.band}/${this.model}`;
    // };
    this.router.navigate([ROUTE_BUY_PRODUCT_CAMPAIGN_PAGE], { queryParams: this.priceOption.queryParams });
  }

  onNext() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CUSTOMER_INFO_PAGE]);
  }

  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
  }

  private createTransaction() {
    // New x-api-request-id
    this.apiRequestService.createRequestId();

    this.transaction = {
      data: {
        transactionType: TransactionType.DEVICE_ORDER_EXISTING_AIS,
        action: TransactionAction.KEY_IN,
      }
    };
  }

}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { HomeService, PageLoadingService, ApiRequestService, DeviceSelling } from 'mychannel-shared-libs';
import { ROUTE_DEVICE_ORDER_ASP_BEST_BUY_SUMMARY_PAGE, ROUTE_DEVICE_ORDER_ASP_BEST_BUY_QUEUE_PAGE, ROUTE_DEVICE_ORDER_ASP_BEST_BUY_QR_CODE_SUMMARY_PAGE } from 'src/app/device-order/asp/device-order-asp-existing-best-buy/constants/route-path.constant';
import { Transaction, Payment } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';

@Component({
  selector: 'app-device-order-asp-existing-best-buy-check-out-page',
  templateUrl: './device-order-asp-existing-best-buy-check-out-page.component.html',
  styleUrls: ['./device-order-asp-existing-best-buy-check-out-page.component.scss']
})
export class DeviceOrderAspExistingBestBuyCheckOutPageComponent implements OnInit, OnDestroy {

  identityValid: boolean = true;
  transaction: Transaction;
  deviceSelling: DeviceSelling;
  priceOption: PriceOption;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private apiRequestService: ApiRequestService,
    private http: HttpClient,
    private priceOptionService: PriceOptionService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void {
    this.setDeviceSelling();
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_ASP_BEST_BUY_SUMMARY_PAGE]);
  }

  onNext(): void {
    const payment: Payment = this.transaction.data.payment;
    // if (payment.paymentType === 'QR_CODE') {
    //   this.router.navigate([ROUTE_DEVICE_ORDER_ASP_BEST_BUY_QR_CODE_SUMMARY_PAGE]);
    // } else {
    //   this.router.navigate([ROUTE_DEVICE_ORDER_ASP_BEST_BUY_QUEUE_PAGE]);
    // }
    this.router.navigate([ROUTE_DEVICE_ORDER_ASP_BEST_BUY_QUEUE_PAGE]);
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

  setDeviceSelling(): void {
    const customer = this.transaction.data.customer;
    const mobileNo = this.transaction.data.simCard.mobileNo;
    const campaign = this.priceOption.campaign;
    const trade = this.priceOption.trade;
    const productDetail = this.priceOption.productDetail;
    const productStock = this.priceOption.productStock;
    this.deviceSelling = {
      fullName: `${customer.firstName} ${customer.lastName}`,
      mobileNo: mobileNo,
      thumbnail: productStock.images.thumbnail,
      campaignName: campaign.campaignName,
      brand: productDetail.brand,
      model: productDetail.model,
      color: productDetail.colorName,
      price: +trade.promotionPrice
    };
  }

}

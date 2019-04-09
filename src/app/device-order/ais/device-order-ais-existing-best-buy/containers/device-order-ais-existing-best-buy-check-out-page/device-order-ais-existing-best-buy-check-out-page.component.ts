import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { HomeService, PageLoadingService, ApiRequestService, DeviceSelling } from 'mychannel-shared-libs';
import { ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SUMMARY_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_QUEUE_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_QR_CODE_SUMMARY_PAGE } from 'src/app/device-order/ais/device-order-ais-existing-best-buy/constants/route-path.constant';
import { Transaction, Payment } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';

@Component({
  selector: 'app-device-order-ais-existing-best-buy-check-out-page',
  templateUrl: './device-order-ais-existing-best-buy-check-out-page.component.html',
  styleUrls: ['./device-order-ais-existing-best-buy-check-out-page.component.scss']
})
export class DeviceOrderAisExistingBestBuyCheckOutPageComponent implements OnInit, OnDestroy {

  transaction: Transaction;
  deviceSelling: DeviceSelling;
  priceOption: PriceOption;

  constructor(
    private router: Router,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void {
    this.setDeviceSelling();
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SUMMARY_PAGE]);
  }

  onNext(): void {
    if (this.isQrCodePayment()) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_QR_CODE_SUMMARY_PAGE]);
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_QUEUE_PAGE]);
    }
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
    const prebooking = this.transaction.data.preBooking;
    const depositAmt = prebooking && prebooking.depositAmt ? -prebooking.depositAmt : 0;
    this.deviceSelling = {
      fullName: `${customer.firstName} ${customer.lastName}`,
      mobileNo: mobileNo,
      thumbnail: productStock.images.thumbnail,
      campaignName: campaign.campaignName,
      brand: productDetail.brand,
      model: productDetail.model,
      color: productDetail.colorName,
      price: +trade.promotionPrice + depositAmt
    };
  }

  isQrCodePayment(): boolean {
    const payment: Payment = this.transaction.data.payment;
    return payment.paymentType === 'QR_CODE';
  }

}

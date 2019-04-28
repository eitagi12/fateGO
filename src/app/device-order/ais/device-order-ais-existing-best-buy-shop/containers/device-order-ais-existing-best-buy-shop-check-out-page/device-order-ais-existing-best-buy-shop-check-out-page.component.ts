import { Component, OnInit, OnDestroy } from '@angular/core';
import { ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_SUMMARY_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_QR_CODE_SUMMARY_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_QUEUE_PAGE } from '../../constants/route-path.constant';
import { Payment, Transaction } from 'src/app/shared/models/transaction.model';
import { DeviceSelling } from 'mychannel-shared-libs';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';

@Component({
  selector: 'app-device-order-ais-existing-best-buy-shop-check-out-page',
  templateUrl: './device-order-ais-existing-best-buy-shop-check-out-page.component.html',
  styleUrls: ['./device-order-ais-existing-best-buy-shop-check-out-page.component.scss']
})
export class DeviceOrderAisExistingBestBuyShopCheckOutPageComponent implements OnInit, OnDestroy {

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
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_SUMMARY_PAGE]);
  }

  onNext(): void {
    if (this.isQrCodePayment()) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_QR_CODE_SUMMARY_PAGE]);
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_QUEUE_PAGE]);
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
    let thumbnail = null;
    if ((!productStock.images &&  !productStock.images.thumbnail) && productDetail.products && productDetail.products.length > 0) {
      const productFilter = productDetail.products.filter((product) => product.colorName === productStock.colorName
              || product.colorName === productStock.color);
      thumbnail = productFilter && productFilter.length > 0 ? productFilter.images.thumbnail : thumbnail;
    }
    this.deviceSelling = {
      fullName: `${customer.firstName} ${customer.lastName}`,
      mobileNo: mobileNo,
      thumbnail: productStock.images && productStock.images.thumbnail ? productStock.images.thumbnail : thumbnail,
      campaignName: campaign.campaignName,
      brand: productDetail.brand,
      model: productDetail.model,
      color: productDetail.colorName || productStock.colorName || productStock.color,
      price: +trade.promotionPrice + depositAmt
    };
  }

  isQrCodePayment(): boolean {
    const payment: Payment = this.transaction.data.payment;
    return payment.paymentType === 'QR_CODE';
  }

}

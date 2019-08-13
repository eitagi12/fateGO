import { Component, OnInit, OnDestroy } from '@angular/core';
import { Transaction, Payment } from 'src/app/shared/models/transaction.model';
import { DeviceSelling } from 'mychannel-shared-libs';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_AGREEMENT_SIGN_PAGE, ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_QUEUE_PAGE, ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_QR_CODE_SUMMARY_PAGE } from 'src/app/device-order/ais/device-order-ais-existing-gadget/constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-existing-gadget-aggregate-page',
  templateUrl: './device-order-ais-existing-gadget-aggregate-page.component.html',
  styleUrls: ['./device-order-ais-existing-gadget-aggregate-page.component.scss']
})
export class DeviceOrderAisExistingGadgetAggregatePageComponent implements OnInit, OnDestroy {

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
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_AGREEMENT_SIGN_PAGE]);
  }

  onNext(): void {
    if (this.isQrCodePayment()) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_QR_CODE_SUMMARY_PAGE]);
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_QUEUE_PAGE]);
    }
  }

  isQrCodePayment(): boolean {
    const payment: Payment = this.transaction.data.payment;
    return payment.paymentType === 'QR_CODE';
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

    const thumbnail: string = productStock.images && productStock.images.thumbnail ?
      productStock.images.thumbnail : this.getThumbnailInProductDetail(productDetail, productStock);

    this.deviceSelling = {
      fullName: `${customer.firstName} ${customer.lastName}`,
      mobileNo: mobileNo,
      thumbnail: thumbnail,
      campaignName: campaign.campaignName,
      brand: productDetail.brand,
      model: productDetail.model,
      color: productDetail.colorName || productStock.colorName || productStock.color,
      price: +trade.promotionPrice
    };
  }

  private getThumbnailInProductDetail(productDetail: any, productStock: any): any {
    let thumbnail: string = null;
    if (productDetail.products && productDetail.products.length > 0) {
      const productFilter = productDetail.products.filter((product: any) => {
        if (product.colorName === productStock.colorName || product.colorName === productStock.color) {
          return product;
        }
      });
      thumbnail = productFilter && productFilter.length > 0 ? productFilter[0].images.thumbnail : thumbnail;
    }
    return thumbnail;
  }
}
